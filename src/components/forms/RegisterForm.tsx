import { useForm } from "react-hook-form";
import "../Animations.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../stores/userStore";
import { registerUser } from "../../slices/userSlice";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import RegisterBg from "../../assets/Login_Register_Background.jpg";
import type { RegisterFormData } from "../../types/RegisterFormData";
import ReCAPTCHA from "react-google-recaptcha";

function Notification({ message, show }: { message: string; show: boolean }) {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    if (!show) {
      setTimeout(() => setVisible(false), 400);
    } else {
      setVisible(true);
    }
  }, [show]);
  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 font-[inter] select-none">
      <div
        className={`bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
          show ? "animate-fade-in" : "animate-fade-out"
        }`}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

const schema = yup.object({
  fullName: yup.string().required("Họ và tên không được để trống!"),
  email: yup
    .string()
    .required("Email không được để trống!")
    .email("Email không hợp lệ!"),
  password: yup
    .string()
    .required("Mật khẩu không được để trống!")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự!")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 ký tự viết hoa!")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số!")
    .matches(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!"),
  confirmPassword: yup
    .string()
    .required("Mật khẩu xác nhận không được để trống!")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp!"),
});

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      localStorage.removeItem("currentUser");
    }
  }, []);

  const [isDelay, setIsDelay] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  React.useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDelay) return;
    setIsDelay(true);
    setTimeout(() => {
      navigate("/login");
      setIsDelay(false);
    }, 2000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Kiểm tra captcha
    if (!captchaToken) {
      setCaptchaError("Vui lòng xác nhận bạn không phải là robot!");
      return;
    }
    setCaptchaError("");
    
    setLocalLoading(true);
    setErrorMsg("");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const userWithRole = { ...data, role: "user", id: Date.now().toString() };
    const rs = await dispatch(registerUser(userWithRole));
    setLocalLoading(false);

    if (registerUser.fulfilled.match(rs)) {
      setShowSuccess(true);
      reset();
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
      localStorage.setItem("currentUser", JSON.stringify(userWithRole));
      localStorage.setItem("currentUser", JSON.stringify(userWithRole));
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 2000);
    } else if (registerUser.rejected.match(rs)) {
      setErrorMsg((rs.payload as string) || "Đăng ký thất bại!");
      reset();
      // Reset captcha nếu đăng ký thất bại
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  };

  const isFormDisabled = localLoading || showSuccess;

	return (
		<div className="relative min-h-screen w-full flex items-center justify-center font-[inter] select-none overflow-hidden">
			<img
				src={RegisterBg}
				alt="Register Background"
				className="absolute inset-0 w-full h-full object-cover z-0"
			/>
			<div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-white/20 to-purple-900/50 z-10" />
			<div className="pointer-events-none absolute inset-0 z-10">
				<div className="absolute -top-24 -left-24 w-[360px] h-[360px] rounded-full bg-gradient-to-br from-blue-500/35 to-indigo-500/20 blur-3xl blob-float-1" />
				<div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-fuchsia-500/30 to-purple-500/20 blur-3xl blob-float-2" />
			</div>

			{showSuccess && (
				<Notification message="Đăng ký tài khoản thành công!" show={showSuccess} />
			)}

			{errorMsg && (
				<div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
					<div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
						<svg
							className="w-5 h-5 text-white"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
						<span>{errorMsg}</span>
					</div>
				</div>
			)}

			<div className="relative z-20 w-full max-w-md px-4">
				<div className="backdrop-blur-xl bg-white/70 dark:bg-white/75 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] rounded-2xl p-8 w-full animate-card-in border border-white/40">
					<div className="flex items-center justify-center mb-6">
						<div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center shadow-lg shadow-blue-600/20">
							<i className="fa-solid fa-user-plus"></i>
						</div>
					</div>
					<h2 className="text-center mb-8 text-[28px] font-[700] tracking-tight">Đăng Ký Tài Khoản</h2>

					<form
						className="space-y-5"
						onSubmit={handleSubmit(onSubmit)}
						style={
							isFormDisabled
								? { pointerEvents: "none", opacity: 0.6 }
								: undefined
						}
					>
						<div className="relative group">
							<div className="relative rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
									<i className="fa-regular fa-user"></i>
								</div>
								<input
									id="fullName"
									type="text"
									placeholder="Nhập họ và tên của bạn"
									{...register("fullName")}
									className="peer w-full bg-transparent rounded-xl pl-10 pr-3 py-3 focus:outline-none text-slate-800"
									disabled={isFormDisabled}
								/>
							</div>
							{errors.fullName && (
								<p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.fullName.message}</p>
							)}
						</div>

						<div className="relative group">
							<div className="relative rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
									<i className="fa-regular fa-envelope"></i>
								</div>
								<input
									id="email"
									type="email"
									placeholder="Nhập email của bạn"
									{...register("email")}
									className="peer w-full bg-transparent rounded-xl pl-10 pr-3 py-3 focus:outline-none text-slate-800"
									autoComplete="new-email"
									disabled={isFormDisabled}
								/>
							</div>
							{errors.email && (
								<p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.email.message}</p>
							)}
						</div>

						<div className="relative group">
							<div className="relative rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
									<i className="fa-solid fa-lock"></i>
								</div>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Nhập mật khẩu của bạn"
									{...register("password")}
									className="peer w-full bg-transparent rounded-xl pl-10 pr-10 py-3 focus:outline-none text-slate-800"
									autoComplete="new-password"
									disabled={isFormDisabled}
								/>
								<button
									type="button"
									aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
									className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-transform duration-200 ${isFormDisabled ? 'pointer-events-none opacity-50' : 'hover:scale-110 focus:scale-110 hover:cursor-pointer'}`}
									onClick={() => { if (!isFormDisabled) setShowPassword(v => !v); }}
								>
									<i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
								</button>
							</div>
							{errors.password && (
								<p className="text-red-500 text-sm mt-2 animate-fade-in">{errors.password.message}</p>
							)}
						</div>

						<div className="relative group">
							<div className="relative rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
									<i className="fa-solid fa-lock-keyhole"></i>
								</div>
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Nhập lại mật khẩu của bạn"
									{...register("confirmPassword")}
									className="peer w-full bg-transparent rounded-xl pl-10 pr-10 py-3 focus:outline-none text-slate-800"
									autoComplete="confirm-password"
									disabled={isFormDisabled}
								/>
								<button
									type="button"
									aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
									className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-transform duration-200 ${isFormDisabled ? 'pointer-events-none opacity-50' : 'hover:scale-110 focus:scale-110 hover:cursor-pointer'}`}
									onClick={() => { if (!isFormDisabled) setShowConfirmPassword(v => !v); }}
								>
									<i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="text-red-500 text-sm mt-2 animate-fade-in">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						{/* Google reCAPTCHA */}
						<div className="flex flex-col items-center">
							<ReCAPTCHA
								ref={recaptchaRef}
								sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
								onChange={(token) => {
									setCaptchaToken(token);
									setCaptchaError("");
								}}
								onExpired={() => {
									setCaptchaToken(null);
									setCaptchaError("Captcha đã hết hạn, vui lòng thử lại!");
								}}
								theme="light"
							/>
							{captchaError && <p className="text-red-500 text-sm mt-2 animate-fade-in">{captchaError}</p>}
						</div>

						<button
							type="submit"
							disabled={isFormDisabled}
							className="btn-press btn-fancy w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 h-[44px] mt-2 disabled:bg-slate-400 focus:outline-none shadow-lg shadow-blue-600/20 ring-1 ring-white/20 hover:cursor-pointer"
						>
							{!localLoading && (
								<i className="fa-solid fa-clipboard-list mr-1.5"></i>
							)}
							{localLoading && (
								<span className="w-5 h-5 border-2 border-t-2 border-t-white border-white/30 rounded-full animate-spin inline-block"></span>
							)}
							{localLoading ? "Đang đăng ký..." : "Đăng ký"}
						</button>
					</form>

					<p className="text-center text-sm text-slate-600 mt-6">
						Đã có tài khoản?{" "}
						<Link
							to="/login"
							className="text-blue-700 hover:text-blue-600 underline-offset-4 hover:underline font-medium"
							onClick={handleLoginClick}
							style={
								isDelay || isFormDisabled
									? { pointerEvents: "none", opacity: 0.6 }
									: undefined
							}
						>
							Đăng nhập ngay
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
