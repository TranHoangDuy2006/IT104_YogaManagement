/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, addCourse, updateCourse, deleteCourse } from "../slices/coursesSlice";
import type { Course } from "../types/Course";
import AddCourseModal from "../components/modals/CourseModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

function ClassesManagementPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const dispatch: any = useDispatch();
  const courses = useSelector((state: any) => state.courses.data) as Course[];
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleAddCourse = async (course: Omit<Course, "id">) => {
    if (editCourse) {
      await dispatch(updateCourse({ id: editCourse.id, course }));
      setEditCourse(null);
      setIsModalOpen(false);
      setSuccessMsg("Sửa lớp học thành công");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      await dispatch(addCourse(course));
      setIsModalOpen(false);
      setSuccessMsg("Thêm lớp học thành công");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row font-[inter] select-none">
      {showSuccess && (
        <div className="fixed top-6 left-1/2 translate-x-1/2.5 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-xl mr-2"></i>
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      <main className="flex-1 bg-[#f9fafb] font-[inter]">
        <div className="flex items-center justify-between mb-6 bg-[#f9fafb]">
          <h1 className="text-[28px] font-bold">Quản lý lớp học</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2 shadow transition-all w-[220px] h-[40px] text-[17px] font-medium transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 duration-200 hover:cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fa fa-plus mr-2"></i> Thêm lớp học mới
          </button>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="text-black font-semibold text-base">
                <th className="px-3 py-3 text-center text-[19px]">Tên lớp học</th>
                <th className="px-6 py-3 text-center text-[19px]">Mô tả</th>
                <th className="px-6 py-3 text-center text-[19px]">Hình ảnh</th>
                <th className="px-6 py-3 text-center text-[19px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-3 py-4 text-[17px] text-center">{course.name}</td>
                  <td className="px-6 py-4 text-[17px] text-center">{course.description}</td>
                  <td className="px-6 py-4 text-center">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-16 h-16 object-cover rounded shadow mx-auto"
                    />
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      className="px-4 py-2 mt-2.5 mr-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-500 hover:cursor-pointer hover:text-white hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => {
                        setEditCourse(course);
                        setIsModalOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square fa-lg mr-1"></i> Sửa
                    </button>
                    <button
                      className="px-4 py-2 mt-2.5 rounded-lg bg-red-100 text-red-600 font-semibold shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-105 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => {
                        setCourseToDelete(course.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-trash-can fa-lg mr-1"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))}
              <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={async () => {
                  if (courseToDelete !== null) {
                    await dispatch(deleteCourse(courseToDelete));
                  }
                  setIsDeleteModalOpen(false);
                  setCourseToDelete(null);
                }}
              />
            </tbody>
          </table>
        </div>

        <AddCourseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditCourse(null);
          }}
          onSave={handleAddCourse}
          course={editCourse}
        />
      </main>
    </div>
  );
}

export default ClassesManagementPage;
