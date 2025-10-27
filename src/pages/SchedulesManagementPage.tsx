/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

import BookingModal from "../components/modals/BookingModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import { fetchAllBookings } from "../slices/fetchAllBookingsThunk";
import { updateBooking, deleteBooking } from "../slices/bookingSlice";
import type { RootState, AppDispatch } from "../stores/userStore";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Booking = {
  id: number;
  userId: number;
  class: string;
  date: string;
  time: string;
  name: string;
  email: string;
};

function normalizeBookingId(b: any): Booking {
  return {
    ...b,
    id: typeof b.id === "number" ? b.id : -1,
  };
}

export default function SchedulesManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const bookings =
    (useSelector((state: RootState) => state.bookingsAll?.data) as Booking[]) || [];

  const [courses, setCourses] = useState<Array<{ id: string; name: string }>>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);

  const [filterClass, setFilterClass] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  useEffect(() => {
    axios.get("http://localhost:1904/courses").then((res) => setCourses(res.data));
  }, []);

  // Debounce cho email
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedEmail(filterEmail);
    }, 400);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [filterEmail]);

  // Lọc danh sách booking
  const filteredBookings = bookings.filter((b) => {
    const matchClass = filterClass ? b.class === filterClass : true;
    const matchEmail = debouncedEmail
      ? b.email.toLowerCase().includes(debouncedEmail.toLowerCase())
      : true;
    const matchDate = filterDate ? b.date === filterDate : true;
    return matchClass && matchEmail && matchDate;
  });

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Thống kê số lượng
  const courseStats = courses.map((course) => ({
    name: course.name,
    count: bookings.filter((b) => b.class === course.name).length,
  }));

  // Xử lý sửa
  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditModalOpen(true);
  };

  // Xử lý xoá
  const handleDelete = (booking: Booking) => {
    setDeleteBookingId(booking.id);
    setDeleteModalOpen(true);
  };

  // Lưu booking sau khi sửa
  const handleSaveBooking = async (data: Booking) => {
    if (!selectedBooking) return;
    await dispatch(
      updateBooking({
        ...selectedBooking,
        ...data,
        id: selectedBooking.id,
        userId: selectedBooking.userId,
        name: selectedBooking.name,
        email: selectedBooking.email,
      })
    );
    setEditModalOpen(false);
    setSelectedBooking(null);
    dispatch(fetchAllBookings());
  };

  // Xác nhận xoá booking
  const handleConfirmDelete = async () => {
    if (deleteBookingId != null) {
      await dispatch(deleteBooking(deleteBookingId));
      setDeleteModalOpen(false);
      setDeleteBookingId(null);
      dispatch(fetchAllBookings());
    }
  };

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: { font: { size: 16, weight: "bold" as const } },
      },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#e5e7eb" } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row font-[inter] select-none">
      <main className="flex-1 bg-[#f9fafb]">
        <h1 className="text-[29px] font-bold mb-4">Thống kê lịch tập</h1>

        {/* --- Thống kê tổng --- */}
        <div
          className="grid gap-4 mb-6 overflow-x-auto pb-2"
          style={{
            gridTemplateColumns: `repeat(${courses.length}, minmax(220px, 1fr))`,
          }}
        >
          {courseStats.map((c, idx) => (
            <div
              key={c.name}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-start min-w-[220px]"
            >
              <span className="text-[20px] font-semibold mb-2">
                Tổng số lịch {c.name}
              </span>
              <span
                className={`text-3xl font-bold ${
                  idx % 3 === 0
                    ? "text-blue-600"
                    : idx % 3 === 1
                    ? "text-green-600"
                    : "text-purple-600"
                }`}
              >
                {c.count}
              </span>
            </div>
          ))}
        </div>

        {/* --- Biểu đồ --- */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <Bar
            data={{
              labels: courseStats.map((c) => c.name),
              datasets: [
                {
                  label: "Số lượng lịch đặt",
                  data: courseStats.map((c) => c.count),
                  backgroundColor: courseStats.map(
                    (_, idx) =>
                      [
                        "rgba(96,165,250,0.5)",
                        "rgba(74,222,128,0.4)",
                        "rgba(192,132,252,0.4)",
                        "rgba(239,68,68,0.4)",
                        "rgba(253,224,71,0.4)",
                        "rgba(34,197,94,0.4)",
                      ][idx % 6]
                  ),
                  borderRadius: 8,
                  borderSkipped: false,
                  maxBarThickness: 120,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        {/* --- Bộ lọc --- */}
        <form className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium">Lớp học</label>
            <select
              className="w-full h-[45px] border-3 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none hover:cursor-pointer"
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả</option>
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="text"
              className="w-full border-3 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Tìm theo email"
              value={filterEmail}
              onChange={(e) => {
                setFilterEmail(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Ngày</label>
            <input
              type="date"
              className="w-full border-3 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </form>

        {/* --- Bảng dữ liệu --- */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr>
                {["Lớp học", "Ngày tập", "Khung giờ", "Họ tên", "Email", "Thao tác"].map(
                  (head) => (
                    <th
                      key={head}
                      className="px-4 py-3 font-semibold bg-gray-100 text-center"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 text-lg font-semibold">Không tìm thấy lịch tập</td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="px-4 py-3 border-t border-gray-200 text-center">{item.class}</td>
                    <td className="px-4 py-3 border-t border-gray-200 text-center">{item.date}</td>
                    <td className="px-4 py-3 border-t border-gray-200 text-center">{item.time}</td>
                    <td className="px-4 py-3 border-t border-gray-200 text-center">{item.name}</td>
                    <td className="px-4 py-3 border-t border-gray-200 text-center">{item.email}</td>
                    <td className="px-4 py-3 border-t border-gray-200 text-center">
                      <button
                        className="mr-3 px-4 py-1 rounded-lg bg-blue-100 text-blue-600 font-semibold hover:bg-blue-500 hover:text-white hover:cursor-pointer"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="fa-solid fa-pen-to-square mr-1"></i> Sửa
                      </button>
                      <button
                        className="px-4 py-1 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-500 hover:text-white hover:cursor-pointer"
                        onClick={() => handleDelete(item)}
                      >
                        <i className="fa-solid fa-trash mr-1"></i> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* --- Modal sửa/Thêm booking --- */}
          {editModalOpen && (
            <BookingModal
              booking={selectedBooking ? normalizeBookingId(selectedBooking) : undefined}
              bookings={bookings.map(normalizeBookingId)}
              onSave={(data) => {
                if (!selectedBooking) {
                  // Thêm mới
                  axios.post("http://localhost:1904/bookings", {
                    ...data,
                    id: undefined,
                  }).then(() => {
                    setEditModalOpen(false);
                    setSelectedBooking(null);
                    dispatch(fetchAllBookings());
                  });
                } else {
                  // Sửa
                  void handleSaveBooking(normalizeBookingId(data));
                }
              }}
              onClose={() => {
                setEditModalOpen(false);
                setSelectedBooking(null);
              }}
              currentUserId={selectedBooking ? selectedBooking.userId : 0}
            />
          )}

          {/* --- Modal xác nhận xoá --- */}
          {deleteModalOpen && (
            <ConfirmDeleteModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
            />
          )}

          {/* --- Phân trang --- */}
          <div className="flex justify-center items-center py-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-3 py-1 rounded-l-lg bg-gray-100 w-[50px] h-[50px] ${
                totalPages === 0 || currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200"
              }`}
              disabled={totalPages === 0 || currentPage === 1}
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 w-[50px] h-[50px] transition-all rounded-none hover:cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white scale-105 shadow-lg"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-3 py-1 rounded-r-lg bg-gray-100 w-[50px] h-[50px] ${
                totalPages === 0 || currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200"
              }`}
              disabled={totalPages === 0 || currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}