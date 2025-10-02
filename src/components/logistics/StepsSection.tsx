'use client';

import React from 'react';

interface Step {
    number: string;
    icon: string;
    title: string;
    description: string;
}

interface StepsSectionProps {
    title?: string;
    description?: string;
    steps?: Step[];
}

const StepsSection: React.FC<StepsSectionProps> = ({
    title = "Langkah-Langkah\nMenggunakan KAI Logistik",
    description = "KAI Logistik adalah layanan pengiriman barang berbasis kereta api yang praktis, cepat, dan aman. Melalui sistem ini, Anda bisa menghitung estimasi biaya, melakukan pemesanan, melacak paket secara real-time, hingga memantau riwayat pengiriman dalam satu platform.",
    steps = [
        {
            number: "01",
            icon: "/ic_logistic_step1.svg",
            title: "Price Simulation",
            description: "Masukkan Asal, Tujuan, Berat, Dan Volume Barang Anda Untuk Menghitung Estimasi Biaya Pengiriman Secara Otomatis."
        },
        {
            number: "02",
            icon: "/ic_logistic_step2.svg",
            title: "Booking",
            description: "Lengkapi Detail Pengirim Dan Penerima Serta Deskripsi Barang Yang Akan Dikirim. Setelah Itu Lakukan Pemesanan."
        },
        {
            number: "03",
            icon: "/ic_logistic_step3.svg",
            title: "Tracking",
            description: "Pantau Perjalanan Paket Anda Secara Real-Time Dengan Memasukkan Nomor Resi Di Fitur Pelacakan."
        },
        {
            number: "04",
            icon: "/ic_logistic_step4.svg",
            title: "Selesai",
            description: "Lihat Riwayat Pengiriman Anda Sebelumnya Untuk Memantau Status Paket Yang Sudah Berhasil Dikirim."
        }
    ]
}) => {
    return (
        <div className="container mx-auto px-8 py-16">
            <div className="grid grid-cols-2 gap-16 items-start">
                {/* Left Side */}
                <div className="flex flex-col justify-center h-full">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {title.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line.includes('KAI Logistik') ? (
                                    <>
                                        {line.split('KAI Logistik')[0]}
                                        <span className="bg-gradient-to-br from-[#5c2ca4] to-[#dd577a] bg-clip-text text-transparent">
                                            KAI Logistik
                                        </span>
                                        {line.split('KAI Logistik')[1]}
                                    </>
                                ) : (
                                    line
                                )}
                                {index < title.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Right Side - Steps */}
                <div className="">
                    {steps.map((step, index) => (
                        <div key={index} className={`flex items-start gap-6 ${index < steps.length - 1 ? 'border-b border-black' : ''}`}>
                            <div className="text-4xl font-bold text-gray-900">{step.number}</div>
                            <div className="flex items-start gap-4 border-l border-black pl-4">
                                <img src={step.icon} alt={step.title} className="w-12 h-12 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepsSection;