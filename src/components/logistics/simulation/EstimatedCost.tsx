"use client";

import React from 'react';

const EstimatedCost: React.FC = () => {
    return (
        <div>
            <div className="flex items-center mb-4">
                <img src="/ic_invoice_white.svg" alt="Image" className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] h-10 w-10 p-2 rounded-lg mr-3" />
                <span className="text-lg font-semibold text-black">Estimated Cost</span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Base Price</span>
                    <span className="text-black font-bold">Rp 150,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Weight Charge</span>
                    <span className="text-black font-bold">Rp 25,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Insurance</span>
                    <span className="text-black font-bold">Rp 10,000</span>
                </div>
            </div>
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center font-bold text-lg">
                    <span className="text-[#3b82f6]">Total Cost</span>
                    <span className="text-[#3b82f6] font-bold text-xl">Rp 185,000</span>
                </div>
            </div>
            <div className="flex flex-row items-center justify-center mt-4">
                <img src="/ic_clock_gray.svg" alt="" className="h-4 w-4 mr-2" />
                <p className="text-sm text-gray-500 text-center">Estimated delivery: 2-3 business days</p>
            </div>
        </div>
    );
};

export default EstimatedCost;
