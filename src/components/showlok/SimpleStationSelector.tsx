"use client";

import React from "react";

interface SimpleStationSelectorProps {
  departureStation: {
    name: string;
    code: string;
  };
  arrivalStation: {
    name: string;
    code: string;
  };
  selectedStation: 'departure' | 'arrival';
  onStationSelect: (station: 'departure' | 'arrival') => void;
}

const SimpleStationSelector: React.FC<SimpleStationSelectorProps> = ({
  departureStation,
  arrivalStation,
  selectedStation,
  onStationSelect,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pilih Stasiun untuk Fasilitas ShowLok
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departure Station */}
        <button
          onClick={() => onStationSelect('departure')}
          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
            selectedStation === 'departure'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <img src="/ic_train.svg" alt="Departure" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stasiun Keberangkatan</p>
              <p className="font-semibold text-gray-900">{departureStation.name}</p>
              <p className="text-sm text-gray-500">{departureStation.code}</p>
            </div>
          </div>
        </button>

        {/* Arrival Station */}
        <button
          onClick={() => onStationSelect('arrival')}
          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
            selectedStation === 'arrival'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <img src="/ic_arrival.svg" alt="Arrival" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stasiun Tujuan</p>
              <p className="font-semibold text-gray-900">{arrivalStation.name}</p>
              <p className="text-sm text-gray-500">{arrivalStation.code}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SimpleStationSelector;