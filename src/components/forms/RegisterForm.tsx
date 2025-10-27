import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../stores/userStore"
import { registerUser } from "../../slices/userSlice"
import { useNavigate, Link } from "react-router-dom"
import React, { useState } from "react"
// Notification component
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
import RegisterBg from "../../assets/Login_Register_Background.jpg"

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const schema = yup.object({
  fullName: yup.string().required("Họ và tên không được để trống!"),
  email: yup.string().required("Email không được để trống!").email("Email không hợp lệ!"),
  password: yup.string().required("Mật khẩu không được để trống!").min(8, "Mật khẩu phải có ít nhất 8 kí tự!"),
  confirmPassword: yup
    .string()
    .required("Mật khẩu xác nhận không được để trống!")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp!"),
})

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isDelay, setIsDelay] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Tự động ẩn thông báo lỗi sau 2 giây
  React.useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg("") , 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (isDelay) return
    setIsDelay(true)
    setTimeout(() => {
      navigate("/login")
      setIsDelay(false)
    }, 1500)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLocalLoading(true);
    setErrorMsg("");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const userWithRole = { ...data, role: "user", id: "" };
    const rs = await dispatch(registerUser(userWithRole));
    setLocalLoading(false);
    if (registerUser.fulfilled.match(rs)) {
      setShowSuccess(true);
      reset(); 
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1800);
    } else if (registerUser.rejected.match(rs)) {
      setErrorMsg(rs.payload as string || "Đăng ký thất bại!");
      reset();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-[inter] select-none overflow-hidden">
      <img src={RegisterBg} alt="Register Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-white/30 to-purple-900/40 z-10" />

      {showSuccess && (
        <Notification message="Đăng ký tài khoản thành công!" />
      )}
      {errorMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      <div className="relative z-20 w-full max-w-md h-auto">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md h-auto">
          <h2 className="text-center mb-6 text-[28px] font-[700]">Đăng Ký Tài Khoản</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">Họ và tên</label>
              <input
                {...register("fullName")}
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
                autoComplete="new-email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px] pr-10"
                  autoComplete="new-password"
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

            <div>
              <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px] pr-10"
                  autoComplete="confirm-password"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 cursor-pointer transition-colors duration-200 hover:text-blue-600 hover:scale-110"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={localLoading}
              className={`w-full font-semibold rounded-md transition-all duration-200 h-[40px] mt-4 shadow-md focus:outline-none flex items-center justify-center gap-2
                ${localLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:shadow-lg hover:cursor-pointer'}
              `}
            >
              {localLoading && (
                <span className="w-5 h-5 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin inline-block"></span>
              )}
              {localLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
              onClick={handleLoginClick}
              style={isDelay ? { pointerEvents: "none", opacity: 0.6 } : {}}
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
