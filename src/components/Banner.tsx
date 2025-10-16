import hero from "../assets/Yoga_1.png";

export default function Banner() {
  return (
    <section className="relative overflow-hidden rounded-b-md" style={ {width: 1425, maxWidth: 1425} }>
      <div className="relative h-[380px] md:h-[420px] xl:h-[745.9px]">
        <img
          src={hero}
          alt="Yoga Hero"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ maxWidth: "1425px" }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white" style={ {width: 1425} }>
          <h1 className="text-2xl md:text-4xl font-bold" style={ {fontSize: 50, fontWeight: "700"}}>Welcome to Our Gym</h1>
          <p className="mt-2 opacity-90" style={ {fontSize: 29.4, fontWeight: "400"}}>
            Transform Your Body, Transform Your Life
          </p>
          <button className="mt-4 bg-[#2b71ff] hover:bg-[#205ae0] text-white text-xs md:text-sm font-medium px-4 py-2 rounded" style={ {fontSize: 19.8, fontWeight: 600, width: 194, height: 44, borderRadius: 8} }>
            Bắt đầu ngay
          </button>
        </div>
      </div>
    </section>
  );
}
