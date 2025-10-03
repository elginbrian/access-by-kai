import React, { Suspense } from "react";
import ClientLockerPage from "./ClientLockerPage";

export default function ShowLokPage({ searchParams }: { searchParams?: { payment?: string } }) {
  const paymentSuccess = searchParams?.payment === "success";

  return (
    <Suspense fallback={<div className="min-h-screen">Memuat...</div>}>
      <ClientLockerPage paymentSuccess={paymentSuccess} />
    </Suspense>
  );
}
