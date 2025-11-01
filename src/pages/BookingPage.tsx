/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../stores/userStore";
import Navbar from "../components/commons/Navbar";
import BookingModal from "../components/modals/BookingModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import { fetchBookingsByUser, addBooking, updateBooking, deleteBooking } from "../slices/bookingSlice";
import { usePagination } from "../hooks/usePagination";
import Footer from "../components/commons/Footer";
import { useLocation } from "react-router-dom";

import '../components/Animations.css';

import React from "react";
function Notification({ message, show }: { message: string, show: boolean }) {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    if (!show) {
      setTimeout(() => setVisible(false), 400);
    } else {
      setVisible(true);
    }
  }, [show]);
  if (!visible) return null;
  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 font-[inter] select-none">
      <div className={`bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${show ? 'animate-fade-in' : 'animate-fade-out'}`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const location = useLocation();
  const defaultClassId = location.hash ? location.hash.replace('#', '') : "";
  const [defaultClassName, setDefaultClassName] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const userStr = localStorage.getItem("currentUser");
  const currentUser = userStr ? JSON.parse(userStr) : {};
  const currentUserId = currentUser?.id || 1;

  const bookings = useSelector((state: RootState) => state.bookings.data);
  const loading = useSelector((state: RootState) => state.bookings.loading);
  const error = useSelector((state: RootState) => state.bookings.error);

  const [showForm, setShowForm] = useState(false);
  const [editBooking, setEditBooking] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    dispatch(fetchBookingsByUser(currentUserId));
  }, [dispatch, currentUserId]);

  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination(bookings, 5);

  const handleCloseForm = () => {
    setShowForm(false);
    setEditBooking(null);
    setDefaultClassName("");
  };

  const handleSave = async (data: any) => {
    if (data.id) {
      await dispatch(updateBooking(data));
      setSuccessMsg("Sửa lịch tập thành công!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      await dispatch(
        addBooking({
          ...data,
          name: currentUser.fullName || "Admin",
          email: currentUser.email || "admin@gmail.com",
        })
      );
      setSuccessMsg("Thêm lịch tập thành công!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
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
    <div className="min-h-screen flex flex-col bg-gray-50 font-[inter] select-none pt-16">
      <div className="flex-1">
      {showSuccess && <Notification message={successMsg} show={showSuccess} />}
        <Navbar showUser={false} showPracticeSchedule={false} showHomePage={true} />
        <div className="w-full bg-white rounded-xl shadow-md max-w-[1280px] mx-auto mt-8 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[30.6px] font-bold">Quản lý lịch tập</h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:cursor-pointer w-[167px] h-[40px] text-[19.6px]"
              onClick={() => {
                if (defaultClassId) {
                  const found = bookings.find(b => b.class === defaultClassId || b.class === defaultClassName);
                  if (found) {
                    setDefaultClassName(found.class);
                  } else {
                    setDefaultClassName(defaultClassId);
                  }
                }
                setShowForm(true);
                setEditBooking(null);
              }}
            >
              <i className="fa-solid fa-calendar-plus mr-2"></i> Đặt lịch mới
            </button>
          </div>

          {loading && <div className="text-blue-500 font-semibold mb-4">Đang tải dữ liệu...</div>}
          {error && <div className="text-red-500 font-semibold mb-4">{error}</div>}

          <div className="w-full max-w-[1248px] mx-auto rounded-lg mt-6 overflow-x-auto">
            {currentItems.length === 0 ? (
              <div className="text-center text-gray-500 text-lg py-12">Chưa có lịch nào được đặt</div>
            ) : (
              <table className="w-full bg-gray-50 rounded-xl shadow-sm">
                <thead>
                  <tr className="text-black font-semibold text-lg">
                    <th className="px-6 py-4 text-center">Lớp học</th>
                    <th className="py-4 text-center">Ngày tập</th>
                    <th className="py-4 text-center">Khung giờ</th>
                    <th className="py-4 text-center">Họ tên</th>
                    <th className="py-4 text-center">Email</th>
                    <th className="py-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((b: any) => (
                    <tr key={b.id} className="hover:bg-gray-100">
                      <td className="px-6 py-3 bg-white text-center">{b.class}</td>
                      <td className="py-3 bg-white text-center">{(() => {
                        if (!b.date) return "";
                        const d = new Date(b.date);
                        if (isNaN(d.getTime())) return b.date;
                        const day = String(d.getDate()).padStart(2, '0');
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const year = d.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()}</td>
                      <td className="py-3 bg-white text-center">{b.time}</td>
                      <td className="py-3 bg-white text-center">{b.name}</td>
                      <td className="py-3 bg-white truncate max-w-[160px] whitespace-nowrap pr-6 text-center">
                        {b.email}
                      </td>
                      <td className="py-3 pl-2 bg-white text-center">
                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow-sm hover:bg-blue-500 hover:text-white hover:cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 mr-3"
                          onClick={() => handleEdit(b)}
                        >
                          <i className="fa-solid fa-pen-to-square fa-lg mr-1"></i> Sửa
                        </button>
                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold shadow-sm hover:bg-red-500 hover:text-white hover:cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 active:scale-95"
                          onClick={() => handleDelete(b.id!)}
                        >
                          <i className="fa-solid fa-trash-can fa-lg mr-1"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {currentItems.length > 0 && (
            <div className="flex justify-center items-center mt-6 gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-3 py-1 rounded-l-lg bg-gray-100 w-[40px] h-[40px] ${
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
                  className={`px-3 py-1 w-[40px] h-[40px] hover:cursor-pointer transition-all duration-300 ease-in-out rounded-none ${
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
                className={`px-3 py-1 rounded-r-lg bg-gray-100 w-[40px] h-[40px] ${
                  bookings.length === 0 || currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-200 hover:cursor-pointer"
                }`}
                disabled={bookings.length === 0 || currentPage === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>

        {showForm && <BookingModal onClose={handleCloseForm} onSave={handleSave} bookings={bookings} currentUserId={currentUserId} booking={editBooking} defaultClassName={defaultClassName} />}

        {showDeleteModal && <ConfirmDeleteModal isOpen={showDeleteModal} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} />}
      </div>
      <Footer />
    </div>
  );
}
