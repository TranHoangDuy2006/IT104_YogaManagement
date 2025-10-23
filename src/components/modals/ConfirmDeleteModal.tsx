/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  // Quản lý trạng thái hiển thị + hiệu ứng
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
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      {/* Lớp nền */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* Hộp xác nhận */}
      <div
        className={`relative bg-white rounded-xl shadow-xl p-8 w-full max-w-[500px] min-h-[180px] flex flex-col justify-between transform transition-all duration-300 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Xác nhận xoá</h2>
        <div className="text-lg text-gray-700 mb-8">
          Bạn có chắc chắn muốn xoá dịch vụ này?
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <button
            className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 hover:cursor-pointer"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark fa-xl mr-1"></i> Hủy
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-300 hover:cursor-pointer"
            onClick={onConfirm}
          >
            <i className="fa-solid fa-trash-can mr-1"></i> Xóa
          </button>
        </div>
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

export default ConfirmDeleteModal;
