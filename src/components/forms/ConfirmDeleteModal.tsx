import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#7c7d7d] bg-opacity-20 backdrop-blur-sm transition-opacity pointer-events-none"></div>
      <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-[500px] min-h-[180px] animate-fade-in flex flex-col justify-between">
        <h2 className="text-2xl font-bold mb-6">Xác nhận xoá</h2>
        <div className="text-lg text-gray-800 mb-8">Bạn có chắc chắn muốn xoá dịch vụ này?</div>
        <div className="flex justify-end gap-4 mt-2">
          <button
            className="px-6 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 hover:cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 hover:cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(.4,0,.2,1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDeleteModal;
