"use client";

import React from "react";

interface PorterCardProps {
  name: string;
  image?: string;
  status: string;
  onWhatsAppClick?: () => void;
  onRequestAnotherClick?: () => void;
  onCancelClick?: () => void;
}

const PorterCard: React.FC<PorterCardProps> = ({ name, image, status, onWhatsAppClick, onRequestAnotherClick, onCancelClick }) => {
  const imgSrc = image || "/ic_person_blue.svg";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Porter Profile */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-3">
          <img src={imgSrc} alt={name} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Porter Ditemukan!</h3>
        <p className="text-lg font-semibold text-gray-700 mb-3">{name}</p>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm">
          <img src="/ic_clock.svg" alt="Info" />
          {status}
        </div>
      </div>

      {/* WhatsApp Button */}
      <button onClick={onWhatsAppClick} className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 mb-3 transition-colors">
        <img src="/ic_whatsapp.svg" alt="WhatsApp" />
        Chat di WhatsApp
      </button>
    </div>
  );
};

export default PorterCard;
