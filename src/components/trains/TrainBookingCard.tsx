"use client";

import React from "react";

interface TrainBookingCardProps {
  fromCity: string;
  toCity: string;
  trainName: string;
  trainClass: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  badges: {
    text: string;
    variant: 'holiday' | 'new-generation' | 'promo' | 'premium' | 'discount' | 'available' | 'limited';
  }[];
  onClick?: () => void;
}

const TrainBookingCard: React.FC<TrainBookingCardProps> = ({
  fromCity,
  toCity,
  trainName,
  trainClass,
  departureTime,
  arrivalTime,
  duration,
  badges,
  onClick
}) => {
  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case 'holiday':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'new-generation':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'promo':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'premium':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'discount':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'available':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'limited':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Route Header */}
      <div className="flex items-center text-lg font-semibold text-gray-900 mb-2">
        <span>{fromCity}</span>
        <span className="mx-3 text-gray-400">→</span>
        <span>{toCity}</span>
      </div>

      {/* Train Info */}
      <div className="text-gray-600 text-sm mb-4">
        {trainName} – {trainClass}
      </div>

      {/* Time and Duration */}
      <div className="flex items-center text-lg font-semibold text-gray-900 mb-4">
        <span>{departureTime}</span>
        <span className="mx-3 text-gray-400">→</span>
        <span>{arrivalTime}</span>
        <span className="ml-4 text-sm font-normal text-gray-500">({duration})</span>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyles(badge.variant)}`}
          >
            {badge.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrainBookingCard;