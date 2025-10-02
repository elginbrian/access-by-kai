"use client";

import React from 'react';
import Button from '@/components/button/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onNext?: () => void;
};

const SuccessModal: React.FC<Props> = ({ open, onClose, onNext }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-lg max-w-2xl w-full mx-4 p-8">
        <h2 className="text-2xl font-semibold text-center text-[#6554f0]">Booking Berhasil</h2>

        <div className="mt-6 flex flex-col items-center gap-6">
          <img src="/img_logist_pay_success.png" alt="booking success" className="w-56 h-40 object-contain" />

          <p className="text-center text-sm text-gray-700 max-w-2xl">
            Terima kasih, pesanan KAI Logistik Anda sudah kami terima. Kami sedang memproses detail barang dan akan segera mengirimkan konfirmasi melalui email/SMS.
          </p>

          <div className="w-full bg-yellow-50 border-l-4 border-yellow-300 p-4 rounded text-sm text-yellow-900">
            Data Anda aman dan hanya digunakan untuk verifikasi identitas. Kami tidak akan membagikan data ini kepada pihak ketiga.
          </div>

          <div className="w-full flex justify-center">
            <Button onClick={onNext} variant="active" className="px-8 py-3 w-full rounded-full bg-gradient-to-r from-[#316ce6] to-[#8b5cf6] text-white">Selanjutnya</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
