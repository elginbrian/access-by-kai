"use client";

import React from "react";
import { colors } from "../../../app/design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrainSearchSchema, type TrainSearchFormData } from "../../../lib/validators/train-search";
import { useStationsForSearch } from "../../../lib/hooks/train-search";
import { useRouter, useSearchParams } from "next/navigation";
import CustomSelect from "../../ui/form/CustomSelect";

interface ScheduleEditCardProps {
  isVisible: boolean;
  onClose: () => void;
  initialData?: {
    departureStationId: number;
    arrivalStationId: number;
    departureDate: string;
    passengers: number;
  };
}

const ScheduleEditCard: React.FC<ScheduleEditCardProps> = ({ isVisible, onClose, initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(TrainSearchSchema),
    defaultValues: {
      departureStationId: initialData?.departureStationId || ("" as string | number),
      arrivalStationId: initialData?.arrivalStationId || ("" as string | number),
      departureDate: initialData?.departureDate || "",
      returnDate: "",
      passengers: initialData?.passengers || 1,
    },
  });

  const watchedValues = watch();

  const { data: stations = [], isLoading: stationsLoading } = useStationsForSearch();

  const stationOptions = React.useMemo(() => {
    const individualStations = stations.map((station) => ({
      value: station.value,
      label: station.label,
      code: station.code,
      city: station.city,
      province: station.province,
      type: "station" as const,
    }));

    const cityGroups = stations.reduce((acc, station) => {
      if (station.city) {
        if (!acc[station.city]) {
          acc[station.city] = [];
        }
        acc[station.city].push(station);
      }
      return acc;
    }, {} as Record<string, typeof stations>);

    const cityOptions = Object.entries(cityGroups)
      .filter(([_, stationsInCity]) => stationsInCity.length > 1)
      .map(([cityName, stationsInCity]) => ({
        value: `city:${cityName}`,
        label: `${cityName}`,
        city: cityName,
        province: stationsInCity[0]?.province,
        code: `${stationsInCity.length} stasiun`,
        type: "city" as const,
        stationIds: stationsInCity.map((s) => s.value),
      }));

    const sortedCityOptions = cityOptions.sort((a, b) => a.city!.localeCompare(b.city!));
    const sortedStations = individualStations.sort((a, b) => a.label.localeCompare(b.label));

    if (sortedCityOptions.length > 0 && sortedStations.length > 0) {
      return [
        ...sortedCityOptions,
        {
          value: "separator",
          label: "── Stasiun Individual ──",
          type: "separator" as const,
        },
        ...sortedStations,
      ];
    }

    return [...sortedCityOptions, ...sortedStations];
  }, [stations]);
  const [isSearching, setIsSearching] = React.useState(false);

  const today = new Date().toISOString().split("T")[0];

  React.useEffect(() => {
    if (initialData) {
      setValue("departureStationId", initialData.departureStationId);
      setValue("arrivalStationId", initialData.arrivalStationId);
      setValue("departureDate", initialData.departureDate);
      setValue("passengers", initialData.passengers);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: any) => {
    setIsSearching(true);
    console.log("Search data:", data);

    // Handle city selections by converting them to station IDs
    const getDepartureStations = () => {
      if (typeof data.departureStationId === "string" && data.departureStationId.startsWith("city:")) {
        const cityOption = stationOptions.find((opt) => opt.value === data.departureStationId && opt.type === "city");
        return cityOption && "stationIds" in cityOption ? cityOption.stationIds : [data.departureStationId];
      }
      return [data.departureStationId];
    };

    const getArrivalStations = () => {
      if (typeof data.arrivalStationId === "string" && data.arrivalStationId.startsWith("city:")) {
        const cityOption = stationOptions.find((opt) => opt.value === data.arrivalStationId && opt.type === "city");
        return cityOption && "stationIds" in cityOption ? cityOption.stationIds : [data.arrivalStationId];
      }
      return [data.arrivalStationId];
    };

    const searchParams = new URLSearchParams({
      departure: getDepartureStations().join(","),
      arrival: getArrivalStations().join(","),
      departureDate: data.departureDate,
      passengers: data.passengers.toString(),
      ...(data.returnDate && { returnDate: data.returnDate }),
    });

    router.push(`/trains?${searchParams.toString()}`);
    setIsSearching(false);
    onClose();
  };

  const swapLocations = () => {
    const currentDeparture = getValues("departureStationId");
    const currentArrival = getValues("arrivalStationId");

    setValue("departureStationId", currentArrival);
    setValue("arrivalStationId", currentDeparture);
  };

  const SwapIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Tutup">
          <CloseIcon />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.base.darker }}>
          Ubah Jadwal Perjalanan
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form Row */}
          <div className="flex flex-row gap-4 items-end mb-6">
            {/* Departure */}
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center text-sm font-semibold mb-2" style={{ color: colors.violet.normal }}>
                <img src="/ic_train.svg" alt="Train Icon" style={{ color: colors.violet.normal }} />
                <span className="ml-2">Dari (Departure)</span>
              </label>
              <CustomSelect
                options={stationOptions}
                value={watchedValues.departureStationId || ""}
                onChange={(value) => setValue("departureStationId", typeof value === "string" && value.startsWith("city:") ? value : Number(value))}
                placeholder={stationsLoading ? "Memuat stasiun..." : "Pilih stasiun keberangkatan"}
                disabled={stationsLoading}
                loading={stationsLoading}
                searchable={true}
                error={!!errors.departureStationId}
              />
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center pb-3">
              <button
                type="button"
                onClick={swapLocations}
                className="p-3 rounded-full transition-colors focus:outline-none"
                style={{
                  backgroundColor: colors.violet.light,
                  color: colors.violet.normal,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.violet.normal;
                  e.currentTarget.style.color = colors.base.light;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.violet.light;
                  e.currentTarget.style.color = colors.violet.normal;
                }}
                aria-label="Tukar stasiun"
              >
                <SwapIcon />
              </button>
            </div>

            {/* Arrival */}
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center text-sm font-semibold mb-2" style={{ color: colors.violet.normal }}>
                <img src="/ic_train.svg" alt="Train Icon" style={{ color: colors.violet.normal }} />
                <span className="ml-2">Ke (Arrival)</span>
              </label>
              <CustomSelect
                options={stationOptions}
                value={watchedValues.arrivalStationId || ""}
                onChange={(value) => setValue("arrivalStationId", typeof value === "string" && value.startsWith("city:") ? value : Number(value))}
                placeholder={stationsLoading ? "Memuat stasiun..." : "Pilih stasiun tujuan"}
                disabled={stationsLoading}
                loading={stationsLoading}
                searchable={true}
                error={!!errors.arrivalStationId}
              />
            </div>

            {/* Departure Date */}
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center text-sm font-semibold mb-2" style={{ color: colors.violet.normal }}>
                <img src="/ic_calendar.svg" alt="Calendar Icon" />
                <span className="ml-2">Tanggal Berangkat</span>
              </label>
              <input
                type="date"
                {...register("departureDate")}
                min={today}
                className="w-full px-4 py-3 bg-white rounded-xl font-medium cursor-pointer transition-colors focus:outline-none"
                style={{
                  border: "2px solid #000000",
                  color: colors.base.darker,
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `2px solid ${colors.violet.normal}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "2px solid #000000";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${colors.violet.normal}`;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.violet.light}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "2px solid #000000";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Passengers */}
            <div className="flex-1 min-w-[150px]">
              <label className="flex items-center text-sm font-semibold mb-2" style={{ color: colors.violet.normal }}>
                <img src="/ic_person.svg" alt="Person Icon" />
                <span className="ml-2">Penumpang</span>
              </label>
              <input
                type="number"
                {...register("passengers", { valueAsNumber: true })}
                min="1"
                max="8"
                className="w-full px-4 py-3 bg-white rounded-xl font-medium transition-colors focus:outline-none"
                style={{
                  border: "2px solid #000000",
                  color: colors.base.darker,
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `2px solid ${colors.violet.normal}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "2px solid #000000";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${colors.violet.normal}`;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.violet.light}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "2px solid #000000";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-700 font-semibold rounded-2xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSearching || stationsLoading}
              className="flex-1 py-3 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none"
              style={{
                background: `linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)`,
                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(99, 102, 241, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.3)";
              }}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <SearchIcon />
                  <span>Cari Jadwal Baru</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {stationsLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colors.violet.normal }}></div>
            <span className="ml-2 text-sm" style={{ color: colors.violet.normal }}>
              Memuat data stasiun...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleEditCard;
