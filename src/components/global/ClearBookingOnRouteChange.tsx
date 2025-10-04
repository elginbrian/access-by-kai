"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BookingSecureStorage } from "@/lib/storage/SecureStorage";

export default function ClearBookingOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (!pathname) return;

      if (!pathname.startsWith("/trains")) {
        BookingSecureStorage.clearBookingData();
      }
    } catch (e) {}
  }, [pathname]);

  return null;
}
