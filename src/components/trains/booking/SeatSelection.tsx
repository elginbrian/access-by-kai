"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import TrainInfoHeader from "@/components/trains/seat-selection/TrainInfoHeader";
import SeatStatusLegend from "@/components/trains/seat-selection/SeatStatusLegend";
import CarSelector from "@/components/trains/seat-selection/CarSelector";
import SeatMap, { Seat, SeatStatus } from "@/components/trains/seat-selection/SeatMap";
import PassengerList, { Passenger } from "@/components/trains/seat-selection/PassengerList";
import AISeatAssistant from "@/components/trains/seat-selection/AISeatAssistant";
import SeatSelectionBottomBar from "@/components/trains/seat-selection/SeatSelectionBottomBar";
import { useJadwalGerbongByJadwal } from "@/lib/hooks/jadwal_gerbong";
import { useJadwalKursiByGerbong } from "@/lib/hooks/jadwal_kursi";
import { PassengerInfo } from "./SeatSelector";

interface SeatSelectionProps {
  onClose: () => void;
  onSeatSelect: (seats: string[]) => void;
  selectedSeats: string[];
  passengers?: PassengerInfo[];
  jadwalId?: number;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ onClose, onSeatSelect, selectedSeats, passengers: passengersProp, jadwalId }) => {
  const [currentCar, setCurrentCar] = useState(1);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  const { data: gerbongList, isLoading: gerbongLoading, error: gerbongError } = useJadwalGerbongByJadwal(jadwalId || 0);
  const { data: kursiList, isLoading: kursiLoading, error: kursiError } = useJadwalKursiByGerbong(jadwalId || 0, currentCar);

  useEffect(() => {
    console.log("Current car changed to:", currentCar);
    console.log("Kursi list loading:", kursiLoading);
    console.log("Kursi list data:", kursiList);
    console.log("Kursi list error:", kursiError);
  }, [currentCar, kursiList, kursiLoading, kursiError]);

  useEffect(() => {
    if (gerbongList && gerbongList.length > 0 && currentCar === 0) {
      console.log("GerbongList:", gerbongList);
      const firstSelectableGerbong = gerbongList.find((gerbong) => {
        return (gerbong.kapasitasKursi || 0) > 0 && !(gerbong.tipeGerbong || "").includes("KERETA_MAKAN") && !(gerbong.tipeGerbong || "").includes("KERETA_PEMBANGKIT") && !(gerbong.tipeGerbong || "").includes("KERETA_BAGASI");
      });

      console.log("First selectable gerbong:", firstSelectableGerbong);
      if (firstSelectableGerbong) {
        console.log("Setting currentCar to:", firstSelectableGerbong.nomorGerbongAktual);
        setCurrentCar(firstSelectableGerbong.nomorGerbongAktual);
      }
    }
  }, [gerbongList]);

  useEffect(() => {
    if (passengersProp && passengersProp.length > 0) {
      const convertedPassengers: Passenger[] = passengersProp.map((passenger, index) => ({
        id: passenger.id,
        name: passenger.name,
        seat: passenger.seat || "",
        isAdult: passenger.isAdult,
        type: passenger.type,
      }));

      const passengersWithSeats = convertedPassengers.map((passenger, index) => ({
        ...passenger,
        seat: selectedSeats[index] || passenger.seat || "",
      }));

      setPassengers(passengersWithSeats);
    }
  }, [passengersProp, selectedSeats]);

  useEffect(() => {
    if (passengers.length > 0 && selectedSeats.length > 0) {
      const updatedPassengers = passengers.map((passenger, index) => ({
        ...passenger,
        seat: selectedSeats[index] || "",
      }));

      const hasChanged = updatedPassengers.some((passenger, index) => passenger.seat !== passengers[index].seat);

      if (hasChanged) {
        setPassengers(updatedPassengers);
      }
    }
  }, [selectedSeats]);

  const generateSeats = useCallback((): Seat[] => {
    if (!kursiList || kursiLoading) {
      return [];
    }

    const seats: Seat[] = kursiList.map((kursi) => {
      const seatId = kursi.kodeKursi;
      let status: SeatStatus = "available";

      if (selectedSeats.includes(seatId)) {
        status = "selected";
      } else if (kursi.statusInventaris === "TERISI" || kursi.statusInventaris === "TERJUAL") {
        status = "occupied";
      } else if (kursi.isBlocked) {
        status = "occupied-lp";
      } else if (kursi.statusInventaris === "DIPESAN") {
        status = "occupied";
      } else if (kursi.statusInventaris === "DIKUNCI") {
        status = "occupied-lp";
      } else if (kursi.statusInventaris === "TERSEDIA") {
        status = "available";
      }

      const matches = seatId.match(/^(\d+)([A-Z])$/);
      const row = matches ? parseInt(matches[1]) : 1;
      const letter = matches ? matches[2] : "A";

      return {
        id: seatId,
        row,
        letter,
        status,
      };
    });

    return seats.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.letter.localeCompare(b.letter);
    });
  }, [kursiList, kursiLoading, selectedSeats]);

  const handleSeatClick = useCallback(
    (seatId: string, status: SeatStatus) => {
      if (status === "occupied" || status === "occupied-lp") {
        toast.error("Kursi sudah terisi, silakan pilih kursi lain.");
        return;
      }

      let newSelectedSeats = [...selectedSeats];
      if (newSelectedSeats.includes(seatId)) {
        newSelectedSeats = newSelectedSeats.filter((id) => id !== seatId);
      } else {
        if (newSelectedSeats.length >= passengers.length) {
          const removedSeat = newSelectedSeats.shift();
          newSelectedSeats.push(seatId);
          toast(`Kursi ${removedSeat} diganti dengan kursi ${seatId}`, {
            icon: "🔄",
          });
        } else {
          newSelectedSeats.push(seatId);
          const remaining = passengers.length - newSelectedSeats.length;
          if (remaining > 0) {
            toast.success(`Kursi ${seatId} dipilih. Pilih ${remaining} kursi lagi.`);
          } else {
            toast.success(`Semua kursi telah dipilih!`);
          }
        }
      }
      onSeatSelect(newSelectedSeats);
    },
    [selectedSeats, passengers.length, onSeatSelect]
  );

  const handleCarChange = useCallback(
    (carNumber: number) => {
      console.log("handleCarChange called:", carNumber, "current:", currentCar);
      setCurrentCar(carNumber);
    },
    [currentCar]
  );

  const handlePassengerChange = useCallback((passengerId: string) => {
    console.log("Change passenger:", passengerId);
  }, []);

  const handleUseAISuggestion = useCallback(() => {
    console.log("Auto assign clicked! KursiList:", kursiList, "Passengers:", passengers);

    if (kursiList && kursiList.length > 0 && passengers.length > 0) {
      const availableSeats = kursiList.filter((kursi) => kursi.statusInventaris === "TERSEDIA" && !kursi.isBlocked).map((kursi) => kursi.kodeKursi);

      console.log("Available seats:", availableSeats);

      if (availableSeats.length >= passengers.length) {
        const shuffled = [...availableSeats].sort(() => 0.5 - Math.random());
        const assignedSeats = shuffled.slice(0, passengers.length);

        console.log("Assigned seats:", assignedSeats);

        const passengersWithSeats = passengers.map((passenger, index) => ({
          ...passenger,
          seat: assignedSeats[index] || "",
        }));

        setPassengers(passengersWithSeats);
        onSeatSelect(assignedSeats);
        toast.success(`${assignedSeats.length} kursi berhasil dipilih secara otomatis!`);
      } else {
        toast.error(`Tidak cukup kursi tersedia. Butuh ${passengers.length} kursi, tersedia ${availableSeats.length} kursi.`);
      }
    } else {
      console.log("Kondisi tidak terpenuhi - kursiList:", !!kursiList, "length:", kursiList?.length, "passengers:", passengers.length);
      toast.error("Data kursi atau penumpang tidak tersedia.");
    }
  }, [kursiList, passengers, onSeatSelect]);

  const handleContinueBooking = useCallback(() => {
    onClose();
  }, [onClose]);

  const seats = generateSeats();

  if (gerbongLoading || kursiLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-8 pb-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data kursi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (gerbongError || kursiError) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-8 pb-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Gagal memuat data kursi</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 pb-24">
      <TrainInfoHeader
        trainNumber="67"
        trainName="Argo Parahyangan"
        trainCode="KA 21"
        departureTime="13:45"
        departureStation="Bekasi (BKS)"
        arrivalTime="17:00"
        arrivalStation="Bandung (BD)"
        duration="3h 15m"
        totalPrice="Rp. 170.000"
        onClose={onClose}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SeatStatusLegend />
          <CarSelector currentCar={currentCar} onCarChange={handleCarChange} totalCars={gerbongList?.length || 8} gerbongList={gerbongList} />
          <div className="flex flex-row">
            <SeatMap seats={seats} currentCar={currentCar} onSeatClick={handleSeatClick} />
            <PassengerList passengers={passengers} onPassengerChange={handlePassengerChange} onAutoAssign={handleUseAISuggestion} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <AISeatAssistant onSuggestionApply={handleUseAISuggestion} />
        </div>
      </div>

      <SeatSelectionBottomBar selectedSeatsCount={selectedSeats.length} maxSelectableSeats={passengers.length} totalPrice="Rp 170,000" onContinueBooking={handleContinueBooking} onBack={onClose} />
    </div>
  );
};

export default SeatSelection;
