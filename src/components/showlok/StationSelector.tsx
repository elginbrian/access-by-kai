"use client";

import React, { useState, useEffect } from "react";
import { getStationFromTicket, searchStations } from "@/lib/utils/ticketHelpers";
import type { Station } from "@/types/facilities";

interface StationSelectorProps {
  ticketId?: string;
  onStationSelect: (station: Station) => void;
  selectedStation?: Station;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  ticketId,
  onStationSelect,
  selectedStation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [ticketStations, setTicketStations] = useState<{
    departure: Station;
    arrival: Station;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Load stations from ticket if provided
  useEffect(() => {
    if (ticketId) {
      getStationFromTicket(ticketId).then((stations) => {
        setTicketStations(stations);
      });
    }
  }, [ticketId]);

  // Search stations when query changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      setLoading(true);
      searchStations(searchQuery).then((results) => {
        setSearchResults(results);
        setShowSearchResults(true);
        setLoading(false);
      });
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleStationClick = (station: Station) => {
    onStationSelect(station);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Quick selection from ticket */}
      {ticketStations && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Pilih Stasiun dari Tiket Anda
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleStationClick(ticketStations.departure)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedStation?.stasiun_id === ticketStations.departure.stasiun_id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <img src="/ic_train.svg" alt="Departure" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Keberangkatan</p>
                  <p className="text-sm text-gray-600">
                    {ticketStations.departure.nama_stasiun} ({ticketStations.departure.kode_stasiun})
                  </p>
                  <p className="text-xs text-gray-500">{ticketStations.departure.kota}</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleStationClick(ticketStations.arrival)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedStation?.stasiun_id === ticketStations.arrival.stasiun_id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <img src="/ic_arrival.svg" alt="Arrival" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Tujuan</p>
                  <p className="text-sm text-gray-600">
                    {ticketStations.arrival.nama_stasiun} ({ticketStations.arrival.kode_stasiun})
                  </p>
                  <p className="text-xs text-gray-500">{ticketStations.arrival.kota}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Search other stations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Atau Cari Stasiun Lain
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama stasiun atau kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}

          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((station) => (
                <button
                  key={station.stasiun_id}
                  onClick={() => handleStationClick(station)}
                  className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <img src="/ic_train.svg" alt="Station" className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {station.nama_stasiun} ({station.kode_stasiun})
                      </p>
                      <p className="text-sm text-gray-600">{station.kota}, {station.provinsi}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && !loading && searchQuery.length > 2 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
              <p className="text-gray-500 text-center">Tidak ada stasiun ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected station display */}
      {selectedStation && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Stasiun Terpilih:</p>
          <p className="text-lg font-bold text-blue-900">
            {selectedStation.nama_stasiun} ({selectedStation.kode_stasiun})
          </p>
          <p className="text-sm text-blue-700">{selectedStation.kota}, {selectedStation.provinsi}</p>
        </div>
      )}
    </div>
  );
};

export default StationSelector;