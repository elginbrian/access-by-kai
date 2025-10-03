"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { BookingSecureStorage } from "@/lib/storage/SecureStorage";
import toast from "react-hot-toast";

export function useSeatChange() {
  const router = useRouter();

  const startSeatChange = useCallback(
    (ticketDetail: any, currentUserId?: number) => {
      try {
        if (!ticketDetail) {
          toast.error("Data tiket tidak valid untuk proses ganti kursi");
          return;
        }

        const seatData = {
          type: "seat-change",
          tiketId: ticketDetail.tiketId ?? ticketDetail.id ?? null,
          ticketNumber: ticketDetail.ticketNumber ?? null,
          jadwalId: ticketDetail.jadwalId ?? ticketDetail.jadwal?.id ?? null,
          trainName: ticketDetail.trainName ?? null,
          bookingId: ticketDetail.booking?.id ?? null,
          passenger: {
            id: ticketDetail.passenger?.id ?? null,
            name: ticketDetail.passenger?.name ?? null,
            seat: ticketDetail.seat?.number ?? null,
            car: ticketDetail.seat?.car ?? null,
          },
          initiatedByUserId: currentUserId ?? null,
          startedAt: new Date().toISOString(),
        };

        BookingSecureStorage.setSeatData(seatData);

        const jadwalId = seatData.jadwalId;
        const basePath = jadwalId ? `/trains/booking/${jadwalId}` : "/trains/booking/";

        router.push(`${basePath}?seatChange=true`);
      } catch (err) {
        console.error("startSeatChange error:", err);
        toast.error("Gagal memulai proses ganti kursi");
      }
    },
    [router]
  );

  return {
    startSeatChange,
  } as const;
}
