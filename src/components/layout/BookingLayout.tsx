"use client";

import { BookingProvider } from "@/lib/hooks/useBookingContext";
import { CentralBookingProvider } from "@/lib/hooks/useCentralBooking";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <CentralBookingProvider>{children}</CentralBookingProvider>
    </BookingProvider>
  );
}
