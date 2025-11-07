import { useState, useEffect } from "react";
import "../Animations.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/useAppSelector";
import type { RootState } from "../../stores/userStore";
import type { UserState } from "../../types/User";
import { setUserFromLocalStorage } from "../../slices/userSlice";

export default function Navbar({
  showUser,
  showPracticeSchedule,
  showHomePage,
}: {
  showUser?: boolean;
  showPracticeSchedule?: boolean;
  showHomePage?: boolean;
}) {
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useAppSelector(
    (state: RootState) => (state.user as UserState).data
  );
  const userName = user?.fullName;
  const userRole = user?.role;
  const isLoggedIn = Boolean(userName);

  const userData = localStorage.getItem("currentUser");

  useEffect(() => {
    if (userData) {
      try {
        dispatch(setUserFromLocalStorage(JSON.parse(userData)));
      } catch (e) {
        console.error("Error parsing user data from localstorage:", e);
      }
    }
  }, [dispatch, userData]);

  const handleNavigate = (path: string) => {
    setTimeout(() => {
      navigate(path);
    }, 2000);
  };

  const handleLogout = () => {
    if (!isLoggedIn) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }
    localStorage.removeItem("currentUser");
    setTimeout(() => {
      setShowLogoutMsg(true);
      setTimeout(() => {
        setShowLogoutMsg(false);
        navigate("/login");
      }, 2000);
    }, 1000);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-[#1f2630] text-white h-14 font-[inter] select-none shadow">
      {showLogoutMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-xl mr-2"></i>
            <span>Đã đăng xuất</span>
          </div>
        </div>
      )}

      <button
        className="tracking-wide text-[24px] font-[700] py-2 ml-0 lg:ml-[88.5px] hover:cursor-pointer bg-transparent border-none"
        onClick={() => handleNavigate("/")}
      >
        GYM MANAGEMENT
      </button>

      <nav className="hidden sm:flex text-[18.6px] font-[400] space-x-5 mr-0 lg:mr-[88.5px] items-center">
        {showHomePage && (
          <button
            className="navbar-link hover:cursor-pointer"
            onClick={() => handleNavigate("/")}
          >
            <i className="fa-solid fa-house mr-2.5"></i>Trang chủ
          </button>
        )}

        {showPracticeSchedule && isLoggedIn && userRole !== "admin" && (
          <button
            className="navbar-link hover:cursor-pointer"
            onClick={() => handleNavigate("/bookings")}
          >
            <i className="fa-solid fa-calendar-check mr-2.5"></i>Lịch đã đặt
          </button>
        )}

        {userRole === "admin" && (
          <button
            className="navbar-link hover:cursor-pointer"
            onClick={() => handleNavigate("/admin")}
          >
            <i className="fa-solid fa-user-shield mr-2.5"></i>Quản lí
          </button>
        )}

        {showUser && isLoggedIn && (
          <span className="flex items-center gap-2 relative">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg cursor-pointer overflow-hidden"
                onClick={() => {
                  const userStr = localStorage.getItem("currentUser");
                  if (userStr) setShowProfileDropdown((v) => !v);
                }}
                tabIndex={0}
                onBlur={() =>
                  setTimeout(() => setShowProfileDropdown(false), 150)
                }
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : userName ? (
                  userName.charAt(0).toUpperCase()
                ) : (
                  "?"
                )}
              </div>

              <span className="absolute bottom-[-1px] right-[-4px] w-3 h-3 bg-green-500 border-2 border-[#1f2630] rounded-full"></span>
            </div>

            <div
              className={`absolute top-14 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-[240px] z-50 overflow-hidden transition-all duration-300 origin-top-right ${
                showProfileDropdown
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="py-2">
                {user?.description && (
                  <div className="px-4 py-2 border-b border-gray-100 mb-2">
                    <p className="text-xs text-cyan-500 italic">{user.description}</p>
                  </div>
                )}
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:cursor-pointer transition-all duration-200 group"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    setTimeout(() => {
                      navigate("/profile");
                    }, 2000);
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <i className="fa-regular fa-user text-indigo-600"></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">Trang cá nhân</p>
                    <p className="text-xs text-gray-500">
                      Xem và chỉnh sửa hồ sơ
                    </p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-400 text-xs group-hover:translate-x-1 transition-transform"></i>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:cursor-pointer transition-all duration-200 group"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate("/settings");
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <i className="fa-solid fa-gear text-purple-600"></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">Cài đặt</p>
                    <p className="text-xs text-gray-500">
                      Tùy chỉnh tài khoản
                    </p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-400 text-xs group-hover:translate-x-1 transition-transform"></i>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:cursor-pointer transition-all duration-200 group"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate("/help");
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <i className="fa-solid fa-circle-question text-blue-600"></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">Trợ giúp</p>
                    <p className="text-xs text-gray-500">Hỗ trợ & câu hỏi</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-400 text-xs group-hover:translate-x-1 transition-transform"></i>
                </button>
              </div>
            </div>

            <span>Xin chào,</span>
            <span
              className={`font-bold ${
                userRole === "admin" ? "text-red-500" : "text-yellow-400"
              }`}
            >
              {userName}
            </span>
          </span>
        )}

        <button
          className="navbar-link bg-transparent border-none cursor-pointer flex items-center"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-right-from-bracket mr-2.5"></i>
          {isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
        </button>
      </nav>
    </header>
  );
}
