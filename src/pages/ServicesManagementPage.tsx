import { useState, useEffect } from "react";

import { getServices, createService, updateService } from "../apis/api";
import AddServiceModal from "../components/modals/AddServiceModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

export default function ServicesManagementPage() {
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response.data);
      } catch {
        alert("Không thể tải danh sách dịch vụ!");
      }
    };
    fetchServices();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  type Service = {
    id: number;
    name: string;
    description: string;
    image: string;
  };

  const [editService, setEditService] = useState<Service | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [services, setServices] = useState<{ id: number; name: string; description: string; image: string }[]>([]);

  const handleAddService = async (service: { name: string; description: string; image: string }) => {
    if (editService) {
      try {
        const response = await updateService(editService.id, service);
        const updatedService = response.data;
        setServices(prev => prev.map(s =>
          s.id === editService.id ? updatedService : s
        ));
        setEditService(null);
        setIsModalOpen(false);
      } catch {
        alert("Cập nhật dịch vụ thất bại!");
      }
    } else {
      try {
        const response = await createService(service);
        const newService = response.data;
        setServices(prev => [
          ...prev,
          newService
        ]);
        setIsModalOpen(false);
      } catch {
        alert("Thêm dịch vụ thất bại!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row font-[inter] select-none">
      <main className="flex-1 bg-[#f9fafb] font-[inter]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold">Quản lý dịch vụ</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2 shadow transition-all w-[210px] h-[40px] text-[17px] font-medium transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 duration-200 hover:cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fa fa-plus mr-3"></i>
            Thêm dịch vụ mới
          </button>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="text-black font-semibold text-base">
                <th className="px-3 py-3 text-left text-[19px]">Tên dịch vụ</th>
                <th className="px-6 py-3 text-left text-[19px]">Mô tả</th>
                <th className="px-6 py-3 text-left text-[19px]">Hình ảnh</th>
                <th className="px-6 py-3 text-left text-[19px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-3 py-4 text-[17px]">{service.name}</td>
                  <td className="px-6 py-4 text-[17px]">{service.description}</td>
                  <td className="px-6 py-4">
                    <img src={service.image} alt={service.name} className="w-16 h-16 object-cover rounded shadow" />
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="px-4 py-2 mt-2.5 mr-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-500 hover:cursor-pointer hover:text-white hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => {
                        setEditService(service);
                        setIsModalOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square fa-lg mr-1"></i>
                      {" "} Sửa
                    </button>
                    <button
                      className="px-4 py-2 mt-2.5 rounded-lg bg-red-100 text-red-600 font-semibold shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-105 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => {
                          setServiceToDelete(service.id);
                          setIsDeleteModalOpen(true);
                        }}
                    >
                      <i className="fa-solid fa-trash-can fa-lg mr-1"></i>
                      {" "} Xóa  
                    </button>
                  </td>
                </tr>
              ))}

            <ConfirmDeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={() => {
                if (serviceToDelete !== null) {
                  setServices(prev => prev.filter(s => s.id !== serviceToDelete));
                }
                setIsDeleteModalOpen(false);
                setServiceToDelete(null);
              }}
            />
            </tbody>
          </table>
        </div>

        <AddServiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditService(null);
          }}
          onSave={handleAddService}
          service={editService}
        />
      </main>
    </div>
  );
}