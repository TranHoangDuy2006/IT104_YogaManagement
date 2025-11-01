import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourses, getServices } from "../apis/api";
import type { Course } from "../types/Course";
import type { Service } from "../types/Service";
import { useSortedCourses } from "../hooks/useSortedCourses";

function Notification({ message, show }: { message: string, show: boolean }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
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

export default function ClassList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showLoginNotify, setShowLoginNotify] = useState(false);

  useEffect(() => {
    getCourses().then(res => setCourses(res.data));
    getServices().then(res => setServices(res.data));
  }, []);

  const activeCourseIds = services
    .filter(s => s.isActive)
    .flatMap(s => s.courses || []);

  const filteredCourses = courses.filter(c => activeCourseIds.includes(c.id));
  const sortedCourses = useSortedCourses(filteredCourses);

  const handleNavigateWithDelay = (id: string | number) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      setShowLoginNotify(true);
      setTimeout(() => {
        setShowLoginNotify(false);
        navigate("/login");
      }, 2500);
      return;
    }
    const idStr = typeof id === 'number' ? String(id) : id;
    setTimeout(() => {
      navigate(`/bookings#${idStr}`);
    }, 2000);
  };

  return (
    <section className="w-full ml-auto mr-auto px-4 mb-16">
      {showLoginNotify && <Notification message="Vui lòng đăng nhập để tiếp tục" show={showLoginNotify} />}
      <h2 className="pt-16 text-3xl md:text-4xl font-bold text-slate-800 text-center mx-auto mb-12">
        Các lớp học phổ biến
      </h2>

      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedCourses.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 text-lg py-12">
            Hiện tại không có khoá học nào khả dụng!
          </div>
        ) : (
          sortedCourses.map(c => (
            <article
              key={c.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-[394.66px] h-[320px] text-white mx-auto transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-300 hover:shadow-2xl hover:border-transparent group cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-200 flex flex-col"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-36 object-cover rounded-t-xl"
                draggable={false}
              />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-black text-xl md:text-2xl font-bold group-hover:text-blue-700 transition-colors duration-300">
                  {c.name}
                </h3>
                <p className="text-gray-700 text-base mt-2 mb-4 line-clamp-2">{c.description}</p>
                <button
                  className="mt-auto bg-[#2b71ff] hover:bg-[#205ae0] hover:cursor-pointer text-white px-4 py-2 rounded text-base md:text-lg font-medium transition-all duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:shadow-lg self-start"
                  onClick={() => handleNavigateWithDelay(c.id)}
                >
                  <i className="fa-solid fa-calendar-plus mr-2.5"></i>Đặt lịch
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
