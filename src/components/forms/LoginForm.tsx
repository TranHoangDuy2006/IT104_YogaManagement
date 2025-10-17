import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function RegisterForm() {  
  const navigate = useNavigate();
  const [isDelay, setIsDelay] = useState(false);

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDelay) return;
    setIsDelay(true);
    setTimeout(() => {
      navigate("/register");
      setIsDelay(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-[inter]">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md h-auto">
        <h2 className="text-center mb-6 text-[28px] font-[700]">
          Đăng Nhập
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
              autoComplete="new-email"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-md transition-all duration-200 h-[40px] mt-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium" onClick={handleRegisterClick} style={isDelay ? { pointerEvents: "none", opacity: 0.6 } : {}}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}