import { useState, useCallback } from "react";
import { BookingSecureStorage } from "@/lib/storage/SecureStorage";

export function useSeatSelection() {
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(() => {
    try {
      if (typeof window === "undefined") return [];

      const seatData = BookingSecureStorage.getSeatData();
      if (seatData && Array.isArray(seatData.seats) && seatData.seats.length > 0) {
        return seatData.seats;
      }

      const booking = BookingSecureStorage.getBookingData();
      if (booking && Array.isArray(booking.passengers) && booking.passengers.length > 0) {
        return booking.passengers.map((p: any) => p.seat || "");
      }
    } catch (e) {}
    return [];
  });
  const [isRouteExpanded, setIsRouteExpanded] = useState(false);

  const handleSeatSelect = useCallback((seats: string[]) => {
    setSelectedSeats((prev) => {
      const same = prev.length === seats.length && prev.every((s, i) => s === seats[i]);
      if (same) return prev;
      return seats;
    });
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
