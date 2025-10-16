import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="flex items-center justify-between bg-[#1f2630] text-white h-14 max-w-[1425px]" style={ {width: 1425, maxWidth: 1425} }>
      <div className="tracking-wide text-[24px] font-[700] py-2 ml-0 lg:ml-[88.5px]">
        GYM MANAGEMENT
      </div>

      <nav className="hidden sm:flex text-[18.6px] font-[400] space-x-5 mr-0 lg:mr-[88.5px]">
        <a href="#" className="hover:underline">
          Trang chủ
        </a>
        <a href="#" className="hover:underline">
          Lịch tập
        </a>
        <a href="#" className="hover:underline">
          Đăng nhập
        </a>
      </nav>

      <button
        className="sm:hidden flex items-center px-2 py-1 focus:outline-none"
        onClick={() => setOpen(v => !v)}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <nav className="absolute top-14 left-0 w-full bg-[#1f2630] flex flex-col items-center space-y-2 py-4 z-50 sm:hidden shadow-lg animate-fade-in text-[18.6px] font-[400]">
          <a href="#" className="hover:underline" onClick={() => setOpen(false)}>
            Trang chủ
          </a>
          <a href="#" className="hover:underline" onClick={() => setOpen(false)}>
            Lịch tập
          </a>
          <a href="#" className="hover:underline" onClick={() => setOpen(false)}>
            Đăng nhập
          </a>
        </nav>
      )}
    </header>
  )
}
