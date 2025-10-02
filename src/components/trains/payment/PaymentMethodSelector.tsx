'use client';

import React from 'react';
import CreditCardForm from './CreditCardForm';

interface PaymentMethodSelectorProps {
    activePaymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
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
    cardNumber,
    cardName,
    expiryDate,
    cvv,
    promoCode,
    onCardNumberChange,
    onCardNameChange,
    onExpiryDateChange,
    onCvvChange,
    onPromoCodeChange
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-black mb-6">Metode Pembayaran</h2>

            {/* Payment Tabs */}
            <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => onPaymentMethodChange('credit')}
                    className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${activePaymentMethod === 'credit'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <img src="/ic_credit_card.svg" alt="Kartu Kredit/Debit" className="w-4 h-4" />
                    Kartu Kredit/Debit
                </button>
                <button
                    onClick={() => onPaymentMethodChange('transfer')}
                    className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${activePaymentMethod === 'transfer'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <img src="/ic_legal.svg" alt="Transfer Bank" />
                    Transfer Bank
                </button>
                <button
                    onClick={() => onPaymentMethodChange('ewallet')}
                    className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${activePaymentMethod === 'ewallet'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <img src="/ic_ewallet.svg" alt="E-Wallet" />
                    E-Wallet
                </button>
                <button
                    onClick={() => onPaymentMethodChange('qris')}
                    className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${activePaymentMethod === 'qris'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <img src="/ic_qris.svg" alt="QRIS" className="w-4 h-4" />
                    QRIS
                </button>
            </div>

            {/* Credit Card Form */}
            {activePaymentMethod === 'credit' && (
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
        </div>
    );
};

export default PaymentMethodSelector;