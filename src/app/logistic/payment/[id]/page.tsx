"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from '@/components/logistics/Stepper';
import NavBarServices from '@/components/navbar/NavBarServices';
import Button from '@/components/button/Button';
import InputField from '@/components/input/InputField';
import SuccessModal from '@/components/logistics/payment/success/SuccessModal';
import FailedModal from '@/components/logistics/payment/failed/FailedModal';

const LogisticPaymentPage: React.FC = () => {
    const router = useRouter();

    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailed, setShowFailed] = useState(false);

    function goToTracking() {
        // In a real flow, the package ID would come from the order/payment response
        const packageId = 'KAI123456789';
        router.push(`/logistic/tracking/${packageId}`);
    }

    function handlePayNow() {
        // Simulate a successful payment flow, then show modal
        // TODO: replace with real payment integration
        // setShowSuccess(true);
        // For demo, you can toggle failure to see the failed modal instead:
        setShowSuccess(true);
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <NavBarServices service="Logistics" />
            <main className="max-w-6xl mx-auto p-4 md:p-8">
                <Stepper currentStep={3} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-black">Package Details</h3>
                            <div className="p-4 bg-[#f5f3ff] rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#6b46c1] text-white">
                                        <img src="/ic_package.svg" alt="package" className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-black">Koli - Koper</div>
                                        <div className="text-sm text-black">Jakarta (GMR) → Surabaya (SBY)</div>
                                        <div className="text-sm text-black mt-2">Berat: 12 kg • Volume: 0.06 m³</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-black">Servis: E-Porter</div>
                                        <div className="text-sm text-black">Pickup: Stasiun Gambir</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Card Number */}
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Nomor Kartu</label>
                                    <div className="relative">
                                        <InputField label="1234 5678 9012 3456" type="text" inputMode="numeric" pattern="[0-9]*" value={"cardNumber"} onChange={"onCardNumberChange"} maxLength={16} />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                            <img src="/ic_visa_blue.svg" alt="Visa" />
                                            <img src="/ic_mastercard_red.svg" alt="MasterCard" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card Name */}
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Nama Pemegang Kartu</label>
                                    <InputField label="Nama sesuai kartu" type="text" value={"cardName"} onChange={"onCardNameChange"} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Tanggal Kadaluarsa</label>
                                    <InputField label="MM/YY" type="text" inputMode="numeric" pattern="[0-9/]*" value={"expiryDate"} onChange={"onExpiryDateChange"} />
                                </div>
                                {/* CVV */}
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">CVV</label>
                                    <div className="relative">
                                        <InputField label="123" type="text" inputMode="numeric" pattern="[0-9]*" value={"cvv"} onChange={"onCvvChange"} maxLength={3} />
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
                                    <InputField label="Masukkan kode promo" type="text" value={"promoCode"} onChange={"onPromoCodeChange"} />
                                    <button className="px-6 py-3 bg-gray-100 text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">Terapkan</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h4 className="font-semibold mb-4 text-black">Ringkasan Pembayaran</h4>
                            <div className="space-y-3 text-sm text-black">
                                <div className="flex justify-between"><span>Tarif Pengiriman</span><span>Rp 150.000</span></div>
                                <div className="flex justify-between"><span>Biaya Pengambilan</span><span>Rp 25.000</span></div>
                                <div className="flex justify-between"><span>Asuransi Barang</span><span>Rp 10.000</span></div>
                            </div>
                            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                                <span className="text-black">Total</span>
                                <span className="text-[#3b82f6]">Rp 595.000</span>
                            </div>

                            <div className="mt-6">
                                <Button onClick={handlePayNow} variant="active" className="w-full py-3 rounded-full text-white bg-gradient-to-r from-[#316ce6] to-[#8b5cf6]">Bayar Sekarang</Button>
                            </div>

                            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
                                Pembayaran Anda terenkripsi dan aman
                            </div>

                            <div className="mt-6 text-center text-xs text-gray-500">
                                    Metode pembayaran yang diterima
                                </div>
                        
                            <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} onNext={goToTracking} />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default LogisticPaymentPage;
