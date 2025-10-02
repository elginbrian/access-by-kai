"use client";

import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { colors } from "@/app/design-system/colors";
import { useTrainBookingDetails, useTrainRouteStations } from "@/lib/hooks/useTrainBookingDetails";
import { useAuth } from "@/lib/auth/AuthContext";
import { useBookingFormData } from "@/lib/hooks/useBookingFormData";
import { useBookingSteps } from "@/lib/hooks/useBookingSteps";
import { useSeatSelection } from "@/lib/hooks/useSeatSelection";

// Import modular components
import BookingHeader from "@/components/trains/booking/BookingHeader";
import TrainSummaryCard from "@/components/trains/booking/TrainSummaryCard";
import TrainInfoCard from "@/components/trains/booking/TrainInfoCard";
import BookerForm from "@/components/trains/booking/BookerForm";
import PassengerForm from "@/components/trains/booking/PassengerForm";
import SeatSelector from "@/components/trains/booking/SeatSelector";
import PaymentButton from "@/components/trains/booking/PaymentButton";
import FloatingChatButton from "@/components/trains/booking/FloatingChatButton";
import LoadingScreen from "@/components/trains/booking/LoadingScreen";
import AuthRequiredScreen from "@/components/trains/booking/AuthRequiredScreen";
import ErrorScreen from "@/components/trains/booking/ErrorScreen";

export default function TrainBooking() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();

  // Custom hooks for modular state management
  const { currentStep, handleStepClick } = useBookingSteps();
  const { showSeatSelection, selectedSeats, isRouteExpanded, handleSeatSelect, handleCloseSeatSelection, handleOpenSeatSelection, handleToggleRoute } = useSeatSelection();
  const { userData, updateBookerData, updatePassengerData, getBookerData, getPassengerData } = useBookingFormData();

  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const jadwalId = params?.id ? parseInt(params.id as string) : null;

  const { data: trainDetails, isLoading: trainLoading, error: trainError } = useTrainBookingDetails(jadwalId);
  const { data: routeStations, isLoading: routeLoading } = useTrainRouteStations(jadwalId);

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      setIsRedirecting(true);
      const currentUrl = `/trains/booking/${params?.id}?${searchParams.toString()}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
    }
  }, [loading, isAuthenticated, router, params?.id, searchParams]);

  // User data is now handled by useBookingFormData hook

  // Show loading while checking auth, redirecting, or loading train data
  if (loading || trainLoading || isRedirecting) {
    const loadingMessage = isRedirecting ? "Mengarahkan ke halaman login..." : loading ? "Memeriksa autentikasi..." : "Memuat detail kereta...";

    const submessage = isRedirecting ? "Anda perlu login untuk memesan tiket kereta" : undefined;

    return <LoadingScreen message={loadingMessage} submessage={submessage} />;
  }

  // Show authentication required screen if not authenticated and not redirecting yet
  if (!isAuthenticated && !isRedirecting) {
    return (
      <AuthRequiredScreen
        onLoginClick={() => {
          setIsRedirecting(true);
          const currentUrl = `/trains/booking/${params?.id}?${searchParams.toString()}`;
          router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
        }}
      />
    );
  }

  if (trainError) {
    return <ErrorScreen title="Kereta tidak ditemukan" message="Jadwal kereta yang Anda cari tidak tersedia." actionLabel="Kembali ke Pencarian" onAction={() => router.push("/trains")} />;
  }

  const allStations = routeStations || [];
  return (
    <div className="min-h-screen bg-gray-50">
      <BookingHeader currentStep={currentStep} onStepClick={handleStepClick} />

      {!showSeatSelection ? (
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <TrainSummaryCard trainDetails={trainDetails} routeStations={allStations} isRouteExpanded={isRouteExpanded} onToggleRoute={handleToggleRoute} />
              <TrainInfoCard trainDetails={trainDetails} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              <BookerForm data={getBookerData()} onChange={updateBookerData} />

              <PassengerForm data={getPassengerData()} onChange={updatePassengerData} />

              <SeatSelector
                trainDetails={trainDetails}
                selectedSeats={selectedSeats}
                showSeatSelection={showSeatSelection}
                onOpenSeatSelection={handleOpenSeatSelection}
                onCloseSeatSelection={handleCloseSeatSelection}
                onSeatSelect={handleSeatSelect}
              />

              <PaymentButton />
            </div>
          </div>
        </div>
      ) : (
        <SeatSelector
          trainDetails={trainDetails}
          selectedSeats={selectedSeats}
          showSeatSelection={showSeatSelection}
          onOpenSeatSelection={handleOpenSeatSelection}
          onCloseSeatSelection={handleCloseSeatSelection}
          onSeatSelect={handleSeatSelect}
        />
      )}

      <FloatingChatButton />
    </div>
  );
}
