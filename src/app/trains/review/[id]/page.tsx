"use client";

import React from "react";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import BookingProgress from "@/components/trains/booking/BookingProgress";
import JourneyDetails from "@/components/trains/review/JourneyDetails";
import PassengerList from "@/components/trains/review/PassengerList";
import MealOrderList from "@/components/trains/review/MealOrderList";
import BookingSummary from "@/components/trains/review/BookingSummary";
import BookingLayout from "@/components/layout/BookingLayout";
import { useBookingContext } from "@/lib/hooks/useBookingContext";
import { useCentralBooking } from "@/lib/hooks/useCentralBooking";

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

const TrainReviewContent = () => {
  const { currentStep, handleStepClick, prevStep, nextStep } = useBookingContext();
  const { bookingData } = useCentralBooking();

  const { journey, booker, passengers: passengerData, foodOrders, pricing } = bookingData;

  const passengers: Passenger[] = passengerData.map((passenger, index) => ({
    id: (index + 1).toString(),
    name: passenger.name,
    idNumber: passenger.idNumber,
    seat: passenger.seat || "Belum dipilih",
    seatType: passenger.seatType || "Unknown",
  }));

  const mealOrders: MealOrder[] = foodOrders.map((order) => ({
    id: order.id,
    name: order.name,
    forPassenger: order.forPassenger || "Main Passenger",
    price: order.price,
    image: order.image || "/dummy_images.png",
  }));

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
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const mealsTotal = pricing.foodTotal;
  const serviceFee = pricing.serviceFee;
  const total = pricing.total;

  if (!journey.jadwalId || !booker.fullName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pemesanan...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-gray-50">
        <TrainNavigation />

        <BookingProgress steps={bookingSteps} currentStep={currentStep} onStepClick={handleStepClick} />
      </div>
      <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-8">
        <div className="lg:col-span-8 space-y-6">
          <JourneyDetails
            trainName={journey.trainName}
            trainCode={journey.trainCode}
            departureTime={formatTime(journey.departureTime)}
            departureStation={journey.departureStation}
            departureDate={formatDate(journey.departureDate)}
            arrivalTime={formatTime(journey.arrivalTime)}
            arrivalStation={journey.arrivalStation}
            arrivalDate={formatDate(journey.arrivalDate)}
          />

          <PassengerList passengers={passengers} />
          <MealOrderList mealOrders={mealOrders} formatPrice={formatPrice} onAddMeal={() => handleStepClick(2)} />
        </div>

        <div className="lg:col-span-4">
          <BookingSummary
            trainTickets={pricing.trainTickets}
            meals={mealsTotal}
            serviceFee={serviceFee}
            total={total}
            passengerCount={passengers.length}
            mealCount={foodOrders.length}
            formatPrice={formatPrice}
            onEditSeat={() => handleStepClick(1)}
            onEditFood={() => handleStepClick(2)}
            onProceedToPayment={nextStep}
          />
        </div>
      </div>
    </div>
  );
};

const TrainReviewPage = () => {
  return (
    <BookingLayout>
      <TrainReviewContent />
    </BookingLayout>
  );
};

export default TrainReviewPage;
