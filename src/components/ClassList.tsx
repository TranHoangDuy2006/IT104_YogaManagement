import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ClassList() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Array<{id: number, name: string, description: string, image: string}>>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:1904/courses");
        setServices(res.data);
      } catch {
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  const handleNavigateWithDelay = (id: number) => {
    setTimeout(() => {
      navigate(`/booking#${id}`);
    }, 1000);
  };

  return (
    <section className="w-full ml-auto mr-auto px-4 mb-16">
      <h2 className="pt-16 text-3xl md:text-4xl font-bold text-slate-800 text-center mx-auto mb-12">
        Các lớp học phổ biến
      </h2>

      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map(s => (
          <article
            key={s.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-[394.66px] h-[380px] text-white mx-auto transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-300 hover:shadow-2xl hover:border-transparent group cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-200 flex flex-col"
          >
            <div className="relative overflow-hidden">
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-[192px] object-cover rounded-t-xl group-hover:scale-110 group-hover:rotate-1 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-xl" />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-black ml-2 text-xl md:text-2xl font-bold group-hover:text-blue-700 transition-colors duration-300">
                {s.name}
              </h3>
              <p className="text-slate-600 ml-2 mt-2 text-base md:text-lg font-normal leading-snug group-hover:text-blue-500 transition-colors duration-300 flex-1 overflow-hidden">
                {s.description}
              </p>
              <button
                className="ml-2 mt-4 bg-[#2b71ff] hover:bg-[#205ae0] hover:cursor-pointer text-white px-4 py-2 rounded text-base md:text-lg font-medium transition-all duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:shadow-lg self-start"
                onClick={() => handleNavigateWithDelay(s.id)}
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
