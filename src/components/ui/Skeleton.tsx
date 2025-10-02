import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", width, height, rounded = false }) => {
  const baseClasses = "animate-pulse bg-gray-200";
  const roundedClass = rounded ? "rounded-full" : "rounded";
  const sizeStyles = {
    width: width || "100%",
    height: height || "20px",
  };

  return <div className={`${baseClasses} ${roundedClass} ${className}`} style={sizeStyles} />;
};

export const TrainCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <Skeleton width="120px" height="20px" />
          <Skeleton width="80px" height="16px" />
        </div>
        <Skeleton width="60px" height="24px" rounded />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <Skeleton width="60px" height="24px" className="mb-1" />
          <Skeleton width="80px" height="14px" />
        </div>
        <div className="flex-1 flex items-center gap-2">
          <Skeleton width="100%" height="2px" />
          <Skeleton width="20px" height="20px" rounded />
        </div>
        <div className="text-center">
          <Skeleton width="60px" height="24px" className="mb-1" />
          <Skeleton width="80px" height="14px" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton width="60px" height="14px" className="mb-1" />
          <Skeleton width="100px" height="16px" />
        </div>
        <div>
          <Skeleton width="80px" height="14px" className="mb-1" />
          <Skeleton width="120px" height="16px" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Skeleton width="100px" height="16px" />
        <Skeleton width="120px" height="28px" />
      </div>
    </div>
  );
};

export const FormSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
      <Skeleton width="150px" height="24px" className="mb-6" />

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton width="100px" height="16px" className="mb-2" />
            <Skeleton width="100%" height="48px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SeatMapSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
      <Skeleton width="120px" height="24px" className="mb-6" />

      <div className="grid grid-cols-4 gap-2 mb-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} width="40px" height="40px" />
        ))}
      </div>

      <div className="flex gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton width="16px" height="16px" />
            <Skeleton width="60px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FoodMenuSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-pulse">
          <Skeleton width="100%" height="200px" />

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <Skeleton width="120px" height="20px" />
              <Skeleton width="60px" height="20px" rounded />
            </div>
            <Skeleton width="100%" height="14px" className="mb-3" />
            <Skeleton width="80%" height="14px" className="mb-4" />

            <div className="flex justify-between items-center">
              <Skeleton width="80px" height="20px" />
              <Skeleton width="80px" height="36px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PaymentSummarySkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
      <Skeleton width="180px" height="24px" className="mb-6" />

      <div className="space-y-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton width="120px" height="16px" />
            <Skeleton width="80px" height="16px" />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <Skeleton width="60px" height="24px" />
          <Skeleton width="120px" height="24px" />
        </div>
      </div>

      <Skeleton width="100%" height="48px" />
    </div>
  );
};

export const BookingProgressSkeleton: React.FC = () => {
  return (
    <div className="bg-white border-b px-6 py-4 animate-pulse">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <Skeleton width="32px" height="32px" rounded />
                <Skeleton width="80px" height="14px" className="mt-2" />
              </div>
              {i < 4 && <Skeleton width="60px" height="2px" className="mx-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BookingPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BookingProgressSkeleton />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <TrainCardSkeleton />
            <div className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
              <Skeleton width="100px" height="20px" className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton width="20px" height="20px" />
                    <Skeleton width="150px" height="14px" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <FormSkeleton />
            <FormSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PaymentPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BookingProgressSkeleton />

      <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-8">
        <div className="lg:col-span-8 space-y-6">
          <TrainCardSkeleton />
          <div className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
            <Skeleton width="180px" height="24px" className="mb-6" />

            <div className="flex gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} width="120px" height="40px" />
              ))}
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton width="100px" height="16px" className="mb-2" />
                  <Skeleton width="100%" height="48px" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <PaymentSummarySkeleton />
        </div>
      </div>
    </div>
  );
};
