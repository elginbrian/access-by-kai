"use client";

import React, { useState } from "react";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import BookingProgress from "@/components/trains/booking/BookingProgress";
import JourneyDetailsCard from "@/components/trains/payment/JourneyDetailsCard";
import PaymentMethodSelector from "@/components/trains/payment/PaymentMethodSelector";
import PaymentSummary from "@/components/trains/payment/PaymentSummary";
import PaymentGateway from "@/components/trains/payment/PaymentGateway";
import BookingLayout from "@/components/layout/BookingLayout";
import { useBookingContext } from "@/lib/hooks/useBookingContext";
import { useCentralBooking } from "@/lib/hooks/useCentralBooking";
import { PaymentErrorBoundary } from "@/components/ErrorBoundary";

const TrainPaymentContent = () => {
  const { currentStep, handleStepClick, prevStep } = useBookingContext();
  const { bookingData } = useCentralBooking();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (e) {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const { journey, booker, passengers, foodOrders, pricing } = bookingData;

  const bookingSteps = [
    {
      id: "pemesanan",
      title: "Pemesanan",
    },
    {
      id: "makanan",
      title: "Pemesanan Makanan",
    },
    {
      id: "review",
      title: "Review",
    },
    {
      id: "bayar",
      title: "Bayar",
    },
  ];

  if (!journey.jadwalId || !booker.fullName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentSuccess(true);
    setPaymentOrderId(orderId);

    setTimeout(() => {
      window.location.href = `/trains/payment/success?order_id=${orderId}`;
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-gray-50">
        <TrainNavigation />
        <BookingProgress steps={bookingSteps} currentStep={currentStep} onStepClick={handleStepClick} />
      </div>

      <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-8">
        <div className="lg:col-span-8 space-y-6">
          <JourneyDetailsCard
            trainName={journey.trainName}
            trainCode={journey.trainCode}
            passengerCount={passengers.length}
            passengerType="Dewasa"
            departureStation={journey.departureStation}
            arrivalStation={journey.arrivalStation}
            departureCode={journey.departureStation.slice(0, 3).toUpperCase()}
            arrivalCode={journey.arrivalStation.slice(0, 3).toUpperCase()}
            className="Eksekutif"
            date={formatDate(journey.departureDate)}
            timeRange={`${formatTime(journey.departureTime)} - ${formatTime(journey.arrivalTime)}`}
          />

          <PaymentGateway onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} />
        </div>

        <div className="lg:col-span-4">
          <PaymentSummary
            ticketPrice={pricing.trainTickets}
            foodTotal={pricing.foodTotal}
            adminFee={pricing.serviceFee}
            total={pricing.total}
            formatPrice={formatPrice}
            foodOrders={foodOrders}
            passengerCount={passengers.length}
            onBackToReview={prevStep}
          />
        </div>
      </div>
    </div>
  );
};

const TrainPaymentPage = () => {
  return (
    <PaymentErrorBoundary>
      <BookingLayout>
        <TrainPaymentContent />
      </BookingLayout>
    </PaymentErrorBoundary>
  );
};

export default TrainPaymentPage;
