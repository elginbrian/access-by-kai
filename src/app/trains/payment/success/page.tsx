"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import PaymentStatusCard from "@/components/trains/payment/PaymentStatusCard";
import { PaymentStatus } from "@/lib/services/PaymentService";
import BookingLayout from "@/components/layout/BookingLayout";
import { PaymentPageSkeleton } from "@/components/ui/Skeleton";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const handleStatusChange = (status: PaymentStatus) => {
    setPaymentStatus(status);
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order ID Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Tidak dapat menemukan informasi pembayaran. Silakan periksa email Anda atau hubungi customer service.</p>
          <div className="space-y-3">
            <button onClick={() => (window.location.href = "/trains")} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Cari Kereta Lagi
            </button>
            <button onClick={() => (window.location.href = "/")} className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainNavigation />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Status Pembayaran</h1>
          <p className="text-gray-600">Berikut adalah informasi terkini mengenai pembayaran Anda</p>
        </div>

        {/* Payment Status Card */}
        <div className="mb-8">
          <PaymentStatusCard orderId={orderId} onStatusChange={handleStatusChange} />
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Konfirmasi Email</h3>
                <p className="text-sm text-gray-600">Bukti pembayaran telah dikirim</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Kami telah mengirimkan konfirmasi pembayaran dan e-tiket ke email Anda.</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Kirim Ulang Email →</button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bantuan</h3>
                <p className="text-sm text-gray-600">Butuh bantuan?</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Tim customer service kami siap membantu Anda 24/7.</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">Hubungi Support →</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Langkah Selanjutnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => (window.location.href = "/trains")} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900">Cari Kereta Lagi</div>
                <div className="text-sm text-gray-600">Pesan perjalanan berikutnya</div>
              </div>
            </button>

            <button onClick={() => (window.location.href = "/my-tickets")} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900">Tiket Saya</div>
                <div className="text-sm text-gray-600">Lihat semua tiket</div>
              </div>
            </button>

            <button onClick={() => (window.location.href = "/")} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900">Beranda</div>
                <div className="text-sm text-gray-600">Kembali ke halaman utama</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Terima kasih telah menggunakan layanan kami!</p>
          <p>Jika ada pertanyaan, jangan ragu untuk menghubungi customer service.</p>
        </div>
      </div>
    </div>
  );
}

function PaymentSuccessPage() {
  return (
    <BookingLayout>
      <Suspense fallback={<PaymentPageSkeleton />}>
        <PaymentSuccessContent />
      </Suspense>
    </BookingLayout>
  );
}

export default PaymentSuccessPage;
