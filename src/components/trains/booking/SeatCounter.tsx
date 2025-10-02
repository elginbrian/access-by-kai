"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";
import { PassengerData } from "./PassengerForm";

interface SeatCounterProps {
  selectedSeats: string[];
  passengers: PassengerData[];
  baseTicketPrice: number;
  totalTicketPrice: number;
  onOpenSeatSelection: () => void;
}

const SeatCounter: React.FC<SeatCounterProps> = ({ selectedSeats, passengers, baseTicketPrice, totalTicketPrice, onOpenSeatSelection }) => {
  const totalPassengers = passengers.length;
  const seatsSelected = selectedSeats.filter((seat) => seat && seat !== "").length;
  const allSeatsSelected = seatsSelected === totalPassengers;

  const validatePassengerData = (passenger: PassengerData) => {
    return passenger.passengerName.trim() !== "" && passenger.idNumber.trim() !== "";
  };

  const allPassengersValid = passengers.every(validatePassengerData);
  const incompletePassengers = passengers.filter((passenger) => !validatePassengerData(passenger));
  const canSelectSeats = allPassengersValid && totalPassengers > 0;

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const handleSeatSelection = () => {
    if (canSelectSeats) {
      onOpenSeatSelection();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pemilihan Kursi & Harga</h3>
        <button
          onClick={handleSeatSelection}
          disabled={!canSelectSeats}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${canSelectSeats ? "text-white hover:opacity-90 cursor-pointer" : "text-gray-500 bg-gray-300 cursor-not-allowed"}`}
          style={{
            backgroundColor: canSelectSeats ? colors.violet.normal : undefined,
          }}
          title={!canSelectSeats ? "Lengkapi data penumpang terlebih dahulu" : ""}
        >
          {!canSelectSeats ? "Lengkapi Data Penumpang" : seatsSelected > 0 ? "Ubah Kursi" : "Pilih Kursi"}
        </button>
      </div>

      {!canSelectSeats && incompletePassengers.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-gray-800 mb-1">Data penumpang belum lengkap</p>
              <p className="text-gray-700">Lengkapi nama dan nomor identitas untuk {incompletePassengers.length} penumpang sebelum memilih kursi.</p>
              <div className="mt-2 text-xs text-gray-600">
                <p>Penumpang yang belum lengkap:</p>
                <ul className="list-disc list-inside mt-1">
                  {incompletePassengers.map((passenger, index) => {
                    const originalIndex = passengers.indexOf(passenger);
                    const missingData = [];
                    if (!passenger.passengerName.trim()) missingData.push("nama");
                    if (!passenger.idNumber.trim()) missingData.push("nomor identitas");

                    return (
                      <li key={originalIndex}>
                        Penumpang {originalIndex + 1}: {missingData.join(", ")} belum diisi
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {seatsSelected > 0 && (
          <div className="border-t pt-3 space-y-3">
            <p className="text-sm font-medium text-gray-700">Detail Penumpang & Kursi:</p>
            <div className="space-y-2">
              {passengers.map((passenger, index) => {
                const assignedSeat = selectedSeats[index];
                const hasName = passenger.passengerName.trim() !== "";
                const hasIdNumber = passenger.idNumber.trim() !== "";
                const hasSeat = assignedSeat && assignedSeat !== "";

                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: colors.violet.normal }}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{hasName ? passenger.passengerName : "Belum diisi"}</span>
                      </div>
                      <div className="text-xs text-gray-600 ml-8">
                        <div>
                          {passenger.idType}: {hasIdNumber ? passenger.idNumber : "Belum diisi"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {hasSeat ? (
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: colors.violet.light + "20",
                            color: colors.violet.dark,
                          }}
                        >
                          Kursi {assignedSeat}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">Belum dipilih</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {seatsSelected < totalPassengers && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-xs text-gray-700">
                <p className="font-medium">Pilih kursi untuk semua penumpang</p>
                <p>Anda perlu memilih {totalPassengers - seatsSelected} kursi lagi</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatCounter;
