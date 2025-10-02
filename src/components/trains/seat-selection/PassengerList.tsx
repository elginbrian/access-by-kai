'use client';

import React from 'react';

export interface Passenger {
    id: string;
    name: string;
    seat: string;
    isAdult: boolean;
    type: 'adult' | 'child';
}

interface PassengerListProps {
    passengers: Passenger[];
    onPassengerChange?: (passengerId: string) => void;
}

const PassengerList: React.FC<PassengerListProps> = ({ passengers, onPassengerChange }) => {
    return (
        <div className="bg-white rounded-br-2xl p-6 border">
            <h3 className="font-semibold text-gray-900 mb-4">Penumpang ({passengers.length})</h3>
            
            <div className="space-y-3">
                {passengers.map((passenger) => (
                    <div key={passenger.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{passenger.name}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                    passenger.isAdult 
                                        ? 'bg-blue-100 text-blue-600' 
                                        : 'bg-green-100 text-green-600'
                                }`}>
                                    {passenger.isAdult ? 'Adult' : 'Child'}
                                </span>
                                {onPassengerChange && (
                                    <button 
                                        onClick={() => onPassengerChange(passenger.id)}
                                        className="text-blue-600 text-xs hover:text-blue-800 font-medium"
                                    >
                                        Change
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Seat: <span className="font-medium">{passenger.seat || 'Not selected'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Auto-assign Button */}
            <button className="w-full mt-4 bg-gray-800 text-white py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Auto-assign Seats
            </button>
        </div>
    );
};

export default PassengerList;