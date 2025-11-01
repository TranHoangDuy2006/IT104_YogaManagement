/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, addService, updateService, deleteService } from "../slices/servicesSlice";
import type { Service } from "../types/Service";
import type { Course } from "../types/Course";
import { getCourses } from "../apis/api";
import AddServiceModal from "../components/modals/ServiceModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import EditCoursesForServiceModal from "../components/modals/EditCourseForServiceModal";

function ServicesManagementPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const dispatch: any = useDispatch();
  const services = useSelector((state: any) => state.services.data) as Service[];
  const [courses, setCourses] = useState<Course[]>([]);
  const [editService, setEditService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [editCoursesService, setEditCoursesService] = useState<Service | null>(null);
  const [isEditCoursesModalOpen, setIsEditCoursesModalOpen] = useState(false);

  const [openDropdowns, setOpenDropdowns] = useState<{[id: string]: boolean}>({});

  useEffect(() => {
    dispatch(fetchServices());
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (e) {
        console.error("Cannot load courses", e);
      }
    };
    fetchCourses();
  }, [dispatch]);

  const handleAddService = async (service: Omit<Service, "id">) => {
    if (editService) {
      await dispatch(updateService({ id: editService.id, service }));
      setEditService(null);
      setIsModalOpen(false);
      setSuccessMsg("Sửa dịch vụ thành công!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      await dispatch(addService(service));
      setIsModalOpen(false);
      setSuccessMsg("Thêm dịch vụ thành công!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row font-[inter] select-none">
      {showSuccess && (
        <div className="fixed top-6 left-1/2 translate-x-[10px] z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-xl mr-2"></i>
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      <main className="flex-1 bg-[#f9fafb] font-[inter]">
      <div className="flex items-center justify-between mb-6 bg-[#f9fafb]">
          <h1 className="text-[28px] font-bold">Quản lý dịch vụ</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2 shadow transition-all w-[220px] h-[40px] text-[17px] font-medium transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 duration-200 hover:cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fa fa-circle-plus mr-2"></i> Thêm dịch vụ mới
          </button>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="text-black font-semibold text-base">
                <th className="px-3 py-3 text-center text-[19px]">Tên dịch vụ</th>
                <th className="px-6 py-3 text-center text-[19px]">Mô tả</th>
                <th className="px-6 py-3 text-center text-[19px]">Hình ảnh</th>
                <th className="px-6 py-3 text-center text-[19px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const serviceCourses = service.courses
                  ? courses.filter((c) => service.courses?.includes(c.id))
                  : [];

                const isOpen = openDropdowns[service.id] ?? false;

                return (
                  <Fragment key={service.id}>
                    <tr className={`border-t border-gray-200 hover:bg-gray-50 transition`}>
                      <td className={`px-3 py-4 text-[17px] text-center ${service.isActive === false ? 'opacity-50' : ''}`}>
                        {service.name}
                      </td>
                      <td className={`px-6 py-4 text-[17px] text-center ${service.isActive === false ? 'opacity-50' : ''}`}>
                        {service.description}
                      </td>
                      <td className={`px-6 py-4 text-center ${service.isActive === false ? 'opacity-50' : ''}`}>
                        <img
                          src={(service.imageUrl || "") as string}
                          alt={service.name}
                          className="w-16 h-16 object-cover rounded shadow mx-auto"
                        />
                      </td>
                      <td className="px-6 py-4 flex gap-2 justify-center">
                        <button
                          className="px-4 py-2 mt-2.5 mr-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-500 hover:cursor-pointer hover:text-white hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                          onClick={() => {
                            setEditService(service);
                            setIsModalOpen(true);
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square fa-lg mr-1"></i>{" "}
                          Sửa
                        </button>

                        <button
                          className={`px-4 py-2 mt-2.5 rounded-lg bg-green-100 text-green-700 font-semibold shadow-sm transition-all duration-200 ${service.isActive === false ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500 hover:text-white hover:scale-105 hover:shadow-lg hover:cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-green-300`}
                          onClick={() => {
                            if (service.isActive === false) return;
                            setEditCoursesService(service);
                            setIsEditCoursesModalOpen(true);
                          }}
                          disabled={service.isActive === false}
                        >
                          <i className="fa-solid fa-list-check fa-lg mr-1"></i>{" "}
                          Các khoá học
                        </button>

                        <button
                          className="px-4 py-2 mt-2.5 mr-1.5 rounded-lg bg-yellow-100 text-yellow-700 font-semibold shadow-sm transition-all duration-200 hover:bg-yellow-500 hover:cursor-pointer hover:text-white hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                          onClick={() => {
                            setOpenDropdowns(prev => ({ ...prev, [service.id]: !isOpen }));
                          }}
                        >
                          <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"} fa-lg mr-1`}></i>{" "}
                          {isOpen ? "Ẩn khoá học" : "Hiện khoá học"}
                        </button>

                        <button
                          className="px-4 py-2 mt-2.5 rounded-lg bg-red-100 text-red-600 font-semibold shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-105 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                          onClick={() => {
                            setServiceToDelete(service.id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <i className="fa-solid fa-trash-can fa-lg mr-1"></i>{" "}
                          Xóa
                        </button>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr>
                        <td colSpan={4} className="bg-gray-50 px-6 py-2">
                          <div className="font-semibold text-blue-700 mb-2">
                            Các khoá học thuộc dịch vụ này:
                          </div>
                          {serviceCourses.length === 0 ? (
                            <div className="text-gray-500 italic py-4">Hiện tại dịch vụ này chưa có khoá học nào</div>
                          ) : (
                            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', display: 'grid' }}>
                              {serviceCourses.map((course) => (
                                <div
                                  key={course.id}
                                  className="flex items-center gap-4 bg-white rounded shadow p-3 border border-gray-200"
                                >
                                  <img
                                    src={course.image}
                                    alt={course.name}
                                    className="w-14 h-14 object-cover rounded"
                                  />
                                  <div>
                                    <div className="font-bold text-gray-800">
                                      {course.name}
                                    </div>
                                    <div className="text-gray-600 text-sm line-clamp-2">
                                      {course.description}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}

              <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={async () => {
                  if (serviceToDelete !== null) {
                    await dispatch(deleteService(serviceToDelete));
                    setSuccessMsg("Xóa dịch vụ thành công!");
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 2000);
                  }
                  setIsDeleteModalOpen(false);
                  setServiceToDelete(null);
                }}
              />
            </tbody>
          </table>
        </div>

        <AddServiceModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditService(null); }} onSave={handleAddService} service={editService} />

        <EditCoursesForServiceModal
          isOpen={isEditCoursesModalOpen}
          onClose={() => {
            setIsEditCoursesModalOpen(false);
            setEditCoursesService(null);
          }}
          allCourses={courses}
          selectedCourseIds={editCoursesService?.courses || []}
          onSave={async (selectedCourseIds) => {
            if (!editCoursesService) return;
            await dispatch(updateService({ id: editCoursesService.id, service: { courses: selectedCourseIds } }));
            setIsEditCoursesModalOpen(false);
            setEditCoursesService(null);
            setSuccessMsg("Cập nhật khoá học cho dịch vụ thành công");
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
          }}
        />
      </main>
    </div>
  );
}

export default ServicesManagementPage;
