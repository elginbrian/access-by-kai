"use client";

import React from "react";
import FilterSection from "./FilterSection";

interface PriceRangeFilterProps {
  priceValue: number;
  setPriceValue: (value: number) => void;
  minPrice?: number;
  maxPrice?: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ priceValue, setPriceValue, minPrice = 50000, maxPrice = 500000 }) => {
  return (
    <FilterSection title="Rentang Harga" icon="/ic_price_tag.svg" iconBgColor="bg-yellow-100">
      <input type="range" min={minPrice} max={maxPrice} value={priceValue} onChange={(e) => setPriceValue(parseInt(e.target.value))} className="w-full accent-blue-500" />
      <div className="flex justify-between text-xs text-black mt-2">
        <span className="text-black">Rp {minPrice.toLocaleString("id-ID")}</span>
        <span className="text-black">Rp {maxPrice.toLocaleString("id-ID")}</span>
      </div>
      <div className="text-center text-xl font-bold mt-3 bg-gradient-to-b from-[#6b46c1] to-[#3b82f6] bg-clip-text text-transparent">Rp {priceValue.toLocaleString("id-ID")}</div>
    </FilterSection>
  );
};

export default PriceRangeFilter;
