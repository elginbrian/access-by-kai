'use client';

import React from 'react';

interface SeatSelectionBottomBarProps {
    selectedSeatsCount: number;
    totalPrice: string;
    onUseAISuggestion?: () => void;
    onContinueBooking: () => void;
}

const SeatSelectionBottomBar: React.FC<SeatSelectionBottomBarProps> = ({
    selectedSeatsCount,
    totalPrice,
    onUseAISuggestion,
    onContinueBooking
}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        {selectedSeatsCount} seat{selectedSeatsCount !== 1 ? 's' : ''} selected
                    </span>
                    <div className="text-lg font-bold text-gray-900">
                        Total: {totalPrice}
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {onUseAISuggestion && (
                        <button 
                            onClick={onUseAISuggestion}
                            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors bg-purple-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Use AI Suggestion
                        </button>
                    )}
                    <button 
                        onClick={onContinueBooking}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Booking
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionBottomBar;