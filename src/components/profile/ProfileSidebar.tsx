"use client";

import React from 'react';
import { colors } from '@/app/design-system/colors';

const ProfileSidebar: React.FC = () => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-80 bg-white p-6 shadow-2xl border-r border-gray-100 overflow-y-auto z-10">
            <div className="flex items-center gap-4 mb-8">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.redPurple.normal} 100%)` }}
                >
                    JD
                </div>
                <div>
                    <div className="font-bold text-lg" style={{ color: colors.base.darker }}>John Doe</div>
                    <div className="text-sm" style={{ color: colors.base.darkActive }}>john.doe@email.com</div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div
                    className="text-white rounded-xl p-5 shadow-lg"
                    style={{
                        background: `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`,
                        boxShadow: '0 8px 24px rgba(74, 144, 226, 0.25)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <img src="/ic_ewallet_white.svg" alt="Kai Pay" className="w-4 h-4" />
                        <div className="text-sm">Kai Pay</div>
                    </div>
                    <div className="text-2xl font-bold mt-2">Rp. 125.000</div>
                </div>

                <div
                    className="text-white rounded-xl p-5 shadow-lg"
                    style={{
                        background: `linear-gradient(135deg, #f97316 0%, #ea580c 100%)`,
                        boxShadow: '0 8px 24px rgba(252, 187, 108, 0.25)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <img src="/ic_star_white.svg" alt="RaiPoint" className="w-4 h-4" />
                        <div className="text-sm">RaiPoint</div>
                    </div>
                    <div className="text-2xl font-bold mt-2">2,450</div>
                </div>
            </div>

            <nav className="space-y-2">
                <button
                    aria-current="page"
                    className="w-full text-left px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                    style={{
                        background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`,
                        boxShadow: '0 4px 12px rgba(92, 44, 173, 0.25)'
                    }}
                >
                    Riwayat Tiket
                </button>
                <button
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01] border border-gray-100"
                    style={{ color: colors.base.darker }}
                >
                    Ganti Kata Sandi
                </button>
                <button
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01] border border-gray-100"
                    style={{ color: colors.base.darker }}
                >
                    Daftar Penumpang
                </button>
                <button
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01] border border-gray-100"
                    style={{ color: colors.base.darker }}
                >
                    Pusat Bantuan
                </button>
                <button
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 transform hover:scale-[1.01] border border-gray-100"
                    style={{ color: colors.red.normal }}
                >
                    Keluar
                </button>
            </nav>
        </aside>
    );
};

export default ProfileSidebar;