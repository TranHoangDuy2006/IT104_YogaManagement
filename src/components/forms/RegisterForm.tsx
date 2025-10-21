import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../stores/userStore"
import { registerUser } from "../../slices/userSlice"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
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

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (isDelay) return
    setIsDelay(true)
    setTimeout(() => {
      navigate("/login")
      setIsDelay(false)
    }, 1000)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLocalLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const userWithRole = { ...data, role: "user" }
    const rs = await dispatch(registerUser(userWithRole))
    setLocalLoading(false)
    if (registerUser.fulfilled.match(rs)) {
      setTimeout(() => {
        navigate("/")
      }, 1000)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-[inter] select-none overflow-hidden">
      <img src={RegisterBg} alt="Register Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-white/30 to-purple-900/40 z-10" />

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
              <input
                {...register("password")}
                type="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
                autoComplete="new-password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">Xác nhận mật khẩu</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
                autoComplete="confirm-password"
              />
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
