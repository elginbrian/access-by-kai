"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/eporter/HeroSection";
import ActiveTicketsList from "@/components/eporter/ActiveTicketsList";
import NavBarServices from "@/components/navbar/NavBarServices";
import { useAuth } from "@/lib/auth/AuthContext";
import { useUserTickets } from "@/lib/hooks/useTickets";

interface Props {
  paymentSuccess?: boolean;
}

const ClientLockerPage: React.FC<Props> = ({ paymentSuccess = false }) => {
  const { user } = useAuth();
  const penggunaId = user?.profile?.user_id ?? null;
  const router = useRouter();

  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(paymentSuccess);

  const { data: tickets = [], isLoading, error } = useUserTickets(Number(penggunaId), { limit: 10 });

  useEffect(() => {
    if (paymentSuccess) {
      setShowSuccessMessage(true);

      router.replace("/showlok");
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [paymentSuccess, router]);

  const handleTicketSelect = (ticketId: string) => {
    router.push(`/showlok/display?ticket=${ticketId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <NavBarServices service="ShowLok" />

      <div className="container mx-auto px-8 py-16">
        <HeroSection
          title="Refresh & Store. All in One Place."
          description="KAI ShowLok menyediakan fasilitas shower dan locker modern di stasiun untuk kenyamanan perjalanan Anda. Booking mudah lewat aplikasi, nikmati fasilitas bersih dan aman di berbagai stasiun kereta api."
          illustrationSrc="/img_illust_kai_eporter.png"
          illustrationAlt="Illustration KAI ShowLok"
        />

        <div className="mt-16">
          {showSuccessMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-500">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Pembayaran berhasil! Booking ShowLok Anda telah dikonfirmasi.</p>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilih Stasiun dari Tiket Anda</h2>

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
              buttonText="Lihat fasilitas stasiun"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientLockerPage;
