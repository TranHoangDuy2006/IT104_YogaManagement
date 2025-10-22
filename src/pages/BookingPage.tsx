/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../stores/userStore";
import Navbar from "../components/commons/Navbar";
import BookingModal from "../components/forms/BookingModal";
import ConfirmDeleteModal from "../components/forms/ConfirmDeleteModal";
import {
  fetchBookingsByUser,
  addBooking,
  updateBooking,
  deleteBooking,
} from "../slices/bookingSlice";
import { usePagination } from "../hooks/usePagination";

export default function BookingPage() {
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const currentUserId = currentUser?.id || 1;

  const bookings = useSelector((state: RootState) => state.bookings.data);
  const loading = useSelector((state: RootState) => state.bookings.loading);
  const error = useSelector((state: RootState) => state.bookings.error);

  const [showForm, setShowForm] = useState(false);
  const [editBooking, setEditBooking] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchBookingsByUser(currentUserId));
  }, [dispatch, currentUserId]);

  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination(bookings, 5);

  const handleCloseForm = () => {
    setShowForm(false);
    setEditBooking(null);
  };

  const handleSave = (data: any) => {
    if (data.id) {
      dispatch(updateBooking(data));
    } else {
      dispatch(
        addBooking({
          ...data,
          name: currentUser.fullName || "Admin",
          email: currentUser.email || "admin@gmail.com",
        })
      );
    }
    setShowForm(false);
    setEditBooking(null);
  };

  const handleEdit = (booking: any) => {
    setEditBooking(booking);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteBooking(deleteId));
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[inter] select-none">
      <Navbar
        showUser={false}
        showPracticeSchedule={false}
        showHomePage={true}
      />

      <div className="w-full bg-white rounded-xl shadow-md max-w-[1280px] mx-auto mt-8 p-8 h-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[30.6px] font-bold">Quản lý lịch tập</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:cursor-pointer w-[167px] h-[40px] text-[19.6px]"
            onClick={() => {
              setShowForm(true);
              setEditBooking(null);
            }}
          >
            <i className="fa-solid fa-plus mr-2"></i> Đặt lịch mới
          </button>
        </div>

        {loading && (
          <div className="text-blue-500 font-semibold mb-4">
            Đang tải dữ liệu...
          </div>
        )}
        {error && (
          <div className="text-red-500 font-semibold mb-4">{error}</div>
        )}

        <div className="w-full max-w-[1248px] mx-auto rounded-lg mt-6 overflow-x-auto">
          <table className="w-full bg-gray-50 rounded-xl shadow-sm">
            <thead>
              <tr className="text-black font-semibold text-lg">
                <th className="px-6 text-left w-[204px] h-[48px]">Lớp học</th>
                <th className="py-4 text-left w-[226px] h-[48px]">Ngày tập</th>
                <th className="py-4 text-left w-[247px] h-[48px]">Khung giờ</th>
                <th className="py-4 text-left w-[182px] h-[48px]">Họ tên</th>
                <th className="py-4 text-left w-[161px] h-[48px]">Email</th>
                <th className="py-4 text-left w-[226px] h-[48px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-100">
                  <td className="px-6 py-3 bg-white">{b.class}</td>
                  <td className="py-3 bg-white">{b.date}</td>
                  <td className="py-3 bg-white">{b.time}</td>
                  <td className="py-3 bg-white">{b.name}</td>
                  <td className="py-3 bg-white truncate max-w-[160px] whitespace-nowrap pr-6">
                    {b.email}
                  </td>
                  <td className="py-3 pl-2 bg-white">
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow-sm hover:bg-blue-500 hover:cursor-pointer hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 mr-3"
                      onClick={() => handleEdit(b)}
                    >
                      <i className="fa-solid fa-pen-to-square fa-lg mr-1"></i>
                      Sửa
                    </button>
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold shadow-sm hover:bg-red-500 hover:text-white hover:cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 active:scale-95"
                      onClick={() => handleDelete(b.id!)}
                    >
                      <i className="fa-solid fa-trash-can fa-lg mr-1"></i>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-3 py-1 rounded-l-lg bg-gray-100 w-[50px] h-[50px] ${
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-200 hover:cursor-pointer"
            }`}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 w-[50px] h-[50px] hover:cursor-pointer transition-all duration-300 ease-in-out rounded-none ${
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
              bookings.length === 0 || currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-200 hover:cursor-pointer"
            }`}
            disabled={bookings.length === 0 || currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>

      {showForm && (
        <BookingModal
          onClose={handleCloseForm}
          onSave={handleSave}
          bookings={bookings}
          currentUserId={currentUserId}
          booking={editBooking}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
