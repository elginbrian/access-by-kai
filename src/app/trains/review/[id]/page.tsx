'use client';

import React from 'react';
import TrainNavigation from '@/components/trains/navbar/TrainNavigation';
import BookingProgress from '@/components/trains/booking/BookingProgress';
import JourneyDetails from '@/components/trains/review/JourneyDetails';
import PassengerList from '@/components/trains/review/PassengerList';
import MealOrderList from '@/components/trains/review/MealOrderList';
import BookingSummary from '@/components/trains/review/BookingSummary';

interface Passenger {
    id: string;
    name: string;
    idNumber: string;
    seat: string;
    seatType: string;
}

interface MealOrder {
    id: string;
    name: string;
    forPassenger: string;
    price: number;
    image: string;
}

const TrainReviewPage = () => {
    const passengers: Passenger[] = [
        {
            id: '1',
            name: 'John Anderson',
            idNumber: '1234567890123456',
            seat: '12A',
            seatType: 'Window'
        },
        {
            id: '2',
            name: 'Sarah Anderson',
            idNumber: '1234567890123457',
            seat: '12B',
            seatType: 'Aisle'
        }
    ];

    const mealOrders: MealOrder[] = [
        {
            id: '1',
            name: 'Nasi Gudeg',
            forPassenger: 'John Anderson',
            price: 45000,
            image: 'https://images.unsplash.com/photo-1596040033229-a0b4e4c82a4c?w=150&h=150&fit=crop'
        },
        {
            id: '2',
            name: 'Nasi Ayam',
            forPassenger: 'Sarah Anderson',
            price: 42000,
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=150&h=150&fit=crop'
        }
    ];

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    const trainTickets = 1200000;
    const meals = 87000;
    const serviceFee = 15000;
    const total = trainTickets + meals + serviceFee;

    const [currentStep, setCurrentStep] = React.useState(1);

    const bookingSteps = [
        {
            id: 'pemesanan',
            title: 'Pemesanan'
        },
        {
            id: 'makanan',
            title: 'Pemesanan Makanan'
        },
        {
            id: 'review',
            title: 'Review'
        },
        {
            id: 'bayar',
            title: 'Bayar'
        },
    ];

    const handleStepClick = (step: number) => {
        // Only allow going back to previous steps
        if (step <= currentStep) {
            setCurrentStep(step);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-30 bg-gray-50">
                {/* Header */}
                <TrainNavigation />

                {/* Progress Steps */}
                <BookingProgress
                    steps={bookingSteps}
                    currentStep={currentStep}
                    onStepClick={handleStepClick}
                />
            </div>
            <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-8">
                {/* Left Section - Journey Details */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Journey Details */}
                    <JourneyDetails
                        trainName="Argo Parahyangan"
                        trainCode="KA 21"
                        departureTime="07:30"
                        departureStation="Jakarta Gambir"
                        departureDate="Dec 25, 2024"
                        arrivalTime="11:15"
                        arrivalStation="Surabaya Gubeng"
                        arrivalDate="Dec 25, 2024"
                    />

                    {/* Passengers & Seats */}
                    <PassengerList passengers={passengers} />

                    {/* Meal Orders */}
                    <MealOrderList 
                        mealOrders={mealOrders} 
                        formatPrice={formatPrice} 
                    />
                </div>

                {/* Right Section - Booking Summary */}
                <div className="lg:col-span-4">
                    <BookingSummary
                        trainTickets={trainTickets}
                        meals={meals}
                        serviceFee={serviceFee}
                        total={total}
                        formatPrice={formatPrice}
                        onEditSeat={() => console.log('Edit seat clicked')}
                        onEditFood={() => console.log('Edit food clicked')}
                        onProceedToPayment={() => console.log('Proceed to payment clicked')}
                    />
                </div>
            </div>
        </div>
    );
}

export default TrainReviewPage;