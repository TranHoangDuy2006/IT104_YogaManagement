import gym from "../assets/Yoga_2.png"
import yoga from "../assets/Yoga_3.png"
import zumba from "../assets/Yoga_4.png"

const classes = [
  {
    id: "gym",
    title: "Gym",
    desc: "Tập luyện với các thiết bị hiện đại",
    img: gym
  },
  {
    id: "yoga",
    title: "Yoga",
    desc: "Thư giãn và cân bằng tâm trí",
    img: yoga,
  },
  {
    id: "zumba",
    title: "Zumba",
    desc: "Đốt cháy calories với những điệu nhảy sôi động",
    img: zumba,
  },
]

export default function ClassList() {
  return (
    <section className="w-full max-w-[1280px] h-[592px] ml-auto mr-auto px-4">
      <h2 className="pt-16 text-3xl md:text-4xl font-bold text-slate-800 text-center mx-auto" style={{ marginBottom: 48 }}>
        Các lớp học phổ biến
      </h2>

      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {classes.map(c => (
          <article
            key={c.id}
            className="bg-white rounded-md shadow-sm border w-full max-w-[394.66px] h-[380px] text-white mx-auto"
          >
            <div className="relative">
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-[192px] object-cover rounded-t-md"
              />
            </div>

            <div className="p-4">
              <h3 className="text-black ml-2 text-xl md:text-2xl font-bold">
                {c.title}
              </h3>
              <p className="text-slate-600 ml-2 mt-2 text-base md:text-lg font-normal leading-snug">
                {c.desc}
              </p>
              <button
                className="ml-2 mt-4 bg-[#2b71ff] hover:bg-[#205ae0] text-white px-4 py-2 rounded text-base md:text-lg font-medium transition-all duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
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
