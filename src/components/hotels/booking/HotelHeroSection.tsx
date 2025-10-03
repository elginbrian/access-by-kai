"use client";

import React from "react";

interface HotelHeroSectionProps {
  title: string;
  description: string;
  price: string;
  badge?: string;
  buttonText?: string;
  backgroundImage?: string;
  onBookNow?: () => void;
}

const HotelHeroSection: React.FC<HotelHeroSectionProps> = ({
  title,
  description,
  price,
  badge = "Premium Station Service",
  buttonText = "Pesan Sekarang",
  backgroundImage,
  onBookNow
}) => {
  return (
    <div className="relative bg-gray-400 rounded-2xl overflow-hidden h-64 mb-6">
      {backgroundImage && (
        <img 
          src={backgroundImage} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute bottom-6 left-6 text-white">
        <span className="bg-blue-600 px-3 py-1 rounded text-sm mb-3 inline-block">
          {badge}
        </span>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg mb-4">{description}</p>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">{price}</span>
          <button 
            onClick={onBookNow}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelHeroSection;