import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full animate-fade-in">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-4 border-t-4 border-transparent border-t-blue-500 animate-spin"></div>
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-blue-400 via-blue-200 to-white blur-sm opacity-80 animate-pulse"></div>
      <div className="absolute inset-4 rounded-full bg-white shadow-inner"></div>
    </div>

    <span className="mt-6 text-blue-600 font-semibold text-lg tracking-wide animate-pulse">
      Đang tải dữ liệu...
    </span>
  </div>
);

export default LoadingSpinner;
