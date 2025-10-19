import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartData = {
  labels: ["Gym", "Yoga", "Zumba"],
  datasets: [
    {
      label: "Số lượng lịch đặt",
      data: [1, 3, 2],
      backgroundColor: [
        "rgba(96, 165, 250, 0.5)",
        "rgba(74, 222, 128, 0.4)",
        "rgba(192, 132, 252, 0.4)",
      ],
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 120,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
      labels: {
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    title: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
      grid: { color: "#e5e7eb" },
    },
  },
};

export default function SchedulesManagementPage() {
  const schedules = [
    { class: "Yoga", date: "2025-05-02", time: "14:00 - 16:00", name: "Trần Hoàng Duy", email: "duyhoangtran2006@gmail.com" },
    { class: "Zumba", date: "2025-04-24", time: "14:00 - 16:00", name: "Phạm Hoàng Trúc Đan", email: "phamhoangtdan1904@gmail.com" },
    { class: "Gym", date: "2025-04-12", time: "07:00 - 09:00", name: "Lê Nguyễn Quang Huy", email: "huygunpow2601@gmail.com" },
    { class: "Yoga", date: "2025-04-25", time: "09:00 - 11:00", name: "Admin", email: "admin@gmail.com" },
    { class: "Yoga", date: "2025-04-19", time: "09:00 - 11:00", name: "Admin", email: "admin@gmail.com" },
    { class: "Zumba", date: "2025-03-15", time: "14:00 - 16:00", name: "Nguyen Van A", email: "a@gmail.com" },
    { class: "Gym", date: "2025-02-20", time: "09:00 - 11:00", name: "Nguyen Van B", email: "b@gmail.com" },
    { class: "Yoga", date: "2025-02-28", time: "09:00 - 11:00", name: "Admin", email: "admin@gmail.com" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = schedules.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row font-[inter] select-none">
      <main className="flex-1 p-6">
        <h1 className="text-[29px] font-bold mb-4">Thống kê lịch tập</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <span className="text-[20px] font-semibold mb-2">Tổng số lịch Gym</span>
            <span className="text-3xl font-bold text-blue-600">1</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <span className="text-[20px] font-semibold mb-2">Tổng số lịch Yoga</span>
            <span className="text-3xl font-bold text-green-600">3</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <span className="text-[20px] font-semibold mb-2">Tổng số lịch Zumba</span>
            <span className="text-3xl font-bold text-purple-600">1</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <form className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium">Lớp học</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 hover:cursor-pointer focus:ring-blue-400">
              <option value="">Tất cả</option>
              <option>Gym</option>
              <option>Yoga</option>
              <option>Zumba</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tìm theo email"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Ngày</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 hover:cursor-pointer focus:ring-blue-400"
            />
          </div>
        </form>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-semibold bg-gray-100">Lớp học</th>
                <th className="px-4 py-3 text-left font-semibold bg-gray-100">Ngày tập</th>
                <th className="px-4 py-3 text-left font-semibold bg-gray-100">Khung giờ</th>
                <th className="px-4 py-3 text-left font-semibold bg-gray-100">Họ tên</th>
                <th className="px-4 py-3 text-left font-semibold bg-gray-100">Email</th>
                <th className="px-4 py-3 text-left font-semibold bg-gray-100">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-4 py-3 border-t border-gray-200">{item.class}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{item.date}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{item.time}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{item.name}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{item.email}</td>
                  <td className="px-4 py-3 border-t border-gray-200">
                    <button className="mr-3 px-4 py-1 rounded-lg bg-blue-100 text-blue-600 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-500 hover:text-white">
                      Sửa
                    </button>
                    <button className="px-4 py-1 rounded-lg bg-red-100 text-red-600 font-semibold shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center py-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-3 py-1 rounded-l-lg bg-gray-100 w-[50px] h-[50px] ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 hover:cursor-pointer'}`}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 w-[50px] h-[50px] hover:cursor-pointer transition-all duration-300 ease-in-out rounded-none ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white scale-105 shadow-lg"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-3 py-1 rounded-r-lg bg-gray-100 w-[50px] h-[50px] ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 hover:cursor-pointer'}`}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
