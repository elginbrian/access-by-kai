'use client';

import React from 'react';

interface PaymentSummaryProps {
    ticketPrice: number;
    adminFee: number;
    insurance: number;
    total: number;
    formatPrice: (price: number) => string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
    ticketPrice,
    adminFee,
    insurance,
    total,
    formatPrice
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border sticky top-6 h-fit">
            <h2 className="text-xl font-bold text-black mb-6">Ringkasan Pembayaran</h2>

            {/* Price Breakdown */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-black">
                    <span>Tiket Kereta (2x)</span>
                    <span className="font-semibold">{formatPrice(ticketPrice)}</span>
                </div>
                <div className="flex justify-between text-black">
                    <span>Biaya Admin</span>
                    <span className="font-semibold">{formatPrice(adminFee)}</span>
                </div>
                <div className="flex justify-between text-black">
                    <span>Asuransi Perjalanan</span>
                    <span className="font-semibold">{formatPrice(insurance)}</span>
                </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-black">Total</span>
                    <span className="text-xl font-bold text-blue-600">{formatPrice(total)}</span>
                </div>
            </div>

            {/* Pay Now Button */}
            <button className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg flex items-center justify-center gap-2 mb-4">
                <img src="/ic_lock.svg" alt="" />
                <span>Bayar Sekarang</span>
            </button>

            {/* Security Badge */}
            <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <img src="/ic_shield.svg" alt="Keamanan" />
                    <div>
                        <div className="font-semibold text-green-800 text-sm mb-1">
                            Pembayaran Anda terenkripsi dan aman
                        </div>
                        <div className="text-xs text-green-700">
                            Dilindungi dengan teknologi SSL 256-bit
                        </div>
                    </div>
                </div>
            </div>

            {/* Accepted Payment Methods */}
            <div className="mt-6">
                <div className="text-xs text-gray-500 text-center mb-3 border-t border-gray-200 pt-3">
                    Metode pembayaran yang diterima
                </div>
                <div className="flex justify-center items-center gap-2 flex-wrap">
                    <img src="/ic_visa_blue.svg" alt="Visa" />
                    <img src="/ic_mastercard_red.svg" alt="MasterCard" />
                    <img src="/ic_legal_dark.svg" alt="Bank" />
                    <img src="/ic_ewallet_purple.svg" alt="E-Wallet" />
                    <img src="/ic_qris_green.svg" alt="QRIS" />
                </div>
            </div>
        </div>
    );
};

export default PaymentSummary;