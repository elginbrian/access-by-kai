"use client";

import React, { useState } from "react";
import PassengerForm, { PassengerData } from "./PassengerForm";
import { colors } from "@/app/design-system/colors";

interface PassengerManagerProps {
  passengers: PassengerData[];
  onChange: (passengers: PassengerData[]) => void;
  maxPassengers?: number;
}

const PassengerManager: React.FC<PassengerManagerProps> = ({ passengers, onChange, maxPassengers = 8 }) => {
  const handlePassengerChange = (index: number, passengerData: PassengerData) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = passengerData;
    onChange(updatedPassengers);
  };

  const addPassenger = () => {
    if (passengers.length < maxPassengers) {
      const newPassenger: PassengerData = {
        title: "Bapak",
        passengerName: "",
        idType: "KTP",
        idNumber: "",
      };
      onChange([...passengers, newPassenger]);
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      onChange(updatedPassengers);
    }
  };

  React.useEffect(() => {
    if (passengers.length === 0) {
      const defaultPassenger: PassengerData = {
        title: "Bapak",
        passengerName: "",
        idType: "KTP",
        idNumber: "",
      };
      onChange([defaultPassenger]);
    }
  }, [passengers.length, onChange]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Data Penumpang</h2>
            <p className="text-sm text-gray-600 mt-1">
              {passengers.length} dari maksimal {maxPassengers} penumpang
            </p>
          </div>

          {passengers.length < maxPassengers && (
            <button onClick={addPassenger} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: colors.violet.normal }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Penumpang
            </button>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium">Tips:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Setiap penumpang memerlukan kursi terpisah</li>
                <li>• Pastikan nama sesuai dengan identitas yang dibawa</li>
                <li>• Maksimal {maxPassengers} penumpang per pemesanan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {passengers.map((passenger, index) => (
        <div key={index} className="relative">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: colors.violet.normal }}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Penumpang {index + 1}</h3>
                    {passenger.passengerName && <p className="text-sm text-gray-600">{passenger.passengerName}</p>}
                  </div>
                </div>

                {passengers.length > 1 && (
                  <button onClick={() => removePassenger(index)} className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors" title="Hapus penumpang">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <PassengerForm data={passenger} onChange={(data) => handlePassengerChange(index, data)} hideHeader={true} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PassengerManager;
