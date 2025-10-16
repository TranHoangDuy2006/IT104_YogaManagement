import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../stores/userStore"
import { registerUser } from "../../slices/userSlice"
import { useNavigate } from "react-router-dom"

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
    confirmPassword: yup.string().required("Mật khẩu xác nhận không được để trống!").oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp!")
})

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const {
    register, handleSubmit, formState: { errors, isSubmitting}
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    const rs = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(rs)) {
      navigate("/") 
    }
  }
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-inter">
  <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md" style={{ height: 'auto' }}>
        <h2 className="text-center mb-6 text-[28px] font-[700]">
          Đăng ký tài khoản
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">
              Họ và tên
            </label>
            <input
              {...register("fullName")}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
            />
            {errors.fullName && (<p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
            </p>)}
          </div>

          <div>
            <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
              autoComplete="new-email"
            />
            {errors.email && (<p className="text-red-500 text-sm mt-1">
                {errors.email.message}
            </p>)}
          </div>

          <div>
            <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">
              Mật khẩu
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
              autoComplete="new-password"
            />
            {errors.password && (<p className="text-red-500 text-sm mt-1">
                {errors.password.message}
            </p>)}
          </div>

          <div>
            <label className="block text-gray-700 text-[15.6px] font-[500] mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[42px]"
              autoComplete="confirm-password"
            />
            {errors.confirmPassword && (<p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
            </p>)}
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-md transition h-[40px] mt-4"
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {/* Đường dẫn đăng nhập */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  )
}
