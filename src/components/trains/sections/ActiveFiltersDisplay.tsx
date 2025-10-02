import React from "react";
import { colors } from "@/app/design-system";

interface ActiveFiltersDisplayProps {
  activeFilters: string[];
  onResetFilters: () => void;
}

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({ activeFilters, onResetFilters }) => {
  if (activeFilters.length === 0) return null;

  return (
    <div
      className="rounded-lg p-3 mb-4"
      style={{
        backgroundColor: colors.violet.light,
        borderColor: colors.violet.lightActive,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium" style={{ color: colors.violet.dark }}>
          Filter Aktif:
        </span>
        {activeFilters.map((filter, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor: colors.violet.lightActive,
              color: colors.violet.dark,
            }}
          >
            {filter}
          </span>
        ))}
        <button onClick={onResetFilters} className="text-sm underline ml-2 hover:opacity-80 transition-opacity" style={{ color: colors.violet.normal }}>
          Hapus Semua Filter
        </button>
      </div>
    </div>
  );
};

export default ActiveFiltersDisplay;
