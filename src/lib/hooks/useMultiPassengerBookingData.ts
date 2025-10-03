import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCentralBooking } from "@/lib/hooks/useCentralBooking";
import { PassengerData } from "@/components/trains/booking/PassengerForm";

export interface MultiPassengerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  passengers: PassengerData[];
}

export function useMultiPassengerBookingData() {
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState<MultiPassengerFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    passengers: [
      {
        title: "Bapak",
        passengerName: "",
        idType: "KTP",
        idNumber: "",
      },
    ],
  });

  useEffect(() => {
    if (user?.profile) {
      setBookingData((prev) => ({
        ...prev,
        fullName: user.profile?.nama_lengkap || "",
        phoneNumber: user.profile?.nomor_telepon || "",
        email: user.email || "",
        passengers:
          prev.passengers.length > 0
            ? prev.passengers.map((passenger, index) => ({
                ...passenger,

                passengerName: index === 0 && !passenger.passengerName ? user.profile?.nama_lengkap || "" : passenger.passengerName,
                idType: index === 0 && !passenger.idNumber ? user.profile?.tipe_identitas || "KTP" : passenger.idType,
              }))
            : [
                {
                  title: "Bapak",
                  passengerName: user.profile?.nama_lengkap || "",
                  idType: user.profile?.tipe_identitas || "KTP",
                  idNumber: "",
                },
              ],
      }));
    }
  }, [user]);

  const { bookingData: centralBooking } = useCentralBooking();

  useEffect(() => {
    if (!centralBooking) return;

    if (!bookingData.fullName && centralBooking.booker?.fullName) {
      setBookingData((prev) => ({
        ...prev,
        fullName: centralBooking.booker.fullName || prev.fullName,
        phoneNumber: centralBooking.booker.phone || prev.phoneNumber,
        email: centralBooking.booker.email || prev.email,
      }));
    }

    const localHasFilledPassengers = bookingData.passengers.some((p) => p.passengerName && p.passengerName.trim() !== "");
    if (!localHasFilledPassengers && centralBooking.passengers && centralBooking.passengers.length > 0) {
      const mapped = centralBooking.passengers.map((p) => ({
        title: "Bapak",
        passengerName: p.name || "",
        idType: "KTP",
        idNumber: p.idNumber || "",
      }));
      setBookingData((prev) => ({
        ...prev,
        passengers: mapped,
      }));
    }
  }, [centralBooking]);

  const updateBookerData = (data: Partial<Pick<MultiPassengerFormData, "fullName" | "phoneNumber" | "email">>) => {
    setBookingData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const updatePassengersData = (passengers: PassengerData[]) => {
    setBookingData((prev) => ({
      ...prev,
      passengers,
    }));
  };

  const updateSinglePassengerData = (index: number, passengerData: PassengerData) => {
    setBookingData((prev) => ({
      ...prev,
      passengers: prev.passengers.map((passenger, i) => (i === index ? passengerData : passenger)),
    }));
  };

  const addPassenger = () => {
    const newPassenger: PassengerData = {
      title: "Bapak",
      passengerName: "",
      idType: "KTP",
      idNumber: "",
    };
    setBookingData((prev) => ({
      ...prev,
      passengers: [...prev.passengers, newPassenger],
    }));
  };

  const removePassenger = (index: number) => {
    if (bookingData.passengers.length > 1) {
      setBookingData((prev) => ({
        ...prev,
        passengers: prev.passengers.filter((_, i) => i !== index),
      }));
    }
  };

  const getBookerData = () => ({
    fullName: bookingData.fullName,
    phoneNumber: bookingData.phoneNumber,
    email: bookingData.email,
  });

  const getPassengerData = () => {
    return (
      bookingData.passengers[0] || {
        title: "Bapak",
        passengerName: "",
        idType: "KTP",
        idNumber: "",
      }
    );
  };

  const getAllPassengersData = () => {
    return bookingData.passengers;
  };

  return {
    bookingData,
    setBookingData,
    updateBookerData,
    updatePassengersData,
    updateSinglePassengerData,
    addPassenger,
    removePassenger,
    getBookerData,
    getPassengerData,
    getAllPassengersData,
  };
}
