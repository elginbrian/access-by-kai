'use client';

import React from 'react';
import FoodMenuItem from './FoodMenuItem';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    badge?: string;
    badgeColor?: string;
}

interface FoodMenuGridProps {
    menuItems: MenuItem[];
    quantities: { [key: string]: number };
    onQuantityChange: (id: string, delta: number) => void;
    formatPrice: (price: number) => string;
}

const FoodMenuGrid: React.FC<FoodMenuGridProps> = ({
    menuItems,
    quantities,
    onQuantityChange,
    formatPrice
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map(item => (
                <FoodMenuItem
                    key={item.id}
                    item={item}
                    quantity={quantities[item.id] || 0}
                    onQuantityChange={onQuantityChange}
                    formatPrice={formatPrice}
                />
            ))}
        </div>
    );
};

export default FoodMenuGrid;