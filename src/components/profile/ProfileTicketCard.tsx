"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/app/design-system/colors";

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
  userId: string;
}

const ProfileTicketCard: React.FC<ProfileTicketCardProps> = ({ ticket, index, userId }) => {
  const router = useRouter();

  const formatDate = (d: string) => {
    try {
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return d;
      return dt.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    } catch (e) {
      return d;
    }
  };

  const statusColor = (s: string) => {
    if (s === "Selesai") return `bg-green-100 text-green-700 border-green-200`;
    if (s === "Dibatalkan") return `bg-red-100 text-red-700 border-red-200`;
    if (s === "Dalam Perjalanan") return `bg-blue-100 text-blue-700 border-blue-200`;
    return `bg-yellow-100 text-yellow-700 border-yellow-200`;
  };

  return (
    <div
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Ticket Content */}
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 min-w-0">
          <div className="min-w-0">
            <span className={`${statusColor(ticket.status)} px-3 py-1 rounded-full text-sm font-bold`}>{ticket.status}</span>
            <span className="ml-4 text-sm truncate block" style={{ color: colors.base.darkActive, maxWidth: 420 }}>
              Booking ID: {ticket.id}
            </span>
          </div>
          <div className="text-right min-w-0">
            <div className="text-sm truncate" style={{ color: colors.base.darkActive, maxWidth: 160 }}>
              {formatDate(ticket.date)}
            </div>
          </div>
        </div>

        <div>
          {/* Journey Info */}
          <div className="flex items-center justify-between mb-4 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <img src="/ic_train_blue.svg" alt="" className="w-5 h-5 flex-shrink-0" />
              <div className="font-bold text-lg truncate" style={{ color: colors.base.darker, maxWidth: 420 }}>
                {ticket.title}
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-0 justify-center">
              <div className="flex items-center gap-3 min-w-0">
                <div className="font-semibold text-2xl text-gray-800 truncate" style={{ maxWidth: 140 }}>
                  {ticket.from}
                </div>
                <img src="/ic_arrow_right_gray.svg" alt="Arrow" className="w-4 h-4 flex-shrink-0 mx-2" />
                <div className="font-semibold text-2xl text-gray-800 truncate" style={{ maxWidth: 140 }}>
                  {ticket.to}
                </div>
              </div>
            </div>

            <div className="font-bold text-xl text-black flex-shrink-0 ml-4">{ticket.price}</div>
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-600 gap-4 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3">
                <div className="font-medium truncate">{ticket.class}</div>
                <div className="text-xs text-gray-500 truncate">|</div>
                <div className="text-xs text-gray-500 truncate">{ticket.time}</div>
              </div>
            </div>
            <div className="w-28 flex-shrink-0 text-right">
              <div className="font-medium">{ticket.people} orang</div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-row gap-3 justify-between border-t pt-4 flex-wrap">
          <div className="flex flex-row items-center gap-3">
            <span className="text-gray-800 truncate">Kursi: {ticket.class}</span>
            <span className="text-gray-800 truncate">Gerbong: {ticket.class}</span>
          </div>
          <div className="flex flex-row gap-3">
            {ticket.status === "Dibatalkan" ? null : ticket.status === "Akan Datang" ? (
              <button onClick={() => {}} aria-label={`Batalkan tiket ${ticket.id}`} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold border border-red-600 text-white transition-all duration-200 transform hover:scale-105">
                <span className="text-red-600">Batalkan</span>
              </button>
            ) : (
              <button onClick={() => {}} aria-label={`Lihat E-Tiket ${ticket.id}`} className="flex items-center gap-2 px-6 py-3 border border-[#2563eb] rounded-xl font-bold transition-all duration-200 transform hover:scale-105">
                <img src="/ic_download_blue.svg" alt="Print" />
                <span className="text-[#2563eb]">E-Tiket</span>
              </button>
            )}

            <button
              onClick={() => {
                if (userId && userId !== 'NaN' && userId !== 'undefined') {
                  router.push(`/${userId}/mytickets/${(ticket as any).tiketId ?? ticket.id}`);
                } else {
                  console.error('Invalid userId for navigation:', userId);
                }
              }}
              aria-label={`Detail tiket ${ticket.id}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold border border-[#d1d5db] transition-all duration-200 transform hover:scale-105"
              disabled={!userId || userId === 'NaN' || userId === 'undefined'}
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
