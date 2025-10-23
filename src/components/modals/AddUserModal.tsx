/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => Promise<void>;
  newUser: User;
  setNewUser: React.Dispatch<React.SetStateAction<User>>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newUser,
  setNewUser,
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  // Khi isOpen thay đổi → bật/tắt hiệu ứng
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => setVisible(false), 300); // khớp thời gian animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit({ ...newUser, id: Date.now().toString() });
          }}
          className="flex flex-col gap-6"
        >
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
              required
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
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Nhập email..."
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-semibold text-gray-600 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Nhập mật khẩu..."
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-semibold text-gray-600 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={newUser.confirmPassword}
              onChange={(e) =>
                setNewUser({ ...newUser, confirmPassword: e.target.value })
              }
              placeholder="Xác nhận mật khẩu..."
              required
              className="border border-gray-300 rounded-xl px-4 py-2 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-semibold text-gray-600 mb-2">
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className="border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer transition-all"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gray-400 text-white text-lg font-semibold hover:cursor-pointer hover:bg-gray-500"
              onClick={onClose}
            >
              <i className="fa-solid fa-xmark mr-2"></i> Đóng
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#2b7fff] text-white text-lg font-semibold hover:cursor-pointer hover:bg-green-600"
            >
              <i className="fa-solid fa-save mr-2"></i> Lưu
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-out {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.95); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-fade-out {
          animation: fade-out 0.3s cubic-bezier(.4,0,.2,1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AddUserModal;
