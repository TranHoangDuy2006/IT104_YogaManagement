export default function Footer() {
  return (
    <footer className="bg-[#1f2630] text-white w-[1425px] h-[325px]">
      <div className="grid md:grid-cols-3 gap-6 text-sm w-[1248px] h-[140px] ml-[88.5px]">
        <div>
          <h4 className="mb-2 text-[24px] font-[700] mt-[40px]">Về chúng tôi</h4>
          <p className="text-[18.6px] font-[400] text-gray-400 leading-relaxed">
            Gym Management – Nơi bạn bắt đầu hành trình fitness của mình với các trang thiết bị hiện đại
            và đội ngũ huấn luyện viên chuyên nghiệp.
          </p>
        </div>

        <div className="ml-[32px]">
          <h4 className="mb-2 text-[24px] font-[700] mt-[40px]">Liên hệ</h4>
          <p className="text-[18.6px] font-[400] text-gray-400">Email: contact@gym.com</p>
          <p className="text-[18.6px] font-[400] text-gray-400">Phone: (123) 456-7890</p>
          <p className="text-[18.6px] font-[400] text-gray-400">Địa chỉ: 123 Đường ABC, Quận XYZ</p>
        </div>

        <div className="ml-[32px]">
          <h4 className="mb-2 text-[24px] font-[700] mt-[40px]">Theo dõi chúng tôi</h4>
          <div className="flex gap-4 text-white/80">
            <a href="#" className="text-[18.6px] font-[400] text-gray-400">Facebook</a>
            <a href="#" className="text-[18.6px] font-[400] text-gray-400">Instagram</a>
            <a href="#" className="text-[18.6px] font-[400] text-gray-400">Twitter</a>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-500 opacity-40 w-[85%] mx-auto mt-[80px] mb-[16px]" />

      <div className="text-center text-white/70 pb-4 mt-[35px] text-[18.6px] font-[400]">
        © 2024 Gym Management. All rights reserved.
      </div>
    </footer>
  )
}
