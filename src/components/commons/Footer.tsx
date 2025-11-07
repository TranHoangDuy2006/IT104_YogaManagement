export default function Footer() {
  return (
    <footer className="bg-[#1f2630] text-white w-full pt-8 pb-2 select-none">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h4 className="mb-2 text-2xl font-bold mt-6">Về chúng tôi</h4>
          <p className="text-base font-normal text-gray-400 leading-relaxed">
            Gym Management – Nơi bạn bắt đầu hành trình fitness của mình với các trang thiết bị hiện đại và đội ngũ huấn luyện viên chuyên nghiệp.
          </p>
        </div>

        <div className="md:ml-8">
          <h4 className="mb-2 text-2xl font-bold mt-6">Liên hệ</h4>
          <p className="text-base font-normal text-gray-400 flex items-center gap-2">
            <i className="fa-solid fa-envelope text-lg" />
            Email: duyhoang1904@gmail.com
          </p>
          <p className="text-base font-normal text-gray-400 flex items-center gap-2">
            <i className="fa-solid fa-phone text-lg" />
            Điện thoại: 0374281904
          </p>
          <p className="text-base font-normal text-gray-400 flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-lg" />
            Địa chỉ: Đường Số 1, Phường Tăng Nhơn Phú B, Thành phố Thủ Đức, Thành phố Hồ Chí Minh
          </p>
        </div>

        <div className="md:ml-8">
          <h4 className="mb-2 text-2xl font-bold mt-6">Theo dõi chúng tôi</h4>
          <div className="grid grid-cols-3 grid-rows-3 gap-4 text-white/80">
            <a href="https://www.facebook.com/itzduy2k6.1904/" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-blue-400 hover:scale-110 hover:underline hover:drop-shadow-lg flex items-center gap-2 justify-center">
              <i className="fa-brands fa-facebook-f text-lg" /> Facebook
            </a>
            <a href="https://www.instagram.com/thduy.1904/" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-pink-400 hover:scale-110 hover:underline hover:drop-shadow-lg flex items-center gap-2 justify-center">
              <i className="fa-brands fa-instagram text-lg" /> Instagram
            </a>
            <a href="https://x.com/hoangtd2006_" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-sky-400 hover:scale-110 hover:underline hover:drop-shadow-lg flex items-center gap-2 justify-center">
              <i className="fa-brands fa-x-twitter text-lg" /> Twitter
            </a>
            <a href="https://www.youtube.com/@LycorisShadow" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-red-500 hover:scale-110 hover:underline hover:drop-shadow-lg flex items-center gap-2 justify-center">
              <i className="fa-brands fa-youtube text-lg" /> Youtube
            </a>
            <a href="https://stackoverflow.com/users/30512944/%c4%90an-ph%e1%ba%a1m" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-orange-500 hover:scale-110 hover:underline hover:drop-shadow-lg flex items-center gap-2 justify-center">
              <i className="fa-brands fa-stack-overflow text-lg" /> Stack Overflow
            </a>
            <a href="https://discord.com/" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-indigo-400 hover:scale-110 hover:underline hover:drop-shadow-lg flex items-center gap-2 justify-center">
              <i className="fa-brands fa-discord text-lg" /> Discord
            </a>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-500 opacity-40 w-[88%] mx-auto mt-12 mb-4" />

      <div className="text-center text-white/70 pb-2 mt-4 text-base font-normal">
        © 2025 Gym Management. All rights reserved.
      </div>
    </footer>
  )
}
