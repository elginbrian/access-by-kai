'use client';

import React from 'react';

interface PorterCardProps {
    name: string;
    image: string;
    status: string;
    onWhatsAppClick?: () => void;
    onRequestAnotherClick?: () => void;
    onCancelClick?: () => void;
}

const PorterCard: React.FC<PorterCardProps> = ({
    name,
    image,
    status,
    onWhatsAppClick,
    onRequestAnotherClick,
    onCancelClick
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Porter Profile */}
            <div className="text-center mb-6">
                <div className="relative inline-block mb-3">
                    <img
                        src={image}
                        alt={name}
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Porter Found!</h3>
                <p className="text-lg font-semibold text-gray-700 mb-3">{name}</p>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm">
                    <img src="/ic_clock.svg" alt="Info" />
                    {status}
                </div>
            </div>

            {/* WhatsApp Button */}
            <button 
                onClick={onWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 mb-3 transition-colors"
            >
                <img src="/ic_whatsapp.svg" alt="WhatsApp" />
                Chat on WhatsApp
            </button>

            {/* Request Another Porter */}
            <button 
                onClick={onRequestAnotherClick}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-medium text-base mb-4 transition-colors"
            >
                Request Another Porter
            </button>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2 mb-4">
                <img src="/ic_info_yellow.svg" alt="Info" />
                <p className="text-xs text-yellow-800">
                    If your porter doesn't respond within 5 minutes, please request another porter.
                </p>
            </div>

            {/* Cancel Button */}
            <button 
                onClick={onCancelClick}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3.5 rounded-xl font-semibold text-base transition-colors"
            >
                Batalkan
            </button>
        </div>
    );
};

export default PorterCard;