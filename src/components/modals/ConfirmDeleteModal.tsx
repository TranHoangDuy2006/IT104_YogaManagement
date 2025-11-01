/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import '../Animations.css';

import type { ConfirmDeleteModalProps } from '../../types/ConfirmDeleteModalProps';

interface ConfirmDeleteModalPropsCustom extends ConfirmDeleteModalProps {
  message?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalPropsCustom> = ({ isOpen, onClose, onConfirm, message }) => {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => setVisible(false), 300);
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
        closing ? "bg-black/0 backdrop-blur-none" : "bg-black/20 backdrop-blur-[1px]"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] ${
          closing ? "backdrop-disappear" : "backdrop-appear"
        }`}
        onClick={handleClose}
      ></div>

      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[500px] min-h-[200px] flex flex-col justify-between transform ${
          closing ? "modal-disappear" : "modal-appear"
        }`}
      >
        <div className="flex items-start mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác nhận xoá</h2>
            <p className="text-lg text-gray-700">
              {message || "Bạn có chắc chắn muốn xoá dịch vụ này? Hành động này không thể hoàn tác."}
            </p>
          </div>
        </div>

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