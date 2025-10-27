import Sidebar from "../components/commons/Sidebar";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function AdminPage() {
  const location = useLocation();
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
      <Sidebar />
      <main className="flex-1 p-8">
            {location.pathname === '/admin' ? (
              <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-10 min-h-[400px] flex flex-col items-center justify-center border border-blue-200 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl text-blue-500"><i className="fa-solid fa-user-shield" /></span>
                  <h2 className="text-2xl font-extrabold text-blue-700 tracking-wide drop-shadow">
                    Chào mừng, Admin
                    {userName && <span className="text-red-500">{userName}</span>}
                  </h2>
                </div>
                <p className="text-lg text-gray-700 mb-4 text-center">Sử dụng <span className="font-semibold text-blue-500">Sidebar</span> bên trái để chuyển giữa các chức năng quản lý:</p>
                <ul className="list-none w-full max-w-md mb-6">
                  <li className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
                    <span className="text-blue-400"><i className="fa-solid fa-users" /></span>
                    <span className="font-semibold text-blue-700">Quản lý người dùng</span>
                    <span className="text-gray-500">Thêm, sửa, xóa tài khoản người dùng.</span>
                  </li>
                  <li className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
                    <span className="text-blue-400"><i className="fa-solid fa-spa" /></span>
                    <span className="font-semibold text-blue-700">Quản lý dịch vụ</span>
                    <span className="text-gray-500">Xem, chỉnh sửa các dịch vụ yoga.</span>
                  </li>
                  <li className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
                    <span className="text-blue-400"><i className="fa-solid fa-calendar-check" /></span>
                    <span className="font-semibold text-blue-700">Quản lý lịch</span>
                    <span className="text-gray-500">Quản lý lịch học, lịch đặt chỗ.</span>
                  </li>
                </ul>
                <p className="text-base text-gray-600 italic underline">Chọn chức năng ở Sidebar để bắt đầu quản lý hệ thống Yoga!</p>
                <style>{`
                  @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  .animate-fade-in {
                    animation: fade-in 0.7s cubic-bezier(.36,.07,.19,.97) both;
                  }
                `}</style>
              </div>
            ) : (
              <Outlet />
            )}
      </main>
    </div>
  );
}
