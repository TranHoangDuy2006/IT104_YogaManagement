import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../stores/userStore"; 
import { loginUser } from "../../slices/userSlice";
import { useState } from "react";

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
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [isDelay, setIsDelay] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload;
      if (user.role === "admin") setTimeout(() => {
        navigate("/");
      }, 1000);
      else setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-[inter] user-select-none">
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
            <input
              type="password"
              {...register("password")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all duration-200 h-[40px] mt-4 disabled:bg-gray-400"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
  );
}
