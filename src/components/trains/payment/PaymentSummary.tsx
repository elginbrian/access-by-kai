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
  isPaymentLoading?: boolean;
  paymentStatus?: any;
  paymentError?: string | null;
  onRetryPayment?: () => void;
  onResetPayment?: () => void;
  onContinuePayment?: () => void;
  isSnapReady?: boolean;
  popupClosed?: boolean;
  snapToken?: string | null;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  ticketPrice,
  foodTotal = 0,
  adminFee,
  insurance = 0,
  total,
  formatPrice,
  foodOrders = [],
  passengerCount = 1,
  onProceedToPayment,
  onBackToReview,
  isPaymentLoading = false,
  paymentStatus,
  paymentError,
  onRetryPayment,
  onResetPayment,
  onContinuePayment,
  isSnapReady = true,
  popupClosed = false,
  snapToken = null,
}) => {
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

      {snapToken && popupClosed && !paymentStatus && (
        <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-900">Pembayaran Siap</h3>
              <p className="text-sm text-green-800">Pembayaran telah disiapkan. Klik "Lanjutkan Pembayaran" untuk menyelesaikan transaksi.</p>
            </div>
          </div>
        </div>
      )}

      {snapToken && popupClosed && !paymentStatus && (
        <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <h3 className="font-semibold text-green-900">Pembayaran Siap</h3>
              <p className="text-sm text-green-800">Pembayaran telah disiapkan. Klik "Lanjutkan Pembayaran" untuk menyelesaikan pemesanan Anda.</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status */}
      {paymentStatus && (
        <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {paymentStatus.status === "settlement" || paymentStatus.status === "capture"
                ? "✅"
                : paymentStatus.status === "pending"
                ? "⏳"
                : paymentStatus.status === "deny" || paymentStatus.status === "cancel" || paymentStatus.status === "expire" || paymentStatus.status === "failure"
                ? "❌"
                : "⏳"}
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">
                {paymentStatus.status === "settlement" || paymentStatus.status === "capture"
                  ? "Pembayaran Berhasil"
                  : paymentStatus.status === "pending"
                  ? "Menunggu Pembayaran"
                  : paymentStatus.status === "deny"
                  ? "Pembayaran Ditolak"
                  : paymentStatus.status === "cancel"
                  ? "Pembayaran Dibatalkan"
                  : paymentStatus.status === "expire"
                  ? "Pembayaran Kadaluarsa"
                  : paymentStatus.status === "failure"
                  ? "Pembayaran Gagal"
                  : "Memproses Pembayaran"}
              </h3>
              <p className="text-sm text-gray-600">
                {paymentStatus.status === "settlement" || paymentStatus.status === "capture"
                  ? "Pembayaran telah berhasil diproses"
                  : paymentStatus.status === "pending"
                  ? "Silakan selesaikan pembayaran Anda"
                  : paymentStatus.status === "deny"
                  ? "Pembayaran ditolak, silakan coba metode lain"
                  : paymentStatus.status === "cancel"
                  ? "Pembayaran telah dibatalkan"
                  : paymentStatus.status === "expire"
                  ? "Waktu pembayaran telah habis"
                  : paymentStatus.status === "failure"
                  ? "Terjadi kesalahan dalam proses pembayaran"
                  : "Sedang memproses pembayaran..."}
              </p>
              {paymentStatus.orderId && <p className="text-xs text-gray-500 mt-1">Order ID: {paymentStatus.orderId}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {paymentError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Gagal Memproses Pembayaran</h3>
              <p className="text-sm text-red-600">{paymentError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 mb-4">
        <button
          onClick={snapToken && popupClosed ? onContinuePayment : onProceedToPayment}
          disabled={isPaymentLoading || !isSnapReady || paymentStatus?.status === "settlement" || paymentStatus?.status === "capture"}
          className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isPaymentLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Memproses...</span>
            </>
          ) : !isSnapReady ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Memuat Payment Gateway...</span>
            </>
          ) : paymentStatus?.status === "settlement" || paymentStatus?.status === "capture" ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Pembayaran Berhasil</span>
            </>
          ) : snapToken && popupClosed ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Lanjutkan Pembayaran</span>
            </>
          ) : (
            <>
              <img src="/ic_lock.svg" alt="" />
              <span>Bayar Sekarang</span>
            </>
          )}
        </button>

        {/* Retry Button */}
        {(paymentStatus?.status === "deny" || paymentStatus?.status === "cancel" || paymentStatus?.status === "expire" || paymentStatus?.status === "failure" || paymentError) && onRetryPayment && (
          <button onClick={onRetryPayment} className="w-full py-3 px-6 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all">
            Coba Lagi
          </button>
        )}

        {/* Reset Button */}
        {(paymentStatus || paymentError) && onResetPayment && (
          <button onClick={onResetPayment} className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
            Reset Pembayaran
          </button>
        )}

        {onBackToReview && (
          <button onClick={onBackToReview} className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
            Kembali ke Review
          </button>
        )}
      </div>

      {paymentStatus?.status === "pending" && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-yellow-800">
              <strong>Selesaikan pembayaran dalam 2 jam</strong> untuk menghindari pembatalan otomatis.
            </p>
          </div>
        </div>
      )}

      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <img src="/ic_shield.svg" alt="Keamanan" />
          <div>
            <div className="font-semibold text-green-800 text-sm mb-1">Pembayaran Anda terenkripsi dan aman</div>
            <div className="text-xs text-green-700">Dilindungi dengan teknologi SSL 256-bit dan diproses oleh Midtrans</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs text-gray-500 text-center mb-3 border-t border-gray-200 pt-3">Metode pembayaran yang diterima</div>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <img src="/ic_visa_blue.svg" alt="Visa" />
          <img src="/ic_mastercard_red.svg" alt="MasterCard" />
          <img src="/ic_legal_dark.svg" alt="Bank" />
          <img src="/ic_ewallet_purple.svg" alt="E-Wallet" />
          <img src="/ic_qris_green.svg" alt="QRIS" />
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
