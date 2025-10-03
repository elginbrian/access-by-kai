"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/eporter/HeroSection";
import ActiveTicketsList from "@/components/eporter/ActiveTicketsList";
import PassengerSelection from "@/components/eporter/PassengerSelection";
import PickupDetails from "@/components/eporter/PickupDetails";
import NavBarServices from "@/components/navbar/NavBarServices";
import PorterBookingForm from "@/components/eporter/PorterBookingForm";
import { useAuth } from "@/lib/auth/AuthContext";
import { useUserTickets } from "@/lib/hooks/useTickets";

const KAIEPorterPage = () => {
  const { user } = useAuth();
  const penggunaId = user?.profile?.user_id ?? null;

  const { data: tickets = [], isLoading, error } = useUserTickets(Number(penggunaId), { limit: 10 });

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const router = useRouter();

  type Passenger = { id: string; name: string; type: "Adult" | "Child"; isSelected: boolean };
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [meetingPoint, setMeetingPoint] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);

    try {
      const selected = tickets.find((t: any) => String(t.id) === String(ticketId));
      if (selected) {
        const bookingId = (selected as any).bookingId;
        const group = tickets.filter((t: any) => (t as any).bookingId && (t as any).bookingId === bookingId);
        const derived: Passenger[] = (group.length > 0 ? group : [selected]).map((t: any, idx: number) => {
          const p = (t as any).passenger ?? { id: idx + 1, name: `Penumpang ${idx + 1}` };
          return {
            id: String(p.id ?? idx + 1),
            name: String(p.name ?? `Penumpang ${idx + 1}`),
            type: "Adult",
            isSelected: false,
          };
        });

        setPassengers(derived);
      } else {
        setPassengers([]);
      }
    } catch (err) {
      setPassengers([]);
    }
  };

  const handleBackToTickets = () => {
    setSelectedTicketId(null);
  };

  const handlePorterBookingSubmit = (formData: any) => {
    const ticketId = formData?.ticketId || selectedTicketId;
    if (ticketId) {
      const found = tickets.find((t: any) => String(t.id) === String(ticketId));
      const numericId = found ? (found as any).tiketId ?? (found as any).tiket_id ?? undefined : undefined;
      const routeId = numericId ? String(numericId) : String(ticketId);
      router.push(`/e-porter/booking/${routeId}`);
    } else {
      setSelectedTicketId(null);
    }
  };

  const handlePassengerToggle = (passengerId: string) => {
    setPassengers((prev) => prev.map((p) => (p.id === passengerId ? { ...p, isSelected: !p.isSelected } : p)));
  };

  const handleInlineSubmit = () => {
    const selected = passengers.filter((p) => p.isSelected);
    if (selected.length === 0) {
      alert("Silakan pilih setidaknya satu penumpang");
      return;
    }
    if (!meetingPoint) {
      alert("Silakan pilih titik pertemuan");
      return;
    }
    const formData = { ticketId: selectedTicketId, passengers: selected, meetingPoint, notes };
    handlePorterBookingSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <NavBarServices service="E-Porter" />

      <div className="container mx-auto px-8 py-16">
        <HeroSection
          title="Santai. Kami Urus Bagasimu."
          description="KAI e-Porter adalah layanan porter resmi di stasiun untuk membantu penumpang membawa barang bawaan. Pesan porter langsung lewat aplikasi, pilih jumlah sesuai kebutuhan, dan nikmati perjalanan lebih nyaman tanpa repot mengangkat koper"
          illustrationSrc="/img_illust_kai_eporter.png"
          illustrationAlt="Ilustrasi KAI E-Porter"
        />

        <div className="mt-16">
          {selectedTicketId ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PassengerSelection passengers={passengers} onPassengerToggle={handlePassengerToggle} maxPorters={3} />

                <PickupDetails onMeetingPointChange={setMeetingPoint} onNotesChange={setNotes} meetingPoint={meetingPoint} notes={notes} />
              </div>

              <div className="flex flex-row w-full gap-4 mt-4">
                <div className="flex-1">
                  <button
                    onClick={handleBackToTickets}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors w-full px-8 py-2.5 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 justify-center"
                  >
                    Kembali
                  </button>
                </div>

                <div className="flex-1">
                  <button onClick={handleInlineSubmit} className={`px-8 py-3 rounded-lg font-semibold transition-all w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#6b46c1] to-[#3b82f6] text-white`}>
                    Pesan Porter
                    <img src="/ic_arrow_right.svg" alt="" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tiket Aktif Anda</h2>

              {isLoading ? (
                <div className="text-center py-8">Memuat tiket...</div>
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

export default KAIEPorterPage;
