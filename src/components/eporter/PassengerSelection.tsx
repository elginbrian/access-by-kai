"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/Icon";

interface Passenger {
  id: string;
  name: string;
  type: "Adult" | "Child";
  isSelected: boolean;
}

interface PassengerSelectionProps {
  passengers: Passenger[];
  onPassengerToggle: (passengerId: string) => void;
  maxPorters?: number;
}

const PassengerSelection: React.FC<PassengerSelectionProps> = ({ passengers, onPassengerToggle, maxPorters = 3 }) => {
  const selectedCount = passengers.filter((p) => p.isSelected).length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-xl">
          <img src="/ic_family_seat_blue.svg" alt="Passengers" className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pilih Penumpang</h3>
          <p className="text-sm text-gray-500">Pilih penumpang yang membutuhkan bantuan porter</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {passengers.map((passenger) => (
          <div key={passenger.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-3">
              <input type="checkbox" id={passenger.id} checked={passenger.isSelected} onChange={() => onPassengerToggle(passenger.id)} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
              <div>
                <label htmlFor={passenger.id} className="text-gray-900 font-medium cursor-pointer">
                  {passenger.name}
                </label>
                <p className="text-sm text-gray-500">{passenger.type}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${passenger.type === "Adult" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{passenger.type}</span>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
        <Icon name="info" className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
        <div>
          <p className="text-sm text-blue-800">
            <strong>Maksimum porter yang diperbolehkan: {maxPorters}</strong> (maksimal sesuai jumlah penumpang yang dipesan)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PassengerSelection;
