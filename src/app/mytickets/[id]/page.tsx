"use client";

import React from 'react';
import NavBarServices from '@/components/navbar/NavBarServices';

const MyTicketDetailPage: React.FC = () => {

    const ticket = { id: 'TKT-240156789', trainName: 'ARGO BROMO ANGREK', date: '15 Jan 2024', duration: '7j 30m', passenger: 'Ahmad Rizki Pratama', car: 'EKS-2', seat: '12A', class: 'Eksekutif', totalPrice: 'Rp 355.000' };

    const onDetail = () => {
        console.log('View details for ticket', ticket.id);
    };

    const getCellFilled = (index: number): boolean => {
        const seed = ticket.id.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0) + index;
        return (seed % 2) === 0;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <NavBarServices service="" />

            <main className="max-w-6xl mx-auto p-8">
                <h1 className="text-2xl font-semibold mb-2 text-black">Tiket Kereta Saya</h1>
                <p className="text-gray-600 mb-6">Detail perjalanan kereta api Anda</p>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {/* Ticket Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                                    <img src="/ic_train.svg" alt="Train" className="w-5 h-5" />
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
                                <div className="flex items-center justify-between gap-5 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="text-start">
                                            <div className="font-semibold text-gray-900">JAKARTA (GMR)</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-end">
                                            <div className="font-semibold text-gray-900">SURABAYA (SBY)</div>
                                        </div>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-6 mx-7">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-600 mb-3">JAKARTA (GMR)</div>
                                        <div className="font-bold text-2xl text-gray-900 mb-3">08:00</div>
                                        <div className="text-xs text-gray-500 mb-3">{ticket.date}</div>
                                    </div>

                                    {/* Journey Line */}
                                    <div className="flex-1 px-4">
                                        <div className="flex items-center">
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                            <div className="px-3">
                                                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">{ticket.duration}</div>
                                            </div>
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                        </div>
                                        <div className="flex items-center justify-center mt-2">
                                            <img src="/ic_train_blue.svg" alt="Train" className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-sm text-gray-600 mb-3">SURABAYA (SBY)</div>
                                        <div className="font-bold text-2xl text-gray-900 mb-3">15:30</div>
                                        <div className="text-xs text-gray-500 mb-3">{ticket.date}</div>
                                    </div>
                                </div>

                                {/* Passenger & Seat Details */}
                                <div className="grid grid-cols-4 gap-4 text-sm w-full">
                                    <div>
                                        <div className="text-gray-500">Penumpang</div>
                                        <div className="font-semibold text-gray-900">{ticket.passenger}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Gerbong</div>
                                        <div className="font-semibold text-gray-900">{ticket.car}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Tempat Duduk</div>
                                        <div className="font-semibold text-gray-900">{ticket.seat}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Kelas</div>
                                        <div className="font-semibold text-gray-900">{ticket.class}</div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mt-6 flex justify-end">
                                    <button onClick={onDetail} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">Lihat Detail</button>
                                </div>
                            </div>

                            {/* Payment Summary & QR */}
                            <div className="border-l border-gray-200 pl-6">
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-4">Detail Pembayaran</h4>
                                    <div className="space-y-2 text-sm mb-6">
                                        <div className="flex justify-between"><span className="text-gray-600">Harga Tiket</span><span className="text-black">Rp 350.000</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">Biaya Admin</span><span className="text-black">Rp 5.000</span></div>
                                        <div className="border-t border-gray-200 pt-2 border-b pb-2 flex justify-between font-semibold"><span className="text-black">Total</span><span className="text-blue-600">{ticket.totalPrice}</span></div>
                                    </div>

                                    {/* QR Code Placeholder */}
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-gray-100 mx-auto mb-2 rounded-lg flex items-center justify-center">
                                            <div className="w-20 h-20 bg-black/10 rounded grid grid-cols-4 gap-0.5 p-1">
                                                {Array.from({ length: 16 }).map((_, i) => (
                                                    <div key={i} className={`rounded-sm ${getCellFilled(i) ? 'bg-black' : 'bg-transparent'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">Scan untuk validasi</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Kelola Tiket</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 flex flex-col items-center justify-center text-center transition">
                                <img src="/ic_switch_blue.svg" alt="WiFi" />
                                <div className="text-sm text-gray-800">Transfer Tiket</div>
                            </div>

                            <div className="bg-red-50 hover:bg-red-100 rounded-lg p-6 flex flex-col items-center justify-center text-center transition">
                                <img src="/ic_cancel.svg" alt="Pembatalan" />
                                <div className="text-sm text-gray-800">Pembatalan</div>
                            </div>

                            <div className="bg-yellow-50 hover:bg-yellow-100 rounded-lg p-6 flex flex-col items-center justify-center text-center transition">
                                <div className="mb-3 text-orange-500">
                                    <img src="/ic_reschedule_orange.svg" alt="Reschedule" />
                                </div>
                                <div className="text-sm text-gray-800">Reschedule</div>
                            </div>

                            <div className="bg-green-50 hover:bg-green-100 rounded-lg p-6 flex flex-col items-center justify-center text-center transition">
                                <img src="/ic_change_seat.svg" alt="Ganti Kursi" />
                                <div className="text-sm text-gray-800">Ganti Kursi</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-3 hover:from-blue-700 hover:to-purple-700 transition">
                                <img src="/ic_print.svg" alt="Print" />
                                Cetak E-Boarding Pass
                            </button>

                            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg>
                                Tambah Penumpang Bayi
                            </button>
                        </div>
                    </div>
                </div>
            </main>

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

export default MyTicketDetailPage;
