'use client';

import React from 'react';

interface QuantityControlProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    className?: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    className = ""
}) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <button
                onClick={onDecrease}
                className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-black"
            >
                <img src="/ic_minus.svg" alt="Kurang" className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-black">
                {quantity}
            </span>
            <button
                onClick={onIncrease}
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
                <img src="/ic_plus.svg" alt="Tambah" className="w-4 h-4" />
            </button>
        </div>
    );
};

export default QuantityControl;