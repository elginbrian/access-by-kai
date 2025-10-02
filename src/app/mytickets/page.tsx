"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import MyTicketsHeader from '@/components/mytickets/MyTicketsHeader';
import ServiceCard from '@/components/mytickets/ServiceCard';
import TicketCard from '@/components/mytickets/TicketCard';
import InputField from '@/components/input/InputField';

const MyTicketsPage: React.FC = () => {
    const router = useRouter();

    const services = [
        { icon: '/ic_meal_blue.svg', title: 'Makanan Tambahan', description: 'Pesan makanan khusus untuk perjalanan Anda', link: 'Lihat Menu' },
        { icon: '/ic_luggage_blue.svg', title: 'E - Porter', description: 'Tambah keamanan bagasi untuk kebutuhan Anda', link: 'Pesan Bagasi' },
        { icon: '/ic_car.svg', title: 'Shower Locker & Luxury Lounge', description: 'Pesan fasilitas tambah untuk kenyamanan Anda', link: 'Lihat Opsi' }
    ];

    const tickets = [
        { id: 'TKT-240156789', trainName: 'ARGO BROMO ANGREK', date: '15 Jan 2024', duration: '7j 30m', passenger: 'Ahmad Rizki Pratama', car: 'EKS-2', seat: '12A', class: 'Eksekutif', totalPrice: 'Rp 355.000' },
        { id: 'TKT-240156789', trainName: 'ARGO BROMO ANGREK', date: '15 Jan 2024', duration: '7j 30m', passenger: 'Ahmad Rizki Pratama', car: 'EKS-2', seat: '12A', class: 'Eksekutif', totalPrice: 'Rp 355.000' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <MyTicketsHeader userName="Ahmad Rizki" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs + Search */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-[#7c53f0] text-white font-medium shadow-sm">Kereta Jarak Jauh</button>
                        <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400">Kereta lokal</button>
                        <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400">Kereta Bandara</button>
                        <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400">Whoosh</button>
                        <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400">LRT</button>
                    </div>

                    <div className="w-full md:w-80">
                        <InputField
                            label="Cari tiket..."
                            placeholder="Cari tiket..."
                            className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            lefticon={
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                                </svg>
                            }
                        />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-8">Tambah Layanan</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {services.map((s, i) => (
                        <ServiceCard key={i} icon={s.icon} title={s.title} description={s.description} linkText={s.link} onClick={() => console.log('service', s.title)} />
                    ))}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tiket Kereta Saya</h2>
                    <p className="text-gray-600 mb-6">Detail perjalanan kereta api Anda</p>
                </div>

                <div className="space-y-6">
                    {tickets.map((t, i) => (
                        <TicketCard key={i} ticket={{ ...t, date: t.date, duration: t.duration }} onDetail={() => console.log('detail', t.id)} />
                    ))}
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

export default MyTicketsPage;
