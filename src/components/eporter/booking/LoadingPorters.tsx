'use client';

import React from 'react';

interface LoadingPortersProps {
    onCancel?: () => void;
}

const LoadingPorters: React.FC<LoadingPortersProps> = ({ onCancel }) => {
    const handleCancel = () => {
        console.log('Loading cancelled');
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            {/* Loading Animation Container */}
            <div className="relative mx-auto mb-8 w-32 h-32">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-purple-100 rounded-full"></div>
                
                {/* Rotating Border */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-400 animate-spin"></div>
                
                {/* Search Icon in Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 text-blue-600">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Loading Text */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
                Looking for available porter near you...
            </h3>
            
            <p className="text-gray-600 mb-8">
                This may take up to 5 minutes.
            </p>

            {/* Loading Dots */}
            <div className="flex justify-center space-x-2 mb-8">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>

            {/* Cancel Button */}
            <button
                onClick={handleCancel}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
                Batalkan
            </button>
        </div>
    );
};

export default LoadingPorters;