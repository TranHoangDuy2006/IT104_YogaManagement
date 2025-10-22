import { useState, useEffect } from "react";
import axios from "axios";
import type { Booking } from "../../slices/bookingSlice";

interface BookingModalProps {
  booking?: Booking;
  bookings: Booking[];
  onSave: (data: Booking) => void;
  onClose: () => void;
  currentUserId: number;
}



const timeOptions = [
  { value: "", label: "Chọn khung giờ" },
  { value: "6:00 - 7:00", label: "6:00 - 7:00" },
  { value: "7:00 - 8:00", label: "7:00 - 8:00" },
  { value: "8:00 - 9:00", label: "8:00 - 9:00" },
  { value: "17:00 - 18:00", label: "17:00 - 18:00" },
  { value: "18:00 - 19:00", label: "18:00 - 19:00" },
];

export default function BookingModal({
  booking,
  bookings,
  onSave,
  onClose,
  currentUserId,
}: BookingModalProps) {
  const [classType, setClassType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [classOptions, setClassOptions] = useState<Array<{ value: string; label: string }>>([
    { value: "", label: "Chọn lớp học" }
  ]);

  useEffect(() => {
    axios.get<{ id: string; name: string }[]>("http://localhost:1904/courses").then(res => {
      const options = res.data.map((course) => ({ value: course.name, label: course.name }));
      setClassOptions([{ value: "", label: "Chọn lớp học" }, ...options]);
    }).catch(() => {
      setClassOptions([{ value: "", label: "Chọn lớp học" }]);
    });
  }, []);

  useEffect(() => {
    if (booking) {
      setClassType(booking.class || "");
      setDate(booking.date || "");
      setTime(booking.time || "");
    }
  }, [booking]);

  const handleSave = () => {
    setError("");

    if (!classType || !date || !time) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const isDuplicate = bookings.some(
      (b) =>
        b.userId === currentUserId &&
        b.class === classType &&
        b.date === date &&
        b.time === time &&
        (!booking || b.id !== booking.id)
    );

    if (isDuplicate) {
      setError("Lịch này đã tồn tại!");
      return;
    }

    onSave({
      ...booking,
      userId: currentUserId,
      class: classType,
      date,
      time,
      name: booking?.name ?? "",
      email: booking?.email ?? "",
    });
  };

  const handleCancel = () => {
    setClassType("");
    setDate("");
    setTime("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-50 select-none font-[inter]">
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

      <form
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-[600px] min-h-[480px] fade-in"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-3xl font-bold mb-6">
          {booking ? "Chỉnh sửa lịch tập" : "Đặt lịch mới"}
        </h2>

        <div className="mb-4">
          <label
            className="block font-semibold mb-2 text-xl"
            htmlFor="classType"
          >
            Lớp học
          </label>
          <select
            id="classType"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer"
            value={classType}
            onChange={(e) => setClassType(e.target.value)}
          >
            {classOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2 text-xl" htmlFor="date">
            Ngày tập
          </label>
          <input
            id="date"
            type="date"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-xl" htmlFor="time">
            Khung giờ
          </label>
          <select
            id="time"
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {timeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-red-500 font-semibold mb-4">{error}</div>}

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 hover:cursor-pointer text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200"
            onClick={handleCancel}
          >
            <i className="fa-solid fa-xmark text-xl mr-1"></i>{" "} Hủy
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200"
            onClick={handleSave}
          >
            <i className="fa-solid fa-floppy-disk mr-1"></i>{" "}Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
