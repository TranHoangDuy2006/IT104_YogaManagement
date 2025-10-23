/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: { name: string; description: string; image: string }) => void;
  service?: { name: string; description: string; image: string } | null;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  service,
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const isEdit = !!service;

  // Cập nhật dữ liệu khi modal mở
  useEffect(() => {
    if (service) {
      setName(service.name || "");
      setDescription(service.description || "");
      setImage(service.image || "");
    } else {
      setName("");
      setDescription("");
      setImage("");
    }
  }, [service, isOpen]);

  // Quản lý hiệu ứng mở/đóng
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => setVisible(false), 300); // khớp animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  const handleSave = () => {
    onSave({ name, description, image });
    setName("");
    setDescription("");
    setImage("");
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center font-[inter] select-none transition-all duration-300 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      {/* Lớp nền mờ */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-white rounded-xl shadow-xl p-8 w-[600px] max-w-full transform transition-all duration-300 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}
        </h2>

        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">
            Tên dịch vụ
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">Mô tả</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">
            URL Hình ảnh
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="px-6 py-2 rounded-lg bg-gray-400 text-white font-semibold hover:bg-gray-500 hover:cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
          >
            <i className="fas fa-times mr-1"></i> Hủy
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={handleSave}
          >
            <i className="fas fa-save mr-1"></i>{" "}
            {isEdit ? "Cập nhật" : "Lưu"}
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

export default AddServiceModal;
