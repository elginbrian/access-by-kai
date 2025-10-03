import React, { Suspense } from "react";
import ClientTrainsPage from "@/app/trains/ClientTrainsPage";

export default function TrainBookingResults({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  return (
    <Suspense fallback={<div className="min-h-screen">Memuat...</div>}>
      <ClientTrainsPage rawSearchParams={searchParams ?? {}} />
    </Suspense>
  );
}
