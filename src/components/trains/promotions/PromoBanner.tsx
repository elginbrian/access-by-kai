"use client";

import React from "react";

interface PromoBannerProps {
  title: string;
  description: string;
  buttonText: string;
  onViewOffers?: () => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ title, description, buttonText, onViewOffers }) => {
  return (
    <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-2 text-white">{title}</h2>
      <p className="text-lg mb-4 text-white">{description}</p>
      <button onClick={onViewOffers} className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:opacity-90 transition-opacity">
        {buttonText}
      </button>
    </div>
  );
};

export default PromoBanner;
