"use client";

import React from "react";

interface SeatSelectionBottomBarProps {
  selectedSeatsCount: number;
  maxSelectableSeats: number;
  totalPrice: string;
  onContinueBooking: () => void;
  onBack?: () => void;
}
const SeatSelectionBottomBar: React.FC<SeatSelectionBottomBarProps> = ({ selectedSeatsCount, maxSelectableSeats, totalPrice, onContinueBooking, onBack }) => {
  const canContinue = selectedSeatsCount === maxSelectableSeats;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">
              {selectedSeatsCount} dari {maxSelectableSeats} kursi dipilih
            </span>
            {!canContinue && <span className="text-xs text-orange-600">Pilih {maxSelectableSeats - selectedSeatsCount} kursi lagi</span>}
          </div>
          <div className="text-lg font-bold text-gray-900">Total: {totalPrice}</div>
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
          )}
          <button
            onClick={onContinueBooking}
            disabled={!canContinue}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${canContinue ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Lanjutkan Pemesanan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionBottomBar;
