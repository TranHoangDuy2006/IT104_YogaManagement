/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../Animations.css";
import type { AddUserModalProps } from "../../types/AddUserModalProps";

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newUser,
  setNewUser,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const initialUser = {
    id: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  };

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
    setErrorMsg("");
  }, [isOpen]);

  const handleClose = () => {
    setNewUser(initialUser);
    setErrorMsg("");
    onClose();
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  if (!visible) return null;

  function validateEmail(email: string) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.password.trim() || !newUser.confirmPassword.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (!validateEmail(newUser.email.trim())) {
      setErrorMsg("Email không hợp lệ!");
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }
    setErrorMsg("");
    await onSubmit({ ...newUser, id: Date.now().toString() });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-all duration-300 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[520px] transform transition-all duration-300 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Thêm người dùng mới
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-base font-semibold text-gray-600 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
              placeholder="Nhập họ và tên..."
              className="border border-gray-300 rounded-xl px-4 py-2 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-semibold text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Nhập email..."
              autoComplete="email"
              className="border border-gray-300 rounded-xl px-4 py-2 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-semibold text-gray-600 mb-2">
              Mật khẩu
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Nhập mật khẩu..."
                autoComplete="new-password"
                className="border border-gray-300 rounded-xl px-4 py-2 pr-12 w-full text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ paddingRight: "2.5rem" }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-blue-500 cursor-pointer flex items-center"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                style={{ height: "100%" }}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-base font-semibold text-gray-600 mb-2">
              Xác nhận mật khẩu
            </label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={newUser.confirmPassword}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirmPassword: e.target.value })
                }
                placeholder="Xác nhận mật khẩu..."
                autoComplete="new-password"
                className="border border-gray-300 rounded-xl px-4 py-2 pr-12 w-full text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ paddingRight: "2.5rem" }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-blue-500 cursor-pointer flex items-center"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={0}
                role="button"
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                style={{ height: "100%" }}
              >
                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-base font-semibold text-gray-600 mb-2">
              Vai trò
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer transition-all"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {errorMsg && (
            <div className="mb-4 text-red-500 text-sm font-semibold text-center animate-fade-in">{errorMsg}</div>
          )}
          <div className="flex gap-4 justify-end mt-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gray-400 text-white text-lg font-semibold hover:cursor-pointer transition-all duration-200 shadow hover:bg-gray-500 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleClose}
            >
              <i className="fa-solid fa-xmark mr-2"></i> Huỷ
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#2b7fff] text-white text-lg font-semibold hover:cursor-pointer transition-all duration-200 shadow hover:bg-blue-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <i className="fa-solid fa-save mr-2"></i> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
