/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../Animations.css";
import type { AddServiceModalProps } from "../../types/AddServiceModalProps";

const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onSave, service }) => {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const isEdit = !!service;

  useEffect(() => {
    if (service) {
      setName(service.name || "");
      setDescription(service.description || "");
      setImageUrl(service.imageUrl || "");
      setIsActive(service.isActive ?? true);
    } else {
      setName("");
      setDescription("");
      setImageUrl("");
      setIsActive(true);
    }
    setErrorMsg("");
  }, [service, isOpen]);

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

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  if (!visible) return null;

  const handleSave = () => {
    if (!name.trim() || !description.trim() || !imageUrl.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin dịch vụ!");
      return;
    }
    setErrorMsg("");
    onSave({ name, description, imageUrl, isActive });
    setName("");
    setDescription("");
    setImageUrl("");
    setIsActive(true);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center font-[inter] select-none transition-all duration-300 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-all duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
      ></div>

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
            placeholder="Nhập tên dịch vụ..."
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">Mô tả</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={description}
            placeholder="Nhập mô tả dịch vụ..."
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">
            URL hình ảnh
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={imageUrl}
            placeholder="Nhập URL hình ảnh..."
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">
            Trạng thái dịch vụ
          </label>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 cursor-pointer focus:outline-none border-2 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 border-blue-400"
                  : "bg-gray-300 border-gray-300"
              }`}
              onClick={() => setIsActive(!isActive)}
            >
              <span
                className={`absolute left-1 top-1 flex items-center justify-center w-6 h-6 transform rounded-full shadow-lg transition-all duration-300 border-2 border-gray-200 bg-white ${
                  isActive ? "translate-x-8" : "translate-x-0"
                }`}
              >
                <i
                  className={`fa-solid ${
                    isActive
                      ? "fa-check text-blue-500"
                      : "fa-ban text-gray-400"
                  } text-lg transition-all duration-300`}
                ></i>
              </span>
            </button>
            <span
              className={`font-medium transition-colors duration-300 ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 text-red-500 font-semibold text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

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
    </div>
  );
};

export default AddServiceModal;
