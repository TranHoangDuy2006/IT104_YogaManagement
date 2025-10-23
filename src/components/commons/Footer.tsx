export default function Footer() {
  return (
    <footer className="bg-[#1f2630] text-white w-full pt-8 pb-2 select-none">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h4 className="mb-2 text-2xl font-bold mt-6">Về chúng tôi</h4>
          <p className="text-base font-normal text-gray-400 leading-relaxed">
            Gym Management – Nơi bạn bắt đầu hành trình fitness của mình với các trang thiết bị hiện đại
            và đội ngũ huấn luyện viên chuyên nghiệp.
          </p>
        </div>

        <div className="md:ml-8">
          <h4 className="mb-2 text-2xl font-bold mt-6">Liên hệ</h4>
          <p className="text-base font-normal text-gray-400">Email: contact@gym.com</p>
          <p className="text-base font-normal text-gray-400">Phone: (123) 456-7890</p>
          <p className="text-base font-normal text-gray-400">Địa chỉ: 123 Đường ABC, Quận XYZ</p>
        </div>

        <div className="md:ml-8">
          <h4 className="mb-2 text-2xl font-bold mt-6">Theo dõi chúng tôi</h4>
          <div className="flex gap-4 text-white/80">
            <a href="#" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-blue-400 hover:scale-110 hover:underline hover:drop-shadow-lg">Facebook</a>
            <a href="#" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-pink-400 hover:scale-110 hover:underline hover:drop-shadow-lg">Instagram</a>
            <a href="#" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-sky-400 hover:scale-110 hover:underline hover:drop-shadow-lg">Twitter</a>
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
