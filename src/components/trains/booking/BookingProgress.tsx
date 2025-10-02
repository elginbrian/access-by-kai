"use client";

import React from "react";
import { colors } from "@/app/design-system/colors";
import MiniBookingTimer from "@/components/trains/MiniBookingTimer";

interface BookingStep {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface BookingProgressProps {
  steps: BookingStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const BookingProgress: React.FC<BookingProgressProps> = ({ steps, currentStep, onStepClick }) => {
  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );

  const getStepIcon = (step: BookingStep, index: number) => {
    if (step.icon) return step.icon;

    switch (step.id.toLowerCase()) {
      case "booking":
      case "pemesanan":
        return <img src="/ic_ticket_booking.svg" alt="Train" />;
      case "food":
      case "makanan":
      case "pemesanan makanan":
        return <img src="/ic_meal_gray.svg" alt="Food" />;
      case "review":
        return <img src="/ic_eyes.svg" alt="Review" />;
      case "payment":
      case "bayar":
        return <img src="/ic_credit_card.svg" alt="Payment" />;
      default:
        return <span className="text-sm font-bold">{index + 1}</span>;
    }
  };

  const getStepStyles = (index: number) => {
    const stepNumber = index + 1;
    const isActive = stepNumber === currentStep;
    const isCompleted = stepNumber < currentStep;
    const isClickable = onStepClick && stepNumber <= currentStep;

    if (isCompleted) {
      return {
        backgroundColor: colors.violet.normal,
        color: colors.base.light,
        cursor: isClickable ? "pointer" : "default",
      };
    } else if (isActive) {
      return {
        background: `linear-gradient(0deg, ${colors.blue.normal} 0%, ${colors.violet.normal} 100%)`,
        color: colors.base.light,
        cursor: "default",
      };
    } else {
      return {
        backgroundColor: colors.base.light,
        color: colors.base.darkHover,
        border: `1px solid ${colors.base.dark}`,
        cursor: "default",
      };
    }
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-[1400px] mx-auto px-6 py-5">
        <div className="flex items-center justify-between relative">
          <div className="w-[200px]"></div>

          <div className="flex items-center justify-center flex-1">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isClickable = onStepClick && stepNumber <= currentStep;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center relative z-20" onClick={isClickable ? () => onStepClick(index + 1) : undefined}>
                    {/* Step Circle with Label */}
                    <div className={`px-5 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${isClickable ? "hover:scale-105 cursor-pointer" : ""}`} style={getStepStyles(index)}>
                      {isCompleted ? <CheckIcon /> : getStepIcon(step, index)}
                      <div className="text-sm font-medium transition-colors duration-300">{step.title}</div>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4 relative">
                      <div className="h-1 bg-gray-200"></div>
                      {stepNumber < currentStep && (
                        <div
                          className="absolute top-0 left-0 h-0.5 transition-all duration-500"
                          style={{
                            width: "100%",
                            backgroundColor: colors.violet.normal,
                          }}
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Right - Timer */}
          <div className="w-[200px] flex justify-end">
            <MiniBookingTimer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;
