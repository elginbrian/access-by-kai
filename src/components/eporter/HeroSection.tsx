"use client";

import React from "react";

interface HeroSectionProps {
  title: string;
  description: string;
  illustrationSrc: string;
  illustrationAlt: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description, illustrationSrc, illustrationAlt }) => {
  return (
    <div className="container mx-auto px-8 py-16">
      <div className="grid grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">{title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">{description}</p>
          <button
            onClick={() => {}}
            className="bg-gradient-to-b from-purple-600 to-blue-600 w-full text-white px-8 py-4 rounded-xl font-semibold text-lg flex flex-row items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            <span className="text-center">Mulai Sekarang</span>
            <img src="/ic_arrow_right.svg" alt="Arrow Right" className="" />
          </button>
        </div>

        <div className="relative">
          <img src={illustrationSrc} alt={illustrationAlt} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
