import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full animate-fade-in">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      <div className="absolute inset-2 rounded-full bg-white"></div>
      <div className="absolute inset-4 rounded-full bg-blue-100"></div>
    </div>
    <span className="mt-4 text-blue-500 font-semibold text-lg tracking-wide">Đang tải...</span>
  </div>
);

export default LoadingSpinner;
