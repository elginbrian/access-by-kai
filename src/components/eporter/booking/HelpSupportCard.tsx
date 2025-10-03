"use client";

import React from "react";

interface HelpSupportCardProps {
  onContactClick?: () => void;
}

const HelpSupportCard: React.FC<HelpSupportCardProps> = ({ onContactClick }) => {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-center">
      <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <img src="/ic_mic_help.svg" alt="Help" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Butuh Bantuan?</h3>
      <p className="text-white/90 text-sm mb-6">
        Layanan pelanggan kami tersedia
        <br />
        24 jam setiap hari
      </p>
      <button onClick={onContactClick} className="bg-white text-purple-700 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
        Hubungi Bantuan
      </button>
    </div>
  );
};

export default HelpSupportCard;
