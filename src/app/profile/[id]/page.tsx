"use client";

import React, { useMemo, useState } from 'react';
import { colors } from '@/app/design-system/colors';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileFilters from '@/components/profile/ProfileFilters';
import ProfileTicketCard from '@/components/profile/ProfileTicketCard';
import ProfilePagination from '@/components/profile/ProfilePagination';

const ProfilePage: React.FC = () => {
    const sampleTickets = [
        { id: 'KAI-2024-001', status: 'Selesai', title: 'Argo Bromo Anggrek', class: 'Eksekutif', from: 'Jakarta Gambir', to: 'Surabaya Gubeng', time: '08:00 - 20:30', price: 'Rp 750.000', people: 2, date: '15 Maret 2024' },
        { id: 'KAI-2024-002', status: 'Dibatalkan', title: 'Gajayana', class: 'Eksekutif', from: 'Jakarta Gambir', to: 'Malang', time: '19:30 - 08:45+1', price: 'Rp 650.000', people: 1, date: '12 Maret 2024' },
        { id: 'KAI-2024-003', status: 'Akan Datang', title: 'Bima', class: 'Eksekutif', from: 'Jakarta Gambir', to: 'Surabaya Pasar Turi', time: '18:00 - 05:30+1', price: 'Rp 700.000', people: 1, date: '20 Maret 2024' },
        { id: 'KAI-2024-004', status: 'Dalam Perjalanan', title: 'Bima', class: 'Eksekutif', from: 'Jakarta Gambir', to: 'Surabaya Pasar Turi', time: '18:00 - 05:30+1', price: 'Rp 700.000', people: 1, date: '20 Maret 2024' }
    ];

    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [dateRange, setDateRange] = useState('30 Hari Terakhir');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredTickets = useMemo(() => {
        const q = query.trim().toLowerCase();
        return sampleTickets.filter((t) => {
            // Status filter
            if (statusFilter !== 'Semua Status' && t.status !== statusFilter) return false;
            
            // Search filter
            if (!q) return true;
            return (
                t.id.toLowerCase().includes(q) ||
                t.title.toLowerCase().includes(q) ||
                t.from.toLowerCase().includes(q) ||
                t.to.toLowerCase().includes(q)
            );
        });
    }, [query, statusFilter]);

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: colors.base.lightHover }}>
            <ProfileSidebar />

            {/* Main content with left margin */}
            <div className="flex-1 ml-80 bg-[#f9fafb]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <section>
                        <ProfileFilters
                            selectedStatus={statusFilter}
                            onStatusChange={setStatusFilter}
                            searchQuery={query}
                            onSearchChange={(e) => setQuery(e.target.value)}
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                        />

                        <div className="space-y-6">
                            {paginatedTickets.length === 0 && (
                                <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.base.darker }}>Tidak ada tiket ditemukan</h3>
                                    <p style={{ color: colors.base.darkActive }}>Coba ubah filter pencarian Anda</p>
                                </div>
                            )}

                            {paginatedTickets.map((ticket, index) => (
                                <ProfileTicketCard
                                    key={ticket.id}
                                    ticket={ticket}
                                    index={index}
                                />
                            ))}
                        </div>

                        <ProfilePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
