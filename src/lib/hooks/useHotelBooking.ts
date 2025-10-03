import { useState, useCallback } from "react";

export interface HotelBookingData {
  hotelId: string;
  guestName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  paymentMethod: string;
  specialRequests?: string;
}

export interface UseHotelBookingReturn {
  bookingData: HotelBookingData;
  updateBookingData: (data: Partial<HotelBookingData>) => void;
  resetBookingData: () => void;
  isValid: boolean;
  submitBooking: () => Promise<boolean>;
  isSubmitting: boolean;
}

const initialBookingData: HotelBookingData = {
  hotelId: "",
  guestName: "",
  email: "",
  phone: "",
  checkInDate: "",
  checkOutDate: "",
  guests: 1,
  paymentMethod: "cash",
  specialRequests: ""
};

export function useHotelBooking(hotelId?: string): UseHotelBookingReturn {
  const [bookingData, setBookingData] = useState<HotelBookingData>({
    ...initialBookingData,
    hotelId: hotelId || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateBookingData = useCallback((data: Partial<HotelBookingData>) => {
    setBookingData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  const resetBookingData = useCallback(() => {
    setBookingData({
      ...initialBookingData,
      hotelId: hotelId || ""
    });
  }, [hotelId]);

  const isValid = useCallback(() => {
    return !!(
      bookingData.guestName.trim() &&
      bookingData.email.trim() &&
      bookingData.phone.trim() &&
      bookingData.checkInDate &&
      bookingData.checkOutDate &&
      bookingData.paymentMethod
    );
  }, [bookingData])();

  const submitBooking = useCallback(async (): Promise<boolean> => {
    if (!isValid) return false;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make actual API call
      console.log("Submitting booking:", bookingData);
      
      return true;
    } catch (error) {
      console.error("Booking submission failed:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingData, isValid]);

  return {
    bookingData,
    updateBookingData,
    resetBookingData,
    isValid,
    submitBooking,
    isSubmitting
  };
}