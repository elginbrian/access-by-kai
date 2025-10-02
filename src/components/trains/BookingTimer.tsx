"use client";

import { useBookingTimerContext } from "@/lib/providers/BookingTimerProvider";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BookingTimerProps {
  className?: string;
}

export default function BookingTimer({ className = "" }: BookingTimerProps) {
  const { timeLeft, isActive, isTimeUp, formattedTime, timePercentage } = useBookingTimerContext();

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

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div
        className={`
        bg-white rounded-lg shadow-lg border-2 p-4 min-w-[200px]
        ${isTimeUp ? "border-red-500 bg-red-50" : showWarning ? "border-orange-500 bg-orange-50" : "border-blue-500"}
        transition-all duration-300
      `}
      >
        {isTimeUp ? (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Waktu Habis!</div>
              <div className="text-xs">Mengarahkan ke halaman trains...</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image src="/ic_clock.svg" alt="Clock" width={16} height={16} className={showWarning ? "opacity-75" : "opacity-100"} />
              <span className={`text-xs font-medium ${showWarning ? "text-orange-600" : "text-blue-600"}`}>Waktu Booking</span>
            </div>

            <div className={`text-lg font-bold mb-2 ${showWarning ? "text-orange-600" : "text-blue-600"}`}>{formattedTime}</div>

            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
              <div className={`h-1.5 rounded-full transition-all duration-1000 ${showWarning ? "bg-orange-500" : "bg-blue-500"}`} style={{ width: `${100 - timePercentage}%` }}></div>
            </div>

            {showWarning && <div className="text-xs text-orange-600 font-medium">Segera selesaikan booking!</div>}
          </div>
        )}
      </div>
    </div>
  );
}
