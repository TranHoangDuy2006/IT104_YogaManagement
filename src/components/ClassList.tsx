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
    <section className="w-[1280px] h-[592px] ml-[72.5px]">
      <h2 className="pt-[64px] pl-[459.97px] text-[35.3px] font-[700] text-slate-800 text-center md:text-left">
        Các lớp học phổ biến
      </h2>

      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3">
        {classes.map(c => (
          <article
            key={c.id}
            className="bg-white rounded-md shadow-sm border w-[394.66px] h-[380px] text-white"
          >
            <div className="relative">
              <img
                src={c.img}
                alt={c.title}
                className="w-[394.66px] h-[192px] object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="text-black ml-[24px] text-[24px] font-[700]">
                {c.title}
              </h3>
              <p className="text-slate-600 ml-[24px] mt-[8.5px] text-[18.6px] font-[400] leading-snug">
                {c.desc}
              </p>
              <button
                className="ml-[24px] mt-[16px] bg-[#2b71ff] hover:bg-[#205ae0] text-white px-3 py-1.5 rounded text-[18.6px] font-[400]"
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
