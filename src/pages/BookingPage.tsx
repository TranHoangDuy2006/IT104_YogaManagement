import { useState } from "react";
import Navbar from "../components/commons/Navbar";
import BookingForm from "../components/forms/BookingModal";

export default function BookingPage() {
  const [showForm, setShowForm] = useState(false);

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
  <div className="min-h-screen bg-gray-50 font-[inter] select-none">
    <Navbar showUser={false} showPracticeSchedule={false} showHomePage={true}/>
      <div className="w-full bg-white rounded-xl shadow-md max-w-[1280px] mx-auto mt-8 p-8 h-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[30.6px] font-bold">Quản lý lịch tập</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:cursor-pointer w-[147px] h-[40px] text-[19.6px]"
            onClick={() => setShowForm(true)}
          >
            Đặt lịch mới
          </button>
        </div>
        <div className="w-full max-w-[1248px] mx-auto rounded-lg mt-6">
          <table className="w-full bg-gray-50 rounded-xl shadow-sm">
            <thead>
              <tr className="text-black font-semibold text-lg">
                <th className="px-6 text-left w-[204px] h-[48px]">Lớp học</th>
                <th className="py-4 text-left w-[226px] h-[48px]">Ngày tập</th>
                <th className="py-4 text-left w-[247px] h-[48px]">Khung giờ</th>
                <th className="py-4 text-left w-[182px] h-[48px]">Họ tên</th>
                <th className="py-4 text-left w-[161px] h-[48px]">Email</th>
                <th className="py-4 text-left w-[226px] h-[48px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <BookingForm onClose={handleCloseForm} />
      )}
    </div>
  );
}