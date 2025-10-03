"use client";

import React, { useState } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import PassengerCard, { PassengerData } from '@/components/profile/PassengerCard';
import PassengerInfoBox from '@/components/profile/PassengerInfoBox';
import { colors } from '@/app/design-system/colors';
import type { Pengguna } from '@/types/models';

interface Props {
  profile: Pengguna;
}

const ManagePassengersPageClient: React.FC<Props> = ({ profile }) => {
    const [passengers, setPassengers] = useState<PassengerData[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            gender: 'Dewasa',
            idType: 'KTP',
            idNumber: '3171234567890123',
            birthDate: '15 Maret 1990',
            isMain: true
        },
        {
            id: '2',
            name: 'Emma Johnson',
            gender: 'Anak',
            idType: 'KTP',
            idNumber: '3171234567890124',
            birthDate: '20 Juli 2015'
        },
        {
            id: '3',
            name: 'Michael Johnson',
            gender: 'Dewasa',
            idType: 'KTP',
            idNumber: '3171234567890125',
            birthDate: '10 Januari 1988'
        },
        {
            id: '4',
            name: 'Baby Johnson',
            gender: 'Anak',
            idType: 'Akta Lahir',
            idNumber: '123456789',
            birthDate: '5 Mei 2023'
        }
    ]);

    const handleAddPassenger = () => {
        if (passengers.length < 8) {
            // This would typically open a form modal or navigate to add passenger page
        }
    };

    const handleEditPassenger = (passenger: PassengerData) => {
        // This would typically open edit form modal or navigate to edit page
    };

    const handleDeletePassenger = (passengerId: string) => {
        const passenger = passengers.find(p => p.id === passengerId);
        if (passenger && window.confirm(`Apakah Anda yakin ingin menghapus data penumpang "${passenger.name}"?`)) {
            setPassengers(prev => prev.filter(p => p.id !== passengerId));
        }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: colors.base.lightHover }}>
            {/* Sidebar - hidden on mobile */}
            <div className="hidden lg:block">
                <ProfileSidebar
                    profile={profile}
                    kaiPayBalance={125000}
                    railPointBalance={2450}
                />
            </div>

            {/* Main content */}
            <div className="flex-1 lg:ml-80 bg-[#f9fafb]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: colors.base.darker }}>
                                        Daftar Penumpang
                                    </h1>
                                    <p className="text-base sm:text-lg" style={{ color: colors.base.darkActive }}>
                                        Kelola data penumpang untuk pemesanan tiket
                                    </p>
                                </div>

                                <button
                                    onClick={handleAddPassenger}
                                    disabled={passengers.length >= 8}
                                    className="flex items-center justify-center gap-3 px-4 sm:px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
                                    style={{
                                        background: passengers.length >= 8
                                            ? colors.base.disabled
                                            : `linear-gradient(135deg, ${colors.blue.normal} 0%, ${colors.blue.darker} 100%)`,
                                        boxShadow: passengers.length >= 8
                                            ? 'none'
                                            : '0 4px 12px rgba(74, 144, 226, 0.25)'
                                    }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="hidden sm:inline">Tambah Penumpang Baru</span>
                                    <span className="sm:hidden">Tambah Penumpang</span>
                                </button>
                            </div>
                        </div>

                        {/* Passenger Cards */}
                        <div className="space-y-4 mb-8">
                            {passengers.length > 0 ? (
                                passengers.map((passenger) => (
                                    <div key={passenger.id}>
                                        <PassengerCard
                                            passenger={passenger}
                                            onEdit={handleEditPassenger}
                                            onDelete={handleDeletePassenger}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.base.darker }}>
                                        Belum ada data penumpang
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Tambah data penumpang untuk memudahkan pemesanan tiket
                                    </p>
                                    <button
                                        onClick={handleAddPassenger}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.blue.normal} 0%, ${colors.blue.darker} 100%)`,
                                            boxShadow: '0 4px 12px rgba(74, 144, 226, 0.25)'
                                        }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Tambah Penumpang Pertama
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div>
                            <PassengerInfoBox />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagePassengersPageClient;