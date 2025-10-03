"use client";

import React from 'react';
import NavBarServices from '@/components/navbar/NavBarServices';
import BookingDetailsCard, { type BookingDetail } from '@/components/hotels/payment/BookingDetailsCard';
import TripDetailsCard, { type TripDetail } from '@/components/hotels/payment/TripDetailsCard';
import PaymentMethodsCard, { type PaymentTab } from '@/components/hotels/payment/PaymentMethodsCard';
import PaymentSummaryCard, { type PaymentSummaryItem } from '@/components/hotels/payment/PaymentSummaryCard';
import HelpSupportCard from '@/components/hotels/payment/HelpSupportCard';
import usePaymentForm from '@/lib/hooks/usePaymentForm';

const ShowlokPaymentPage = () => {
    // Use the payment form hook
    const {
        activeTab,
        formData,
        isProcessing,
        setActiveTab,
        updateFormData,
        applyPromoCode,
        processPayment
    } = usePaymentForm({
        onSuccess: (data: any) => {
            console.log('Payment successful:', data);
            alert('Pembayaran berhasil!');
        },
        onError: (error: string) => {
            console.error('Payment failed:', error);
            alert(`Pembayaran gagal: ${error}`);
        }
    });

    // Sample data
    const bookingDetail: BookingDetail = {
        id: "booking-1",
        title: "Luxury Lounge",
        icon: "/ic_train.svg",
        route: "Bekasi (BKS) → Bandung (BD)",
        class: "Eksekutif",
        date: "Senin, 15 Jan 2024",
        time: "08:00 - 15:30",
        passengers: 2,
        passengerType: "Dewasa",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        iconBgColor: "bg-yellow-600"
    };

    const tripDetail: TripDetail = {
        id: "trip-1",
        title: "Argo Parahyangan",
        trainCode: "KA 21",
        icon: "/ic_train.svg",
        route: "Bekasi (BKS) → Bandung (BD)",
        class: "Eksekutif",
        date: "Senin, 15 Jan 2024",
        time: "08:00 - 15:30",
        passengers: 2,
        passengerType: "Dewasa",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        iconBgColor: "bg-purple-600"
    };

    const paymentTabs: PaymentTab[] = [
        { id: "card", label: "Kartu Kredit/Debit", icon: "/ic_wifi.svg" },
        { id: "transfer", label: "Transfer Bank" },
        { id: "ewallet", label: "E-Wallet" },
        { id: "qris", label: "QRIS" }
    ];

    const summaryItems: PaymentSummaryItem[] = [
        { label: "Luxury Lounge (3x)", amount: "Rp 240.000" },
        { label: "Biaya Admin", amount: "Rp 5.000" },
        { label: "Asuransi Perjalanan", amount: "Rp 10.000" }
    ];

    const handleContactSupport = () => {
        alert('Menghubungi customer service...');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <NavBarServices service="Hotels" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Details */}
                        <BookingDetailsCard
                            title="Detail Pemesanan"
                            booking={bookingDetail}
                        />

                        {/* Trip Details */}
                        <TripDetailsCard
                            title="Detail Perjalanan"
                            trip={tripDetail}
                        />

                        {/* Payment Methods */}
                        <PaymentMethodsCard
                            tabs={paymentTabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            formData={formData}
                            onFormDataChange={updateFormData}
                            onPromoApply={applyPromoCode}
                        />
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Help Card */}
                            <HelpSupportCard
                                onContactSupport={handleContactSupport}
                            />

                            {/* Payment Summary */}
                            <PaymentSummaryCard
                                title="Ringkasan Pembayaran"
                                items={summaryItems}
                                total={{
                                    label: "Total",
                                    amount: "Rp 255.000"
                                }}
                                onPayNow={processPayment}
                                loading={isProcessing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowlokPaymentPage;