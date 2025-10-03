"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SimpleStationSelector from "@/components/showlok/SimpleStationSelector";
import FacilityCard from "@/components/showlok/FacilityCard";
import { useStationFacilities } from "@/lib/hooks/useFacilities";
import { useUserTickets } from "@/lib/hooks/useTickets";
import { useAuth } from "@/lib/auth/AuthContext";
import { getStationIdByCode, getStationIdsByName } from "@/lib/utils/stationHelpers";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";

interface Props {
  ticketId: string | null;
}

const ClientShowlokDisplay: React.FC<Props> = ({ ticketId }) => {
  const router = useRouter();

  const { user } = useAuth();
  const penggunaId = user?.profile?.user_id ?? null;

  const { data: tickets = [] } = useUserTickets(Number(penggunaId), { limit: 10 });
  const selectedTicket = tickets.find((t) => String(t.id) === String(ticketId));

  const [selectedStation, setSelectedStation] = useState<"departure" | "arrival">("departure");

  // Get station ID based on selection
  const { data: stationId } = useQuery({
    queryKey: ["stationId", selectedTicket, selectedStation],
    queryFn: async (): Promise<number | null> => {
      if (!selectedTicket) return null;

      const stationInfo = selectedStation === "departure" ? selectedTicket.departureStation : selectedTicket.arrivalStation;

      // Try to get by code first, then by name
      let id = await getStationIdByCode(stationInfo.code);
      if (!id) {
        id = await getStationIdsByName(stationInfo.name);
      }
      return id;
    },
    enabled: !!selectedTicket,
  });

  const { data: facilities = [], isLoading, error } = useStationFacilities(stationId || 0);

  const handleBack = () => {
    router.push("/showlok");
  };

  const handleFacilitySelect = (facilityId: number) => {
    router.push(`/showlok/booking/${facilityId}?ticket=${ticketId}`);
  };

  if (!selectedTicket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <TrainNavigation />
        <div className="container mx-auto px-8 py-16">
          <div className="text-center py-16">
            <p className="text-red-600">Tiket tidak ditemukan</p>
            <button onClick={handleBack} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl">
              Kembali ke ShowLok
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <TrainNavigation />

      <div className="container mx-auto px-8 py-16">
        <div className="mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <span>←</span> Kembali ke daftar tiket
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Fasilitas ShowLok</h1>
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Tiket yang dipilih:</h3>
            <div className="text-sm text-gray-600">
              <p>
                <strong>{selectedTicket.trainName || selectedTicket.ticketNumber}</strong>
              </p>
              <p>
                {selectedTicket.departureStation?.name} → {selectedTicket.arrivalStation?.name}
              </p>
              <p>{selectedTicket.date ? new Date(selectedTicket.date).toLocaleDateString("id-ID") : ""}</p>
            </div>
          </div>
        </div>

        <SimpleStationSelector
          departureStation={{
            name: selectedTicket.departureStation?.name || "",
            code: selectedTicket.departureStation?.code || "",
          }}
          arrivalStation={{
            name: selectedTicket.arrivalStation?.name || "",
            code: selectedTicket.arrivalStation?.code || "",
          }}
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation}
        />

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fasilitas di {selectedStation === "departure" ? selectedTicket.departureStation?.name : selectedTicket.arrivalStation?.name}</h2>

          {!stationId ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Mencari stasiun...</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat fasilitas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600">Gagal memuat fasilitas</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600">Belum ada fasilitas ShowLok di stasiun ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <FacilityCard key={facility.facility_id} facility={facility} onSelect={() => handleFacilitySelect(facility.facility_id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientShowlokDisplay;
