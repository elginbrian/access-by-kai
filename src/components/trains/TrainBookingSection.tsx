"use client";

import React from "react";
import TrainBookingCard from "./TrainBookingCard";

interface TrainBookingSectionProps {
  title?: string;
  subtitle?: string;
  trains?: Array<{
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
  }>;
  onTrainClick?: (index: number) => void;
}

const TrainBookingSection: React.FC<TrainBookingSectionProps> = ({
  title = "Pesan Cepat",
  subtitle = "Pesan kembali kereta yang pernah anda pesan",
  trains = [],
  onTrainClick
}) => {
  // Default data matching your screenshot
  const defaultTrains = [
    {
      fromCity: "KEDIRI",
      toCity: "MALANG",
      trainName: "MAJAPAHIT 246",
      trainClass: "Economy CA",
      departureTime: "04:03",
      arrivalTime: "06:28",
      duration: "2h 25m",
      badges: [
        { text: "Lebaran", variant: "holiday" as const },
        { text: "Kereta New Generation", variant: "new-generation" as const },
        { text: "Promo", variant: "promo" as const }
      ]
    },
    {
      fromCity: "JAKARTA",
      toCity: "SURABAYA",
      trainName: "ARGO BROMO 10",
      trainClass: "Executive",
      departureTime: "07:00",
      arrivalTime: "15:30",
      duration: "8h 30m",
      badges: [
        { text: "Premium", variant: "premium" as const },
        { text: "Diskon 20%", variant: "discount" as const }
      ]
    },
    {
      fromCity: "BANDUNG",
      toCity: "YOGYA",
      trainName: "TURANGGA 23",
      trainClass: "Business",
      departureTime: "09:15",
      arrivalTime: "16:45",
      duration: "7h 30m",
      badges: [
        { text: "Tersedia", variant: "available" as const },
        { text: "Kursi Terbatas", variant: "limited" as const }
      ]
    }
  ];

  const displayTrains = trains.length > 0 ? trains : defaultTrains;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Train Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTrains.map((train, index) => (
          <TrainBookingCard
            key={index}
            {...train}
            onClick={() => onTrainClick?.(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainBookingSection;