"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import SearchSummary from "@/components/trains/trainSummary/SearchSummary";
import ScheduleEditCard from "@/components/trains/schedule/ScheduleEditCard";
import PromoBanner from "@/components/trains/promotions/PromoBanner";
import ErrorBoundary, { TrainErrorFallback } from "@/components/ErrorBoundary";
import FilterSection from "@/components/trains/sections/FilterSection";
import ActiveFiltersDisplay from "@/components/trains/sections/ActiveFiltersDisplay";
import ResultsHeader from "@/components/trains/sections/ResultsHeader";
import EmptyStateMessage from "@/components/trains/sections/EmptyStateMessage";
import TrainResultsList from "@/components/trains/sections/TrainResultsList";
import PaginationControls from "@/components/trains/sections/PaginationControls";
import { useTrainScheduleSearch, useStationsForSearch, useAllTrainSchedules } from "@/lib/hooks/train-search";
import { useTrainFilters } from "@/lib/hooks/useTrainFilters";
import { useTrainDataFiltering } from "@/lib/hooks/useTrainDataFiltering";
import { usePagination } from "@/lib/hooks/usePagination";
import { useChat } from "@/lib/hooks/useChat";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";
import type { TrainScheduleSearchData } from "@/lib/validators/train-search";
import { colors } from "@/app/design-system";

interface Props {
  rawSearchParams: Record<string, string | string[]>;
}

const ClientTrainsPage: React.FC<Props> = ({ rawSearchParams }) => {
  const router = useRouter();
  const searchParams = new URLSearchParams();

  Object.entries(rawSearchParams).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((val) => searchParams.append(k, String(val)));
    } else if (v != null) {
      searchParams.set(k, String(v));
    }
  });

  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isScheduleEditOpen, setIsScheduleEditOpen] = React.useState(false);

  const rightColumnRef = React.useRef<HTMLDivElement>(null);

  const { scrollDirection, isAtTop } = useScrollDirection({
    threshold: 10,
    element: rightColumnRef,
  });

  React.useEffect(() => {
    const rightColumn = rightColumnRef.current;
    if (!rightColumn || !isScheduleEditOpen) return;

    const handleScroll = () => {
      if (isScheduleEditOpen) {
        setIsScheduleEditOpen(false);
      }
    };

    rightColumn.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      rightColumn.removeEventListener("scroll", handleScroll);
    };
  }, [isScheduleEditOpen]);

  const searchCriteria = React.useMemo((): TrainScheduleSearchData | null => {
    const fromParam = searchParams.get("from") || searchParams.get("departure");
    const toParam = searchParams.get("to") || searchParams.get("arrival");
    const dateParam = searchParams.get("date") || searchParams.get("departureDate");
    const classParam = searchParams.get("class");

    if (!fromParam || !toParam || !dateParam) {
      return null;
    }

    const criteria = {
      departureStationId: parseInt(fromParam, 10),
      arrivalStationId: parseInt(toParam, 10),
      departureDate: dateParam,
      trainClass: (classParam as any) || undefined,
    };

    return criteria;
  }, [searchParams.toString()]);

  const defaultSummaryData = React.useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayFormatted = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return {
      departure: "Semua",
      arrival: "Semua",
      date: todayFormatted,
      passengers: "1 Penumpang",
    };
  }, []);

  const { data: stations = [], isLoading: stationsLoading } = useStationsForSearch();
  const { data: searchResults = [], isLoading: searchLoading, error: searchError } = useTrainScheduleSearch(searchCriteria);
  const { data: allTrains = [], isLoading: allTrainsLoading } = useAllTrainSchedules();

  const departureStation = stations.find((s) => s.value === searchCriteria?.departureStationId);
  const arrivalStation = stations.find((s) => s.value === searchCriteria?.arrivalStationId);
  const passengersCount = searchParams.get("passengers") || searchParams.get("passenger") || "1";

  const maxPrice = React.useMemo(() => {
    const trainsToCheck = searchCriteria ? searchResults : allTrains;
    if (!trainsToCheck.length) return 500000;
    return Math.max(...trainsToCheck.map((train) => train.harga_mulai || 0)) + 50000;
  }, [searchCriteria, searchResults, allTrains]);

  const filters = useTrainFilters({ maxPrice });
  const trainsToFilter = searchCriteria ? searchResults : allTrains;
  const filteredAndSortedResults = useTrainDataFiltering({
    trains: trainsToFilter,
    priceValue: filters.priceValue,
    trainTypes: filters.trainTypes,
    departureTimes: filters.departureTimes,
    arrivalTimes: filters.arrivalTimes,
    sortBy: filters.sortBy,
  });

  const pagination = usePagination({
    totalItems: filteredAndSortedResults.length,
    itemsPerPage: 10,
    resetDependencies: [filters.priceValue, filters.trainTypes, filters.departureTimes, filters.arrivalTimes, filters.sortBy, searchCriteria],
  });

  const currentPageResults = filteredAndSortedResults.slice(pagination.startIndex, pagination.endIndex);

  const handleBookNow = (train: any) => {
    const bookingParams = new URLSearchParams();

    if (searchCriteria) {
      bookingParams.set("from", searchCriteria.departureStationId.toString());
      bookingParams.set("to", searchCriteria.arrivalStationId.toString());
      bookingParams.set("date", searchCriteria.departureDate);
      if (searchCriteria.trainClass) {
        bookingParams.set("class", searchCriteria.trainClass);
      }
    }

    if (passengersCount) {
      bookingParams.set("passengers", passengersCount);
    }

    router.push(`/trains/booking/${train.jadwalId}?${bookingParams.toString()}`);
  };

  const handleEditSchedule = () => {
    setIsScheduleEditOpen(true);
  };

  const handleSwitchStations = () => {
    if (searchCriteria === null) {
      return;
    }

    const newParams = new URLSearchParams(searchParams.toString());

    const currentDeparture = newParams.get("from") || newParams.get("departure");
    const currentArrival = newParams.get("to") || newParams.get("arrival");

    if (currentDeparture && currentArrival) {
      if (newParams.has("from")) {
        newParams.set("from", currentArrival);
        newParams.set("to", currentDeparture);
      } else {
        newParams.set("departure", currentArrival);
        newParams.set("arrival", currentDeparture);
      }

      router.push(`/trains?${newParams.toString()}`);
    }
  };

  const handleViewOffers = () => {};

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChatSidebar = () => {
    setIsChatOpen(false);
  };

  const handleNavClick = (section: string) => {};

  return (
    <div>
      <h1 className="text-2xl font-bold">Train search results</h1>
    </div>
  );
};

export default ClientTrainsPage;
