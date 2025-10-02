'use client';

import React from 'react';

interface JourneyDetailsProps {
    trainName: string;
    trainCode: string;
    departureTime: string;
    departureStation: string;
    departureDate: string;
    arrivalTime: string;
    arrivalStation: string;
    arrivalDate: string;
}

const JourneyDetails: React.FC<JourneyDetailsProps> = ({
    trainName,
    trainCode,
    departureTime,
    departureStation,
    departureDate,
    arrivalTime,
    arrivalStation,
    arrivalDate
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/ic_train_blue.svg" alt="Train" />
                </div>
                <h2 className="text-xl font-bold text-black">Journey Details</h2>
            </div>

            {/* Train Card */}
            <div className="bg-indigo-50 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <img src="/ic_train.svg" alt="Train" className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-black">{trainName}</h3>
                        <p className="text-black">{trainCode}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {/* Departure */}
                    <div className="text-center min-w-[100px]">
                        <div className="text-3xl font-bold text-black mb-1">{departureTime}</div>
                        <div className="text-sm font-medium text-black">{departureStation}</div>
                        <div className="text-xs text-black">{departureDate}</div>
                    </div>

                    {/* Train Line with Space */}
                    <div className="flex-1 flex items-center px-8">
                        <div className="w-full h-0.5 bg-gray-300" />
                        <div className="mx-8 flex items-center justify-center">
                            <img src="/ic_train_blue.svg" alt="Train" className="w-10 h-10" />
                        </div>
                        <div className="w-full h-0.5 bg-gray-300" />
                    </div>

                    {/* Arrival */}
                    <div className="text-center min-w-[100px]">
                        <div className="text-3xl font-bold text-black mb-1">{arrivalTime}</div>
                        <div className="text-sm font-medium text-black">{arrivalStation}</div>
                        <div className="text-xs text-black">{arrivalDate}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneyDetails;