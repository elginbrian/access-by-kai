"use client";

import React from "react";
import { colors } from "../../../app/design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrainSearchSchema, type TrainSearchFormData } from "../../../lib/validators/train-search";
import { useStationsForSearch } from "../../../lib/hooks/train-search";
import { useRouter } from "next/navigation";
import CustomSelect from "../../ui/form/CustomSelect";

const SearchCard = () => {
  const router = useRouter();

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
      departureStationId: "" as string | number,
      arrivalStationId: "" as string | number,
      departureDate: "",
      returnDate: "",
      passengers: 1,
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

  const onSubmit = async (data: any) => {
    setIsSearching(true);
    console.log("Search data:", data);

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
      ...(data.returnDate && { returnDate: data.returnDate }),
    });

    router.push(`/trains?${searchParams.toString()}`);
    setIsSearching(false);
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

  return (
    <div className="w-full max-w-[100rem] flex justify-center mx-auto p-6 pt-20">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.base.darker }}>
          Book Your Train Journey
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form Row - Exactly like original */}
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
                aria-label="Swap locations"
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

            {/* Return Date */}
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center text-sm font-semibold mb-2" style={{ color: colors.violet.normal }}>
                <img src="/ic_calendar.svg" alt="Calendar Icon" />
                <span className="ml-2">Tanggal Pulang</span>
              </label>
              <input
                type="date"
                {...register("returnDate")}
                min={watchedValues.departureDate || today}
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
          </div>

          <button
            type="submit"
            disabled={isSearching || stationsLoading}
            className="w-full mt-6 py-4 text-white font-bold text-lg rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none"
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
                <span>Mencari Jadwal...</span>
              </>
            ) : (
              <>
                <SearchIcon />
                <span>Search Trains</span>
              </>
            )}
          </button>
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

export default SearchCard;
