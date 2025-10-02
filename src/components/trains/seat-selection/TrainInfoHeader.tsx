"use client";

import React from "react";

interface TrainInfoHeaderProps {
  trainNumber: string;
  trainName: string;
  trainCode: string;
  departureTime: string;
  departureStation: string;
  arrivalTime: string;
  arrivalStation: string;
  duration: string;
  totalPrice: string;
  onClose: () => void;
}

const TrainInfoHeader: React.FC<TrainInfoHeaderProps> = ({ trainNumber, trainName, trainCode, departureTime, departureStation, arrivalTime, arrivalStation, duration, totalPrice, onClose }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{trainNumber}</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{trainName}</h2>
              <p className="text-sm text-gray-500">{trainCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{departureTime}</span>
              <span className="text-xs text-gray-500">{departureStation}</span>
            </div>
            <span className="text-gray-400">{duration}</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{arrivalTime}</span>
              <span className="text-xs text-gray-500">{arrivalStation}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Total Harga</div>
            <div className="text-lg font-bold text-blue-600">{totalPrice}</div>
          </div>
        </div>

        <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800" aria-label="Back to booking page">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Kembali</span>
        </button>
      </div>
    </div>
  );
};

export default TrainInfoHeader;
