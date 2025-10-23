/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getCourses } from "../../apis/api";
import type { Booking } from "../../slices/bookingSlice";

interface BookingModalProps {
  isOpen: boolean;
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
  isOpen,
  booking,
  bookings,
  onSave,
  onClose,
  currentUserId,
}: BookingModalProps) {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  const [classType, setClassType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const [classOptions, setClassOptions] = useState<Array<{ value: string; label: string }>>([
    { value: "", label: "Chọn lớp học" },
  ]);

  // Animation control
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

  // Fetch courses
  useEffect(() => {
    getCourses()
      .then((res) => {
        const options = res.data.map((c: any) => ({
          value: c.name,
          label: c.name,
        }));
        setClassOptions([{ value: "", label: "Chọn lớp học" }, ...options]);
      })
      .catch(() => setClassOptions([{ value: "", label: "Chọn lớp học" }]));
  }, []);

  // Fill data if editing
  useEffect(() => {
    if (booking) {
      setClassType(booking.class || "");
      setDate(booking.date || "");
      setTime(booking.time || "");
    } else {
      setClassType("");
      setDate("");
      setTime("");
    }
  }, [booking]);

  if (!visible) return null;

  const handleSave = () => {
    setError("");
    if (!classType || !date || !time) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const duplicate = bookings.some(
      (b) =>
        b.userId === currentUserId &&
        b.class === classType &&
        b.date === date &&
        b.time === time &&
        (!booking || b.id !== booking.id)
    );
    if (duplicate) {
      setError("Lịch tập này đã tồn tại!");
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
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-50 select-none font-[inter] transition-all duration-300 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.94); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-out {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.96); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-fade-out {
          animation: fade-out 0.3s cubic-bezier(.4,0,.2,1) forwards;
        }
      `}</style>

      <form
        className={`bg-white rounded-xl shadow-xl p-8 w-full max-w-[600px] min-h-[480px] transform transition-all duration-300 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-3xl font-bold mb-6">
          {booking ? "Chỉnh sửa lịch tập" : "Đặt lịch mới"}
        </h2>

        <div className="mb-4">
          <label htmlFor="classType" className="block font-semibold mb-2 text-xl">
            Lớp học
          </label>
          <select
            id="classType"
            value={classType}
            onChange={(e) => setClassType(e.target.value)}
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer"
          >
            {classOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block font-semibold mb-2 text-xl">
            Ngày tập
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="time" className="block font-semibold mb-2 text-xl">
            Khung giờ
          </label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white hover:cursor-pointer"
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
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 hover:cursor-pointer text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200"
          >
            <i className="fa-solid fa-xmark text-xl mr-1"></i> Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200"
          >
            <i className="fa-solid fa-floppy-disk mr-1"></i> Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
