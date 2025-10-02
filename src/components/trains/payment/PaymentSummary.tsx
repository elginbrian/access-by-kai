"use client";

import React from "react";

interface FoodOrder {
  id: string;
  name: string;
  price: number;
  quantity: number;
  forPassenger: string;
  image?: string;
}

interface PaymentSummaryProps {
  ticketPrice: number;
  foodTotal?: number;
  adminFee: number;
  insurance?: number;
  total: number;
  formatPrice: (price: number) => string;
  foodOrders?: FoodOrder[];
  passengerCount?: number;
  onProceedToPayment?: () => void;
  onBackToReview?: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ ticketPrice, foodTotal = 0, adminFee, insurance = 0, total, formatPrice, foodOrders = [], passengerCount = 1, onProceedToPayment, onBackToReview }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border sticky top-6 h-fit">
      <h2 className="text-xl font-bold text-black mb-6">Ringkasan Pembayaran</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-black">
          <span>Tiket Kereta ({passengerCount}x)</span>
          <span className="font-semibold">{formatPrice(ticketPrice)}</span>
        </div>
        {foodTotal > 0 && (
          <div className="flex justify-between text-black">
            <span>Makanan & Minuman</span>
            <span className="font-semibold">{formatPrice(foodTotal)}</span>
          </div>
        )}
        <div className="flex justify-between text-black">
          <span>Biaya Layanan</span>
          <span className="font-semibold">{formatPrice(adminFee)}</span>
        </div>
        {insurance > 0 && (
          <div className="flex justify-between text-black">
            <span>Asuransi Perjalanan</span>
            <span className="font-semibold">{formatPrice(insurance)}</span>
          </div>
        )}
      </div>

      {/* Food Orders Details */}
      {foodOrders.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Detail Pesanan Makanan</h3>
          <div className="space-y-2">
            {foodOrders.map((order) => (
              <div key={order.id} className="flex justify-between text-sm text-gray-600">
                <span>
                  {order.name} x{order.quantity}
                </span>
                <span>{formatPrice(order.price * order.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-black">Total</span>
          <span className="text-xl font-bold text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-4">
        {onBackToReview && (
          <button onClick={onBackToReview} className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
            Kembali ke Review
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;
