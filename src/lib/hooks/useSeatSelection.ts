import { useState } from "react";

export function useSeatSelection() {
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isRouteExpanded, setIsRouteExpanded] = useState(false);

  const handleSeatSelect = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const handleCloseSeatSelection = () => {
    setShowSeatSelection(false);
  };

  const handleOpenSeatSelection = () => {
    setShowSeatSelection(true);
  };

  const handleToggleRoute = () => {
    setIsRouteExpanded((prev) => !prev);
  };

  return {
    showSeatSelection,
    selectedSeats,
    isRouteExpanded,
    handleSeatSelect,
    handleCloseSeatSelection,
    handleOpenSeatSelection,
    handleToggleRoute,
  };
}
