import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import '../Animations.css';

interface SidebarProps {
  setShowLogoutMsg?: (show: boolean) => void;
}

export default function Sidebar({ setShowLogoutMsg }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateWithDelay = (path: string) => {
    setTimeout(() => {
      navigate(path);
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    setTimeout(() => {
      if (setShowLogoutMsg) setShowLogoutMsg(true);
      setTimeout(() => {
        if (setShowLogoutMsg) setShowLogoutMsg(false);
        navigate("/login");
      }, 2000);
    }, 1000);
  };

  return (
    <aside className="w-[250px] h-screen sticky top-0 left-0 bg-[#232b36] text-white flex flex-col py-4 px-6 gap-4 font-[inter] select-none">
      
      <h2 className="text-[20px] font-bold mb-[32px]">Admin Dashboard</h2>
      <nav className="flex flex-col gap-2">
        <button
          className={`px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer ${location.pathname === '/admin/schedules-management' ? 'border-l-4 border-blue-400 bg-[#263043] text-blue-300 font-bold' : ''}`}
          onClick={() => handleNavigateWithDelay('/admin/schedules-management')}
        >
          <i className="fa-solid fa-calendar-days mr-2.5"></i>Quản lý lịch
        </button>
        <button
          className={`px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer truncate overflow-hidden whitespace-nowrap ${location.pathname === '/admin/users-management' ? 'border-l-4 border-blue-400 bg-[#263043] text-blue-300 font-bold' : ''}`}
          onClick={() => handleNavigateWithDelay('/admin/users-management')}
        >
          <i className="fa-solid fa-users mr-2.5"></i>Quản lý người dùng
        </button>
        <button
          className={`px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer ${location.pathname === '/admin/services-management' ? 'border-l-4 border-blue-400 bg-[#263043] text-blue-300 font-bold' : ''}`}
          onClick={() => handleNavigateWithDelay('/admin/services-management')}
        >
          <i className="fa-solid fa-gear mr-2.5"></i>Quản lý dịch vụ
        </button>
        <button
          className="px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer"
          onClick={() => handleNavigateWithDelay("/home")}
        >
          <i className="fa-solid fa-house mr-2.5"></i>Trang chủ
        </button>
        <button
          className="text-[#f87171] font-semibold px-3 py-2 rounded-lg w-full text-left transition-all duration-200 hover:bg-red-500 hover:text-white hover:shadow-lg hover:scale-105 hover:animate-shake hover:cursor-pointer"
          style={{ position: 'relative', overflow: 'hidden' }}
          onClick={handleLogout}
        >
          {/* Animation shake style now imported from Animations.css */}
          <i className="fa-solid fa-right-from-bracket mr-2.5"></i>Đăng xuất
        </button>
      </nav>
    </aside>
  );
}