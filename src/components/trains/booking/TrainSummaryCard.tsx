"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";
import { TrainBookingDetails } from "@/lib/hooks/useTrainBookingDetails";

interface RouteStationData {
  name: string;
  time: string;
  active: boolean;
  urutan: number;
}

interface TrainSummaryCardProps {
  trainDetails: TrainBookingDetails | null | undefined;
  routeStations: RouteStationData[];
  isRouteExpanded: boolean;
  onToggleRoute: () => void;
}

const TrainSummaryCard: React.FC<TrainSummaryCardProps> = ({ trainDetails, routeStations, isRouteExpanded, onToggleRoute }) => {
  const displayedStations = isRouteExpanded ? routeStations : routeStations.length > 1 ? [routeStations[0], routeStations[routeStations.length - 1]] : routeStations;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-sm font-semibold text-gray-900 mb-5">Ringkasan Kereta</h2>

      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.violet.normal }}>
          <img src="/ic_train.svg" alt="Train" className="w-6 h-6 filter brightness-0 invert" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base">{trainDetails?.nama_kereta || "Memuat..."}</h3>
          <p className="text-sm text-gray-500">{trainDetails?.nomor_ka || trainDetails?.kode_jadwal || "N/A"}</p>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">{trainDetails?.jenis_layanan || "Standard"}</span>
      </div>

      <div className="flex items-center mb-2">
        <div className="flex-1 text-left">
          <div className="text-xl font-bold text-gray-900">
            {trainDetails?.waktu_berangkat
              ? new Date(trainDetails.waktu_berangkat).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "00:00"}
          </div>
          <div className="text-xs text-gray-500">
            {trainDetails?.stasiun_asal?.nama || "Stasiun Asal"} ({trainDetails?.stasiun_asal?.kode || "N/A"})
          </div>
        </div>

        <div className="w-12 h-0.5 bg-gray-200 mx-2" />

        <div className="flex flex-col items-center px-2">
          <img src="/ic_train_gradient.svg" alt="Train" />
        </div>

        <div className="w-12 h-0.5 bg-gray-200 mx-2" />

        <div className="flex-1 text-right">
          <div className="text-xl font-bold text-gray-900">
            {trainDetails?.waktu_tiba
              ? new Date(trainDetails.waktu_tiba).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "00:00"}
          </div>
          <div className="text-xs text-gray-500">
            {trainDetails?.stasiun_tujuan?.nama || "Stasiun Tujuan"} ({trainDetails?.stasiun_tujuan?.kode || "N/A"})
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mb-4">Durasi: {trainDetails?.durasi || "0j 0m"}</p>

      <button onClick={onToggleRoute} className="text-indigo-600 text-xs font-medium flex items-center gap-1 hover:text-indigo-700 transition-colors">
        {isRouteExpanded ? "Lihat Lebih Sedikit" : "Lihat Rute Lengkap"}
        <svg className={`w-4 h-4 transition-transform duration-200 ${isRouteExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isRouteExpanded && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 mt-3 text-sm">Rute</h3>
          <div className="space-y-3 transition-all duration-300">
            {displayedStations.map((station, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${station.active ? "bg-blue-600" : "bg-gray-300"}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${station.active ? "text-gray-900 font-medium" : "text-gray-500"}`}>{station.name}</div>
                </div>
                <div className="text-sm text-gray-500">{station.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainSummaryCard;
