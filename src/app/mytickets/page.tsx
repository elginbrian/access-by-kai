"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const MyTicketsPage: React.FC = () => {
    const router = useRouter();

    const services = [
        {
            icon: '/ic_meal.svg',
            title: 'Makanan Tambahan',
            description: 'Pesan makanan khusus untuk perjalanan Anda',
            link: 'Lihat Menu'
        },
        {
            icon: '/ic_e_porter.svg',
            title: 'E - Porter',
            description: 'Tambah keamanan bagasi untuk kebutuhan Anda',
            link: 'Pesan Bagasi'
        },
        {
            icon: '/ic_shower.svg',
            title: 'Shower Locker & Luxury Lounge',
            description: 'Pesan fasilitas tambah untuk kenyamanan Anda',
            link: 'Lihat Opsi'
        }
    ];

    const tickets = [
        {
            id: 'TKT-240156789',
            trainName: 'ARGO BROMO ANGREK',
            trainNumber: 'Kereta Api Eksekutif',
            route: 'JAKARTA (GMR) → SURABAYA (SBY)',
            time: '08:00 → 15:30',
            date: '15 Jan 2024',
            duration: '7j 30m',
            passenger: 'Ahmad Rizki Pratama',
            car: 'EKS-2',
            seat: '12A',
            class: 'Eksekutif',
            totalPrice: 'Rp 355.000',
            qrCode: '/qr_code_sample.png'
        },
        {
            id: 'TKT-240156789',
            trainName: 'ARGO BROMO ANGREK',
            trainNumber: 'Kereta Api Eksekutif',
            route: 'JAKARTA (GMR) → SURABAYA (SBY)',
            time: '08:00 → 15:30',
            date: '15 Jan 2024',
            duration: '7j 30m',
            passenger: 'Ahmad Rizki Pratama',
            car: 'EKS-2',
            seat: '12A',
            class: 'Eksekutif',
            totalPrice: 'Rp 355.000',
            qrCode: '/qr_code_sample.png'
        }
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 9.36 9 10.93 5.16-1.57 9-5.38 9-10.93V7l-10-5z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">RailTravel</span>
                        </div>

                        {/* Right side navigation */}
                        <div className="flex items-center space-x-6">
                            <button className="text-gray-600 hover:text-gray-900 transition-colors">Beranda</button>
                            <button className="text-blue-600 font-medium">Tiket Saya</button>
                            <button className="text-gray-600 hover:text-gray-900 transition-colors">Riwayat</button>

                            {/* User Profile */}
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">AR</span>
                                </div>
                                <span className="text-gray-700 font-medium">Ahmad Rizki</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Tambah Layanan</h1>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <img src={service.icon} alt={service.title} className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                                {service.link}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tiket Kereta Saya</h2>
                    <p className="text-gray-600 mb-6">Detail perjalanan kereta api Anda</p>
                </div>

                {/* Ticket Cards */}
                <div className="space-y-6">
                    {tickets.map((ticket, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                            {/* Ticket Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2L2 7v10c0 5.55 3.84 9.36 9 10.93 5.16-1.57 9-5.38 9-10.93V7l-10-5z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold">{ticket.trainName}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm opacity-90">No. Tiket</div>
                                        <div className="font-mono font-semibold">{ticket.id}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Journey Details */}
                                    <div className="lg:col-span-2">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-3 h-3 bg-green-500 rounded-full self-start"></div>
                                            {/* Departure */}
                                            <div className="text-center">
                                                <div className="font-bold text-2xl text-gray-900">08:00</div>
                                                <div className="text-sm text-gray-600">JAKARTA (GMR)</div>
                                                <div className="text-xs text-gray-500">{ticket.date}</div>
                                            </div>

                                            {/* Journey Line */}
                                            <div className="flex-1 px-4">
                                                <div className="flex items-center">
                                                    <div className="flex-1 h-px bg-gray-300"></div>
                                                    <div className="px-3">
                                                        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                                                            {ticket.duration}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 h-px bg-gray-300"></div>
                                                </div>
                                                <div className="flex items-center justify-center mt-2">
                                                    <img src="/ic_train_blue.svg" alt="Train" className="w-6 h-6" />
                                                </div>
                                            </div>

                                            {/* Arrival */}
                                            <div className="text-center">
                                                <div className="font-bold text-2xl text-gray-900">15:30</div>
                                                <div className="text-sm text-gray-600">SURABAYA (SBY)</div>
                                                <div className="text-xs text-gray-500">{ticket.date}</div>
                                            </div>
                                            <div className="w-3 h-3 bg-red-500 rounded-full self-start"></div>
                                        </div>

                                        {/* Passenger & Seat Details */}
                                        <div className="grid grid-cols-4 gap-4 text-sm w-full">
                                            <div>
                                                <div className="text-gray-500">Penumpang</div>
                                                <div className="font-semibold text-gray-900">{ticket.passenger}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Terminal Tujuan</div>
                                                <div className="font-semibold text-gray-900">{ticket.seat}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Gerbong</div>
                                                <div className="font-semibold text-gray-900">{ticket.car}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Kelas</div>
                                                <div className="font-semibold text-gray-900">{ticket.class}</div>
                                            </div>
                                        </div>
                                        {/* Action Button */}
                                        <div className="mt-6 flex justify-end">
                                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>

                                    {/* Payment Summary & QR */}
                                    <div className="border-l border-gray-200 pl-6">
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-4">Detail Pembayaran</h4>
                                            <div className="space-y-2 text-sm mb-6">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Harga Tiket</span>
                                                    <span className="text-black">Rp 350.000</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Biaya Admin</span>
                                                    <span className="text-black">Rp 5.000</span>
                                                </div>
                                                <div className="border-t border-gray-200 pt-2 border-b pb-2 flex justify-between font-semibold">
                                                    <span className="text-black">Total</span>
                                                    <span className="text-blue-600">{ticket.totalPrice}</span>
                                                </div>
                                            </div>

                                            {/* QR Code */}
                                            <div className="text-center">
                                                <div className="w-24 h-24 bg-gray-100 mx-auto mb-2 rounded-lg flex items-center justify-center">
                                                    <div className="w-20 h-20 bg-black/10 rounded grid grid-cols-4 gap-0.5 p-1">
                                                        {Array.from({ length: 16 }).map((_, i) => (
                                                            <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500">Scan untuk validasi</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 9.36 9 10.93 5.16-1.57 9-5.38 9-10.93V7l-10-5z" />
                        </svg>
                        <span className="font-bold">RailTravel</span>
                    </div>
                    <p className="text-gray-400 text-sm">© 2024 RailTravel. Semua hak cipta dilindungi.</p>
                </div>
            </footer>
        </div>
    );
};

export default MyTicketsPage;
