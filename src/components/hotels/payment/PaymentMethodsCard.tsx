"use client";

import React from "react";

export interface PaymentTab {
  id: string;
  label: string;
  icon?: string;
}

export interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  promoCode: string;
}

export interface PaymentMethodsCardProps {
  tabs: PaymentTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  formData: PaymentFormData;
  onFormDataChange: (field: keyof PaymentFormData, value: string) => void;
  onPromoApply: () => void;
}

const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({
  tabs,
  activeTab,
  onTabChange,
  formData,
  onFormDataChange,
  onPromoApply
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 text-black">Metode Pembayaran</h2>

      {/* Payment Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-3 px-2 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            {tab.icon && <img src={tab.icon} alt={tab.label} />}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Card Form - only show when activeTab is 'card' */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Kartu
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => onFormDataChange('cardNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-2.5 flex gap-1">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Pemegang Kartu
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={(e) => onFormDataChange('cardName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Kadaluarsa
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => onFormDataChange('expiry', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => onFormDataChange('cvv', e.target.value)}
                  maxLength={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <img src="/ic_wifi.svg" alt="Info" className="absolute right-3 top-2.5 w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kode Promo (Opsional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan kode promo"
                value={formData.promoCode}
                onChange={(e) => onFormDataChange('promoCode', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={onPromoApply}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other payment method content would go here based on activeTab */}
      {activeTab === 'transfer' && (
        <div className="p-8 text-center text-gray-500">
          <p>Transfer Bank form akan ditampilkan di sini</p>
        </div>
      )}

      {activeTab === 'ewallet' && (
        <div className="p-8 text-center text-gray-500">
          <p>E-Wallet options akan ditampilkan di sini</p>
        </div>
      )}

      {activeTab === 'qris' && (
        <div className="p-8 text-center text-gray-500">
          <p>QRIS code akan ditampilkan di sini</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsCard;