"use client";

import React from "react";

export interface PaymentOption {
  id: string;
  label: string;
  description: string;
  descriptionColor?: string;
  warningIcon?: string;
}

interface PaymentOptionsCardProps {
  title?: string;
  options?: PaymentOption[];
  selectedPayment: string;
  onPaymentChange: (paymentId: string) => void;
  infoText?: string;
}

const PaymentOptionsCard: React.FC<PaymentOptionsCardProps> = ({
  title = "Pilihan Pembayaran",
  options,
  selectedPayment,
  onPaymentChange,
  infoText
}) => {
  const defaultOptions: PaymentOption[] = [
    {
      id: "cash",
      label: "Bayar Sekarang",
      description: "Diskon khusus tersedia",
      descriptionColor: "text-green-500"
    },
    {
      id: "later",
      label: "Bayar Nanti",
      description: "Reservasi booking direstul",
      descriptionColor: "text-gray-500"
    },
    {
      id: "offline",
      label: "Bayar Dekat Tanggal",
      description: "Ketersediaan terbatas",
      descriptionColor: "text-yellow-600",
      warningIcon: "/ic_warning_yellow.svg"
    }
  ];

  const defaultInfoText = `Termasuk fasilitas, tidak dapat melakukan
konfirmasi sebelum H-1 hari penyewaan. Jika
melebihi jam, silakan kunjungi dekat tanggal, layarr
konsultan atau telah berhubungan harga harus
hingat.`;

  const displayOptions = options || defaultOptions;
  const displayInfoText = infoText || defaultInfoText;

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-4 text-black">{title}</h3>

      <div className="space-y-3">
        {displayOptions.map((option) => (
          <label key={option.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={selectedPayment === option.id}
              onChange={(e) => onPaymentChange(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <div className="font-medium text-sm text-black">{option.label}</div>
              <div className={`text-xs flex items-center gap-2 ${option.descriptionColor || "text-gray-500"}`}>
                {option.warningIcon && (
                  <img src={option.warningIcon} alt="Warning" className="w-3 h-3" />
                )}
                {option.description}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2 border-b-2 border-yellow-200 pb-2">
          <img src="/ic_info_yellow.svg" alt="Info" className="w-4 h-4" />
          <span className="font-medium text-sm text-black">Info Penting</span>
        </div>
        <p className="text-xs text-gray-700">
          {displayInfoText}
        </p>
      </div>
    </div>
  );
};

export default PaymentOptionsCard;