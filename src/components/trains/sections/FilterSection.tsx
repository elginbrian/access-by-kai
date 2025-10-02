import React from "react";
import PriceRangeFilter from "@/components/trains/filter/PriceRangeFilter";
import CheckboxFilter from "@/components/trains/filter/CheckboxFilter";
import { colors } from "@/app/design-system";
import { FilterOption } from "@/lib/hooks/useTrainFilters";

interface FilterSectionProps {
  priceValue: number;
  setPriceValue: (value: number) => void;
  minPrice: number;
  maxPrice: number;
  trainTypes: FilterOption[];
  departureTimes: FilterOption[];
  arrivalTimes: FilterOption[];
  onTrainTypeChange: (optionId: string, checked: boolean) => void;
  onDepartureTimeChange: (optionId: string, checked: boolean) => void;
  onArrivalTimeChange: (optionId: string, checked: boolean) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  priceValue,
  setPriceValue,
  minPrice,
  maxPrice,
  trainTypes,
  departureTimes,
  arrivalTimes,
  onTrainTypeChange,
  onDepartureTimeChange,
  onArrivalTimeChange,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0 mb-2">
      <div
        className="lg:sticky lg:top-6 mt-4 mb-16 space-y-4 lg:max-h-screen lg:overflow-y-auto p-4 duration-200 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Price Range */}
        <PriceRangeFilter priceValue={priceValue} setPriceValue={setPriceValue} minPrice={minPrice} maxPrice={maxPrice} />

        {/* Train Service Type */}
        <CheckboxFilter title="Jenis Kelas Kereta" icon="/ic_train_purple.svg" iconBgColor="bg-purple-100" options={trainTypes} onChange={onTrainTypeChange} />

        {/* Departure Time */}
        <CheckboxFilter title="Waktu Keberangkatan" icon="/ic_clock.svg" iconBgColor="bg-blue-100" options={departureTimes} onChange={onDepartureTimeChange} />

        {/* Arrival Time */}
        <CheckboxFilter title="Waktu Kedatangan" icon="/ic_arrival.svg" iconBgColor="bg-green-100" options={arrivalTimes} onChange={onArrivalTimeChange} />

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <button
              onClick={onResetFilters}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: colors.violet.light,
                color: colors.violet.dark,
                borderColor: colors.violet.lightActive,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.violet.lightActive;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.violet.light;
              }}
            >
              🔄 Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
