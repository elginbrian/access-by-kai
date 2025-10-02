'use client';

import React from 'react';

const SeatStatusLegend: React.FC = () => {
    const statusItems = [
        { color: 'bg-white border border-gray-300', label: 'Available' },
        { color: 'bg-blue-500', label: 'Selected' },
        { color: 'bg-gray-400', label: 'Occupied' },
        { color: 'bg-pink-400', label: 'Occupied (LP)' },
        { color: 'bg-green-500', label: 'Child' },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Seat Status</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs">
                {statusItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                        <span className="text-gray-700">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatStatusLegend;