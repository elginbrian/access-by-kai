import React, { Suspense } from "react";
import ClientShowlokDisplay from "@/app/locker/display/ClientShowlokDisplay";

export default function ShowlokDisplayPage({ searchParams }: { searchParams?: { ticket?: string } }) {
  const ticketId = searchParams?.ticket ?? null;

  return (
    <Suspense fallback={<div className="min-h-screen">Memuat...</div>}>
      <ClientShowlokDisplay ticketId={ticketId ?? null} />
    </Suspense>
  );
}
