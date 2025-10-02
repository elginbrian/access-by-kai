'use client';

import React from 'react';
import JourneyTimeline from '../JourneyTimeline';

interface TicketInfoCardProps {
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

const TicketInfoCard: React.FC<TicketInfoCardProps> = ({
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
    timeRange
}) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-8">
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
        </div>
    );
};

export default TicketInfoCard;