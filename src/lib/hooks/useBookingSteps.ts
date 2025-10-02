import { useState } from "react";

export function useBookingSteps() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return {
    currentStep,
    setCurrentStep,
    handleStepClick,
    nextStep,
    prevStep,
  };
}
