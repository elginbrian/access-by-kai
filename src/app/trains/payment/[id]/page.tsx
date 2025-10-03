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
import { usePayment, usePaymentStatus } from "@/lib/hooks/usePayment";

const TrainPaymentContent = () => {
  const { currentStep, handleStepClick, prevStep } = useBookingContext();
  const { bookingData } = useCentralBooking();
  const payment = usePayment();
  const statusInfo = usePaymentStatus(payment.status);

  const [activePaymentMethod, setActivePaymentMethod] = useState("credit");
  const [selectedSpecificMethod, setSelectedSpecificMethod] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [popupClosed, setPopupClosed] = useState(false);

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

  const handlePaymentMethodChange = (method: string) => {
    setActivePaymentMethod(method);
    if (method === "qris") {
      setSelectedSpecificMethod("qris");
    } else {
      setSelectedSpecificMethod(null);
    }
  };

  const handleProceedToPayment = async () => {
    if (!payment.isSnapReady) {
      alert("Payment gateway belum siap, silakan tunggu...");
      return;
    }

    let paymentMethods: string[] = [];

    if (activePaymentMethod === "credit") {
      paymentMethods = ["credit_card"];
    } else if (activePaymentMethod === "transfer") {
      if (selectedSpecificMethod) {
        paymentMethods = [selectedSpecificMethod];
      } else {
        paymentMethods = ["bca_va", "bni_va", "bri_va", "mandiri_va", "permata_va", "other_va"];
      }
    } else if (activePaymentMethod === "ewallet") {
      if (selectedSpecificMethod) {
        paymentMethods = [selectedSpecificMethod];
      } else {
        paymentMethods = ["gopay", "shopeepay"];
      }
    } else if (activePaymentMethod === "qris") {
      paymentMethods = ["qris"];
    }

    console.log("Selected payment method:", activePaymentMethod);
    console.log("Payment methods to be sent:", paymentMethods);

    if (!payment.snapToken) {
      setPopupClosed(false);
      await payment.createPayment(paymentMethods);
    } else {
      setPopupClosed(false);
      payment.openSnapPayment(() => {
        setPopupClosed(true);
      });
    }
  };

  const handleContinuePayment = () => {
    if (payment.snapToken) {
      setPopupClosed(false);
      payment.openSnapPayment(() => {
        setPopupClosed(true);
      });
    }
  };

  React.useEffect(() => {
    if (statusInfo.isCompleted && payment.orderId) {
      setTimeout(() => {
        window.location.href = `/trains/payment/success?order_id=${payment.orderId}`;
      }, 2000);
    }
  }, [statusInfo.isCompleted, payment.orderId]);

  React.useEffect(() => {
    if (payment.snapToken && !payment.isProcessing && !popupClosed) {
      payment.openSnapPayment(() => {
        setPopupClosed(true); // Set popup as closed when user closes it
      });
    }
  }, [payment.snapToken, payment.isProcessing, popupClosed]);

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
            onPaymentMethodChange={handlePaymentMethodChange}
            selectedSpecificMethod={selectedSpecificMethod}
            onSpecificMethodChange={setSelectedSpecificMethod}
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
            onProceedToPayment={handleProceedToPayment}
            onBackToReview={prevStep}
            isPaymentLoading={payment.isLoading || payment.isProcessing}
            paymentStatus={payment.status}
            paymentError={payment.error}
            onRetryPayment={payment.retryPayment}
            onResetPayment={payment.resetPayment}
            onContinuePayment={handleContinuePayment}
            isSnapReady={payment.isSnapReady}
            popupClosed={popupClosed}
            snapToken={payment.snapToken}
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
