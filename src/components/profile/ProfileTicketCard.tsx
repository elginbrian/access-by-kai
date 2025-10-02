"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { colors } from '@/app/design-system/colors';

interface Ticket {
    id: string;
    status: string;
    title: string;
    class: string;
    from: string;
    to: string;
    time: string;
    price: string;
    people: number;
    date: string;
}

interface ProfileTicketCardProps {
    ticket: Ticket;
    index: number;
}

const ProfileTicketCard: React.FC<ProfileTicketCardProps> = ({ ticket, index }) => {
    const router = useRouter();

    const statusColor = (s: string) => {
        if (s === 'Selesai') return `bg-green-100 text-green-700 border-green-200`;
        if (s === 'Dibatalkan') return `bg-red-100 text-red-700 border-red-200`;
        if (s === 'Dalam Perjalanan') return `bg-blue-100 text-blue-700 border-blue-200`;
        return `bg-yellow-100 text-yellow-700 border-yellow-200`;
    };

    return (
        <div
            className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden border"
            style={{
                animationDelay: `${index * 100}ms`
            }}
        >
            {/* Ticket Content */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <span
                            className={`${statusColor(ticket.status)} px-4 py-2 rounded-full text-sm font-bold`}
                        >
                            {ticket.status}
                        </span>
                        <span className="ml-4 text-sm" style={{ color: colors.base.darkActive }}>
                            Booking ID: {ticket.id}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm" style={{ color: colors.base.darkActive }}>{ticket.date}</div>
                    </div>
                </div>

                <div>
                    {/* Journey Info */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                                <img src="/ic_train_blue.svg" alt="" className="w-5 h-5" />
                                <div className="font-bold text-lg" style={{ color: colors.base.darker }}>{ticket.title}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                                <div className="font-bold text-lg" style={{ color: colors.base.darker }}>{ticket.from}</div>
                                <img src="/ic_arrow_right_gray.svg" alt="Arrow" className="w-3 h-3" />
                                <div className="font-bold text-lg" style={{ color: colors.base.darker }}>{ticket.to}</div>
                            </div>
                        </div>

                        <div className="font-bold text-xl text-black">{ticket.price}</div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div style={{ color: colors.base.darker }}>{ticket.class} - KA {index + 1}</div>
                        <div className="text-sm" style={{ color: colors.base.darkActive }}>{ticket.time.split(' - ')[0]} - {ticket.time.split(' - ')[1]}</div>
                        <div style={{ color: colors.base.darker }}>{ticket.people} orang</div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-row gap-3 justify-between border-t pt-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-gray-800">Kursi: {ticket.class}</span>
                        <span className="text-gray-800">Gerbong: {ticket.class}</span>
                    </div>
                    <div className="flex flex-row gap-3">
                        {ticket.status === 'Dibatalkan' ? null : ticket.status === 'Akan Datang' ? (
                            <button
                                onClick={() => {

                                }}
                                aria-label={`Batalkan tiket ${ticket.id}`}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold border border-red-600 text-white border border-red-600 transition-all duration-200 transform hover:scale-105"
                            >
                                <span className="text-red-600">Batalkan</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    
                                }}
                                aria-label={`Lihat E-Tiket ${ticket.id}`}
                                className="flex items-center gap-2 px-6 py-3 border border-[#2563eb] rounded-xl font-bold transition-all duration-200 transform hover:scale-105"
                            >
                                <img src="/ic_download_blue.svg" alt="Print" />
                                <span className="text-[#2563eb]">E-Tiket</span>
                            </button>
                        )}

                        <button
                            onClick={() => router.push(`/mytickets/${ticket.id}`)}
                            aria-label={`Detail tiket ${ticket.id}`}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold border border-[#d1d5db] transition-all duration-200 transform hover:scale-105"
                        >
                            <span className="text-[#4b5563]"> Detail </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTicketCard;