import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { jwtDecode } from "jwt-decode"
import type { RootState } from "../../stores/userStore"

export default function Navbar({ showUser, showPracticeSchedule, showHomePage }: { showUser?: boolean; showPracticeSchedule?: boolean; showHomePage?: boolean }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const getUserFromLocal = (): { fullName?: string; role?: string } => {
    const token = localStorage.getItem("currentUser");
    if (!token) return {};
    try {
      return jwtDecode<{ fullName?: string; role?: string }>(token);
    } catch {
      return {};
    }
  };
  const userName = useSelector((state: RootState) => state.user.data?.fullName) || getUserFromLocal().fullName;
  const userRole = useSelector((state: RootState) => state.user.data?.role) || getUserFromLocal().role;
  const isLoggedIn = Boolean(userName);

  const handleNavigate = (path: string) => {
    setTimeout(() => {
      navigate(path)
    }, 1500)
  }

  const handleLogout = () => {
    if (!isLoggedIn) {
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
  <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-[#1f2630] text-white h-14 select-none shadow">
      <button
        className="tracking-wide text-[24px] font-[700] py-2 ml-0 lg:ml-[88.5px] hover:cursor-pointer cursor-pointer bg-transparent border-none"
        onClick={() => handleNavigate("/")}
      >
        GYM MANAGEMENT
      </button>

      <nav className="hidden sm:flex text-[18.6px] font-[400] space-x-5 mr-0 lg:mr-[88.5px] items-center">

        {showHomePage && (
          <button className="navbar-link hover:cursor-pointer" onClick={() => handleNavigate("/")}><i className="fa-solid fa-house mr-2.5"></i>Trang chủ</button>
        )}

        {showPracticeSchedule && isLoggedIn && (
          <button className="navbar-link hover:cursor-pointer" onClick={() => handleNavigate("/bookings")}><i className="fa-solid fa-calendar-days mr-2.5"></i>Lịch tập</button>
        )}

        {userRole === 'admin' && (
          <button className="navbar-link hover:cursor-pointer" onClick={() => handleNavigate("/admin")}><i className="fa-solid fa-user-shield mr-2.5"></i>Quản lí</button>
        )}

        {showUser && isLoggedIn && (
          <span className="ml-4 mt-0.5 text-gray-200 group">
            <i className="fa-regular fa-user mr-2.5"></i>
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
          <i className="fa-solid fa-right-from-bracket mr-2.5"></i>{isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
        </button>
      </nav>

      <button
        className="sm:hidden flex items-center px-2 py-1 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <i className="fa-solid fa-xmark text-2xl"></i>
        ) : (
          <i className="fa-solid fa-bars text-2xl"></i>
        )}
      </button>

      {open && (
        <nav className="absolute top-14 left-0 w-full bg-[#1f2630] flex flex-col items-center space-y-2 py-4 z-50 sm:hidden shadow-lg animate-fade-in text-[18.6px] font-[400]">
          {showHomePage && (
            <a
              href="#"
              className="navbar-link flex items-center"
              onClick={() => setOpen(false)}
            >
              <i className="fa-solid fa-house mr-2.5"></i>Trang chủ
            </a>
          )}
          {showPracticeSchedule && isLoggedIn && (
            <a
              href="#"
              className="navbar-link flex items-center"
              onClick={() => setOpen(false)}
            >
              <i className="fa-solid fa-calendar-days mr-2.5"></i>Lịch tập
            </a>
          )}
          {userRole === 'admin' && (
            <a
              href="#"
              className="navbar-link flex items-center"
              onClick={() => setOpen(false)}
            >
              <i className="fa-solid fa-user-shield mr-2.5"></i>Quản lý
            </a>
          )}

          {showUser && isLoggedIn && (
            <span className="mt-2 text-sm text-gray-200 group flex items-center">
              <i className="fa-regular fa-user mr-2.5"></i>
              <span>Xin chào, </span>
              <span className="font-bold text-yellow-400 transition-colors duration-200 group-hover:text-yellow-300">
                {userName}
              </span>
            </span>
          )}
          <button
            className="navbar-link mt-2 bg-transparent border-none cursor-pointer flex items-center"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket mr-2.5"></i>{isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
          </button>
        </nav>
      )}
    </header>
  )
}
