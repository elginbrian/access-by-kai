"use client";

import React from "react";
import SeatSelection from "@/components/trains/booking/SeatSelection";
import { TrainBookingDetails } from "@/lib/hooks/useTrainBookingDetails";

export interface PassengerInfo {
  id: string;
  name: string;
  seat?: string;
  isAdult: boolean;
  type: "adult" | "child";
}

interface SeatSelectorProps {
  trainDetails: TrainBookingDetails | null | undefined;
  selectedSeats: string[];
  showSeatSelection: boolean;
  passengers?: PassengerInfo[];
  onOpenSeatSelection: () => void;
  onCloseSeatSelection: () => void;
  onSeatSelect: (seats: string[]) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ trainDetails, selectedSeats, showSeatSelection, passengers, onOpenSeatSelection, onCloseSeatSelection, onSeatSelect }) => {
  if (showSeatSelection) {
    return <SeatSelection onClose={onCloseSeatSelection} onSeatSelect={onSeatSelect} selectedSeats={selectedSeats} passengers={passengers} jadwalId={trainDetails?.jadwal_id} />;
  }

  const hasSelectedSeats = selectedSeats.length > 0;
  const passengersWithSeats = passengers?.filter((p) => p.seat) || [];
  const passengersWithoutSeats = passengers?.filter((p) => !p.seat) || [];

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
        <div className="flex items-center justify-between ">
          <p className="text-sm font-medium text-gray-900">{hasSelectedSeats ? "Kursi Terpilih" : "Pilih Kursi"}</p>
          <button onClick={onOpenSeatSelection} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
            {hasSelectedSeats ? "Ubah" : "Pilih"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {hasSelectedSeats ? (
          <div>
            {passengersWithSeats.map((passenger, index) => (
              <div key={passenger.id} className="flex mt-3 items-center justify-between bg-white rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">{passenger.seat}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{passenger.name}</p>
                    <p className="text-xs text-gray-500">{passenger.isAdult ? "Dewasa" : "Anak-anak"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium">Terpilih</span>
                </div>
              </div>
            ))}

            {passengersWithoutSeats.map((passenger) => (
              <div key={passenger.id} className="flex items-center justify-between bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 text-xs font-bold">?</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{passenger.name}</p>
                    <p className="text-xs text-gray-500">{passenger.isAdult ? "Dewasa" : "Anak-anak"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-xs font-medium">Belum memilih</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">Belum ada kursi yang dipilih</p>
            <p className="text-xs text-gray-400">{passengers?.length || 0} penumpang membutuhkan kursi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelector;
