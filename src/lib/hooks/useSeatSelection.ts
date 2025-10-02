import { useState, useCallback } from "react";

export function useSeatSelection() {
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isRouteExpanded, setIsRouteExpanded] = useState(false);

  const handleSeatSelect = useCallback((seats: string[]) => {
    setSelectedSeats(seats);
  }, []);

  const handleSingleSeatSelect = useCallback((seatNumber: string, passengerIndex: number) => {
    setSelectedSeats((prev) => {
      const newSeats = [...prev];
      newSeats[passengerIndex] = seatNumber;
      return newSeats;
    });
  }, []);

  const handleRemoveSeat = useCallback((passengerIndex: number) => {
    setSelectedSeats((prev) => {
      const newSeats = [...prev];
      newSeats.splice(passengerIndex, 1);
      return newSeats;
    });
  }, []);

  const handleCloseSeatSelection = useCallback(() => {
    setShowSeatSelection(false);
  }, []);

  const handleOpenSeatSelection = useCallback(() => {
    setShowSeatSelection(true);
  }, []);

  const handleToggleRoute = useCallback(() => {
    setIsRouteExpanded((prev) => !prev);
  }, []);

  // Utility to get seat for specific passenger
  const getSeatForPassenger = useCallback(
    (passengerIndex: number): string | undefined => {
      return selectedSeats[passengerIndex];
    },
    [selectedSeats]
  );

  // Utility to check if all passengers have seats
  const areAllSeatsSelected = useCallback(
    (passengerCount: number): boolean => {
      return selectedSeats.length >= passengerCount && selectedSeats.slice(0, passengerCount).every((seat) => seat && seat !== "");
    },
    [selectedSeats]
  );

  return {
    showSeatSelection,
    selectedSeats,
    isRouteExpanded,
    handleSeatSelect,
    handleSingleSeatSelect,
    handleRemoveSeat,
    handleCloseSeatSelection,
    handleOpenSeatSelection,
    handleToggleRoute,
    getSeatForPassenger,
    areAllSeatsSelected,
  };
}
