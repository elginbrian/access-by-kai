"use client";

import React from "react";

type Ticket = {
  id: string;
  ticketNumber?: string;
  trainName: string;
  trainNumber?: string;
  route?: string;
  time?: string;
  date?: string;
  duration?: string;
  passenger?: string;
  car?: string;
  seat?: string;
  class?: string;
  totalPrice?: string;
  qrCode?: string;
};

type Props = {
  ticket: Ticket;
  onDetail?: () => void;
};

const TicketCard: React.FC<Props> = ({ ticket, onDetail }) => {
  const getCellFilled = (index: number) => {
    const seed = ticket.ticketNumber ?? ticket.id ?? "";
    let sum = 0;
    for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
    return (sum + index) % 2 === 0;
  };

  const formatDate = (d?: string) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return d;
      return dt.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    } catch (e) {
      return d;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center flex-shrink-0">
              <img src="/ic_train.svg" alt="Train" className="w-5 h-5" />
            </div>
            <span className="font-semibold truncate max-w-[260px] block">{ticket.trainName}</span>
          </div>
          <div className="text-right min-w-0">
            <div className="text-sm opacity-90">No. Tiket</div>
            <div className="font-mono font-semibold">{ticket.ticketNumber ?? ticket.id}</div>
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

            <div className="flex items-center justify-between mb-6 mx-7 min-w-0">
              <div className="text-center min-w-0">
                <div className="text-sm text-gray-600 mb-3">JAKARTA (GMR)</div>
                <div className="font-bold text-2xl text-gray-900 mb-3">08:00</div>
                <div className="text-xs text-gray-500 mb-3 truncate">{formatDate(ticket.date)}</div>
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

              <div className="text-center min-w-0">
                <div className="text-sm text-gray-600 mb-3">SURABAYA (SBY)</div>
                <div className="font-bold text-2xl text-gray-900 mb-3">15:30</div>
                <div className="text-xs text-gray-500 mb-3 truncate">{formatDate(ticket.date)}</div>
              </div>
            </div>

            {/* Passenger & Seat Details */}
            <div className="grid grid-cols-4 gap-4 text-sm w-full min-w-0">
              <div>
                <div className="text-gray-500">Penumpang</div>
                <div className="font-semibold text-gray-900 truncate max-w-[160px]">{ticket.passenger}</div>
              </div>
              <div>
                <div className="text-gray-500">Gerbong</div>
                <div className="font-semibold text-gray-900 truncate max-w-[80px]">{ticket.car}</div>
              </div>
              <div>
                <div className="text-gray-500">Tempat Duduk</div>
                <div className="font-semibold text-gray-900 truncate max-w-[80px]">{ticket.seat}</div>
              </div>
              <div>
                <div className="text-gray-500">Kelas</div>
                <div className="font-semibold text-gray-900 truncate max-w-[200px]">{ticket.class}</div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-end">
              <button onClick={onDetail} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
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

              {/* QR Code Placeholder */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 mx-auto mb-2 rounded-lg flex items-center justify-center">
                  <div className="w-20 h-20 bg-black/10 rounded grid grid-cols-4 gap-0.5 p-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${getCellFilled(i) ? "bg-black" : "bg-transparent"}`}></div>
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
  );
};

export default TicketCard;
