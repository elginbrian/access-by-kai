"use client";

import React from "react";

interface ServiceDescriptionProps {
  title?: string;
  description: string;
  amenities?: Array<{
    icon: string;
    label: string;
    bgColor?: string;
  }>;
}

const ServiceDescription: React.FC<ServiceDescriptionProps> = ({
  title = "Deskripsi Layanan",
  description,
  amenities
}) => {
  const defaultAmenities = [
    { icon: "/ic_sofa_premium_gradient.svg", label: "Sofa Premium", bgColor: "bg-[#fff7ed]" },
    { icon: "/ic_fast_wifi_gradient.svg", label: "WiFi Cepat", bgColor: "bg-[#fff7ed]" },
    { icon: "/ic_free_snack_gradient.svg", label: "Free Snack", bgColor: "bg-[#fff7ed]" },
    { icon: "/ic_working_area_gradient.svg", label: "Area Kerja", bgColor: "bg-[#fff7ed]" }
  ];

  const displayAmenities = amenities || defaultAmenities;

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
      
      {/* Description */}
      <p className="text-gray-700 leading-relaxed text-black mb-6">
        {description}
      </p>

      {/* Amenities Grid */}
      {displayAmenities.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {displayAmenities.map((amenity, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${amenity.bgColor || "bg-orange-50"} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <img src={amenity.icon} alt={amenity.label} className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-600">{amenity.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceDescription;