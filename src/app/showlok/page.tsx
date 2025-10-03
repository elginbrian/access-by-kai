"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/eporter/HeroSection";
import ActiveTicketsList from "@/components/eporter/ActiveTicketsList";
import NavBarServices from "@/components/navbar/NavBarServices";
import PorterBookingForm from "@/components/eporter/PorterBookingForm";
import { useAuth } from "@/lib/auth/AuthContext";
import { useUserTickets } from "@/lib/hooks/useTickets";

const KAIHotelPage = () => {
  const { user } = useAuth();
  const penggunaId = user?.profile?.user_id ?? null;

  const { data: tickets = [], isLoading, error } = useUserTickets(Number(penggunaId), { limit: 10 });

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const router = useRouter();

  const handleTicketSelect = (ticketId: string) => {
    router.push(`/hotels/ticket/${ticketId}`);
  };

  const handleBackToTickets = () => {
    setSelectedTicketId(null);
  };

  const handlePorterBookingSubmit = (formData: any) => {
    alert("Porter booking submitted successfully!");
    setSelectedTicketId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <NavBarServices service="Hotel" />

      <div className="container mx-auto px-8 py-16">
        <HeroSection
          title="Sit Back. We'll Handle Your Luggage."
          description="KAI e-Porter adalah layanan porter resmi di stasiun untuk membantu penumpang membawa barang bawaan. Pesan porter langsung lewat aplikasi, pilih jumlah sesuai kebutuhan, dan nikmati perjalanan lebih nyaman tanpa repot mengangkat koper"
          illustrationSrc="/img_illust_kai_eporter.png"
          illustrationAlt="Illustration KAI E-Porter"
        />

        <div className="mt-16">
          {selectedTicketId ? (
            <PorterBookingForm ticketId={selectedTicketId} onBack={handleBackToTickets} onSubmit={handlePorterBookingSubmit} />
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tiket Aktif Anda</h2>

              {isLoading ? (
                <div className="text-center py-8">Loading tickets...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">Gagal memuat tiket: {String(error.message)}</div>
              ) : (
                <ActiveTicketsList
                  tickets={tickets.map((t) => ({
                    id: t.id,
                    trainName: t.trainName || t.ticketNumber || "-",
                    trainCode: t.trainNumber ? `KA ${t.trainNumber}` : "",
                    trainClass: t.seat?.class || "",
                    departureTime: t.departureTime ? new Date(t.departureTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "",
                    departureStation: t.departureStation?.name || t.departureStation?.code || "-",
                    arrivalTime: t.arrivalTime ? new Date(t.arrivalTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "",
                    arrivalStation: t.arrivalStation?.name || t.arrivalStation?.code || "-",
                    duration: t.duration || "",
                    travelClass: t.seat?.class || "",
                    date: t.date ? new Date(t.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "",
                    timeRange:
                      t.departureTime && t.arrivalTime
                        ? `${new Date(t.departureTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${new Date(t.arrivalTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`
                        : "",
                  }))}
                  onTicketSelect={handleTicketSelect}
                  buttonText="Pilih tiket ini"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KAIHotelPage;