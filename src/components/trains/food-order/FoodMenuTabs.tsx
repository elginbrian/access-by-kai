'use client';

import React from 'react';

type FoodTabType = 'Makanan' | 'Snacks' | 'Minuman';

interface FoodMenuTabsProps {
    activeTab: FoodTabType;
    onTabChange: (tab: FoodTabType) => void;
}

const FoodMenuTabs: React.FC<FoodMenuTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs: FoodTabType[] = ['Makanan', 'Snacks', 'Minuman'];

    return (
        <div className="inline-flex gap-2 bg-gray-100 p-1 rounded-lg">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab
                            ? 'text-blue-600 bg-white'
                            : 'text-black hover:text-black hover:bg-gray-50'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default FoodMenuTabs;