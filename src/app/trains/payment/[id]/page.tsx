'use client';

import React, { useState } from 'react';
import TrainNavigation from '@/components/trains/navbar/TrainNavigation';
import BookingProgress from '@/components/trains/booking/BookingProgress';
import JourneyDetailsCard from '@/components/trains/payment/JourneyDetailsCard';
import PaymentMethodSelector from '@/components/trains/payment/PaymentMethodSelector';
import PaymentSummary from '@/components/trains/payment/PaymentSummary';

const TrainPaymentPage = () => {
    const [activePaymentMethod, setActivePaymentMethod] = useState('credit');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [promoCode, setPromoCode] = useState('');

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    const ticketPrice = 580000;
    const adminFee = 5000;
    const insurance = 10000;
    const total = ticketPrice + adminFee + insurance;

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

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(e.target.value.replace(/\D/g, ''));
    };

    const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardName(e.target.value);
    };

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length === 0) {
            setExpiryDate('');
        } else if (val.length <= 2) {
            setExpiryDate(val + '/');
        } else {
            setExpiryDate(val.slice(0, 2) + '/' + val.slice(2, 4));
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCvv(e.target.value);
    };

    const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPromoCode(e.target.value);
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
                {/* Left Section - Journey & Payment Details */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Journey Details */}
                    <JourneyDetailsCard
                        trainName="Argo Parahyangan"
                        trainCode="KA 21"
                        passengerCount={2}
                        passengerType="Dewasa"
                        departureStation="Bekasi"
                        arrivalStation="Bandung"
                        departureCode="BKS"
                        arrivalCode="BD"
                        className="Eksekutif"
                        date="Senin, 15 Jan 2024"
                        timeRange="08:00 - 15:30"
                    />

                    {/* Payment Method */}
                    <PaymentMethodSelector
                        activePaymentMethod={activePaymentMethod}
                        onPaymentMethodChange={setActivePaymentMethod}
                        cardNumber={cardNumber}
                        cardName={cardName}
                        expiryDate={expiryDate}
                        cvv={cvv}
                        promoCode={promoCode}
                        onCardNumberChange={handleCardNumberChange}
                        onCardNameChange={handleCardNameChange}
                        onExpiryDateChange={handleExpiryDateChange}
                        onCvvChange={handleCvvChange}
                        onPromoCodeChange={handlePromoCodeChange}
                    />
                </div>

                {/* Right Section - Payment Summary */}
                <div className="lg:col-span-4">
                    <PaymentSummary
                        ticketPrice={ticketPrice}
                        adminFee={adminFee}
                        insurance={insurance}
                        total={total}
                        formatPrice={formatPrice}
                    />
                </div>
            </div>
        </div>
    );
}

export default TrainPaymentPage;