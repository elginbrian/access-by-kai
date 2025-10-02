'use client';

import React from 'react';

interface JourneyDetailsCardProps {
    trainName: string;
    trainCode: string;
    passengerCount: number;
    passengerType: string;
    departureStation: string;
    arrivalStation: string;
    departureCode: string;
    arrivalCode: string;
    className: string;
    date: string;
    timeRange: string;
}

const JourneyDetailsCard: React.FC<JourneyDetailsCardProps> = ({
    trainName,
    trainCode,
    passengerCount,
    passengerType,
    departureStation,
    arrivalStation,
    departureCode,
    arrivalCode,
    className,
    date,
    timeRange
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-black">Journey Details</h2>
            </div>

            {/* Train Card */}
            <div className="bg-indigo-50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-black">{trainName}</h3>
                            <p className="text-black text-sm">{trainCode}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-black">{passengerCount} Penumpang</div>
                        <div className="text-sm text-black">{passengerType}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-black">
                        <span className="font-semibold">{departureStation} ({departureCode})</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="font-semibold">{arrivalStation} ({arrivalCode})</span>
                    </div>
                    <div className="text-sm text-black">{className}</div>
                    <div className="text-sm text-black">{date} • {timeRange}</div>
                </div>
            </div>
        </div>
    );
};

export default JourneyDetailsCard;