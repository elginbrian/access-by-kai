"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";

interface PaymentButtonProps {
  onClick?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 text-white rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90"
      style={{
        background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`,
      }}
    >
      Lanjut ke Pemesanan Makanan
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );
};

export default PaymentButton;
