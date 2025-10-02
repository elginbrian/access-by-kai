'use client';

import React, { useState } from 'react';
import NavBarServices from '@/components/navbar/NavBarServices';
import TicketInfoCard from '@/components/eporter/booking/TicketInfoCard';
import PassengerListCard from '@/components/eporter/booking/PassengerListCard';
import PortersList from '@/components/eporter/booking/PortersList';
import HelpSupportCard from '@/components/eporter/booking/HelpSupportCard';

const KAIEPorterBookingPage = () => {
    // Passengers state for selection UI
    const [passengers] = useState([
        { id: '1', name: 'Jane Doe', type: 'Adult' as 'Adult', isSelected: true },
        { id: '2', name: 'Emma Doe', type: 'Child' as 'Child', isSelected: false }
    ]);

    // Maximum porters allowed (equal to total passengers)
    const maxPorters = passengers.length;
    
    // Example ticket data (replace with API/context later)
    const ticket = {
        trainName: 'Argo Parahyangan',
        trainCode: 'KA 21',
        trainClass: 'Eksekutif',
        departureTime: '08:00',
        departureStation: 'Gambir',
        arrivalTime: '12:00',
        arrivalStation: 'Bandung',
        duration: '4j',
        travelClass: 'Eksekutif',
        date: 'Senin, 15 Jan 2024',
        timeRange: '08:00 - 12:00'
    };

    const porters = [
        {
            name: 'Budi Santoso',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
            status: 'Assigned - Waiting response'
        },
        {
            name: 'Budi Santoso',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
            status: 'Assigned - Waiting response'
        }
    ];

    const handleWhatsAppClick = (porterId: string | number) => {
        console.log('WhatsApp clicked for porter:', porterId);
        // Handle WhatsApp action
    };

    const handleRequestAnotherClick = (porterId: string | number) => {
        console.log('Request another porter for:', porterId);
        // Handle request another porter action
    };

    const handleCancelClick = (porterId: string | number) => {
        console.log('Cancel clicked for porter:', porterId);
        // Handle cancel action
    };

    const handleContactSupport = () => {
        console.log('Contact support clicked');
        // Handle contact support action
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {/* Navigation */}
            <NavBarServices service="E-Porter" />

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
                        <PassengerListCard
                            passengers={passengers}
                            maxPorters={maxPorters}
                        />

                        {/* Need Help Card */}
                        <HelpSupportCard
                            onContactClick={handleContactSupport}
                        />
                    </div>

                    {/* Right Column - Porter Cards */}
                    <div className="space-y-6">
                        <PortersList
                            porters={porters}
                            onWhatsAppClick={handleWhatsAppClick}
                            onRequestAnotherClick={handleRequestAnotherClick}
                            onCancelClick={handleCancelClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KAIEPorterBookingPage;