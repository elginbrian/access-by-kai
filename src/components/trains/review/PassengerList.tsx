'use client';

import React from 'react';

interface Passenger {
    id: string;
    name: string;
    idNumber: string;
    seat: string;
    seatType: string;
}

interface PassengerListProps {
    passengers: Passenger[];
}

const PassengerList: React.FC<PassengerListProps> = ({ passengers }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/ic_family_seat_blue.svg" alt="Train" className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-black">Passengers & Seats</h2>
            </div>

            <div className="space-y-4">
                {passengers.map((passenger) => (
                    <div key={passenger.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-200"></div>
                            <div>
                                <h3 className="font-semibold text-black">{passenger.name}</h3>
                                <p className="text-sm text-black">Adult • ID: {passenger.idNumber}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">Seat {passenger.seat}</div>
                            <div className="text-sm text-black">{passenger.seatType}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PassengerList;