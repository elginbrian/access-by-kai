"use client";

import React from "react";

export interface HelpSupportCardProps {
  title?: string;
  description?: string;
  icon?: string;
  buttonText?: string;
  onContactSupport: () => void;
  gradientFrom?: string;
  gradientTo?: string;
}

const HelpSupportCard: React.FC<HelpSupportCardProps> = ({
  title = "Need Help?",
  description = "Our customer service is available 24/7",
  icon = "/ic_mic_help.svg",
  buttonText = "Contact Support",
  onContactSupport,
  gradientFrom = "from-purple-600",
  gradientTo = "to-blue-500"
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg shadow-lg p-6 text-white`}>
      <div className="w-12 h-12 bg-gray-50/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
        <img src={icon} alt="Help" className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
      <p className="text-sm text-center mb-4 text-white text-opacity-90">
        {description}
      </p>
      <button 
        onClick={onContactSupport}
        className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default HelpSupportCard;