"use client";

import React from 'react';

interface StepperProps {
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
    const steps = [
        { id: 1, name: 'Price Simulation' },
        { id: 2, name: 'Booking' },
        { id: 3, name: 'Payment' },
        { id: 4, name: 'Tracking' },
        { id: 5, name: 'Selesai' },
    ];

    return (
        <div className="mb-8 px-4">
            <div className="hidden md:flex items-center justify-between gap-4">
                {steps.map((step, idx) => {
                    const completed = step.id < currentStep;
                    const active = step.id === currentStep;
                    return (
                        <div key={step.id} className="flex-1 flex items-center">
                            {/* Circle + label */}
                            <div className="flex items-center z-10">
                                <div
                                    className={`relative flex items-center justify-center rounded-full w-10 h-10 text-sm font-semibold shadow-sm
                                        ${completed ? 'bg-[#16a34a] text-white' : active ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    {completed ? (
                                        // checkmark
                                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 10.5L8.5 13L14 7" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <span className="text-sm font-semibold">{step.id}</span>
                                    )}
                                </div>
                                <div className="ml-3 hidden md:block">
                                    <div className={`${completed ? 'text-[#16a34a]' : active ? 'text-[#4c1d95] font-semibold' : 'text-gray-600 font-semibold'} text-sm`}>{step.name}</div>
                                </div>
                            </div>

                            {/* connector */}
                            {idx < steps.length - 1 && (
                                <div className="flex-1 h-1 mx-3 relative">
                                    <div className={`absolute left-0 top-0 h-1 w-full rounded-full ${step.id < currentStep ? 'bg-[#1bc95b]' : 'bg-gray-200'}`}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* mobile: compact horizontal */}
            <div className="md:hidden flex items-center justify-between gap-2">
                {steps.map((step) => {
                    const completed = step.id < currentStep;
                    const active = step.id === currentStep;
                    return (
                        <div key={step.id} className="flex-1 flex flex-col items-center text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                                ${completed ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white' : active ? 'bg-white border-2 border-[#8b5cf6] text-[#4c1d95]' : 'bg-gray-100 text-gray-500'}`}>
                                {completed ? (
                                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 10.5L8.5 13L14 7" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <span>{step.id}</span>
                                )}
                            </div>
                            <div className={`text-[10px] mt-1 ${active ? 'text-[#4c1d95] font-medium' : 'text-gray-400'}`}>{step.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
