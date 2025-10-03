"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TrainBookingCard from "./TrainBookingCard";
import { useUserQuickBookingSimple } from "@/lib/hooks/useUserQuickBookingSimple";
import { useAuth } from "@/lib/auth/AuthContext";

interface TrainBookingSectionProps {
  title?: string;
  subtitle?: string;
  onTrainClick?: (jadwalId: number) => void;
}

const TrainBookingSection: React.FC<TrainBookingSectionProps> = ({
  title = "Pesan Cepat",
  subtitle = "Pesan kembali kereta yang pernah anda pesan",
  onTrainClick
}) => {
  const router = useRouter();
  const { user } = useAuth();
  
  // Use simple API instead of complex one
  const { data: recommendationData, isLoading, error } = useUserQuickBookingSimple();
  // Remove tracking for now to reduce requests
  // const trackInteraction = useTrackQuickBookingInteraction();

  // Generate session ID untuk tracking
  const sessionId = React.useMemo(() => 
    `qb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, []
  );

  // Track view event saat recommendations berhasil dimuat
  React.useEffect(() => {
    if (recommendationData?.recommendations && recommendationData.recommendations.length > 0) {
      console.log("Quick booking recommendations loaded:", recommendationData.recommendations.length);
      // Tracking disabled to reduce requests
    }
  }, [recommendationData]);

  // Jika user belum login, jangan tampilkan section ini
  if (!user) {
    return null;
  }

  // Jika sedang loading
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Jika ada error, jangan tampilkan section
  if (error) {
    return null;
  }

  // Jika user baru (belum ada completed trips), tampilkan section informatif
  if (recommendationData?.isNewUser || recommendationData?.isEmpty) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        
        {/* Empty State Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitur Pesan Cepat Tersedia!</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            {recommendationData.message || "Lakukan perjalanan pertama Anda untuk mendapatkan rekomendasi personal berdasarkan riwayat perjalanan."}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Rekomendasi akan muncul setelah Anda menyelesaikan perjalanan</span>
          </div>
        </div>
      </div>
    );
  }

  // Jika tidak ada rekomendasi available
  if (!recommendationData?.recommendations || recommendationData.recommendations.length === 0) {
    return null;
  }

  const handleTrainClick = (jadwalId: number, position: number) => {
    // Track click event - disabled to reduce requests
    console.log("Train clicked:", jadwalId, "position:", position);

    if (onTrainClick) {
      onTrainClick(jadwalId);
    } else {
      // Default behavior: redirect ke halaman booking dengan jadwal ID
      router.push(`/trains/booking/${jadwalId}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
        {recommendationData.message && (
          <p className="text-sm text-gray-500 mt-1">{recommendationData.message}</p>
        )}
      </div>

      {/* Train Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendationData.recommendations.map((train, index) => (
          <TrainBookingCard
            key={train.jadwalId}
            fromCity={train.fromCity}
            toCity={train.toCity}
            trainName={train.trainName}
            trainClass={train.trainClass}
            departureTime={train.departureTime}
            arrivalTime={train.arrivalTime}
            duration={train.duration}
            badges={train.badges}
            onClick={() => handleTrainClick(train.jadwalId, index + 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainBookingSection;