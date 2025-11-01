import { useState } from "react";
import React from "react";
import hero from "../assets/Yoga_1.png";
import { useNavigate } from "react-router-dom";

function Notification({ message, show }: { message: string, show: boolean }) {
  const [visible, setVisible] = useState(true);
  React.useEffect(() => {
    if (!show) {
      setTimeout(() => setVisible(false), 400);
    } else {
      setVisible(true);
    }
  }, [show]);
  if (!visible) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 font-[inter] select-none">
      <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
        <i className="fa-solid fa-circle-exclamation text-xl mr-2"></i>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default function Banner() {
  const navigate = useNavigate();
  const [showLoginNotify, setShowLoginNotify] = useState(false);

  const handleStart = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      setShowLoginNotify(true);
      setTimeout(() => {
        setShowLoginNotify(false);
        navigate("/login");
      }, 2500);
      return;
    }
    setTimeout(() => {
      navigate("/bookings");
    }, 2500);
  };

  return (
    <section className="relative overflow-hidden rounded-b-md w-full">
      {showLoginNotify && <Notification message="Vui lòng đăng nhập để tiếp tục" show={showLoginNotify} />}
      <div className="relative h-[380px] md:h-[420px] xl:h-[745.9px] w-full">
        <img
          src={hero}
          alt="Yoga Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white w-full">
          <h1 className="text-white text-center font-bold text-[50px] md:text-[50px] leading-tight drop-shadow-lg">
            Welcome to Our Gym
          </h1>
          <p className="mt-2 opacity-90 text-[29.4px] font-normal">
            Transform Your Body, Transform Your Life
          </p>
          <button
            className="mt-4 bg-[#2b71ff] hover:bg-[#205ae0] hover:cursor-pointer text-white text-[19.8px] font-semibold w-[194px] h-[44px] rounded-lg transition-all duration-200 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:shadow-xl"
            onClick={handleStart}
          >
            <i className="fa-solid fa-circle-play mr-2.5"></i>Bắt đầu ngay
          </button>
        </div>
      </div>
    </section>
  );
}
