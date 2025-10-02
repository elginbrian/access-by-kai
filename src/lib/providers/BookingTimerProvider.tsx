"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useBookingTimer } from "@/lib/hooks/useBookingTimer";
import { useRouter, usePathname } from "next/navigation";

interface BookingTimerContextType {
  timeLeft: number;
  isActive: boolean;
  isTimeUp: boolean;
  formattedTime: string;
  timePercentage: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  resetAndStartTimer: () => void;
}

const BookingTimerContext = createContext<BookingTimerContextType | null>(null);

interface BookingTimerProviderProps {
  children: ReactNode;
}

export function BookingTimerProvider({ children }: BookingTimerProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const timer = useBookingTimer({
    totalMinutes: 6,
    redirectPath: "/trains",
    onTimeUp: () => {
      localStorage.removeItem("bookingTimerStart");
      localStorage.removeItem("bookingTimerEnd");
    },
  });

  useEffect(() => {
    const isBookingPage = pathname?.includes("/trains/booking") || pathname?.includes("/trains/food-order") || pathname?.includes("/trains/review") || pathname?.includes("/trains/payment");
    const isBookingEntryPage = pathname?.includes("/trains/booking");

    if (isBookingEntryPage) {
      const lastVisitedPage = sessionStorage.getItem("lastVisitedPage");
      const isFromTrainsPage =
        lastVisitedPage === "/trains" ||
        (lastVisitedPage?.includes("/trains") &&
          !lastVisitedPage?.includes("/trains/booking") &&
          !lastVisitedPage?.includes("/trains/food-order") &&
          !lastVisitedPage?.includes("/trains/review") &&
          !lastVisitedPage?.includes("/trains/payment"));

      if (isFromTrainsPage || !timer.isActive) {
        timer.resetAndStartTimer();
      }
    } else if (isBookingPage && !timer.isActive && !timer.isTimeUp) {
      const savedStartTime = localStorage.getItem("bookingTimerStart");
      if (!savedStartTime) {
        timer.startTimer();
      }
    }

    if (!isBookingPage && timer.isActive) {
      timer.stopTimer();
    }

    if (pathname) {
      sessionStorage.setItem("lastVisitedPage", pathname);
    }
  }, [pathname, timer]);

  return <BookingTimerContext.Provider value={timer}>{children}</BookingTimerContext.Provider>;
}

export function useBookingTimerContext() {
  const context = useContext(BookingTimerContext);
  if (!context) {
    throw new Error("useBookingTimerContext must be used within BookingTimerProvider");
  }
  return context;
}
