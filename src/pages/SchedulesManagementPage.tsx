import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../stores/userStore";
import { fetchAllBookings } from "../slices/fetchAllBookingsThunk";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Booking = {
  class: string;
  date: string;
  time: string;
  name: string;
  email: string;
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
      labels: {
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    title: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
      grid: { color: "#e5e7eb" },
    },
  },
};

export default function SchedulesManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const bookings =
    (useSelector((state: RootState) => state.bookingsAll?.data) as Booking[]) || [];

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const [courses, setCourses] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    axios.get("http://localhost:1904/courses").then((res) => setCourses(res.data));
  }, []);

  const courseStats = courses.map((course) => ({
    name: course.name,
    count: bookings.filter((b) => b.class === course.name).length,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row font-[inter] select-none">
      <main className="flex-1 p-6">
        <h1 className="text-[29px] font-bold mb-4">Thống kê lịch tập</h1>

        {/* --- Thanh thống kê ngang cuộn được --- */}
        <div
          className="grid gap-4 mb-6 overflow-x-auto pb-2"
          style={{
            gridTemplateColumns: `repeat(${courses.length}, minmax(220px, 1fr))`,
          }}
        >
          {courseStats.map((c, idx) => (
            <div
              key={c.name}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-start min-w-[220px] flex-shrink-0"
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
                        "rgba(96, 165, 250, 0.5)",
                        "rgba(74, 222, 128, 0.4)",
                        "rgba(192, 132, 252, 0.4)",
                        "rgba(239, 68, 68, 0.4)",
                        "rgba(253, 224, 71, 0.4)",
                        "rgba(34, 197, 94, 0.4)",
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
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 hover:cursor-pointer focus:ring-blue-400">
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tìm theo email"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Ngày</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 hover:cursor-pointer focus:ring-blue-400"
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
                      className="px-4 py-3 text-left font-semibold bg-gray-100"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-4 py-3 border-t border-gray-200">{item.class}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{item.date}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{item.time}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{item.name}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{item.email}</td>
                  <td className="px-4 py-3 border-t border-gray-200">
                    <button className="mr-3 px-4 py-1 rounded-lg bg-blue-100 text-blue-600 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-500 hover:text-white">
                      <i className="fa-solid fa-pen-to-square"></i> Sửa
                    </button>
                    <button className="px-4 py-1 rounded-lg bg-red-100 text-red-600 font-semibold shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white">
                      <i className="fa-solid fa-trash"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- Phân trang --- */}
          <div className="flex justify-center items-center py-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-3 py-1 rounded-l-lg bg-gray-100 w-[50px] h-[50px] ${
                totalPages === 0 || currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200 hover:cursor-pointer"
              }`}
              disabled={totalPages === 0 || currentPage === 1}
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 w-[50px] h-[50px] transition-all duration-300 ease-in-out rounded-none ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white scale-105 shadow-lg"
                    : "bg-white hover:bg-gray-100 hover:cursor-pointer"
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
                  : "hover:bg-gray-200 hover:cursor-pointer"
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
