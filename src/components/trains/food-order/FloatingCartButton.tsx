'use client';

import React from 'react';

interface FloatingCartButtonProps {
    itemCount: number;
    onClick?: () => void;
}

const ShoppingBag = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="m16 10a4 4 0 0 1-8 0"></path>
    </svg>
);

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors lg:hidden"
        >
            <ShoppingBag size={24} />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                </span>
            )}
        </button>
    );
};

export default FloatingCartButton;