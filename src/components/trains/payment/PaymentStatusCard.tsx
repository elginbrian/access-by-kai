"use client";

import React, { useEffect, useState } from "react";
import { usePaymentStatus } from "@/lib/hooks/usePayment";
import PaymentService, { PaymentStatus } from "@/lib/services/PaymentService";

interface PaymentStatusCardProps {
  orderId: string;
  onStatusChange?: (status: PaymentStatus) => void;
  className?: string;
}

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({ orderId, onStatusChange, className = "" }) => {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const statusInfo = usePaymentStatus(status);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const paymentStatus = await PaymentService.checkPaymentStatus(orderId);
        if (paymentStatus) {
          setStatus(paymentStatus);
          onStatusChange?.(paymentStatus);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      checkStatus();

      const interval = setInterval(checkStatus, 10000);

      return () => clearInterval(interval);
    }
  }, [orderId, onStatusChange]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Tidak Ditemukan</h3>
          <p className="text-gray-600">Tidak dapat menemukan status pembayaran untuk Order ID: {orderId}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (statusInfo.statusDisplay?.color) {
      case "green":
        return "text-green-600 bg-green-50 border-green-200";
      case "red":
        return "text-red-600 bg-red-50 border-red-200";
      case "yellow":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${className}`}>
      <div className="p-6">
        {/* Status Header */}
        <div className={`p-4 rounded-xl border-2 mb-6 ${getStatusColor()}`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{statusInfo.statusDisplay?.icon}</span>
            <div>
              <h3 className="text-xl font-bold">{statusInfo.statusDisplay?.label}</h3>
              <p className="text-sm opacity-80">{statusInfo.statusDisplay?.description}</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Order ID</label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">{status.orderId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status Transaksi</label>
              <p className="font-semibold text-gray-900 capitalize">{status.transactionStatus}</p>
            </div>
          </div>

          {status.paymentType && (
            <div>
              <label className="text-sm font-medium text-gray-500">Metode Pembayaran</label>
              <p className="font-semibold text-gray-900 capitalize">{status.paymentType.replace("_", " ")}</p>
            </div>
          )}

          {status.grossAmount && (
            <div>
              <label className="text-sm font-medium text-gray-500">Total Pembayaran</label>
              <p className="text-2xl font-bold text-blue-600">{PaymentService.formatCurrency(status.grossAmount)}</p>
            </div>
          )}

          {status.transactionTime && (
            <div>
              <label className="text-sm font-medium text-gray-500">Waktu Transaksi</label>
              <p className="text-gray-900">
                {new Date(status.transactionTime).toLocaleString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons based on status */}
        <div className="mt-6 space-y-3">
          {statusInfo.isCompleted && (
            <button onClick={() => (window.location.href = "/trains/booking/success")} className="w-full py-3 px-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all">
              Lihat Tiket Saya
            </button>
          )}

          {statusInfo.isPending && (
            <div className="text-center">
              <div className="animate-pulse">
                <div className="inline-flex items-center gap-2 text-yellow-600">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Menunggu konfirmasi pembayaran...</p>
            </div>
          )}

          {statusInfo.canRetry && (
            <button onClick={() => (window.location.href = `/trains/payment/${orderId.split("-")[1]}`)} className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
              Coba Bayar Lagi
            </button>
          )}
        </div>

        {/* Additional Info for Pending VA Payments */}
        {statusInfo.isPending && status.paymentType?.includes("va") && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">Instruksi Pembayaran Virtual Account</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. Login ke mobile banking atau ATM bank yang dipilih</p>
              <p>2. Pilih menu Transfer atau Bayar</p>
              <p>3. Masukkan nomor Virtual Account yang diberikan</p>
              <p>
                4. Masukkan nominal pembayaran: <strong>{PaymentService.formatCurrency(status.grossAmount || 0)}</strong>
              </p>
              <p>5. Ikuti instruksi hingga selesai</p>
            </div>
          </div>
        )}

        {/* E-wallet Instructions */}
        {statusInfo.isPending && (status.paymentType === "gopay" || status.paymentType === "shopeepay") && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-2">Instruksi Pembayaran E-Wallet</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>1. Buka aplikasi {status.paymentType === "gopay" ? "Gojek" : "Shopee"}</p>
              <p>2. Scan QR Code yang muncul di popup pembayaran</p>
              <p>3. Atau check notifikasi push di aplikasi Anda</p>
              <p>4. Konfirmasi pembayaran dengan PIN atau biometrik</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusCard;
