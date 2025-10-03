"use client";

import React from "react";

interface RatingReviewsProps {
  rating: number;
  maxRating?: number;
  reviewLabel?: string;
  features?: string[];
}

const RatingReviews: React.FC<RatingReviewsProps> = ({
  rating,
  maxRating = 10,
  reviewLabel = "Mengagumkan",
  features = ["Nyaman & Bersih", "Staf Ramah", "Lokasi Strategis", "Fasilitas Lengkap"]
}) => {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Rating & Ulasan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rating Display */}
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">{rating}</div>
          <div className="text-gray-500 mb-2">/ {maxRating}</div>
          <div className="text-sm text-gray-600 mb-4 text-black">{reviewLabel}</div>
          <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <img src="/ic_tick_green_fill.svg" alt="Check" className="w-4 h-4" />
              <span className="text-sm text-black">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingReviews;