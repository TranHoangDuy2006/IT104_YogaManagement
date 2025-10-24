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

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setVisible(false);
    }, 250);
  };

  const handleConfirm = () => {
    setClosing(true);
    setTimeout(() => {
      onConfirm();
      setVisible(false);
    }, 250);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none font-[inter] transition-all duration-300 ${
        closing ? "bg-black/0 backdrop-blur-none" : "bg-black/40 backdrop-blur-[2px]"
      }`}
    >
      <style>{`
        @keyframes modal-appear {
          0% { 
            opacity: 0; 
            transform: scale(0.85) translateY(15px); 
          }
          60% { 
            opacity: 0.8; 
            transform: scale(1.02) translateY(-3px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes modal-disappear {
          0% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
          40% { 
            opacity: 0.8; 
            transform: scale(1.03) translateY(-8px); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
        }
        
        @keyframes backdrop-appear {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes backdrop-disappear {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .modal-appear {
          animation: modal-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .modal-disappear {
          animation: modal-disappear 0.3s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
        }
        
        .backdrop-appear {
          animation: backdrop-appear 0.3s ease-out forwards;
        }
        
        .backdrop-disappear {
          animation: backdrop-disappear 0.25s ease-in forwards;
        }
      `}</style>

      {/* Lớp nền với hiệu ứng riêng */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] ${
          closing ? "backdrop-disappear" : "backdrop-appear"
        }`}
        onClick={handleClose}
      ></div>

      {/* Hộp xác nhận với hiệu ứng nảy */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[500px] min-h-[200px] flex flex-col justify-between transform ${
          closing ? "modal-disappear" : "modal-appear"
        }`}
      >
        {/* Nội dung */}
        <div className="flex items-start mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác nhận xoá</h2>
            <p className="text-lg text-gray-700">
              Bạn có chắc chắn muốn xoá dịch vụ này? Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className={`flex justify-end gap-4 transition-opacity duration-200 ${
          closing ? "opacity-0" : "opacity-100"
        }`}>
          <button
            className="px-6 py-3 rounded-xl bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 hover:cursor-pointer flex items-center"
            onClick={handleClose}
          >
            <i className="fa-solid fa-xmark text-lg mr-2"></i>
            Hủy
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 hover:cursor-pointer flex items-center"
            onClick={handleConfirm}
          >
            <i className="fa-solid fa-trash-can mr-2"></i>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;