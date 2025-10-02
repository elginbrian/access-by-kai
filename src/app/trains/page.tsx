"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import SearchSummary from "@/components/trains/trainSummary/SearchSummary";
import ScheduleEditCard from "@/components/trains/schedule/ScheduleEditCard";
import PromoBanner from "@/components/trains/promotions/PromoBanner";
import FloatingChat from "@/components/trains/floatButton/FloatingChat";
import ChatSidebar from "@/components/trains/chat/ChatSidebar";
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

const TrainBookingResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

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

    console.log("Search params debug:", {
      from: searchParams.get("from"),
      departure: searchParams.get("departure"),
      to: searchParams.get("to"),
      arrival: searchParams.get("arrival"),
      date: searchParams.get("date"),
      departureDate: searchParams.get("departureDate"),
      finalFrom: fromParam,
      finalTo: toParam,
      finalDate: dateParam,
    });

    if (!fromParam || !toParam || !dateParam) {
      console.log("Missing required parameters:", { fromParam, toParam, dateParam });
      return null;
    }

    const criteria = {
      departureStationId: parseInt(fromParam, 10),
      arrivalStationId: parseInt(toParam, 10),
      departureDate: dateParam,
      trainClass: (classParam as any) || undefined,
    };

    console.log("Final search criteria:", criteria);
    return criteria;
  }, [searchParams]);

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
    console.log("Booking train:", train);

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
      console.log("Cannot switch stations when showing all results");
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

  const handleViewOffers = () => {
    console.log("View offers clicked");
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChatSidebar = () => {
    setIsChatOpen(false);
  };

  const handleNavClick = (section: string) => {
    console.log("Nav clicked:", section);
  };

  const handleScheduleEditClose = () => {
    setIsScheduleEditOpen(false);
  };

  return (
    <ErrorBoundary fallback={TrainErrorFallback}>
      <div className="min-h-screen relative" style={{ backgroundColor: colors.violet.light }}>
        <div
          className={`sticky z-30 transition-all duration-300 ease-in-out ${isAtTop ? "top-0" : scrollDirection === "down" ? "-translate-y-full top-0" : "top-0 translate-y-0 shadow-lg backdrop-blur-sm"}`}
          style={{
            backgroundColor: isAtTop ? colors.violet.light : `${colors.violet.light}f0`,
          }}
        >
          <TrainNavigation onNavClick={handleNavClick} />
          <SearchSummary
            departure={searchCriteria ? (stationsLoading ? "Memuat stasiun..." : departureStation?.label || `Stasiun ID: ${searchCriteria.departureStationId}`) : defaultSummaryData.departure}
            arrival={searchCriteria ? (stationsLoading ? "Memuat stasiun..." : arrivalStation?.label || `Stasiun ID: ${searchCriteria.arrivalStationId}`) : defaultSummaryData.arrival}
            date={
              searchCriteria?.departureDate
                ? new Date(searchCriteria.departureDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : defaultSummaryData.date
            }
            passengers={searchCriteria ? `${passengersCount} ${parseInt(passengersCount) === 1 ? "Penumpang" : "Penumpang"}` : defaultSummaryData.passengers}
            onEditSchedule={handleEditSchedule}
            onSwitchStations={handleSwitchStations}
          />
        </div>

        {isScheduleEditOpen && (
          <div className={`transition-all duration-300 ease-in-out ${scrollDirection === "down" && !isAtTop ? "-mt-28" : "mt-8"}`}>
            <ScheduleEditCard
              isVisible={isScheduleEditOpen}
              onClose={handleScheduleEditClose}
              initialData={
                searchCriteria
                  ? {
                      departureStationId: searchCriteria.departureStationId,
                      arrivalStationId: searchCriteria.arrivalStationId,
                      departureDate: searchCriteria.departureDate,
                      passengers: parseInt(passengersCount),
                    }
                  : {
                      departureStationId: 0,
                      arrivalStationId: 0,
                      departureDate: new Date().toISOString().split("T")[0],
                      passengers: 1,
                    }
              }
            />
          </div>
        )}

        <div className={`max-w-7xl mx-auto px-6 transition-all duration-300 ease-in-out ${scrollDirection === "down" && !isAtTop ? "-mt-48" : "pt-6"}`}>
          <div className="flex flex-col lg:flex-row gap-6">
            <FilterSection
              priceValue={filters.priceValue}
              setPriceValue={filters.setPriceValue}
              minPrice={50000}
              maxPrice={maxPrice}
              trainTypes={filters.trainTypes}
              departureTimes={filters.departureTimes}
              arrivalTimes={filters.arrivalTimes}
              onTrainTypeChange={filters.handleTrainTypeChange}
              onDepartureTimeChange={filters.handleDepartureTimeChange}
              onArrivalTimeChange={filters.handleArrivalTimeChange}
              hasActiveFilters={filters.hasActiveFilters}
              onResetFilters={filters.resetAllFilters}
            />

            {/* Scrollable Main Area */}
            <div ref={rightColumnRef} className="flex-1 mb-2 min-w-0 space-y-4 lg:max-h-screen lg:overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {/* Promo Banner */}
              <PromoBanner title="Diskon Spesial Akhir Pekan!" description="Dapatkan diskon hingga 30% untuk tiket kelas Eksekutif" buttonText="Lihat Penawaran" onViewOffers={handleViewOffers} />

              {/* Active Filters Display */}
              <ActiveFiltersDisplay activeFilters={filters.activeFilters} onResetFilters={filters.resetAllFilters} />

              {/* Results Header */}
              <ResultsHeader isLoading={searchLoading || allTrainsLoading} hasSearchCriteria={!!searchCriteria} totalItems={filteredAndSortedResults.length} sortBy={filters.sortBy} onSortChange={filters.setSortBy} />

              {/* Loading State */}
              {(searchLoading || allTrainsLoading) && <EmptyStateMessage type="loading" hasSearchCriteria={!!searchCriteria} />}

              {/* Error State */}
              {searchError && <EmptyStateMessage type="error" errorMessage="Gagal memuat jadwal kereta. Silakan coba lagi atau periksa koneksi internet Anda." />}

              {/* Empty State - No trains found */}
              {!searchLoading && !allTrainsLoading && !searchError && filteredAndSortedResults.length === 0 && searchResults.length === 0 && allTrains.length === 0 && (
                <EmptyStateMessage type="noResults" hasSearchCriteria={!!searchCriteria} onEditSchedule={handleEditSchedule} />
              )}

              {/* No results after filtering */}
              {!searchLoading && !allTrainsLoading && !searchError && filteredAndSortedResults.length === 0 && (searchResults.length > 0 || allTrains.length > 0) && (
                <EmptyStateMessage type="noResultsWithFilters" hasActiveFilters={filters.hasActiveFilters} onResetFilters={filters.resetAllFilters} />
              )}

              {/* Train Cards */}
              {!searchLoading && !allTrainsLoading && currentPageResults.length > 0 && <TrainResultsList trains={currentPageResults} onBookNow={handleBookNow} />}

              {/* Pagination */}
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.handlePageChange}
                onPrevPage={pagination.handlePrevPage}
                onNextPage={pagination.handleNextPage}
                canGoPrev={pagination.canGoPrev}
                canGoNext={pagination.canGoNext}
                pageNumbers={pagination.pageNumbers}
              />
            </div>
          </div>
        </div>

        {/* Floating Chat */}
        <FloatingChat notificationCount={2} onClick={handleChatClick} isHidden={isChatOpen} />

        {/* Chat Sidebar */}
        <ChatSidebar isOpen={isChatOpen} onClose={handleCloseChatSidebar} />
      </div>
    </ErrorBoundary>
  );
};

export default TrainBookingResults;
