import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 font-[inter] relative overflow-hidden select-none">
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[360px] h-[360px] bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[280px] h-[280px] bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-150" />
        <div className="absolute top-[50%] left-[60%] w-[160px] h-[160px] bg-indigo-400/20 rounded-full blur-2xl animate-pulse delay-300" />
      </div>
      <div className="max-w-xl w-full bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-12 flex flex-col items-center z-10 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          {["4", "0", "4"].map((n, i) => (
            <span
              key={i}
              className="text-[110px] font-extrabold bg-gradient-to-br from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent drop-shadow-lg animate-bounce"
              style={{ animationDelay: `${i * 0.8}s` }}
            >
              {n}
            </span>
          ))}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight text-center">
          Không tìm thấy trang
        </h2>
        <p className="text-lg text-gray-600 mb-10 text-center leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          <br />
          Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>
        <button
          onClick={handleBackHome}
          className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-10 py-3 rounded-lg text-lg shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
        >
          <span className="relative z-10"><i className="fa-solid fa-house-chimney mr-2.5"></i>Quay về trang chủ</span>
          <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
