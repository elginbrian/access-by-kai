"use client";

import React, { useState } from "react";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import BookingProgress from "@/components/trains/booking/BookingProgress";
import JourneyDetailsCard from "@/components/trains/payment/JourneyDetailsCard";
import PaymentMethodSelector from "@/components/trains/payment/PaymentMethodSelector";
import PaymentSummary from "@/components/trains/payment/PaymentSummary";
import BookingLayout from "@/components/layout/BookingLayout";
import { useBookingContext } from "@/lib/hooks/useBookingContext";
import { useCentralBooking } from "@/lib/hooks/useCentralBooking";

const TrainPaymentContent = () => {
  const { currentStep, handleStepClick, prevStep } = useBookingContext();
  const { bookingData } = useCentralBooking();

  const [activePaymentMethod, setActivePaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [promoCode, setPromoCode] = useState("");

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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value.replace(/\D/g, ""));
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length === 0) {
      setExpiryDate("");
    } else if (val.length <= 2) {
      setExpiryDate(val + "/");
    } else {
      setExpiryDate(val.slice(0, 2) + "/" + val.slice(2, 4));
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

        <div className="lg:col-span-4">
          <PaymentSummary
            ticketPrice={pricing.trainTickets}
            foodTotal={pricing.foodTotal}
            adminFee={pricing.serviceFee}
            total={pricing.total}
            formatPrice={formatPrice}
            foodOrders={foodOrders}
            passengerCount={passengers.length}
            onProceedToPayment={() => {}}
            onBackToReview={prevStep}
          />
        </div>
      </div>
    </div>
  );
};

const TrainPaymentPage = () => {
  return (
    <BookingLayout>
      <TrainPaymentContent />
    </BookingLayout>
  );
};

export default TrainPaymentPage;
