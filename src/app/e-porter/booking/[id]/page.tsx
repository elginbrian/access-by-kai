"use client";

import React, { useEffect, useMemo, useState } from "react";
import TicketInfoCard from "@/components/eporter/booking/TicketInfoCard";
import PassengerListCard from "@/components/eporter/booking/PassengerListCard";
import PortersList from "@/components/eporter/booking/PortersList";
import HelpSupportCard from "@/components/eporter/booking/HelpSupportCard";
import LoadingPorters from "@/components/eporter/booking/LoadingPorters";
import { useCreateEporterBooking } from "@/lib/hooks/useEporterBookings";
import { useEporterPorters, UIPorter } from "@/lib/hooks/useEporterPorters";
import type { EporterBooking } from "@/types/models";
import { useParams } from "next/navigation";
import { useTicketDetail } from "@/lib/hooks/useTickets";
import { useAuth } from "@/lib/auth/AuthContext";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";

const KAIEPorterBookingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const createBooking = useCreateEporterBooking();
  const [assignmentResult, setAssignmentResult] = useState<any | null>(null);
  const [createdBooking, setCreatedBooking] = useState<EporterBooking | null>(null);
  const [assignedPorter, setAssignedPorter] = useState<any | null>(null);

  const params = useParams();
  const ticketId = (params?.id as string) || null;

  const { user } = useAuth();
  const penggunaId = user?.profile?.user_id ?? null;

  const ticketDetailQuery = useTicketDetail(Number(penggunaId), { ticketId: ticketId ?? "" });

  const passengers = useMemo(() => {
    const detail: any = ticketDetailQuery?.data || null;
    if (!detail?.passenger) return [];
    return [{ id: String(detail.passenger.id), name: detail.passenger.name || "Penumpang", type: "Adult" as const, isSelected: true }];
  }, [ticketDetailQuery?.data]);

  const maxPorters = passengers.length;

  // derive ticket info for UI
  const ticket = useMemo(() => {
    const d: any = ticketDetailQuery?.data;
    if (!d) {
      return {
        trainName: "-",
        trainCode: "-",
        trainClass: "-",
        departureTime: "-",
        departureStation: "-",
        arrivalTime: "-",
        arrivalStation: "-",
        duration: "-",
        travelClass: "-",
        date: "-",
        timeRange: "-",
      };
    }
    return {
      trainName: d.trainName || d.train?.name || "-",
      trainCode: d.trainNumber || "-",
      trainClass: d.railcar?.type || "-",
      departureTime: d.departureTime || "-",
      departureStation: d.departureStation?.name || "-",
      arrivalTime: d.arrivalTime || "-",
      arrivalStation: d.arrivalStation?.name || "-",
      duration: d.duration || "-",
      travelClass: d.seat?.class || "-",
      date: d.date || "-",
      timeRange: `${d.departureTime || "-"} - ${d.arrivalTime || "-"}`,
    };
  }, [ticketDetailQuery?.data]);

  // meeting point input
  const [meetingPoint, setMeetingPoint] = useState<string>("");

  const portersQuery = useEporterPorters();
  const porters: UIPorter[] = portersQuery.data ?? [];

  const handleWhatsAppClick = (porter: any) => {
    // If we have a whatsapp number for the porter, open wa.me link; otherwise fall back to profile
    const number = porter?.whatsapp_number || porter?.phone_number;
    if (!number) return;
    const normalized = String(number).replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${normalized}`, "_blank");
  };

  const handleRequestAnotherClick = (porterId: string | number) => {
    // Call API to reassign another porter excluding the provided porterId
    (async () => {
      try {
        if (!createdBooking?.e_porter_booking_id) {
          alert("Booking ID tidak tersedia untuk reassign");
          return;
        }

        const res = await fetch(`/api/e-porter/bookings/reassign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ e_porter_booking_id: createdBooking.e_porter_booking_id, exclude_porter_id: Number(porterId) }),
        });
        const json = await res.json();
        if (!res.ok) {
          console.error("Reassign failed", json);
          alert(json?.error || "Reassign failed");
          return;
        }

        if (json?.ok && json?.booking) {
          setCreatedBooking(json.booking);
          setAssignmentResult({ status: json.assignment?.status ?? "ASSIGNED", assigned_porter_id: json.porter?.porter_id ?? null });
        } else {
          alert("Tidak ada porter tersedia saat ini.");
        }
      } catch (e) {
        console.error(e);
        alert("Terjadi kesalahan saat meminta porter lain.");
      }
    })();
  };

  const handleCancelClick = (porterId: string | number) => {
    console.log("Cancel clicked for porter:", porterId);
    // Handle cancel action
  };

  const handleContactSupport = () => {
    console.log("Contact support clicked");
    // Handle contact support action
  };

  const handleSearchPorters = async () => {
    const payload = {
      user_id: penggunaId ?? 1,
      jumlah_penumpang: passengers.length || 1,
      passenger_ids: passengers.map((p) => Number(p.id)),
      meeting_point: meetingPoint || "Gate A",
      pemesanan_id: ticketDetailQuery?.data?.booking?.id ?? null,

      tiket_id: ticketDetailQuery?.data?.tiketId ?? null,
      kode_tiket: ticketDetailQuery?.data?.id ?? null,
    } as any;

    setIsLoading(true);
    try {
      const res = await createBooking.mutateAsync(payload);
      // mutation now returns { booking, assignmentResult, porter }
      setCreatedBooking(res.booking ?? res);
      setAssignedPorter(res.porter ?? null);
      setAssignmentResult({ status: res.assignmentResult?.status ?? "ASSIGNED", assigned_porter_id: res.booking?.assigned_porter_id ?? res.booking?.assigned_porter_id ?? null });
    } catch (err: any) {
      console.error("Create booking failed", err);
      alert(err?.message || "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSearch = () => {
    console.log("Porter search cancelled");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Navigation */}
      <TrainNavigation />

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Ticket Card */}
            <TicketInfoCard
              trainName={ticket.trainName}
              trainCode={ticket.trainCode}
              trainClass={ticket.trainClass}
              departureTime={ticket.departureTime}
              departureStation={ticket.departureStation}
              arrivalTime={ticket.arrivalTime}
              arrivalStation={ticket.arrivalStation}
              duration={ticket.duration}
              travelClass={ticket.travelClass}
              date={ticket.date}
              timeRange={ticket.timeRange}
            />

            {/* Select Passengers */}
            <PassengerListCard passengers={passengers} maxPorters={maxPorters} />

            {/* Need Help Card */}
            <HelpSupportCard onContactClick={handleContactSupport} />
          </div>

          {/* Right Column - Porter Cards or Loading */}
          <div className="space-y-6">
            {isLoading ? (
              <LoadingPorters onCancel={handleCancelSearch} />
            ) : (
              <>
                {createdBooking && (assignedPorter || createdBooking.assigned_porter_id) ? (
                  // Show single assigned porter
                  <PortersList
                    porters={
                      assignedPorter
                        ? [
                            {
                              id: String(assignedPorter.porter_id),
                              name: assignedPorter.nama || assignedPorter.name || "Porter",
                              image: assignedPorter.foto_url || "/ic_person_blue.svg",
                              status: assignedPorter.is_available ? "Tersedia" : "Tidak tersedia",
                            },
                          ]
                        : [{ id: String(createdBooking.assigned_porter_id), name: "Porter (assigned)", image: "/ic_person_blue.svg", status: "Assigned" }]
                    }
                    onWhatsAppClick={(id) => {
                      // if we have assignedPorter, use its number directly
                      if (assignedPorter) {
                        const number = assignedPorter.whatsapp_number || assignedPorter.phone_number;
                        if (number) {
                          const normalized = String(number).replace(/[^0-9]/g, "");
                          window.open(`https://wa.me/${normalized}`, "_blank");
                          return;
                        }
                      }
                      const p = porters.find((pp) => pp.id === String(id));
                      handleWhatsAppClick(p ?? { whatsapp_number: undefined, phone_number: undefined });
                    }}
                    onRequestAnotherClick={handleRequestAnotherClick}
                    onCancelClick={handleCancelClick}
                  />
                ) : (
                  <>
                    {/* Show only a single porter preview (top-rated) instead of full list */}
                    {porters.length > 0 ? (
                      <PortersList
                        porters={porters.slice(0, 1)}
                        onWhatsAppClick={(id) => {
                          const p = porters.find((pp) => pp.id === String(id));
                          handleWhatsAppClick(p ?? { whatsapp_number: undefined, phone_number: undefined });
                        }}
                        onRequestAnotherClick={handleRequestAnotherClick}
                        onCancelClick={handleCancelClick}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Belum ada porter tersedia saat ini</p>
                      </div>
                    )}

                    {/* Search Button */}
                    <button onClick={handleSearchPorters} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Cari Porter Sekarang
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KAIEPorterBookingPage;
