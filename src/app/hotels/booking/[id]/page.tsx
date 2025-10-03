"use client";

import React, { useState } from "react";
import NavBarServices from "@/components/navbar/NavBarServices";
import HotelHeroSection from "@/components/hotels/booking/HotelHeroSection";
import RatingReviews from "@/components/hotels/booking/RatingReviews";
import LocationSection from "@/components/hotels/booking/LocationSection";
import ServiceDescription from "@/components/hotels/booking/ServiceDescription";
import FacilitiesCard from "@/components/hotels/booking/FacilitiesCard";
import PaymentOptionsCard, { type PaymentOption } from "@/components/hotels/booking/PaymentOptionsCard";
import BookingButton from "@/components/hotels/booking/BookingButton";

const HotelBookingPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>("cash");
  const [isLoading, setIsLoading] = useState(false);

  // Hotel data - in real app, this would come from API
  const hotelData = {
    title: "Luxury Lounge",
    description: "Kenyamanan ekstra sebelum perjalanan Anda",
    price: "Mulai Rp 50.000 / pax",
    rating: 8.7,
    features: ["Nyaman & Bersih", "Staf Ramah", "Lokasi Strategis", "Fasilitas Lengkap"],
    location: {
      name: "Stasiun Gambir, Jakarta Pusat",
      address: "Jl. Gambir, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, DKI Jakarta"
    },
    serviceDescription: `Luxury Lounge memberikan kenyamanan ekstra sebelum perjalanan Anda. Dilengkapi
dengan sofa empuk, AC, meja kerja, perpustakaan mini, free snack & drinks, dan ruang kerja
ekslusif. Nikmati suasana tenang dan nyaman sambil menunggu keberangkatan kereta
Anda.`
  };

  const paymentOptions: PaymentOption[] = [
    {
      id: "cash",
      label: "Bayar Sekarang",
      description: "Diskon khusus tersedia",
      descriptionColor: "text-green-500"
    },
    {
      id: "later",
      label: "Bayar Nanti",
      description: "Reservasi booking direstul",
      descriptionColor: "text-gray-500"
    },
    {
      id: "offline",
      label: "Bayar Dekat Tanggal",
      description: "Ketersediaan terbatas",
      descriptionColor: "text-yellow-600",
      warningIcon: "/ic_warning_yellow.svg"
    }
  ];

  const handleBookNow = () => {
    setIsLoading(true);
    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false);
      alert("Booking berhasil!");
    }, 2000);
  };

  const handleConfirmBooking = () => {
    setIsLoading(true);
    // Simulate confirmation process
    setTimeout(() => {
      setIsLoading(false);
      alert(`Pesanan dikonfirmasi dengan metode pembayaran: ${selectedPayment}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavBarServices service="Hotel" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <HotelHeroSection
          title={hotelData.title}
          description={hotelData.description}
          price={hotelData.price}
          onBookNow={handleBookNow}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rating & Reviews */}
            <RatingReviews
              rating={hotelData.rating}
              features={hotelData.features}
            />

            {/* Location */}
            <LocationSection
              location={hotelData.location}
            />

            {/* Service Description */}
            <ServiceDescription
              description={hotelData.serviceDescription}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Facilities */}
            <FacilitiesCard />

            {/* Payment Options */}
            <PaymentOptionsCard
              options={paymentOptions}
              selectedPayment={selectedPayment}
              onPaymentChange={setSelectedPayment}
            />

            {/* Booking Button */}
            <BookingButton
              onClick={handleConfirmBooking}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingPage;
