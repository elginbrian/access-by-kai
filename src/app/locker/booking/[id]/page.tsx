"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavBarServices from "@/components/navbar/NavBarServices";
import { useFacilityDetail } from "@/lib/hooks/useFacilities";

interface BookingPageProps {
  params: { id: string };
}

const BookingPage = ({ params }: BookingPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticket");
  const facilityId = parseInt(params.id);

  const {
    data: facility,
    isLoading,
    error
  } = useFacilityDetail(facilityId);

  const handleBack = () => {
    router.push(`/showlok/display${ticketId ? `?ticket=${ticketId}` : ""}`);
  };

  const handleProceedToPayment = () => {
    // In a real implementation, this would create a booking record first
    // For now, we'll proceed directly to payment
    router.push(`/showlok/payment/${facilityId}?ticket=${ticketId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <NavBarServices service="ShowLok" />
        <div className="container mx-auto px-8 py-16">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat detail fasilitas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <NavBarServices service="ShowLok" />
        <div className="container mx-auto px-8 py-16">
          <div className="text-center py-16">
            <p className="text-red-600">Fasilitas tidak ditemukan</p>
            <button
              onClick={handleBack}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <NavBarServices service="ShowLok" />
      
      <div className="container mx-auto px-8 py-16">
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>←</span> Kembali ke daftar fasilitas
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Booking {facility.nama_fasilitas}
        </h1>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center py-16">
            <p className="text-gray-600 mb-6">
              Halaman booking sedang dalam pengembangan...
            </p>
            <div className="mt-4 text-sm text-gray-500 mb-8">
              <p>Facility ID: {facilityId}</p>
              <p>Ticket ID: {ticketId}</p>
              <p>Station: {facility.station?.nama_stasiun}</p>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
