import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-400 font-[inter] relative overflow-hidden select-none">
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-blue-300 rounded-full opacity-30 blur-2xl z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[260px] h-[260px] bg-blue-500 rounded-full opacity-20 blur-2xl z-0" />
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-blue-400 rounded-full opacity-20 blur-xl z-0" />
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-12 flex flex-col items-center z-10 relative border border-blue-100">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[120px] font-extrabold text-blue-500 leading-none drop-shadow-lg">4</span>
          <span className="text-[120px] font-extrabold text-blue-400 leading-none drop-shadow-lg">0</span>
          <span className="text-[120px] font-extrabold text-blue-500 leading-none drop-shadow-lg">4</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">Không tìm thấy trang</h2>
        <p className="text-lg text-gray-500 mb-8 text-center">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.<br />Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 hover:cursor-pointer text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleBackHome}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
