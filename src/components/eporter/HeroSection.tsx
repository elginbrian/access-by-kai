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
        {/* Left Content */}
        <div>
          <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">{title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">{description}</p>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative">
          <img src={illustrationSrc} alt={illustrationAlt} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
