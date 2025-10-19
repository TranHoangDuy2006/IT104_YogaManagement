import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateWithDelay = (path: string) => {
    setTimeout(() => {
      navigate(path);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <aside className="w-[250px] h-screen sticky top-0 left-0 bg-[#232b36] text-white flex flex-col py-4 px-6 gap-4 font-[inter]">
      <h2 className="text-[20px] font-bold mb-[32px]">Admin Dashboard</h2>
      <nav className="flex flex-col gap-2">
        <button
          className={`px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer ${location.pathname === '/admin/schedules-management' ? 'border-l-4 border-blue-400 bg-[#263043] text-blue-300 font-bold' : ''}`}
          onClick={() => handleNavigateWithDelay('/admin/schedules-management')}
        >
          Quản lý lịch
        </button>
        <button
          className={`px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer ${location.pathname === '/admin/services-management' ? 'border-l-4 border-blue-400 bg-[#263043] text-blue-300 font-bold' : ''}`}
          onClick={() => handleNavigateWithDelay('/admin/services-management')}
        >
          Quản lý dịch vụ
        </button>
        <button
          className="px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline hover:cursor-pointer"
          onClick={() => handleNavigateWithDelay("/")}
        >
          Trang chủ
        </button>
        <button
          className="text-[#f87171] font-semibold px-3 py-2 rounded-lg hover:bg-[#2d3748] hover:cursor-pointer transition w-full text-left"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </nav>
    </aside>
  )
}
