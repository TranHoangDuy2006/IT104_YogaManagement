import React, { useEffect, useState } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => Promise<void>;
  editUser: User;
  setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editUser, 
  setEditUser 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen && editUser) {
      setIsVisible(true);
      setAnimationClass('animate-fade-in');
    } else if (!isOpen && isVisible) {
      setAnimationClass('animate-fade-out');
      const timer = setTimeout(() => {
        setIsVisible(false);
        setAnimationClass('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, editUser, isVisible]);

  const handleClose = () => {
    setAnimationClass('animate-fade-out');
    setTimeout(() => {
      setIsVisible(false);
      setAnimationClass('');
      onClose();
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(editUser);
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[520px] ${animationClass}`}>
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Sửa thông tin người dùng
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <label className="flex flex-col text-base font-semibold text-gray-600 mb-2">
            Họ và tên
            <input
              type="text"
              value={editUser.fullName}
              onChange={e => setEditUser({ ...editUser, fullName: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-3 mt-2 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col text-base font-semibold text-gray-600 mb-2">
            Email
            <input
              type="email"
              value={editUser.email}
              onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-3 mt-2 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col text-base font-semibold text-gray-600 mb-2">
            Role
            <select
              value={editUser.role}
              onChange={e => setEditUser({ ...editUser, role: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-3 mt-2 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:cursor-pointer"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-gray-400 text-white text-lg font-semibold hover:bg-gray-500 hover:cursor-pointer"
              onClick={handleClose}
            >
              <i className="fa-solid fa-xmark mr-2" /> Đóng
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600 hover:cursor-pointer"
            >
              <i className="fa-solid fa-save mr-2" /> Lưu
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(-20px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes fade-out {
          0% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.8) translateY(-20px); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease forwards;
        }
        
        .animate-fade-out {
          animation: fade-out 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default EditUserModal;