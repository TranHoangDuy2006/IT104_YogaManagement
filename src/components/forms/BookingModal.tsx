import { useState } from "react";

const classOptions = [
  { value: "", label: "Chọn lớp học" },
  { value: "Gym", label: "Gym" },
  { value: "Yoga", label: "Yoga" },
  { value: "Zumba", label: "Zumba" },
];

const timeOptions = [
  { value: "", label: "Chọn khung giờ" },
  { value: "6:00 - 7:00", label: "6:00 - 7:00" },
  { value: "7:00 - 8:00", label: "7:00 - 8:00" },
  { value: "8:00 - 9:00", label: "8:00 - 9:00" },
  { value: "17:00 - 18:00", label: "17:00 - 18:00" },
  { value: "18:00 - 19:00", label: "18:00 - 19:00" },
];

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const [classType, setClassType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleCancel = () => {
    setClassType("");
    setDate("");
    setTime("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#7c7d7d] bg-opacity-10 z-50 backdrop-blur-sm select-none">
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.92); }
          60% { opacity: 0.7; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        .fade-in {
          animation: fadeIn 0.6s cubic-bezier(.4,0,.2,1) forwards;
        }
      `}</style>
      <form className="bg-white rounded-xl shadow-lg p-8 w-full max-w-[600px] min-h-[480px] fade-in">
        <h2 className="text-3xl font-bold mb-6">Đặt lịch mới</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-xl" htmlFor="classType">Lớp học</label>
          <select
            id="classType"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white"
            value={classType}
            onChange={e => setClassType(e.target.value)}
          >
            {classOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-xl" htmlFor="date">Ngày tập</label>
          <input
            id="date"
            type="date"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-xl" htmlFor="time">Khung giờ</label>
          <select
            id="time"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white"
            value={time}
            onChange={e => setTime(e.target.value)}
          >
            {timeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 hover:cursor-pointer text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200"
            onClick={handleCancel}
          >
            Hủy
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
