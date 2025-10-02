"use client";

import React from 'react';
import InputField from '@/components/input/InputField';

const PriceForm: React.FC = () => {
    return (
        <div className="bg-white p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origin Station</label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                        <option value="">Select origin</option>
                        <option value="Jakarta">Jakarta</option>
                        <option value="Surabaya">Surabaya</option>
                        <option value="Bandung">Bandung</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination Station</label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                        <option value="">Select destination</option>
                        <option value="Surabaya">Surabaya</option>
                        <option value="Jakarta">Jakarta</option>
                        <option value="Bandung">Bandung</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <InputField
                        label="Weight (kg)"
                        type="number"
                        placeholder="Enter weight"
                        className="block w-full px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³)</label>
                    <InputField
                        label="Volume (m³)"
                        type="number"
                        placeholder="Enter volume"
                        className="block w-full px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    />
                </div>
            </div>
        </div>
    );
};

export default PriceForm;
