'use client';

import React from 'react';
import Footer from '@/components/footer/Footer';
import NavBarServices from '@/components/navbar/NavBarServices';
import SearchBar from '@/components/logistics/SearchBar';
import HeroSection from '@/components/logistics/HeroSection';
import WhyChooseSection from '@/components/logistics/WhyChooseSection';
import StepsSection from '@/components/logistics/StepsSection';

const KAILogisticPage = () => {
    const handleSearch = (value: string) => {
        console.log('Searching for:', value);
        // Implement search logic here
    };

    const handleBookingClick = () => {
        console.log('Booking button clicked');
        // Implement booking navigation here
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <NavBarServices service="Logistics" />

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Hero Section */}
            <HeroSection
                title="Mudah, Cepat, Aman. Kirim Barang Bersama KAI Logistik."
                description="KAI Logistik menghadirkan layanan pengiriman barang yang praktis, terpercaya, dan tepat waktu. Pesan langsung lewat website, tentukan jenis layanan sesuai kebutuhan Anda, dan nikmati kemudahan kirim barang ke seluruh Indonesia."
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
}

export default KAILogisticPage;