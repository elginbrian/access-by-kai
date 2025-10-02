'use client';

import React from 'react';
import QuantityControl from './QuantityControl';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    badge?: string;
    badgeColor?: string;
}

interface FoodMenuItemProps {
    item: MenuItem;
    quantity: number;
    onQuantityChange: (id: string, delta: number) => void;
    formatPrice: (price: number) => string;
}

const FoodMenuItem: React.FC<FoodMenuItemProps> = ({
    item,
    quantity,
    onQuantityChange,
    formatPrice
}) => {
    return (
        <div className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-black mb-2">{item.name}</h3>
                {item.badge && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${item.badgeColor}`}>
                        {item.badge}
                    </span>
                )}
                <p className="text-black text-sm mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-black">{formatPrice(item.price)}</span>
                    <QuantityControl
                        quantity={quantity}
                        onIncrease={() => onQuantityChange(item.id, 1)}
                        onDecrease={() => onQuantityChange(item.id, -1)}
                    />
                </div>
            </div>
        </div>
    );
};

export default FoodMenuItem;