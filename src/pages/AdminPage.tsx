import Sidebar from "../components/commons/Sidebar";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import '../components/Animations.css';

export default function AdminPage() {
  const location = useLocation();
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);
  let userName = "";
  try {
    const userStr = localStorage.getItem("currentUser");
    const user = userStr ? JSON.parse(userStr) : {};
    userName = user?.fullName || "";
  } catch (e) {
    console.error("Error parsing user data:", e);
  }

  return (
    <div className="min-h-screen w-full flex font-[inter] bg-gray-50">
      <Sidebar setShowLogoutMsg={setShowLogoutMsg} />
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {showLogoutMsg && (
          <div className="fixed top-5 left-[55%] -translate-x-1/2 z-[9999] animate-fade-in">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-xl mr-2"></i>
              <span>Đã đăng xuất</span>
            </div>
          </div>
        )}
        {location.pathname === '/admin' ? (
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-10 min-h-[400px] flex flex-col items-center justify-center border border-blue-200 animate-fade-in select-none">
            <div className="flex items-center gap-3 mb-6">
              {!showLogoutMsg && (
                <>
                  <span className="text-3xl text-blue-500"><i className="fa-solid fa-user-shield" /></span>
                  <h2 className="text-2xl font-extrabold text-blue-700 tracking-wide drop-shadow">
                    Chào mừng, Admin
                    {userName && <span className="text-red-500"> {userName}</span>}
                  </h2>
                </>
              )}
            </div>
            <p className="text-lg text-gray-700 mb-4 text-center">Sử dụng <span className="font-semibold text-blue-500">Sidebar</span> bên trái để chuyển giữa các chức năng quản lý:</p>
              <ul className="list-none w-full max-w-xl mb-6 flex flex-col gap-3">
                <li className="flex flex-row items-center justify-between gap-4 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition min-w-[400px]">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400"><i className="fa-solid fa-calendar-check" /></span>
                    <span className="font-semibold text-blue-700">Quản lý lịch</span>
                  </div>
                  <span className="text-gray-500 text-right">Quản lý lịch học, lịch đặt chỗ.</span>
                </li>
                <li className="flex flex-row items-center justify-between gap-4 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition min-w-[400px]">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400"><i className="fa-solid fa-users" /></span>
                    <span className="font-semibold text-blue-700">Quản lý người dùng</span>
                  </div>
                  <span className="text-gray-500 text-right">Thêm, sửa, xóa tài khoản người dùng.</span>
                </li>
                <li className="flex flex-row items-center justify-between gap-4 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition min-w-[400px]">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400"><i className="fa-solid fa-gear" /></span>
                    <span className="font-semibold text-blue-700">Quản lý dịch vụ</span>
                  </div>
                  <span className="text-gray-500 text-right">Xem, chỉnh sửa các dịch vụ yoga.</span>
                </li>
              </ul>
            <p className="text-base text-gray-600 italic underline">Chọn chức năng ở Sidebar để bắt đầu quản lý hệ thống Yoga!</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}