"use client";

import React, { useState } from "react";

interface PickupDetailsProps {
  onMeetingPointChange: (meetingPoint: string) => void;
  onNotesChange: (notes: string) => void;
  meetingPoint?: string;
  notes?: string;
}

const PickupDetails: React.FC<PickupDetailsProps> = ({ onMeetingPointChange, onNotesChange, meetingPoint = "", notes = "" }) => {
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState(meetingPoint);
  const [additionalNotes, setAdditionalNotes] = useState(notes);

  const handleMeetingPointChange = (value: string) => {
    setSelectedMeetingPoint(value);
    onMeetingPointChange(value);
  };

  const handleNotesChange = (value: string) => {
    setAdditionalNotes(value);
    onNotesChange(value);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-3 rounded-xl">
          <img src="/ic_location_orange.svg" alt="PickUp Location" className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Detail Penjemputan</h3>
          <p className="text-sm text-gray-500">Tentukan lokasi pertemuan dengan porter Anda</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Meeting Point */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Titik Pertemuan</label>
          <div className="relative">
            <select
              value={selectedMeetingPoint}
              onChange={(e) => handleMeetingPointChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
            >
              <option value="" disabled>
                Pilih titik pertemuan
              </option>
              <option value="platform">Peron</option>
              <option value="main-entrance">Pintu Utama</option>
              <option value="waiting-room">Ruang Tunggu</option>
              <option value="ticket-counter">Loket Tiket</option>
              <option value="food-court">Area Makan</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Catatan Tambahan</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Misal: butuh porter untuk 2 koper, bantuan kursi roda, dll."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default PickupDetails;
