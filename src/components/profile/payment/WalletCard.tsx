"use client";

import React from "react";

interface WalletCardProps {
  type: "kaipay" | "railpoint";
  balance: string | number;
  icon: string;
  iconAlt: string;
  onClick?: () => void;
  className?: string;
}

const WalletCard: React.FC<WalletCardProps> = ({
  type,
  balance,
  icon,
  iconAlt,
  onClick,
  className = "",
}) => {
  const getCardStyles = () => {
    if (type === "kaipay") {
      return {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        boxShadow: "0 8px 24px rgba(74, 144, 226, 0.25)",
      };
    } else {
      return {
        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        boxShadow: "0 8px 24px rgba(252, 187, 108, 0.25)",
      };
    }
  };

  const formatBalance = (balance: string | number) => {
    if (type === "kaipay") {
      return typeof balance === "number" ? `Rp ${balance.toLocaleString("id-ID")}` : balance;
    } else {
      return typeof balance === "number" ? balance.toLocaleString("id-ID") : balance;
    }
  };

  const cardName = type === "kaipay" ? "KAI Pay" : "RaiPoint";

  return (
    <div
      className={`text-white rounded-xl p-6 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${className}`}
      style={{
        ...getCardStyles(),
        animation: "slideInUp 0.6s ease-out",
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={icon} alt={iconAlt} className="w-5 h-5" />
          <div className="text-sm font-medium">{cardName}</div>
        </div>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
      <div className="text-2xl font-bold">{formatBalance(balance)}</div>
      <div className="text-xs text-white/80 mt-2">
        {type === "kaipay" ? "Saldo tersedia" : "Poin tersedia"}
      </div>
    </div>
  );
};

export default WalletCard;