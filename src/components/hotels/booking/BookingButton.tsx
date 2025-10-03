"use client";

import React from "react";

interface BookingButtonProps {
  text?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const BookingButton: React.FC<BookingButtonProps> = ({
  text = "Konfirmasi Pesanan",
  icon = "/ic_tick_white_fill.svg",
  onClick,
  disabled = false,
  loading = false,
  className = ""
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-colors ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Memproses...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {icon && <img src={icon} alt="Icon" className="w-4 h-4" />}
          <span>{text}</span>
        </div>
      )}
    </button>
  );
};

export default BookingButton;