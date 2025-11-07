/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import '../Animations.css';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../stores/userStore"; 
import { loginUser } from "../../slices/userSlice";
import LoginBg from "../../assets/Login_Register_Background.jpg";
import type { LoginFormData } from '../../types/LoginFormData';
import FacebookLoginButton from "../auth/FacebookLoginButton";
import ReCAPTCHA from "react-google-recaptcha";

function Notification({ message, show }: { message: string, show: boolean }) {
  const [visible, setVisible] = useState(true);
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
      <div className={`bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${show ? 'animate-fade-in' : 'animate-fade-out'}`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

const schema = yup.object({
  email: yup.string().required("Email không được để trống!").email("Email không hợp lệ!"),
  password: yup
    .string()
    .required("Mật khẩu không được để trống!")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự!")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 ký tự viết hoa!")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số!")
    .matches(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!"),
});

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showAlreadyLoggedIn, setShowAlreadyLoggedIn] = useState(false);
  React.useEffect(() => {
    if (localStorage.getItem('currentUser')) {
      setShowAlreadyLoggedIn(true);
      setTimeout(() => {
        setShowAlreadyLoggedIn(false);
        navigate("/");
      }, 2500);
    }
  }, [navigate]);
  const { error } = useSelector((state: RootState) => state.user);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  let emailError = errors.email?.message || "";
  let passwordError = errors.password?.message || "";
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  if (error) {
    const err = error.toLowerCase();
    if (["email", "địa chỉ", "không tìm thấy", "tồn tại", "hợp lệ"].some(key => err.includes(key))) {
      emailError = error;
    } else if (err.includes("mật khẩu") || err.includes("password")) {
      passwordError = error;
    } else {
      passwordError = error;
    }
  }
  const [isDelay, setIsDelay] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onSubmit = async (data: LoginFormData) => {
    // Kiểm tra captcha
    if (!captchaToken) {
      setCaptchaError("Vui lòng xác nhận bạn không phải là robot!");
      return;
    }
    setCaptchaError("");
    
    setLocalLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result = await dispatch(loginUser(data));
    setLocalLoading(false);
    
    if (loginUser.fulfilled.match(result)) {
  setShowSuccess(true);
  reset();
  setCaptchaToken(null);
  recaptchaRef.current?.reset();
      setTimeout(() => {
        setShowSuccess(false);
        const user = result.payload as any;
        if (user && user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 2000);
    } else {
      // Reset captcha nếu đăng nhập thất bại
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDelay) return;
    setIsDelay(true);
    setTimeout(() => {
      navigate("/register");
      setIsDelay(false);
    }, 2000);
  };

  const isFormDisabled = localLoading || showSuccess;
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-[inter] select-none overflow-hidden">
      <img src={LoginBg} alt="Login Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-white/20 to-purple-900/50 z-10" />
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute -top-24 -left-24 w-[360px] h-[360px] rounded-full bg-gradient-to-br from-blue-500/35 to-indigo-500/20 blur-3xl blob-float-1" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-fuchsia-500/30 to-purple-500/20 blur-3xl blob-float-2" />
      </div>

      {showSuccess && (
        <Notification message="Đăng nhập thành công!" show={showSuccess} />
      )}
      {showAlreadyLoggedIn && (
        <Notification message="Bạn đã đăng nhập rồi, bạn sẽ được điều hướng về trang chủ" show={showAlreadyLoggedIn} />
      )}

      <div className="relative z-20 w-full max-w-md px-4">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-white/75 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] rounded-2xl p-8 w-full animate-card-in border border-white/40">
          <div className="flex items-center justify-center mb-6">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center shadow-lg shadow-blue-600/20">
              <i className="fa-solid fa-user-lock"></i>
            </div>
          </div>
          <h2 className="text-center mb-8 text-[28px] font-[700] tracking-tight">Đăng Nhập</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" style={isFormDisabled ? { pointerEvents: "none", opacity: 0.6 } : {}}>
            <div className="relative group">
              <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${emailError ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`relative rounded-xl border ${emailError && !emailFocused ? 'border-red-400/80' : 'border-slate-200'} bg-white/60 backdrop-blur-sm focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all` }>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  {...register("email")}
                  className={`peer w-full bg-transparent rounded-xl pl-10 pr-3 py-3 focus:outline-none text-slate-800`}
                  autoComplete="email"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  disabled={isFormDisabled}
                />
              </div>
              {emailError && <p className="text-red-500 text-sm mt-2 animate-fade-in">{emailError}</p>}
            </div>

            <div className="relative group">
              <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${passwordError ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`relative rounded-xl border ${passwordError && !passwordFocused ? 'border-red-400/80' : 'border-slate-200'} bg-white/60 backdrop-blur-sm focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all` }>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  {...register("password")}
                  className={`peer w-full bg-transparent rounded-xl pl-10 pr-10 py-3 focus:outline-none text-slate-800`}
                  autoComplete="current-password"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
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
              {passwordError && <p className="text-red-500 text-sm mt-2 animate-fade-in">{passwordError}</p>}
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
              <span className="inline-flex items-center justify-center gap-2">
                {!localLoading && <i className="fa-solid fa-arrow-right-to-bracket"></i>}
                {localLoading && (
                  <span className="w-5 h-5 border-2 border-t-2 border-t-white border-white/30 rounded-full animate-spin inline-block"></span>
                )}
                {localLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </span>
            </button>
          </form>

          <div className="mt-4">
            <FacebookLoginButton 
              disabled={isFormDisabled}
              onSuccess={() => {
                const raw = localStorage.getItem('currentUser');
                if (raw) {
                  const user = JSON.parse(raw) as any;
                  if (user && user.role === 'admin') {
                    navigate('/admin');
                  } else {
                    navigate('/');
                  }
                }
              }} 
            />
          </div>

          <p className="text-center text-sm text-slate-600 mt-6">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-700 hover:text-blue-600 underline-offset-4 hover:underline font-medium"
              onClick={handleRegisterClick}
              style={isDelay || isFormDisabled ? { pointerEvents: "none", opacity: 0.6 } : {}}
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
