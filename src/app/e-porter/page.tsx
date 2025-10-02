'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/eporter/HeroSection';
import ActiveTicketsList from '@/components/eporter/ActiveTicketsList';
import NavBarEPorter from '@/components/eporter/NavBarEPorter';
import PorterBookingForm from '@/components/eporter/PorterBookingForm';

// Sample ticket data - in a real app this would come from an API
const sampleTickets = [
    {
        id: '1',
        trainName: 'Argo Parahyangan',
        trainCode: 'KA 21',
        trainClass: 'Eksekutif',
        departureTime: '08:00',
        departureStation: 'Jakarta Gambir',
        arrivalTime: '15:30',
        arrivalStation: 'Bandung',
        duration: '7j 30m',
        travelClass: 'Eksekutif',
        date: 'Senin, 15 Jan 2024',
        timeRange: '08:00 - 15:30'
    },
    {
        id: '2',
        trainName: 'Argo Sindoro',
        trainCode: 'KA 31',
        trainClass: 'Eksekutif',
        departureTime: '09:15',
        departureStation: 'Jakarta Gambir',
        arrivalTime: '16:45',
        arrivalStation: 'Semarang Tawang',
        duration: '7j 30m',
        travelClass: 'Eksekutif',
        date: 'Selasa, 16 Jan 2024',
        timeRange: '09:15 - 16:45'
    }
];

const KAIEPorterPage = () => {
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const handleTicketSelect = (ticketId: string) => {
        console.log('Selected ticket:', ticketId);
        setSelectedTicketId(ticketId);
    };

    const handleBackToTickets = () => {
        setSelectedTicketId(null);
    };

    const handlePorterBookingSubmit = (formData: any) => {
        console.log('Porter booking submitted:', formData);
        // Handle the booking submission here
        alert('Porter booking submitted successfully!');
        setSelectedTicketId(null); // Go back to tickets list
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {/* Navigation */}
            <NavBarEPorter/>
            
            {/* Hero Section */}
            <div className="container mx-auto px-8 py-16">
                <HeroSection
                    title="Sit Back. We'll Handle Your Luggage."
                    description="KAI e-Porter adalah layanan porter resmi di stasiun untuk membantu penumpang membawa barang bawaan. Pesan porter langsung lewat aplikasi, pilih jumlah sesuai kebutuhan, dan nikmati perjalanan lebih nyaman tanpa repot mengangkat koper"
                    illustrationSrc="/img_illust_kai_eporter.png"
                    illustrationAlt="Illustration KAI E-Porter"
                />

                {/* Active Tickets Section */}
                <div className="mt-16">
                    {selectedTicketId ? (
                        <PorterBookingForm
                            ticketId={selectedTicketId}
                            onBack={handleBackToTickets}
                            onSubmit={handlePorterBookingSubmit}
                        />
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tiket Aktif Anda</h2>

                            <ActiveTicketsList
                                tickets={sampleTickets}
                                onTicketSelect={handleTicketSelect}
                                buttonText="Pilih tiket ini"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default KAIEPorterPage;