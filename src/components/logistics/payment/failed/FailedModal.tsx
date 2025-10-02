"use client";

import React from 'react';
import Button from '@/components/button/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onRetry?: () => void;
};

const FailedModal: React.FC<Props> = ({ open, onClose, onRetry }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-lg max-w-2xl w-full mx-4 p-8">
        <h2 className="text-2xl font-semibold text-center text-red-600">✖ Booking Gagal</h2>

        <div className="mt-6 flex flex-col items-center gap-6">
          <img src="/img_logist_pay_failed.png" alt="booking failed" className="w-56 h-40 object-contain" />

          <p className="text-center text-sm text-gray-700 max-w-2xl">
            Mohon maaf, terjadi kendala saat memproses pesanan Anda. Hal ini bisa disebabkan oleh koneksi internet yang tidak stabil atau format data yang tidak sesuai.
          </p>

          <div className="w-full bg-red-50 border border-red-200 p-4 rounded text-sm text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>Jika Anda terus mengalami masalah, silakan hubungi tim dukungan kami untuk bantuan.</div>
          </div>

          <div className="w-full flex justify-center">
            <Button onClick={onRetry} variant="active" className="px-8 py-3 rounded-full bg-red-600 text-white w-full">Coba Lagi</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailedModal;
