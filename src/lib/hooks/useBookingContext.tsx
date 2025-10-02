"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface BookingContextType {
  currentStep: number;
  maxCompletedStep: number;
  handleStepClick: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  navigateToStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const trainId = params?.id as string;

  const getCurrentStepFromPath = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("/trains/booking/")) return 1;
      if (path.includes("/trains/food-order/")) return 2;
      if (path.includes("/trains/review/")) return 3;
      if (path.includes("/trains/payment/")) return 4;
    }
    return 1;
  };

  const [currentStep, setCurrentStep] = useState(getCurrentStepFromPath());
  const [maxCompletedStep, setMaxCompletedStep] = useState(1);

  useEffect(() => {
    const step = getCurrentStepFromPath();
    setCurrentStep(step);
  }, [params]);

  const handleStepClick = (step: number) => {
    if (step <= maxCompletedStep || step === maxCompletedStep + 1) {
      navigateToStep(step);
    }
  };

  const navigateToStep = (step: number) => {
    if (!trainId) return;

    switch (step) {
      case 1:
        router.push(`/trains/booking/${trainId}`);
        break;
      case 2:
        router.push(`/trains/food-order/${trainId}`);
        break;
      case 3:
        router.push(`/trains/review/${trainId}`);
        break;
      case 4:
        router.push(`/trains/payment/${trainId}`);
        break;
      default:
        break;
    }
  };

  const nextStep = () => {
    const newStep = Math.min(currentStep + 1, 4);
    markStepCompleted(currentStep);
    navigateToStep(newStep);
  };

  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 1);
    navigateToStep(newStep);
  };

  const markStepCompleted = (step: number) => {
    setMaxCompletedStep((prev) => Math.max(prev, step));
  };

  return (
    <BookingContext.Provider
      value={{
        currentStep,
        maxCompletedStep,
        handleStepClick,
        nextStep,
        prevStep,
        navigateToStep,
        markStepCompleted,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookingContext must be used within BookingProvider");
  }
  return context;
}
