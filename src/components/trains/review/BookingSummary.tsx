"use client";

import React from "react";

interface BookingSummaryProps {
  trainTickets: number;
  meals: number;
  serviceFee: number;
  total: number;
  passengerCount: number;
  mealCount: number;
  formatPrice: (price: number) => string;
  onEditSeat?: () => void;
  onEditFood?: () => void;
  onProceedToPayment?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ trainTickets, meals, serviceFee, total, passengerCount, mealCount, formatPrice, onEditSeat, onEditFood, onProceedToPayment }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6 h-fit">
      <h2 className="text-xl font-bold text-black mb-6">Ringkasan Pemesanan</h2>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-black">
          <span>Tiket Kereta ({passengerCount}x)</span>
          <span className="font-semibold">{formatPrice(trainTickets)}</span>
        </div>
        <div className="flex justify-between text-black">
          <span>Makanan ({mealCount}x)</span>
          <span className="font-semibold">{formatPrice(meals)}</span>
        </div>
        <div className="flex justify-between text-black">
          <span>Biaya Layanan</span>
          <span className="font-semibold">{formatPrice(serviceFee)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-black">Total</span>
          <span className="text-xl font-bold text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <button onClick={onEditSeat} className="w-full py-3 px-4 bg-[#eff6ff] border border-[#bfdbfe] text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-between">
          <span>Ubah Pilihan Kursi</span>
          <img src="/ic_arrow_right_blue.svg" alt="Ubah Pilihan Kursi" className="w-4 h-4" />
        </button>
        <button onClick={onEditFood} className="w-full py-3 px-4 bg-[#eff6ff] border border-[#bfdbfe] text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-between">
          <span>Ubah Pesanan Makanan</span>
          <img src="/ic_arrow_right_blue.svg" alt="Ubah Pesanan Makanan" className="w-4 h-4" />
        </button>
      </div>

      {/* Proceed Button */}
      <button
        onClick={onProceedToPayment}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all hover:shadow-xl flex items-center justify-center gap-2"
      >
        <span>Lanjut ke Pembayaran</span>
        <img src="/ic_arrow_right.svg" alt="Lanjut ke Pembayaran" className="w-4 h-4" />
      </button>

      {/* Security Badge */}
      <div className="mt-4 py-4 px-6 flex items-center justify-center gap-2 text-sm text-green-600 bg-[#f0fdf4] rounded-xl border border-[#dcfce7]">
        <img src="/ic_question_dot.svg" alt="Aman" className="w-4 h-4" />
        <span className="font-medium">Pembayaran terlindungi</span>
      </div>
    </div>
  );
};

export default BookingSummary;
