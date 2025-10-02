'use client';

import React from 'react';
import JourneyTimeline from './JourneyTimeline';

interface ActiveTicketCardProps {
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
    onSelect: () => void;
    buttonText?: string;
}

const ActiveTicketCard: React.FC<ActiveTicketCardProps> = ({
    trainName,
    trainCode,
    trainClass,
    departureTime,
    departureStation,
    arrivalTime,
    arrivalStation,
    duration,
    travelClass,
    date,
    timeRange,
    onSelect,
    buttonText = "Pilih tiket ini"
}) => {
    return (
        <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                    <div className="bg-purple-600 p-3 rounded-xl">
                        <img src="/ic_train.svg" alt="Train" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{trainName}</h3>
                        <p className="text-gray-500">{trainCode}</p>
                    </div>
                </div>
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm">
                    {trainClass}
                </div>
            </div>

            <JourneyTimeline
                departureTime={departureTime}
                departureStation={departureStation}
                arrivalTime={arrivalTime}
                arrivalStation={arrivalStation}
                duration={duration}
            />

            <div className="text-sm font-semibold text-gray-900 mb-1">{travelClass}</div>
            <div className="text-sm text-gray-600 mb-1">{date} • {timeRange}</div>

            <button 
                onClick={onSelect}
                className="w-full bg-gradient-to-b from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-all"
            >
                {buttonText}
                <img src="/ic_arrow_right.svg" alt="" />
            </button>
        </div>
    );
};

export default ActiveTicketCard;