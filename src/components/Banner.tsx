import hero from "../assets/Yoga_1.png";

export default function Banner() {
  return (
    <section className="relative overflow-hidden rounded-b-md w-full">
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
            className="mt-4 bg-[#2b71ff] hover:bg-[#205ae0] hover:cursor-pointer text-white text-[19.8px] font-semibold w-[194px] h-[44px] rounded-lg transition-all duration-200 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 hover:scale-105 hover:shadow-xl">
            Bắt đầu ngay
          </button>
        </div>
      </div>
    </section>
  );
}
