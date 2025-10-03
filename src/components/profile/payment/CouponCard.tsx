"use client";

import React from "react";
import { colors } from "@/app/design-system";

interface CouponCardProps {
  title: string;
  discount: string;
  description: string;
  terms: string;
  expiry: string;
  requiredPoints?: number; // points needed to redeem
  availablePoints?: number; // user's current points
  isRedeemed?: boolean;
  onRedeem?: () => void;
  className?: string;
}

const CouponCard: React.FC<CouponCardProps> = ({
  title,
  discount,
  description,
  terms,
  expiry,
  requiredPoints,
  availablePoints,
  isRedeemed = false,
  onRedeem,
  className = "",
}) => {
  const pointsLabel = requiredPoints ? `${requiredPoints.toLocaleString("id-ID")} Poin` : null;
  const isDisabled = typeof requiredPoints === "number" && typeof availablePoints === "number" && availablePoints < requiredPoints;

  return (
    <div
      className={`relative rounded-xl p-5 transition-all duration-200 ${className}`}
      style={{
        background: isDisabled ? "#f8fafb" : "#fff8ec",
        border: `2px dotted ${colors.orange.normal}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full text-white text-sm font-semibold" style={{ background: colors.orange.normal }}>
                {discount} OFF
              </div>
              <div className="text-sm text-gray-500">{expiry}</div>
            </div>

            <div className="text-sm text-orange-600 font-semibold">{pointsLabel}</div>
          </div>

          <h3 className={`text-lg font-semibold mb-2 ${isDisabled ? "text-gray-400" : "text-gray-900"}`}>{title}</h3>

          <p className={`text-sm mb-3 ${isDisabled ? "text-gray-400" : "text-gray-700"}`}>{description}</p>

          <p className={`text-xs ${isDisabled ? "text-gray-400" : "text-gray-500"}`}>{terms}</p>
        </div>
      </div>

      <div className="mt-4">
        {!isDisabled && !isRedeemed ? (
          <button
            onClick={onRedeem}
            className="w-full py-3 rounded-md text-white font-medium"
            style={{ background: colors.orange.normal }}
          >
            Tukar Poin
          </button>
        ) : isRedeemed ? (
          <div className="w-full py-3 rounded-md text-center font-medium text-gray-500 bg-gray-100">Terpakai</div>
        ) : (
          <div className="w-full py-3 rounded-md text-center font-medium text-gray-400 bg-gray-100">Poin Kurang</div>
        )}
      </div>
    </div>
  );
};

export default CouponCard;