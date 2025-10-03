"use client";

import React from "react";

interface Facility {
  icon: string;
  label: string;
}

interface FacilitiesCardProps {
  title?: string;
  facilities?: Facility[];
}

const FacilitiesCard: React.FC<FacilitiesCardProps> = ({
  title = "Detail Fasilitas",
  facilities
}) => {
  const defaultFacilities: Facility[] = [
    { icon: "/ic_ac_blue.svg", label: "AC & Ventilasi" },
    { icon: "/ic_fast_wifi_green.svg", label: "WiFi Gratis" },
    { icon: "/ic_charging_station_orange.svg", label: "Charging Station" },
    { icon: "/ic_meal_orange.svg", label: "Snack & Minuman" },
    { icon: "/ic_toilet_pink.svg", label: "Toilet Bersih" },
    { icon: "/ic_tv_entertainment.svg", label: "TV Entertainment" }
  ];

  const displayFacilities = facilities || defaultFacilities;

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-4 text-black">{title}</h3>
      <div className="space-y-3 text-sm">
        {displayFacilities.map((facility, index) => (
          <div key={index} className="flex items-center gap-3">
            <img src={facility.icon} alt={facility.label} className="w-4 h-4" />
            <span className="text-black">{facility.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesCard;