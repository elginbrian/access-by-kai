"use client";

import React from "react";
import { TrainBookingDetails } from "@/lib/hooks/useTrainBookingDetails";

interface TrainInfoCardProps {
  trainDetails: TrainBookingDetails | null | undefined;
}

const TrainInfoCard: React.FC<TrainInfoCardProps> = ({ trainDetails }) => {
  return (
    <div className="space-y-6">
      {/* About This Train */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Tentang Kereta Ini</h2>
        <div className="relative rounded-xl overflow-hidden mb-3">
          <img src="/img_illustration_train_interior.jpg" alt="Train interior" className="w-full h-40 object-cover" />
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {trainDetails?.deskripsi || `${trainDetails?.nama_kereta || "Kereta ini"} adalah layanan ${trainDetails?.jenis_layanan || "standard"} dengan fasilitas nyaman untuk perjalanan Anda.`}
        </p>
      </div>

      {/* Facilities */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Fasilitas</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <img src="/ic_ac_blue.svg" alt="Air Conditioning" />
              <span>AC</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <img src="/ic_toilet_blue.svg" alt="Toilet" />
              <span>Toilet</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <img src="/ic_charging_ports.svg" alt="Colokan Listrik" />
              <span>Colokan Listrik</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <img src="/ic_luggage_blue.svg" alt="Bagasi Gratis" />
              <span>Bagasi Gratis</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <img src="/ic_meal_blue.svg" alt="Kereta Makan" />
            <span>Kereta Makan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainInfoCard;
