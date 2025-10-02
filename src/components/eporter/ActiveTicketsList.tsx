'use client';

import React from 'react';
import ActiveTicketCard from './ActiveTicketCard';

interface TicketData {
    id: string;
    trainName: string;
    trainCode: string;
    trainClass: string;
    departureTime: string;
    departureStation: string;
    arrivalTime: string;
    arrivalStation: string;
    duration: string;
    travelClass: string;
    date: string;
    timeRange: string;
}

interface ActiveTicketsListProps {
    tickets: TicketData[];
    onTicketSelect: (ticketId: string) => void;
    buttonText?: string;
}

const ActiveTicketsList: React.FC<ActiveTicketsListProps> = ({
    tickets,
    onTicketSelect,
    buttonText = "Pilih tiket ini"
}) => {
    if (tickets.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada tiket aktif</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {tickets.map((ticket) => (
            <div
                key={ticket.id}
                className="transition-transform duration-200 hover:-translate-y-2"
            >
                <ActiveTicketCard
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
                onSelect={() => onTicketSelect(ticket.id)}
                buttonText={buttonText}
                />
            </div>
            ))}
        </div>
    );
};

export default ActiveTicketsList;