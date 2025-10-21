import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../stores/userStore"

export default function Navbar({ showUser, showPracticeSchedule, showHomePage }: { showUser?: boolean; showPracticeSchedule?: boolean; showHomePage?: boolean }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const userName = useSelector((state: RootState) => state.user.data?.fullName) || JSON.parse(localStorage.getItem("currentUser") || "{}").fullName
  const userRole = useSelector((state: RootState) => state.user.data?.role) || JSON.parse(localStorage.getItem("currentUser") || "{}").role

  const handleNavigate = (path: string) => {
    setTimeout(() => {
      navigate(path)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <header className="flex items-center justify-between bg-[#1f2630] text-white h-14 w-full select-none">
      <button
        className="tracking-wide text-[24px] font-[700] py-2 ml-0 lg:ml-[88.5px] hover:cursor-pointer cursor-pointer bg-transparent border-none"
        onClick={() => handleNavigate("/")}
      >
        GYM MANAGEMENT
      </button>

      <nav className="hidden sm:flex text-[18.6px] font-[400] space-x-5 mr-0 lg:mr-[88.5px] items-center">

        {showHomePage && (
          <button className="navbar-link hover:cursor-pointer" onClick={() => handleNavigate("/")}>Trang chủ</button>
        )}

        {showPracticeSchedule && (
          <button className="navbar-link hover:cursor-pointer" onClick={() => handleNavigate("/booking")}>Lịch tập</button>
        )}

        {userRole === 'admin' && (
          <button className="navbar-link hover:cursor-pointer" onClick={() => handleNavigate("/admin")}>Quản lí</button>
        )}

        {showUser && (
          <span className="ml-4 mt-0.5 text-gray-200 group">
            <span>Xin chào, </span>
            <span className="font-bold text-yellow-400 transition-colors duration-200 group-hover:text-yellow-300">
              {userName}
            </span>
          </span>
        )}

        <button
          className="navbar-link ml-4 bg-transparent border-none hover:cursor-pointer"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </nav>

      <button
        className="sm:hidden flex items-center px-2 py-1 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {open && (
        <nav className="absolute top-14 left-0 w-full bg-[#1f2630] flex flex-col items-center space-y-2 py-4 z-50 sm:hidden shadow-lg animate-fade-in text-[18.6px] font-[400]">
          <a
            href="#"
            className="navbar-link"
            onClick={() => setOpen(false)}
          >
            Trang chủ
          </a>
          <a
            href="#"
            className="navbar-link"
            onClick={() => setOpen(false)}
          >
            Lịch tập
          </a>
          {userRole === 'admin' && (
            <a
              href="#"
              className="navbar-link"
              onClick={() => setOpen(false)}
            >
              Quản lý
            </a>
          )}

          {showUser && (
            <span className="mt-2 text-sm text-gray-200 group">
              <span>Xin chào, </span>
              <span className="font-bold text-yellow-400 transition-colors duration-200 group-hover:text-yellow-300">
                {userName}
              </span>
            </span>
          )}
          <button
            className="navbar-link mt-2 bg-transparent border-none cursor-pointer"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </nav>
      )}
    </header>
  )
}
