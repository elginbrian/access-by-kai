"use client";

import React from "react";
import SeatSelection from "@/components/trains/booking/SeatSelection";
import { TrainBookingDetails } from "@/lib/hooks/useTrainBookingDetails";

interface SeatSelectorProps {
  trainDetails: TrainBookingDetails | null | undefined;
  selectedSeats: string[];
  showSeatSelection: boolean;
  onOpenSeatSelection: () => void;
  onCloseSeatSelection: () => void;
  onSeatSelect: (seats: string[]) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ trainDetails, selectedSeats, showSeatSelection, onOpenSeatSelection, onCloseSeatSelection, onSeatSelect }) => {
  if (showSeatSelection) {
    return <SeatSelection onClose={onCloseSeatSelection} onSeatSelect={onSeatSelect} selectedSeats={selectedSeats} />;
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tempat Duduk</h2>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs text-gray-500 mb-1">Kursi Tersedia</div>
          <div className="text-xs text-gray-500 mb-1">Konfigurasi</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-emerald-600">{trainDetails?.kursi_tersedia || 0} kursi tersisa</div>
          <div className="text-sm text-gray-900">2-2 {trainDetails?.jenis_layanan || "Standard"}</div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 mb-8 relative">
        <p className="text-sm font-medium text-gray-900">Pilih Kursi</p>
        <button onClick={onOpenSeatSelection} className="absolute top-0 right-0 w-full h-full flex items-center justify-end pr-4 rounded-lg transition-colors hover:bg-gray-200">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
          <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
          <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
