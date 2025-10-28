/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import '../Animations.css';
import { getCourses } from "../../apis/api";
import type { Booking } from "../../slices/bookingSlice";
import type { User } from "../../types/User";

interface AddScheduleForUserModalProps {
  users: User[];
  bookings: Booking[];
  onSave: (data: Booking) => void;
  onClose: () => void;
}

const timeOptions = [
  { value: "", label: "Chọn khung giờ" },
  { value: "6:00 - 7:00", label: "6:00 - 7:00" },
  { value: "7:00 - 8:00", label: "7:00 - 8:00" },
  { value: "8:00 - 9:00", label: "8:00 - 9:00" },
  { value: "17:00 - 18:00", label: "17:00 - 18:00" },
  { value: "18:00 - 19:00", label: "18:00 - 19:00" },
];

export default function AddScheduleForUserModal({ users, bookings, onSave, onClose }: AddScheduleForUserModalProps) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [classType, setClassType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [classOptions, setClassOptions] = useState<Array<{ value: string; label: string }>>([
    { value: "", label: "Chọn lớp học" }
  ]);

  useEffect(() => {
    getCourses()
      .then(res => {
        const options = res.data.map((course: any) => ({ value: course.name, label: course.name }));
        setClassOptions([{ value: "", label: "Chọn lớp học" }, ...options]);
      })
      .catch(() => {
        setClassOptions([{ value: "", label: "Chọn lớp học" }]);
      });
  }, []);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSave = () => {
    setError("");
    if (!selectedUserId || !classType || !date || !time) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const isDuplicate = bookings.some(
      (b) =>
        b.userId === Number(selectedUserId) &&
        b.class === classType &&
        b.date === date &&
        b.time === time
    );
    if (isDuplicate) {
      setError("Lịch này đã tồn tại!");
      return;
    }
    const user = users.find(u => u.id === selectedUserId);
    if (!user) {
      setError("Không tìm thấy user!");
      return;
    }
    onSave({
      userId: Number(user.id),
      class: classType,
      date,
      time,
      name: user.fullName,
      email: user.email,
    } as Booking);
    handleClose();
  };

  const handleCancel = () => {
    setSelectedUserId("");
    setClassType("");
    setDate("");
    setTime("");
    handleClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 select-none font-[inter] transition-all duration-300 ${
      isClosing 
        ? "bg-black/0 backdrop-blur-none" 
        : "bg-black/40 backdrop-blur-[1px]"
    }`}>

      <form
        className={`bg-white rounded-xl shadow-2xl p-8 w-full max-w-[600px] min-h-[520px] transform transition-all duration-300 ${
          isClosing 
            ? "fade-out scale-95 opacity-0 translate-y-5" 
            : "fade-in scale-100 opacity-100"
        }`}
        onSubmit={e => e.preventDefault()}
      >
        <h2 className="text-3xl font-bold mb-6">Thêm lịch mới cho người dùng</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-xl" htmlFor="userSelect">Chọn người dùng</label>
          <select
            id="userSelect"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer transition-colors duration-200"
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
          >
            <option value="">Chọn người dùng</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-xl" htmlFor="classType">Lớp học</label>
          <select
            id="classType"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer transition-colors duration-200"
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
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer transition-colors duration-200"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-xl" htmlFor="time">Khung giờ</label>
          <select
            id="time"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer transition-colors duration-200"
            value={time}
            onChange={e => setTime(e.target.value)}
          >
            {timeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {error && (
          <div className={`text-red-500 font-semibold mb-4 transition-all duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}>{error}</div>
        )}
        <div className={`flex justify-end gap-4 mt-8 transition-all duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}>
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 hover:cursor-pointer text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={handleCancel}
          >
            <i className="fa-solid fa-xmark text-xl mr-1"></i> Hủy
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={handleSave}
          >
            <i className="fa-solid fa-floppy-disk mr-1"></i> Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
