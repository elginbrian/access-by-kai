"use client";

import React from "react";
import { FacilityWithUnits } from "@/types/facilities";

interface FacilityCardProps {
  facility: FacilityWithUnits;
  onSelect: (facilityId: number) => void;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onSelect }) => {
  const getFacilityIcon = (type: string) => {
    switch (type) {
      case "SHOWER":
        return "/ic_toilet_blue.svg"; // Using toilet icon as closest alternative
      case "LOCKER":
        return "/ic_luggage_blue.svg"; // Using luggage icon for locker
      case "SHOWER_LOCKER_COMBO":
        return "/ic_hotels.svg"; // Using hotel icon for combo
      default:
        return "/ic_location.svg";
    }
  };

  const getFacilityTypeLabel = (type: string) => {
    switch (type) {
      case "SHOWER":
        return "Shower";
      case "LOCKER":
        return "Locker";
      case "SHOWER_LOCKER_COMBO":
        return "Shower & Locker";
      default:
        return type;
    }
  };

  const availableUnits = facility.units.filter(unit => unit.status_unit === "TERSEDIA").length;
  const operationalHours = `${facility.jam_operasional?.open || "05:00"} - ${facility.jam_operasional?.close || "23:00"}`;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <img src={getFacilityIcon(facility.tipe_fasilitas)} alt={facility.tipe_fasilitas} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{facility.nama_fasilitas}</h3>
            <p className="text-gray-500">{facility.lokasi_dalam_stasiun}</p>
          </div>
        </div>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold text-sm">
          {getFacilityTypeLabel(facility.tipe_fasilitas)}
        </div>
      </div>

      {facility.deskripsi && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{facility.deskripsi}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <img src="/ic_clock.svg" alt="Time" className="w-4 h-4" />
          <span className="text-sm text-gray-600">{operationalHours}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/ic_location.svg" alt="Capacity" className="w-4 h-4" />
          <span className="text-sm text-gray-600">{availableUnits}/{facility.kapasitas_total} tersedia</span>
        </div>
      </div>

      {facility.rating_rata > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <= facility.rating_rata ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {facility.rating_rata.toFixed(1)} ({facility.jumlah_review} review)
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Mulai dari</p>
          <p className="text-lg font-bold text-gray-900">
            {facility.units.length > 0 
              ? `Rp ${Math.min(...facility.units.map(u => u.harga_per_jam)).toLocaleString()}/jam`
              : "Hubungi CS"
            }
          </p>
        </div>
        <button
          onClick={() => onSelect(facility.facility_id)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          disabled={availableUnits === 0}
        >
          {availableUnits === 0 ? "Penuh" : "Booking"}
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;