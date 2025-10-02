"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";

interface TrainBadge {
  label: string;
  type: "executive" | "economy";
}

interface TrainData {
  name: string;
  code: string;
  price: number;
  badges: string[];
  arrival: string;
  departure?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  departureStation?: string;
  availableSeats?: number;
  jadwalId?: number;
  facilities?: string[];
}

interface TrainCardProps {
  train: TrainData;
  onBookNow?: (train: TrainData) => void;
}

const TrainCard: React.FC<TrainCardProps> = ({ train, onBookNow }) => {
  const getBadgeStyles = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "eksekutif":
        return "bg-purple-100 text-purple-700";
      case "ekonomi":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getTrainIconBackground = () => {
    const hasExecutive = train.badges.some((badge) => badge.toLowerCase() === "eksekutif");
    const hasEconomy = train.badges.some((badge) => badge.toLowerCase() === "ekonomi");

    if (hasExecutive && hasEconomy) {
      // Both executive and economy - gradient
      return {
        background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`,
      };
    } else if (hasExecutive) {
      // Only executive
      return {
        backgroundColor: colors.violet.normal,
      };
    } else if (hasEconomy) {
      // Only economy
      return {
        backgroundColor: colors.blue.normal,
      };
    } else {
      // Default fallback
      return {
        backgroundColor: colors.violet.normal,
      };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={getTrainIconBackground()}>
            <img src="/ic_train.svg" alt="Train" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-black">{train.name}</h3>
            <p className="text-sm text-black">{train.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {train.badges.map((badge, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyles(badge)}`}>
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-black">{train.departureTime || "13:45"}</div>
          <div className="text-sm text-black">{train.departureStation || "Bekasi (BKS)"}</div>
        </div>
        <div className="flex-1 px-8">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-px bg-gray-300 mx-2"></div>
            <img src="/ic_train_gradient.svg" alt="Train" />
            <div className="flex-1 h-px bg-gray-300 mx-2"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <div className="text-center text-sm text-black mt-1">{train.duration || "3h 15m"}</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-black">{train.arrivalTime || "17:00"}</div>
          <div className="text-sm text-black">{train.arrival}</div>
        </div>
        <div className="text-right ml-8">
          <div className="text-xs text-black">Mulai dari</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#6b46c1] to-[#3b82f6] bg-clip-text text-transparent">Rp. {train.price.toLocaleString()}</div>
          <div className="text-xs text-black">per/orang</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-4 text-black text-sm">
          <img src="/ic_wifi.svg" alt="WiFi" />
          <span>WiFi</span>
          <img src="/ic_ac.svg" alt="AC" />
          <span>AC</span>
        </div>
        <button onClick={() => onBookNow?.(train)} className="px-3 py-2.5 bg-purple-600 text-white font-semibold rounded-lg bg-gradient-to-r from-[#6b46c1] to-[#3b82f6] hover:opacity-90 transition-opacity">
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default TrainCard;
