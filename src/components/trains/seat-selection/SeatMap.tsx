'use client';

import React from 'react';

export type SeatStatus = 'available' | 'selected' | 'occupied' | 'child' | 'occupied-lp';

export interface Seat {
    id: string;
    row: number;
    letter: string;
    status: SeatStatus;
}

interface SeatMapProps {
    seats: Seat[];
    currentCar: number;
    onSeatClick: (seatId: string, status: SeatStatus) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, currentCar, onSeatClick }) => {
    const getSeatColor = (status: SeatStatus): string => {
        switch (status) {
            case 'available': return 'bg-white border border-gray-300 hover:border-blue-300 cursor-pointer';
            case 'selected': return 'bg-blue-500 border border-blue-500 cursor-pointer';
            case 'occupied': return 'bg-gray-400 border border-gray-400 cursor-not-allowed';
            case 'child': return 'bg-green-500 border border-green-500 cursor-not-allowed';
            case 'occupied-lp': return 'bg-pink-400 border border-pink-400 cursor-not-allowed';
            default: return 'bg-gray-300 border border-gray-300 cursor-not-allowed';
        }
    };

    const canClickSeat = (status: SeatStatus): boolean => {
        return status === 'available' || status === 'selected';
    };

    const getSeatContent = (status: SeatStatus): string | null => {
        switch (status) {
            case 'occupied-lp': return 'P';
            default: return null;
        }
    };

    // Group seats into rows of 4
    const seatRows = [];
    for (let i = 0; i < seats.length; i += 4) {
        seatRows.push(seats.slice(i, i + 4));
    }

    return (
        <div className="bg-white rounded-bl-2xl p-6 border w-full">
            <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-900">Ekonomi {currentCar}</h4>
                <p className="text-xs text-gray-500">Gerbong</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                {/* Seat Grid Headers */}
                <div className="flex items-center justify-center gap-8 text-xs font-medium text-gray-600 mb-3">
                    <div className="flex gap-1">
                        <span className="w-7 text-center">A</span>
                        <span className="w-7 text-center">B</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="w-7 text-center">C</span>
                        <span className="w-7 text-center">D</span>
                    </div>
                </div>

                {/* Seat Grid */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {seatRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex items-center gap-2 justify-center">
                            {/* Row number */}
                            <div className="w-6 text-xs text-gray-500 text-center font-medium">
                                {rowIndex + 1}
                            </div>

                            {/* Left side seats (A, B) */}
                            <div className="flex gap-1">
                                {row.slice(0, 2).map((seat, seatIdx) => (
                                    <button
                                        key={seat.id}
                                        onClick={() => canClickSeat(seat.status) && onSeatClick(seat.id, seat.status)}
                                        className={`w-7 h-7 rounded-sm transition-all duration-200 flex items-center justify-center text-xs font-bold text-white ${getSeatColor(seat.status)} ${rowIndex === seatRows.length - 1 && seatIdx === 0 ? 'rounded-bl-lg' : ''
                                            }`}
                                        disabled={!canClickSeat(seat.status)}
                                        title={`Seat ${seat.id} - ${seat.status}`}
                                    >
                                        {getSeatContent(seat.status)}
                                    </button>
                                ))}
                            </div>

                            {/* Aisle */}
                            <div className="w-4"></div>

                            {/* Right side seats (C, D) */}
                            <div className="flex gap-1">
                                {row.slice(2, 4).map((seat) => (
                                    <button
                                        key={seat.id}
                                        onClick={() => canClickSeat(seat.status) && onSeatClick(seat.id, seat.status)}
                                        className={`w-7 h-7 rounded-sm transition-all duration-200 flex items-center justify-center text-xs font-bold text-white ${getSeatColor(seat.status)}`}
                                        disabled={!canClickSeat(seat.status)}
                                        title={`Seat ${seat.id} - ${seat.status}`}
                                    >
                                        {getSeatContent(seat.status)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeatMap;