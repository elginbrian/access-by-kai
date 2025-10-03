"use client";

import React from "react";

type EstimateProps = {
  totalPriceIdr?: number | null;
  breakdown?: { label: string; amountIdr: number }[];
  estimatedWeightKg?: number | null;
  estimatedVolumeM3?: number | null;
};

const EstimatedCost: React.FC<EstimateProps & { breakdown?: any }> = ({ totalPriceIdr = null, breakdown = [], estimatedWeightKg = null, estimatedVolumeM3 = null }) => {
  let items: { label: string; amountIdr: number }[] = [];
  if (Array.isArray(breakdown)) {
    items = breakdown;
  } else if (breakdown && typeof breakdown === "object") {
    items = Object.entries(breakdown).map(([k, v]) => ({ label: k, amountIdr: Number((v as any) ?? 0) }));
  }
  return (
    <div>
      <div className="flex items-center mb-4">
        <img src="/ic_invoice_white.svg" alt="Image" className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] h-10 w-10 p-2 rounded-lg mr-3" />
        <span className="text-lg font-semibold text-black">Estimated Cost</span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">No estimate yet. Fill the form and tekan "Calculate Price".</div>
        ) : (
          items.map((b, i) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">{b.label}</span>
              <span className="text-black font-bold">Rp {b.amountIdr.toLocaleString("id")}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center font-bold text-lg">
          <div>
            <div className="text-sm text-gray-500">Weight</div>
            <div className="text-black">{estimatedWeightKg ? `${estimatedWeightKg} kg` : `-`}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Cost</div>
            <div className="text-[#3b82f6] font-bold text-xl">{totalPriceIdr ? `Rp ${totalPriceIdr.toLocaleString("id")}` : `-`}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center mt-4">
        <img src="/ic_clock_gray.svg" alt="" className="h-4 w-4 mr-2" />
        <p className="text-sm text-gray-500 text-center">Estimated delivery: 2-3 business days</p>
      </div>
    </div>
  );
};

export default EstimatedCost;
