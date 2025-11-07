import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import '../Animations.css';
import type { SidebarProps } from '../../types/SidebarProps';

export default function Sidebar({ setShowLogoutMsg }: SidebarProps) {
  const userData = localStorage.getItem("currentUser");
  let user: { fullName?: string; avatarUrl?: string; role?: string } = {};
  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch {
      user = {};
    }
  }
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateWithDelay = (path: string) => {
    setTimeout(() => {
      navigate(path);
    }, 500);
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
      
      <h2 className="text-[20px] font-bold mb-[32px]">
        <i className="fa-solid fa-chart-line mr-2.5"></i>Admin Dashboard
      </h2>
      <nav className="flex flex-col gap-2">
        <button
          className="px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer"
          onClick={() => handleNavigateWithDelay("/home")}
        >
          <i className="fa-solid fa-house mr-2.5"></i>Trang chủ
        </button>
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
          className={`px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer truncate overflow-hidden whitespace-nowrap ${location.pathname === '/admin/classes-management' ? 'border-l-4 border-blue-400 bg-[#263043] text-blue-300 font-bold' : ''}`}
          onClick={() => handleNavigateWithDelay('/admin/classes-management')}
        >
          <i className="fa-solid fa-users-class mr-2.5"></i>Quản lý lớp học
        </button>
        <button
          className={`px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer ${location.pathname === '/admin/services-management' ? 'border-l-4 border-blue-400 bg-[#263043] text-blue-300 font-bold' : ''}`}
          onClick={() => handleNavigateWithDelay('/admin/services-management')}
        >
          <i className="fa-solid fa-gear mr-2.5"></i>Quản lý dịch vụ
        </button>
        <button
          className="text-[#f87171] font-semibold px-3 py-2 rounded-lg w-full text-left transition-all duration-200 hover:bg-red-500 hover:text-white hover:shadow-lg hover:scale-105 hover:animate-shake hover:cursor-pointer relative overflow-hidden"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-right-from-bracket mr-2.5"></i>Đăng xuất
        </button>
      </nav>

      {user?.fullName && (
        <div className="flex items-center gap-3 mb-2 mt-140 p-2 rounded-xl bg-[#20232a] shadow-inner">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                user.fullName.charAt(0).toUpperCase()
              )}
            </div>

            <span className="absolute bottom-[-1px] right-[-4px] w-3 h-3 bg-green-500 border-2 border-[#20232a] rounded-full"></span>
          </div>
          <span className={`font-semibold text-[16px] truncate max-w-[120px] ${user.role === 'admin' ? 'text-red-500' : 'text-white'}`}>{user.fullName}</span>
        </div>
      )}
    </aside>
  );
}