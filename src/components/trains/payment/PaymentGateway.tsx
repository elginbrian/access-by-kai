"use client";

import React, { useState } from "react";
import { usePayment, usePaymentStatus } from "@/lib/hooks/usePayment";
import PaymentService from "@/lib/services/PaymentService";
import { useCentralBooking } from "@/lib/hooks/useCentralBooking";

const PAYMENT_METHODS = [
  {
    id: "credit_card",
    name: "Kartu Kredit/Debit",
    icon: "/ic_credit_card.svg",
    description: "Visa, Mastercard, JCB",
    popular: true,
  },
  {
    id: "bca_va",
    name: "BCA Virtual Account",
    icon: "/ic_bca.svg",
    description: "Transfer via ATM/Mobile Banking BCA",
  },
  {
    id: "bni_va",
    name: "BNI Virtual Account",
    icon: "/ic_bni.svg",
    description: "Transfer via ATM/Mobile Banking BNI",
  },
  {
    id: "bri_va",
    name: "BRI Virtual Account",
    icon: "/ic_bri.svg",
    description: "Transfer via ATM/Mobile Banking BRI",
  },
  {
    id: "mandiri_va",
    name: "Mandiri Virtual Account",
    icon: "/ic_mandiri.svg",
    description: "Transfer via ATM/Mobile Banking Mandiri",
  },
  {
    id: "gopay",
    name: "GoPay",
    icon: "/ic_gopay.svg",
    description: "Bayar dengan saldo GoPay",
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    icon: "/ic_shopeepay.svg",
    description: "Bayar dengan saldo ShopeePay",
  },
  {
    id: "qris",
    name: "QRIS",
    icon: "/ic_qris.svg",
    description: "Scan QR Code untuk bayar",
    popular: true,
  },
];

interface PaymentGatewayProps {
  onPaymentSuccess?: (orderId: string) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ onPaymentSuccess, onPaymentError, className = "" }) => {
  const { bookingData } = useCentralBooking();
  const payment = usePayment();
  const statusInfo = usePaymentStatus(payment.status);

  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [isMethodSelectionOpen, setIsMethodSelectionOpen] = useState(false);

  // Handle payment method selection
  const togglePaymentMethod = (methodId: string) => {
    setSelectedMethods((prev) => (prev.includes(methodId) ? prev.filter((id) => id !== methodId) : [...prev, methodId]));
  };

  const handleStartPayment = async () => {
    if (!payment.isSnapReady) {
      onPaymentError?.("Payment gateway belum siap");
      return;
    }

    if (selectedMethods.length === 0) {
      // Use all methods if none selected
      await payment.createPayment();
    } else {
      await payment.createPayment(selectedMethods);
    }
  };

  const handleProceedToPay = () => {
    if (payment.snapToken) {
      payment.openSnapPayment();
    }
  };

  // Handle payment status changes
  React.useEffect(() => {
    if (statusInfo.isCompleted && payment.orderId) {
      onPaymentSuccess?.(payment.orderId);
    } else if (statusInfo.isFailed && payment.error) {
      onPaymentError?.(payment.error);
    }
  }, [statusInfo.isCompleted, statusInfo.isFailed, payment.orderId, payment.error, onPaymentSuccess, onPaymentError]);

  const totalAmount = bookingData.pricing.total;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Pilih Metode Pembayaran</h2>
        <p className="text-gray-600">
          Total: <span className="text-2xl font-bold text-blue-600">{PaymentService.formatCurrency(totalAmount)}</span>
        </p>
      </div>

      {/* Payment Status */}
      {payment.status && (
        <div
          className="p-4 mx-6 mt-6 rounded-xl"
          style={{
            backgroundColor: statusInfo.statusDisplay?.color === "green" ? "#f0f9ff" : statusInfo.statusDisplay?.color === "red" ? "#fef2f2" : statusInfo.statusDisplay?.color === "yellow" ? "#fffbeb" : "#f9fafb",
            borderLeft: `4px solid ${statusInfo.statusDisplay?.color === "green" ? "#10b981" : statusInfo.statusDisplay?.color === "red" ? "#f87171" : statusInfo.statusDisplay?.color === "yellow" ? "#f59e0b" : "#6b7280"}`,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{statusInfo.statusDisplay?.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{statusInfo.statusDisplay?.label}</h3>
              <p className="text-sm text-gray-600">{statusInfo.statusDisplay?.description}</p>
              {payment.orderId && <p className="text-xs text-gray-500 mt-1">Order ID: {payment.orderId}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {payment.error && (
        <div className="p-4 mx-6 mt-6 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Gagal Memproses Pembayaran</h3>
              <p className="text-sm text-red-600">{payment.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Selection */}
      <div className="p-6">
        <div className="mb-4">
          <button onClick={() => setIsMethodSelectionOpen(!isMethodSelectionOpen)} className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-700">{selectedMethods.length === 0 ? "Semua Metode Pembayaran" : `${selectedMethods.length} Metode Dipilih`}</span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${isMethodSelectionOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isMethodSelectionOpen && (
          <div className="space-y-2 mb-6">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedMethods.includes(method.id) ? "border-blue-200 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
                onClick={() => togglePaymentMethod(method.id)}
              >
                <input type="checkbox" checked={selectedMethods.includes(method.id)} onChange={() => togglePaymentMethod(method.id)} className="w-4 h-4 text-blue-600 rounded" />
                <img
                  src={method.icon}
                  alt={method.name}
                  className="w-8 h-8"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/ic_credit_card.svg";
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    {method.popular && <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">Popular</span>}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!payment.snapToken ? (
            <button
              onClick={handleStartPayment}
              disabled={payment.isLoading || !payment.isSnapReady}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {payment.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Menyiapkan Pembayaran...
                </>
              ) : !payment.isSnapReady ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Memuat Payment Gateway...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Buat Pembayaran
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleProceedToPay}
              disabled={payment.isProcessing || statusInfo.isCompleted}
              className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {payment.isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Memproses Pembayaran...
                </>
              ) : statusInfo.isCompleted ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Pembayaran Berhasil
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Bayar Sekarang
                </>
              )}
            </button>
          )}

          {/* Retry Button */}
          {statusInfo.canRetry && (
            <button onClick={payment.retryPayment} className="w-full py-3 px-6 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all">
              Coba Lagi
            </button>
          )}

          {/* Reset Button */}
          {(payment.snapToken || payment.error) && (
            <button onClick={payment.resetPayment} className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              Reset Pembayaran
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-green-50 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-green-800 text-sm">Pembayaran Aman & Terpercaya</h4>
              <p className="text-sm text-green-700 mt-1">Transaksi Anda dilindungi dengan enkripsi SSL 256-bit dan diproses oleh Midtrans, payment gateway terpercaya di Indonesia.</p>
            </div>
          </div>
        </div>

        {/* Payment Timer */}
        {payment.snapToken && statusInfo.isPending && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
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
      </div>
    </div>
  );
};

export default PaymentGateway;
