/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import '../Animations.css'
import type { Course } from '../../types/Course';

interface EditCoursesForServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedCourseIds: string[]) => void;
  allCourses: Course[];
  selectedCourseIds: string[];
}

const EditCoursesForServiceModal: React.FC<EditCoursesForServiceModalProps> = ({ isOpen, onClose, onSave, allCourses, selectedCourseIds }) => {
  const [selected, setSelected] = useState<string[]>(selectedCourseIds);
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setSelected(selectedCourseIds);
  }, [selectedCourseIds, isOpen]);

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

  if (!visible) return null;

  const handleToggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center font-[inter] select-none transition-all duration-300 ${closing ? "animate-fade-out" : "animate-fade-in"}`}>
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-[1px] transition-all duration-300 ${closing ? "backdrop-disappear" : "backdrop-appear"}`}></div>
      <div className={`relative bg-white rounded-xl shadow-xl p-8 w-[500px] max-w-full transform transition-all duration-300 ${closing ? "modal-disappear" : "modal-appear"}`}>
        <h2 className="text-xl font-bold mb-4">Chọn khoá học cho dịch vụ</h2>
        <div className="max-h-80 overflow-y-auto mb-6">
          {allCourses.map(course => (
            <label key={course.id} className="flex items-center gap-3 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(course.id)}
                onChange={() => handleToggle(course.id)}
                className="w-5 h-5"
              />
              <img src={course.image} alt={course.name} className="w-10 h-10 object-cover rounded" />
              <span className="font-medium text-gray-800">{course.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="px-5 py-2 rounded-lg bg-gray-400 text-white font-semibold hover:bg-gray-500 hover:cursor-pointer"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark mr-1"></i> Hủy
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:cursor-pointer"
            onClick={() => onSave(selected)}
          >
            <i className="fa-solid fa-floppy-disk mr-1"></i> Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCoursesForServiceModal;
