"use client";

import React from "react";

interface SearchSummaryProps {
  departure: string;
  arrival: string;
  date: string;
  passengers: string;
  onEditSchedule?: () => void;
  onSwitchStations?: () => void;
}

const SearchSummary: React.FC<SearchSummaryProps> = ({ departure, arrival, date, passengers, onEditSchedule, onSwitchStations }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between border-2 p-6 rounded-2xl">
          <div className="flex items-center space-x-6">
            <div>
              <div className="flex items-center space-x-1 text-xs text-black mb-1">
                <img src="/ic_train_violet.svg" alt="Train" />
                <span>Dari (Departure)</span>
              </div>
              <div className="font-semibold text-black">{departure}</div>
            </div>

            <button onClick={onSwitchStations} className="p-2 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors cursor-pointer" title="Tukar stasiun asal dan tujuan">
              <img src="/ic_switch.svg" alt="Switch" className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center space-x-1 text-xs text-black mb-1">
                <img src="/ic_train_violet.svg" alt="Train" />
                <span>Ke (Arrival)</span>
              </div>
              <div className="font-semibold text-black">{arrival}</div>
            </div>

            <div>
              <div className="flex items-center space-x-1 text-xs text-black mb-1">
                <img src="/ic_calendar.svg" alt="Calendar" />
                <span>Tanggal Berangkat</span>
              </div>
              <div className="font-semibold text-black">{date}</div>
            </div>

            <div>
              <div className="text-xs text-black mb-1">Penumpang</div>
              <div className="font-semibold text-black">{passengers}</div>
            </div>
          </div>

          <button
            onClick={onEditSchedule}
            className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-2xl bg-gradient-to-r from-[#6b46c1] to-[#3b82f6] hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Ubah Jadwal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSummary;
