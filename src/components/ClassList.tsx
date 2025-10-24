import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourses } from "../apis/api";
import type { Course } from "../types/Course";
import { useSortedCourses } from "../hooks/useSortedCourses";

export default function ClassList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const sortedCourses = useSortedCourses(courses);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data);
      } catch {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const handleNavigateWithDelay = (id: number) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      setTimeout(() => {
        navigate("/login");
      }, 1500); 
      return;
    }
    setTimeout(() => {
      navigate(`/bookings#${id}`);
    }, 1000);
  };

  return (
    <section className="w-full ml-auto mr-auto px-4 mb-16">
      <h2 className="pt-16 text-3xl md:text-4xl font-bold text-slate-800 text-center mx-auto mb-12">
        Các lớp học phổ biến
      </h2>

      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedCourses.map(c => (
          <article
            key={c.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-[394.66px] h-[320px] text-white mx-auto transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-300 hover:shadow-2xl hover:border-transparent group cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-200 flex flex-col"
          >
            <img
              src={c.image}
              alt={c.name}
              className="w-full h-36 object-cover rounded-t-xl"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-black text-xl md:text-2xl font-bold group-hover:text-blue-700 transition-colors duration-300">
                {c.name}
              </h3>
              <p className="text-gray-700 text-base mt-2 mb-4 line-clamp-2">{c.description}</p>
              <button
                className="mt-auto bg-[#2b71ff] hover:bg-[#205ae0] hover:cursor-pointer text-white px-4 py-2 rounded text-base md:text-lg font-medium transition-all duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:shadow-lg self-start"
                onClick={() => handleNavigateWithDelay(Number(c.id))}
              >
                Đặt lịch
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
