'use client';

import React from 'react';

interface CarSelectorProps {
    currentCar: number;
    onCarChange: (carNumber: number) => void;
    totalCars?: number;
}

const CarSelector: React.FC<CarSelectorProps> = ({ 
    currentCar, 
    onCarChange, 
    totalCars = 8 
}) => {
    return (
        <div className="bg-white rounded-t-2xl p-6 border">
            <h3 className="font-semibold text-gray-900 mb-3">Pilih Kursi Penumpang</h3>
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalCars }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => onCarChange(i + 1)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentCar === i + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Ekonomi {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CarSelector;