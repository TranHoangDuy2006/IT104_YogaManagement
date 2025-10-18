import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleNavigateWithDelay = (path: string) => {
    setTimeout(() => {
      navigate(path);
    }, 1000);
  };

  return (
    <aside className="w-[250px] bg-[#232b36] text-white flex flex-col py-4 px-6 gap-4 font-[inter]">
      <h2 className="text-[20px] font-bold mb-[32px]">Admin Dashboard</h2>
      <nav className="flex flex-col gap-2">
        <a
          href="#"
          className="px-3 py-2 rounded-lg font-[19px] transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline"
        >
          Quản lý lịch
        </a>
        <a
          href="#"
          className="px-3 py-2 rounded-lg font-[19px] transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:underline"
        >
          Quản lý dịch vụ
        </a>
        <button
          className="px-3 py-2 rounded-lg font-[19px] w-full text-left transition-all duration-200 hover:bg-[#2d3748] hover:text-blue-400 hover:cursor-pointer hover:scale-105 hover:shadow-lg hover:underline"
          onClick={() => handleNavigateWithDelay("/")}
        >
          Trang chủ
        </button>
        <button
          className="text-[#f87171] font-semibold px-3 py-2 rounded-lg hover:bg-[#2d3748] hover:cursor-pointer transition w-full text-left"
          onClick={() => handleNavigateWithDelay("/login")}
        >
          Đăng xuất
        </button>
      </nav>
    </aside>
  )
}
