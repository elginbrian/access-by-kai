"use client";

import React from "react";
import InputField from "@/components/input/InputField";

interface CreditCardFormProps {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  promoCode: string;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvvChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPromoCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ cardNumber, cardName, expiryDate, cvv, promoCode, onCardNumberChange, onCardNameChange, onExpiryDateChange, onCvvChange, onPromoCodeChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Nomor Kartu</label>
          <div className="relative">
            <InputField label="1234 5678 9012 3456" type="text" inputMode="numeric" pattern="[0-9]*" value={cardNumber} onChange={onCardNumberChange} maxLength={16} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <img src="/ic_visa_blue.svg" alt="Visa" />
              <img src="/ic_mastercard_red.svg" alt="MasterCard" />
            </div>
          </div>
        </div>

        {/* Card Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Nama Pemegang Kartu</label>
          <InputField label="Nama sesuai kartu" type="text" value={cardName} onChange={onCardNameChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Tanggal Kadaluarsa</label>
          <InputField label="MM/YY" type="text" inputMode="numeric" pattern="[0-9/]*" value={expiryDate} onChange={onExpiryDateChange} />
        </div>
        {/* CVV */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">CVV</label>
          <div className="relative">
            <InputField label="123" type="text" inputMode="numeric" pattern="[0-9]*" value={cvv} onChange={onCvvChange} maxLength={3} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div>
        <label className="block text-sm font-medium text-black mb-2 border-t border-gray-200 pt-4">Kode Promo (Opsional)</label>
        <div className="flex gap-3">
          <InputField label="Masukkan kode promo" type="text" value={promoCode} onChange={onPromoCodeChange} />
          <button className="px-6 py-3 bg-gray-100 text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">Terapkan</button>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
