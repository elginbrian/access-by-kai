"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Stepper from '@/components/logistics/Stepper';
import NavBarServices from '@/components/navbar/NavBarServices';
import Button from '@/components/button/Button';
import InputField from '@/components/input/InputField';
import TextAreaField from '@/components/input/TextAreaField';

const BookingDetailsPage: React.FC = () => {
    const router = useRouter();

    function goToPayment() {
        router.push('/logistic/payment');
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <NavBarServices service="Logistics" />
            <main className="max-w-6xl mx-auto p-4 md:p-8">
                <Stepper currentStep={2} />

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#8b5cf6] to-[#dd577a] text-white">
                            <img src="/ic_box_white.svg" alt="icon" className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
                    </div>

                    <section className="mb-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-3">Sender Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Full Name" className="w-full" />
                            <InputField label="Phone Number" className="w-full" />
                            <div className="md:col-span-2 w-full">
                                <TextAreaField rows={3} label="Sender Address" className="w-full" />
                            </div>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-3">Receiver Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Full Name" className="w-full" />
                            <InputField label="Phone Number" className="w-full" />
                            <div className="md:col-span-2 w-full">
                                <TextAreaField rows={3} label="Receiver Address" className="w-full" />
                            </div>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-3">Item Description</h4>
                        <TextAreaField rows={4} label="Describe your items..." className="w-full" />
                    </section>

                    <div className="mt-6">
                        <Button onClick={goToPayment} variant="active" className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
                            Selanjutnya →
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookingDetailsPage;
