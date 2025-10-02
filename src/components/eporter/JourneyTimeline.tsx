'use client';

import React from 'react';

interface JourneyTimelineProps {
    departureTime: string;
    departureStation: string;
    arrivalTime: string;
    arrivalStation: string;
    duration: string;
}

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
    departureTime,
    departureStation,
    arrivalTime,
    arrivalStation,
    duration
}) => {
    return (
        <div className="flex items-center mb-2 w-full">
            <div className="flex flex-col items-center text-center w-[200px] break-words">
                <div className="text-xl font-bold text-gray-900 break-words w-full">
                    {departureTime}
                </div>
                <div className="text-xs text-gray-500 break-words w-full">
                    {departureStation}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center relative mx-2">
                <div className="flex items-center w-full">
                    <div className="flex-1 h-1 bg-gray-200" />
                    <div className="px-2">
                        <img src="/ic_train_blue.svg" alt="Train" className="h-5 w-5" />
                    </div>
                    <div className="flex-1 h-1 bg-gray-200" />
                </div>
                <span className="text-xs text-gray-500 mt-2 absolute top-full">{duration}</span>
            </div>

            <div className="flex flex-col items-center text-center w-[200px] break-words">
                <div className="text-xl font-bold text-gray-900 break-words w-full">
                    {arrivalTime}
                </div>
                <div className="text-xs text-gray-500 break-words w-full">
                    {arrivalStation}
                </div>
            </div>
        </div>
    );
};

export default JourneyTimeline;