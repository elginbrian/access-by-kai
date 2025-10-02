"use client";

import { useBookingTimerContext } from "@/lib/providers/BookingTimerProvider";
import { useEffect, useState } from "react";

interface MiniBookingTimerProps {
  className?: string;
}

export default function MiniBookingTimer({ className = "" }: MiniBookingTimerProps) {
  const { timeLeft, isActive, isTimeUp, formattedTime } = useBookingTimerContext();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 120 && timeLeft > 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [timeLeft]);

  if (!isActive && !isTimeUp) {
    return null;
  }

  if (isTimeUp) {
    return (
      <div className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <span className="font-semibold">Waktu Habis</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${showWarning ? "text-orange-600" : "text-gray-600"} ${className}`}>
      <svg className={`w-4 h-4 ${showWarning ? "text-orange-600" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
      <span className={`font-medium ${showWarning ? "text-orange-600" : "text-gray-600"}`}>Sisa Waktu: {formattedTime}</span>
    </div>
  );
}
