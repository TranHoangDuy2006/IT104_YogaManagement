import React, { useState } from "react";
import type { Course } from "../../types/Course";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, "id">) => void;
  course?: Course | null;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onSave, course }) => {
  const [name, setName] = useState(course?.name || "");
  const [description, setDescription] = useState(course?.description || "");
  const [image, setImage] = useState(course?.image || "");

  React.useEffect(() => {
    setName(course?.name || "");
    setDescription(course?.description || "");
    setImage(course?.image || "");
  }, [course, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, image });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-[inter] select-none animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-all duration-300 opacity-100"></div>
      <form onSubmit={handleSubmit} className="relative bg-white rounded-xl shadow-xl p-8 w-[600px] max-w-full transform scale-100 opacity-100 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6">{course ? "Sửa lớp học" : "Thêm lớp học mới"}</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">Tên lớp học</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nhập tên lớp học..."
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">Mô tả</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Nhập mô tả lớp học..."
            required
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">URL hình ảnh</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={image}
            onChange={e => setImage(e.target.value)}
            placeholder="Nhập URL hình ảnh lớp học..."
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" className="px-6 py-2 rounded-lg bg-gray-400 text-white font-semibold hover:bg-gray-500 hover:cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-gray-300" onClick={onClose}>
            <i className="fas fa-times mr-1"></i> Hủy
          </button>
          <button type="submit" className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-300">
            <i className="fas fa-save mr-1"></i> {course ? "Cập nhật" : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseModal;
