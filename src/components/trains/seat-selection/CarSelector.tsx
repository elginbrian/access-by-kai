"use client";

import React from "react";
import { JadwalGerbongUI } from "@/lib/mappers/jadwal_gerbong";

interface CarSelectorProps {
  currentCar: number;
  onCarChange: (carNumber: number) => void;
  totalCars?: number;
  gerbongList?: JadwalGerbongUI[];
}

const CarSelector: React.FC<CarSelectorProps> = ({ currentCar, onCarChange, totalCars = 8, gerbongList }) => {
  const getGerbongLabel = (gerbong: JadwalGerbongUI, index: number): string => {
    const tipe = gerbong.tipeGerbong || "";

    if (tipe.includes("KERETA_MAKAN") || tipe.includes("MAKAN")) {
      return `Restoran ${index + 1}`;
    }
    if (tipe.includes("KERETA_PEMBANGKIT") || tipe.includes("PEMBANGKIT")) {
      return `Pembangkit ${index + 1}`;
    }
    if (tipe.includes("KERETA_BAGASI") || tipe.includes("BAGASI")) {
      return `Bagasi ${index + 1}`;
    }

    if (tipe.includes("LUXURY") || tipe.includes("COMPARTEMEN_SUITES")) {
      return `Luxury ${index + 1}`;
    }
    if (tipe.includes("EKSEKUTIF") || tipe.includes("PANORAMIC")) {
      return `Eksekutif ${index + 1}`;
    }
    if (tipe.includes("PRIORITY")) {
      return `Priority ${index + 1}`;
    }
    if (tipe.includes("EKONOMI")) {
      return `Ekonomi ${index + 1}`;
    }

    return `Gerbong ${index + 1}`;
  };

  const isSelectableGerbong = (gerbong: JadwalGerbongUI): boolean => {
    return (gerbong.kapasitasKursi || 0) > 0 && !(gerbong.tipeGerbong || "").includes("KERETA_MAKAN") && !(gerbong.tipeGerbong || "").includes("KERETA_PEMBANGKIT") && !(gerbong.tipeGerbong || "").includes("KERETA_BAGASI");
  };

  return (
    <div className="bg-white rounded-t-2xl p-6 border">
      <h3 className="font-semibold text-gray-900 mb-3">Pilih Kursi Penumpang</h3>
      <div className="flex flex-wrap gap-2">
        {gerbongList && gerbongList.length > 0
          ? gerbongList
              .filter((gerbong) => isSelectableGerbong(gerbong))
              .map((gerbong, filteredIndex) => {
                const originalIndex = gerbongList.findIndex((g) => g.jadwalGerbongId === gerbong.jadwalGerbongId);
                const actualCarNumber = gerbong.nomorGerbongAktual;
                const label = getGerbongLabel(gerbong, originalIndex);

                return (
                  <button
                    key={gerbong.jadwalGerbongId}
                    onClick={() => {
                      console.log("CarSelector onClick:", actualCarNumber);
                      onCarChange(actualCarNumber);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentCar === actualCarNumber ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {label}
                  </button>
                );
              })
          : Array.from({ length: totalCars }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => onCarChange(i + 1)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentCar === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Ekonomi {i + 1}
              </button>
            ))}
      </div>
    </div>
  );
};

export default CarSelector;
