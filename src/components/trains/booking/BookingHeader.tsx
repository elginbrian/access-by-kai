"use client";

import React from "react";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import BookingProgress from "@/components/trains/booking/BookingProgress";

interface BookingStep {
  id: string;
  title: string;
}

interface BookingHeaderProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ currentStep, onStepClick }) => {
  const bookingSteps: BookingStep[] = [
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
    <div className="sticky top-0 z-30 bg-gray-50">
      <TrainNavigation />
      <BookingProgress steps={bookingSteps} currentStep={currentStep} onStepClick={onStepClick} />
    </div>
  );
};

export default BookingHeader;
