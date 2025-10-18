import { useState } from "react";
import AddServiceModal from "../components/forms/AddServiceModal";
import ConfirmDeleteModal from "../components/forms/ConfirmDeleteModal";
import Sidebar from "../components/commons/Sidebar";

export default function ServicesManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Gym",
      description: "Tập luyện với các thiết bị hiện đại",
      image: "https://titansport.com.vn/wp-content/uploads/2017/08/thiet-bi-phong-gym.jpg"
    },
    {
      id: 2,
      name: "Yoga",
      description: "Thư giãn và cân bằng tâm trí",
      image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2025/10/14/tap-gym-dung-cach-giup-co-the-san-chac-tang-suc-ben-va-cai-thien-suc-khoe-tim-mach-17604114360302556601.jpg"
    },
    {
      id: 3,
      name: "Zumba",
      description: "Đốt cháy calories với những điệu nhảy sôi động",
      image: "https://fitstudio.vn/wp-content/uploads/2023/05/bai-nhay-dance-kpop-into-the-new-world.jpg"
    }
  ]);

  const handleAddService = (service: { name: string; description: string; image: string }) => {
    setServices(prev => [
      ...prev,
      {
        id: prev.length + 1,
        ...service
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row font-[inter] select-none">
      <Sidebar />
      <main className="flex-1 p-6 font-[inter]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold">Quản lý Dịch vụ</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2 shadow transition-all w-[185px] h-[40px] text-[17px] font-medium transform hover:scale-105 hover:shadow-lg hover:-translate-y-1 duration-200 hover:cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
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
                    >
                      Sửa
                    </button>
                    <button
                      className="px-4 py-2 mt-2.5 rounded-lg bg-red-100 text-red-600 font-semibold shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-105 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => {
                          setServiceToDelete(service.id);
                          setIsDeleteModalOpen(true);
                        }}
                    >
                      Xóa
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
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddService}
        />
      </main>
    </div>
  );
}