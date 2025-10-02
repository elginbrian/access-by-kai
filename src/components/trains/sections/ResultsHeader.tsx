import React from "react";
import { colors } from "@/app/design-system";

interface ResultsHeaderProps {
  isLoading: boolean;
  hasSearchCriteria: boolean;
  totalItems: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ isLoading, hasSearchCriteria, totalItems, sortBy, onSortChange }) => {
  const getTitle = () => {
    if (isLoading) return "Mencari Kereta...";
    if (hasSearchCriteria) return `Hasil Pencarian (${totalItems} Kereta)`;
    return `Semua Kereta Tersedia (${totalItems} Kereta)`;
  };

  return (
    <div id="results-section" className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
      <div>
        <h2 className="text-xl font-bold" style={{ color: colors.base.darker }}>
          {getTitle()}
        </h2>
      </div>

      {!isLoading && (
        <div className="flex items-center space-x-2">
          <span className="text-sm" style={{ color: colors.base.darker }}>
            Urutkan:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm"
            style={{
              color: colors.base.darker,
              borderColor: colors.base.normalActive,
            }}
          >
            <option value="departure">Waktu Keberangkatan</option>
            <option value="price-low">Harga (Rendah ke Tinggi)</option>
            <option value="price-high">Harga (Tinggi ke Rendah)</option>
            <option value="duration">Durasi Perjalanan</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ResultsHeader;
