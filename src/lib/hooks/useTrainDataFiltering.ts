import { useMemo } from "react";
import { FilterOption } from "./useTrainFilters";

export interface TrainData {
  jadwal_id: number;
  nama_kereta: string;
  nomor_ka: string;
  kode_jadwal: string;
  harga_mulai: number;
  kelas_tersedia: string[];
  waktu_berangkat: string;
  waktu_tiba: string;
  durasi: string;
  kursi_tersedia: number;
  jenis_layanan: string;
  stasiun_asal: { nama: string; kode: string };
  stasiun_tujuan: { nama: string; kode: string };
  fasilitas: string[];
}

interface UseTrainDataFilteringProps {
  trains: TrainData[];
  priceValue: number;
  trainTypes: FilterOption[];
  departureTimes: FilterOption[];
  arrivalTimes: FilterOption[];
  sortBy: string;
}

export const useTrainDataFiltering = ({ trains, priceValue, trainTypes, departureTimes, arrivalTimes, sortBy }: UseTrainDataFilteringProps) => {
  const getTimeSlot = (hour: number): string => {
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    if (hour >= 18 && hour < 24) return "evening";
    return "night";
  };

  const filteredAndSortedResults = useMemo(() => {
    if (!trains.length) return [];

    // Filter trains
    const filtered = trains.filter((train) => {
      // Price filter
      if (train.harga_mulai > priceValue) return false;

      // Train type filter
      const selectedTrainTypes = trainTypes.filter((t) => t.checked).map((t) => t.id);
      if (selectedTrainTypes.length > 0) {
        const availableClasses = Array.isArray(train.kelas_tersedia) ? train.kelas_tersedia : typeof train.kelas_tersedia === "string" ? [train.kelas_tersedia] : [];

        const hasMatchingClass = selectedTrainTypes.some((selectedType) =>
          availableClasses.some((availableClass) => {
            if (!availableClass) return false;
            const availableUpper = availableClass.toString().toUpperCase();
            const selectedUpper = selectedType.toUpperCase();
            return availableUpper === selectedUpper || availableUpper.includes(selectedUpper);
          })
        );

        if (!hasMatchingClass) return false;
      }

      // Departure time filter
      const selectedDepartureTimes = departureTimes.filter((t) => t.checked).map((t) => t.id);
      if (selectedDepartureTimes.length > 0) {
        const departureDate = new Date(train.waktu_berangkat);
        if (isNaN(departureDate.getTime())) return false;

        const departureHour = departureDate.getHours();
        const timeSlot = getTimeSlot(departureHour);
        if (!selectedDepartureTimes.includes(timeSlot)) return false;
      }

      // Arrival time filter
      const selectedArrivalTimes = arrivalTimes.filter((t) => t.checked).map((t) => t.id);
      if (selectedArrivalTimes.length > 0) {
        const arrivalDate = new Date(train.waktu_tiba);
        if (isNaN(arrivalDate.getTime())) return false;

        const arrivalHour = arrivalDate.getHours();
        const timeSlot = getTimeSlot(arrivalHour);
        if (!selectedArrivalTimes.includes(timeSlot)) return false;
      }

      return true;
    });

    // Sort trains
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "departure":
          return new Date(a.waktu_berangkat).getTime() - new Date(b.waktu_berangkat).getTime();
        case "price-low":
          return (a.harga_mulai || 0) - (b.harga_mulai || 0);
        case "price-high":
          return (b.harga_mulai || 0) - (a.harga_mulai || 0);
        case "duration":
          const getDurationMinutes = (durasi: string) => {
            const matches = durasi.match(/(\d+)h\s*(\d+)m/);
            if (!matches) return 0;
            return parseInt(matches[1]) * 60 + parseInt(matches[2]);
          };
          return getDurationMinutes(a.durasi || "0h 0m") - getDurationMinutes(b.durasi || "0h 0m");
        default:
          return 0;
      }
    });

    return sorted;
  }, [trains, priceValue, trainTypes, departureTimes, arrivalTimes, sortBy]);

  return filteredAndSortedResults;
};
