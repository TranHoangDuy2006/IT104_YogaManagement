/* eslint-disable @typescript-eslint/no-explicit-any */
function Notification({ message }: { message: string }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        <span>{message}</span>
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(.4,0,.2,1) forwards;
        }
      `}</style>
    </div>
  );
}
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../stores/userStore"; 
import { loginUser } from "../../slices/userSlice";
import { useState } from "react";
import LoginBg from "../../assets/Login_Register_Background.jpg";

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().required("Email không được để trống!").email("Email không hợp lệ!"),
  password: yup.string().required("Mật khẩu không được để trống!").min(6, "Mật khẩu tối thiểu 6 ký tự!"),
});

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.user);
  const [isDelay, setIsDelay] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginFormData) => {
    setLocalLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const result = await dispatch(loginUser(data));
    setLocalLoading(false);
    
    if (loginUser.fulfilled.match(result)) {
      setShowSuccess(true);
      reset(); 
      setTimeout(() => {
        setShowSuccess(false);

        const user = result.payload as any;
        if (user && user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    }
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDelay) return;
    setIsDelay(true);
    setTimeout(() => {
      navigate("/register");
      setIsDelay(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-[inter] user-select-none overflow-hidden">
      <img src={LoginBg} alt="Login Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-white/30 to-purple-900/40 z-10" />

      {showSuccess && (
        <Notification message="Đăng nhập thành công!" />
      )}

      <div className="relative z-20 w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-center mb-6 text-[28px] font-[700]">Đăng Nhập</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                  autoComplete="current-password"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 cursor-pointer transition-colors duration-200 hover:text-blue-600 hover:scale-110"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}

            <button
              type="submit"
              disabled={localLoading}
              className="w-full bg-blue-600 hover:scale-[1.04] hover:shadow-xl hover:ring-2 hover:ring-blue-400 hover:cursor-pointer text-white font-semibold rounded-md transition-all duration-200 h-[40px] mt-4 disabled:bg-gray-400 focus:outline-none shadow-md flex items-center justify-center gap-2"
            >
              {localLoading && (
                <span className="w-5 h-5 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin inline-block"></span>
              )}
              {localLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
              onClick={handleRegisterClick}
              style={isDelay ? { pointerEvents: "none", opacity: 0.6 } : {}}
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
