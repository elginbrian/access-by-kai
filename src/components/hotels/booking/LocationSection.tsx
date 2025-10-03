"use client";

import React from "react";

interface LocationInfo {
  name: string;
  address: string;
  mapImage?: string;
  nearbyPoints?: Array<{
    icon: string;
    text: string;
  }>;
}

interface LocationSectionProps {
  location: LocationInfo;
}

const LocationSection: React.FC<LocationSectionProps> = ({ location }) => {
  const defaultNearbyPoints = [
    { icon: "/ic_main_gate.svg", text: "5 km dari Gate Utama" },
    { icon: "/ic_main_hall.svg", text: "1000 m dari Hall Utama" }
  ];

  const nearbyPoints = location.nearbyPoints || defaultNearbyPoints;

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-xl text-black font-bold mb-6">Area & Lokasi</h2>
      
      {/* Location Name */}
      <div className="flex items-center gap-2 mb-4">
        <img src="/ic_location_gradient.svg" alt="Location" className="w-4 h-4" />
        <span className="font-medium text-black">{location.name}</span>
      </div>
      
      {/* Address */}
      <p className="text-sm text-gray-600 mb-6 text-black">
        {location.address}
      </p>

      {/* Map Placeholder */}
      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
        {location.mapImage ? (
          <img 
            src={location.mapImage} 
            alt="Map" 
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <img src="/ic_maps_loading.svg" alt="Map" className="w-10 h-10" />
            <span className="text-sm text-gray-500 text-center">Google Maps akan dimuat di sini</span>
          </div>
        )}
      </div>

      {/* Nearby Points */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {nearbyPoints.map((point, index) => (
          <div key={index} className="flex items-center gap-2">
            <img src={point.icon} alt="Point" className="w-4 h-4" />
            <span className="text-black">{point.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSection;