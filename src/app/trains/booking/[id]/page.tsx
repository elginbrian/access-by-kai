"use client";

import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { colors } from "@/app/design-system/colors";
import { useTrainBookingDetails, useTrainRouteStations } from "@/lib/hooks/useTrainBookingDetails";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMultiPassengerBookingData } from "@/lib/hooks/useMultiPassengerBookingData";
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
import PassengerManager from "@/components/trains/booking/PassengerManager";
import SeatSelector from "@/components/trains/booking/SeatSelector";
import SeatCounter from "@/components/trains/booking/SeatCounter";
import PaymentButton from "@/components/trains/booking/PaymentButton";
import LoadingScreen from "@/components/trains/booking/LoadingScreen";
import AuthRequiredScreen from "@/components/trains/booking/AuthRequiredScreen";
import ErrorScreen from "@/components/trains/booking/ErrorScreen";

function TrainBookingContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();
  const { currentStep, handleStepClick, nextStep } = useBookingContext();
  const { bookingData, setJourneyData, setBookerData, setPassengersData, setTrainTicketPrice, updatePricing } = useCentralBooking();
  const { showSeatSelection, selectedSeats, isRouteExpanded, handleSeatSelect, handleCloseSeatSelection, handleOpenSeatSelection, handleToggleRoute, areAllSeatsSelected } = useSeatSelection();
  const { bookingData: centralBooking } = useCentralBooking();
  const { bookingData: multiPassengerData, updateBookerData, updatePassengersData, getBookerData, getAllPassengersData } = useMultiPassengerBookingData();

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

  React.useEffect(() => {
    try {
      const seatsFromCentral = bookingData.passengers.map((p) => p.seat || "");

      const hasAnySeat = seatsFromCentral.some((s) => s && s !== "Belum dipilih");
      if (hasAnySeat) {
        const same = seatsFromCentral.length === selectedSeats.length && seatsFromCentral.every((s, i) => s === selectedSeats[i]);
        if (!same) {
          handleSeatSelect(seatsFromCentral);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [bookingData.passengers, handleSeatSelect, selectedSeats]);

  const bookerInfo = getBookerData();
  const allPassengersInfo = getAllPassengersData();

  const currentBookerData = React.useMemo(
    () => ({
      fullName: bookerInfo.fullName,
      email: bookerInfo.email,
      phoneNumber: bookerInfo.phoneNumber,
    }),
    [bookerInfo.fullName, bookerInfo.email, bookerInfo.phoneNumber]
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
    if (allPassengersInfo.length > 0) {
      const passengersForCentral = allPassengersInfo.map((passenger, index) => ({
        name: passenger.passengerName,
        idNumber: passenger.idNumber,
        seat: selectedSeats[index] || "Belum dipilih",
        seatType: "Window",
      }));
      setPassengersData(passengersForCentral);
    }
  }, [allPassengersInfo, selectedSeats, setPassengersData]);

  React.useEffect(() => {
    if (multiPassengerData.fullName || multiPassengerData.email || multiPassengerData.phoneNumber) {
      setBookerData({
        fullName: multiPassengerData.fullName,
        email: multiPassengerData.email,
        phone: multiPassengerData.phoneNumber,
      });
    }
  }, [multiPassengerData.fullName, multiPassengerData.email, multiPassengerData.phoneNumber, setBookerData]);

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

  const bookerData = getBookerData();
  const passengersData = getAllPassengersData();

  const passengers = passengersData.map((passenger, index) => ({
    id: (index + 1).toString(),
    name: passenger.passengerName,
    seat: selectedSeats[index] || undefined,
    isAdult: true,
    type: "adult" as const,
  }));

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

              <PassengerManager passengers={getAllPassengersData()} onChange={updatePassengersData} maxPassengers={8} />

              <SeatCounter
                selectedSeats={selectedSeats}
                passengers={getAllPassengersData()}
                baseTicketPrice={bookingData.pricing.baseTicketPrice}
                totalTicketPrice={bookingData.pricing.trainTickets}
                onOpenSeatSelection={handleOpenSeatSelection}
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
