"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Stepper from '@/components/logistics/Stepper';
import NavBarServices from '@/components/navbar/NavBarServices';
import PriceForm from '@/components/logistics/simulation/PriceForm';
import FileUploadCard from '@/components/logistics/simulation/FileUploadCard';
import EstimatedCost from '@/components/logistics/simulation/EstimatedCost';

const LogisticsPriceSimulationPage = () => {
    const router = useRouter();

    function goToBooking() {
        router.push('/logistic/booking');
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <NavBarServices service="Logistics" />
            <main className="max-w-6xl mx-auto p-4 md:p-8">
                <Stepper currentStep={1} />
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#ebf8ff] text-white">
                            <img src="/ic_calculator.svg" alt="icon" className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Price Simulation</h3>
                    </div>
                    <PriceForm />
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto Barang</label>
                        <div className="flex items-center p-3 text-sm text-yellow-800 bg-yellow-50 rounded-lg" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <div>Ambil foto barangmu, biar AI langsung analisis dan prediksi ongkos kirimnya.</div>
                        </div>
                        <FileUploadCard />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">ISI TEKS DI SINI JIKA ADA JAWABAN DARI AI</label>
                    </div>

                    <button
                        type="button"
                        onClick={() => { }}
                        className="w-full py-3 rounded-lg text-white font-semibold bg-[#3b82f6] hover:from-[#316ce6] hover:to-[#7c4dff] transition-colors"
                    >
                        Calculate Price
                    </button>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">

                    <EstimatedCost />
                    <button
                        onClick={goToBooking}
                        className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-b from-[#6b46c1] to-[#3b82f6] hover:opacity-95 mt-6 flex items-center justify-center gap-2"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Selanjutnya
                            <img src="/ic_arrow_right.svg" alt="" className="h-4 w-4" />
                        </span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LogisticsPriceSimulationPage;