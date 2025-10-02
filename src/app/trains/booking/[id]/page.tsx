"use client";

import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { colors } from "@/app/design-system/colors";
import { useTrainBookingDetails, useTrainRouteStations } from "@/lib/hooks/useTrainBookingDetails";
import { useAuth } from "@/lib/auth/AuthContext";
import { useBookingFormData } from "@/lib/hooks/useBookingFormData";
import { useBookingContext } from "@/lib/hooks/useBookingContext";
import { useCentralBooking } from "@/lib/hooks/useCentralBooking";
import { useSeatSelection } from "@/lib/hooks/useSeatSelection";
import { validateBookingCompletion } from "@/lib/validation/bookingValidation";
import { MissingDataAlert } from "@/components/trains/booking/RequiredFieldIndicator";
import BookingLayout from "@/components/layout/BookingLayout";

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

function TrainBookingContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();
  const { currentStep, handleStepClick, nextStep } = useBookingContext();
  const { bookingData, setJourneyData, setBookerData, setPassengersData, setTrainTicketPrice } = useCentralBooking();
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

  React.useEffect(() => {
    if (trainDetails && jadwalId) {
      setJourneyData({
        jadwalId: jadwalId,
        trainName: trainDetails.nama_kereta || "Unknown Train",
        trainCode: trainDetails.nomor_ka || "N/A",
        departureTime: trainDetails.waktu_berangkat || "",
        departureStation: trainDetails.stasiun_asal?.nama || "",
        departureDate: trainDetails.tanggal_keberangkatan || "",
        arrivalTime: trainDetails.waktu_tiba || "",
        arrivalStation: trainDetails.stasiun_tujuan?.nama || "",
        arrivalDate: trainDetails.tanggal_keberangkatan || "",
      });

      setTrainTicketPrice(trainDetails.harga_base || 600000);
    }
  }, [
    trainDetails?.nama_kereta,
    trainDetails?.nomor_ka,
    trainDetails?.waktu_berangkat,
    trainDetails?.waktu_tiba,
    trainDetails?.stasiun_asal?.nama,
    trainDetails?.stasiun_tujuan?.nama,
    trainDetails?.tanggal_keberangkatan,
    trainDetails?.harga_base,
    jadwalId,
    setJourneyData,
    setTrainTicketPrice,
  ]);

  const bookerInfo = getBookerData();
  const passengerInfo = getPassengerData();

  const currentBookerData = React.useMemo(
    () => ({
      fullName: bookerInfo.fullName,
      email: bookerInfo.email,
      phoneNumber: bookerInfo.phoneNumber,
    }),
    [bookerInfo.fullName, bookerInfo.email, bookerInfo.phoneNumber]
  );

  const currentPassengerData = React.useMemo(
    () => ({
      passengerName: passengerInfo.passengerName,
      idNumber: passengerInfo.idNumber,
    }),
    [passengerInfo.passengerName, passengerInfo.idNumber]
  );

  React.useEffect(() => {
    if (currentBookerData.fullName) {
      setBookerData({
        fullName: currentBookerData.fullName,
        email: currentBookerData.email,
        phone: currentBookerData.phoneNumber,
      });
    }
  }, [currentBookerData.fullName, currentBookerData.email, currentBookerData.phoneNumber, setBookerData]);

  React.useEffect(() => {
    if (currentPassengerData.passengerName) {
      setPassengersData([
        {
          name: currentPassengerData.passengerName,
          idNumber: currentPassengerData.idNumber,
          seat: selectedSeats[0] || "Belum dipilih",
          seatType: "Window",
        },
      ]);
    }
  }, [currentPassengerData.passengerName, currentPassengerData.idNumber, selectedSeats, setPassengersData]);

  React.useEffect(() => {
    if (userData.fullName || userData.email || userData.phoneNumber) {
      setBookerData({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phoneNumber,
      });
    }
  }, [userData.fullName, userData.email, userData.phoneNumber, setBookerData]);

  if (loading || trainLoading || isRedirecting) {
    const loadingMessage = isRedirecting ? "Mengarahkan ke halaman login..." : loading ? "Memeriksa autentikasi..." : "Memuat detail kereta...";

    const submessage = isRedirecting ? "Anda perlu login untuk memesan tiket kereta" : undefined;

    return <LoadingScreen message={loadingMessage} submessage={submessage} />;
  }

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

  const passengerData = getPassengerData();
  const bookerData = getBookerData();

  const passengers = passengerData.passengerName
    ? [
        {
          id: "1",
          name: passengerData.passengerName,
          seat: selectedSeats[0] || undefined,
          isAdult: true,
          type: "adult" as const,
        },
      ]
    : [];

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
                passengers={passengers}
                onOpenSeatSelection={handleOpenSeatSelection}
                onCloseSeatSelection={handleCloseSeatSelection}
                onSeatSelect={handleSeatSelect}
              />

              {(() => {
                const validation = validateBookingCompletion(bookingData);
                return !validation.isValid ? <MissingDataAlert missingFields={validation.missingFields} /> : null;
              })()}

              <PaymentButton onClick={nextStep} />
            </div>
          </div>
        </div>
      ) : (
        <SeatSelector
          trainDetails={trainDetails}
          selectedSeats={selectedSeats}
          showSeatSelection={showSeatSelection}
          passengers={passengers}
          onOpenSeatSelection={handleOpenSeatSelection}
          onCloseSeatSelection={handleCloseSeatSelection}
          onSeatSelect={handleSeatSelect}
        />
      )}

      <FloatingChatButton />
    </div>
  );
}

export default function TrainBooking() {
  return (
    <BookingLayout>
      <TrainBookingContent />
    </BookingLayout>
  );
}
