"use client";

import React from "react";
import CreditCardForm from "./CreditCardForm";

interface PaymentMethodSelectorProps {
  activePaymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  selectedSpecificMethod?: string | null;
  onSpecificMethodChange?: (method: string) => void;
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

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  activePaymentMethod,
  onPaymentMethodChange,
  selectedSpecificMethod,
  onSpecificMethodChange,
  cardNumber,
  cardName,
  expiryDate,
  cvv,
  promoCode,
  onCardNumberChange,
  onCardNameChange,
  onExpiryDateChange,
  onCvvChange,
  onPromoCodeChange,
}) => {
  const bankTransferMethods = [
    { id: "bca_va", name: "BCA Virtual Account", icon: "/ic_legal_dark.svg", description: "Transfer via ATM/Mobile Banking BCA" },
    { id: "bni_va", name: "BNI Virtual Account", icon: "/ic_legal_dark.svg", description: "Transfer via ATM/Mobile Banking BNI" },
    { id: "bri_va", name: "BRI Virtual Account", icon: "/ic_legal_dark.svg", description: "Transfer via ATM/Mobile Banking BRI" },
    { id: "mandiri_va", name: "Mandiri Virtual Account", icon: "/ic_legal_dark.svg", description: "Transfer via ATM/Mobile Banking Mandiri" },
    { id: "permata_va", name: "Permata Virtual Account", icon: "/ic_legal_dark.svg", description: "Transfer via ATM/Mobile Banking Permata" },
    { id: "other_va", name: "Bank Lainnya", icon: "/ic_legal_dark.svg", description: "ATM Bersama, Prima, Alto" },
  ];

  const eWalletMethods = [
    { id: "gopay", name: "GoPay", icon: "/ic_ewallet_purple.svg", description: "Bayar dengan saldo GoPay" },
    { id: "shopeepay", name: "ShopeePay", icon: "/ic_ewallet_purple.svg", description: "Bayar dengan saldo ShopeePay" },
  ];

  const qrisMethods = [{ id: "qris", name: "QRIS", icon: "/ic_qris_green.svg", description: "Scan QR Code untuk bayar dari semua e-wallet dan mobile banking" }];
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-black mb-6">Metode Pembayaran</h2>

      {/* Payment Tabs */}
      <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => onPaymentMethodChange("credit")}
          className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${activePaymentMethod === "credit" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <img src="/ic_credit_card.svg" alt="Kartu Kredit/Debit" className="w-4 h-4" />
          Kartu Kredit/Debit
        </button>
        <button
          onClick={() => onPaymentMethodChange("transfer")}
          className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${activePaymentMethod === "transfer" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <img src="/ic_legal.svg" alt="Transfer Bank" />
          Transfer Bank
        </button>
        <button
          onClick={() => onPaymentMethodChange("ewallet")}
          className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${activePaymentMethod === "ewallet" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <img src="/ic_ewallet.svg" alt="E-Wallet" />
          E-Wallet
        </button>
        <button
          onClick={() => onPaymentMethodChange("qris")}
          className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${activePaymentMethod === "qris" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <img src="/ic_qris.svg" alt="QRIS" className="w-4 h-4" />
          QRIS
        </button>
      </div>

      {/* Credit Card Form */}
      {activePaymentMethod === "credit" && (
        <CreditCardForm
          cardNumber={cardNumber}
          cardName={cardName}
          expiryDate={expiryDate}
          cvv={cvv}
          promoCode={promoCode}
          onCardNumberChange={onCardNumberChange}
          onCardNameChange={onCardNameChange}
          onExpiryDateChange={onExpiryDateChange}
          onCvvChange={onCvvChange}
          onPromoCodeChange={onPromoCodeChange}
        />
      )}

      {activePaymentMethod === "transfer" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">Pilih bank untuk transfer virtual account:</p>
          {bankTransferMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 ${selectedSpecificMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              onClick={() => onSpecificMethodChange?.(method.id)}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedSpecificMethod === method.id ? "border-blue-500" : "border-gray-300"}`}>
                {selectedSpecificMethod === method.id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              <img src={method.icon} alt={method.name} className="w-8 h-8" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activePaymentMethod === "ewallet" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">Pilih e-wallet untuk pembayaran:</p>
          {eWalletMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 ${selectedSpecificMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              onClick={() => onSpecificMethodChange?.(method.id)}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedSpecificMethod === method.id ? "border-blue-500" : "border-gray-300"}`}>
                {selectedSpecificMethod === method.id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              <img src={method.icon} alt={method.name} className="w-8 h-8" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activePaymentMethod === "qris" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">Bayar dengan QRIS dari semua e-wallet dan mobile banking:</p>
          {qrisMethods.map((method) => (
            <div key={method.id} className="flex items-center gap-4 p-4 rounded-xl border border-blue-200 bg-blue-50">
              <img src={method.icon} alt={method.name} className="w-8 h-8" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <div className="text-sm font-medium text-blue-600">Tersedia</div>
            </div>
          ))}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Cara Pembayaran QRIS:</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Klik "Bayar Sekarang" untuk melanjutkan</li>
              <li>2. Scan QR Code yang muncul dengan aplikasi e-wallet atau mobile banking</li>
              <li>3. Konfirmasi pembayaran di aplikasi Anda</li>
              <li>4. Pembayaran akan diproses secara otomatis</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
