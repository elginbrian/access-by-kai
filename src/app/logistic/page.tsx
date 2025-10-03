"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import SearchBar from "@/components/logistics/SearchBar";
import HeroSection from "@/components/logistics/HeroSection";
import WhyChooseSection from "@/components/logistics/WhyChooseSection";
import StepsSection from "@/components/logistics/StepsSection";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";

const KAILogisticPage = () => {
  const router = useRouter();

  const handleSearch = (value: string) => {
    console.log("Searching for:", value);
  };

  const handleBookingClick = () => {
    router.push("/logistic/simulation");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <TrainNavigation />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Hero Section */}
      <HeroSection
        title="Mudah, Cepat, Aman. Kirim Barang Bersama KAI Logistik."
        description="KAI Logistik menghadirkan layanan pengiriman barang yang praktis, terpercaya, dan tepat waktu. Pesan langsung lewat website, pilih layanan sesuai kebutuhan, dan nikmati kemudahan pengiriman ke seluruh Indonesia."
        onButtonClick={handleBookingClick}
      />

      {/* Why Choose Section */}
      <WhyChooseSection />

      {/* Steps Section */}
      <StepsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default KAILogisticPage;
