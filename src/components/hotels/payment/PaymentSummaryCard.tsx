"use client";

import React from "react";

export interface PaymentSummaryItem {
  label: string;
  amount: string;
  isTotal?: boolean;
}

export interface PaymentSummaryCardProps {
  title: string;
  items: PaymentSummaryItem[];
  total: {
    label: string;
    amount: string;
    color?: string;
  };
  onPayNow: () => void;
  payButtonText?: string;
  payButtonIcon?: string;
  loading?: boolean;
  securityNote?: string;
  acceptedPayments?: Array<{
    name: string;
    bgColor: string;
    textColor: string;
    icon?: string;
  }>;
}

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
  title,
  items,
  total,
  onPayNow,
  payButtonText = "Bayar Sekarang",
  payButtonIcon = "/ic_wifi.svg",
  loading = false,
  securityNote = "Pembayaran Anda terenkripsi dan aman",
  acceptedPayments = [
    { name: "VISA", bgColor: "bg-blue-600", textColor: "text-white" },
    { name: "MC", bgColor: "bg-red-600", textColor: "text-white" },
    { name: "🏦", bgColor: "bg-gray-700", textColor: "text-white" },
    { name: "💳", bgColor: "bg-purple-600", textColor: "text-white" },
    { name: "QR", bgColor: "bg-green-600", textColor: "text-white" }
  ]
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4 text-black">{title}</h3>

      {/* Payment Items */}
      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium text-black">{item.amount}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-black">{total.label}</span>
          <span className={`font-bold text-xl ${total.color || 'text-blue-600'}`}>
            {total.amount}
          </span>
        </div>
      </div>

      {/* Pay Button */}
      <button 
        onClick={onPayNow}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <img src={payButtonIcon} alt="Pay" className="w-4 h-4" />
            {payButtonText}
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-600">
        <img src="/ic_wifi.svg" alt="Security" className="w-4 h-4 mt-0.5" />
        <p>
          <span className="text-green-600 font-medium">{securityNote}</span>
          <br />
          Dilindungi dengan teknologi SSL 256-bit
        </p>
      </div>

      {/* Accepted Payment Methods */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center mb-3">Metode pembayaran yang diterima</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {acceptedPayments.map((payment, index) => (
            <div 
              key={index}
              className={`w-10 h-7 ${payment.bgColor} rounded flex items-center justify-center ${payment.textColor} text-xs font-bold`}
            >
              {payment.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;