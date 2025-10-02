import { useState, useEffect, useMemo } from "react";

export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

export interface UseTrainFiltersProps {
  maxPrice: number;
}

export const useTrainFilters = ({ maxPrice }: UseTrainFiltersProps) => {
  const [priceValue, setPriceValue] = useState(500000);
  const [sortBy, setSortBy] = useState("departure");

  const [trainTypes, setTrainTypes] = useState<FilterOption[]>([
    { id: "EKSEKUTIF", label: "Eksekutif", checked: false },
    { id: "EKONOMI", label: "Ekonomi", checked: false },
    { id: "BISNIS", label: "Bisnis", checked: false },
    { id: "LUXURY", label: "Luxury", checked: false },
    { id: "PRIORITY", label: "Priority", checked: false },
  ]);

  const [departureTimes, setDepartureTimes] = useState<FilterOption[]>([
    { id: "morning", label: "Pagi (06:00 - 12:00)", checked: false },
    { id: "afternoon", label: "Siang (12:00 - 18:00)", checked: false },
    { id: "evening", label: "Sore (18:00 - 24:00)", checked: false },
    { id: "night", label: "Malam (00:00 - 06:00)", checked: false },
  ]);

  const [arrivalTimes, setArrivalTimes] = useState<FilterOption[]>([
    { id: "morning", label: "Pagi (06:00 - 12:00)", checked: false },
    { id: "afternoon", label: "Siang (12:00 - 18:00)", checked: false },
    { id: "evening", label: "Sore (18:00 - 24:00)", checked: false },
    { id: "night", label: "Malam (00:00 - 06:00)", checked: false },
  ]);

  useEffect(() => {
    if (priceValue === 500000 && maxPrice > 500000) {
      setPriceValue(maxPrice);
    }
  }, [maxPrice, priceValue]);

  const handleTrainTypeChange = (optionId: string, checked: boolean) => {
    setTrainTypes((prev) => prev.map((item) => (item.id === optionId ? { ...item, checked } : item)));
  };

  const handleDepartureTimeChange = (optionId: string, checked: boolean) => {
    setDepartureTimes((prev) => prev.map((item) => (item.id === optionId ? { ...item, checked } : item)));
  };

  const handleArrivalTimeChange = (optionId: string, checked: boolean) => {
    setArrivalTimes((prev) => prev.map((item) => (item.id === optionId ? { ...item, checked } : item)));
  };

  const resetAllFilters = () => {
    setTrainTypes((prev) => prev.map((t) => ({ ...t, checked: false })));
    setDepartureTimes((prev) => prev.map((t) => ({ ...t, checked: false })));
    setArrivalTimes((prev) => prev.map((t) => ({ ...t, checked: false })));
    setPriceValue(maxPrice);
    setSortBy("departure");
  };

  const hasActiveFilters = useMemo(() => {
    return trainTypes.some((t) => t.checked) || departureTimes.some((t) => t.checked) || arrivalTimes.some((t) => t.checked) || priceValue < maxPrice;
  }, [trainTypes, departureTimes, arrivalTimes, priceValue, maxPrice]);

  const activeFilters = useMemo(() => {
    return [
      ...trainTypes.filter((t) => t.checked).map((t) => `Kelas: ${t.label}`),
      ...departureTimes.filter((t) => t.checked).map((t) => `Berangkat: ${t.label.split(" ")[0]}`),
      ...arrivalTimes.filter((t) => t.checked).map((t) => `Tiba: ${t.label.split(" ")[0]}`),
    ];
  }, [trainTypes, departureTimes, arrivalTimes]);

  return {
    priceValue,
    setPriceValue,
    sortBy,
    setSortBy,
    trainTypes,
    departureTimes,
    arrivalTimes,
    handleTrainTypeChange,
    handleDepartureTimeChange,
    handleArrivalTimeChange,
    resetAllFilters,
    hasActiveFilters,
    activeFilters,
  };
};
