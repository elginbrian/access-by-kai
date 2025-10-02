"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { BookingSecureStorage } from "@/lib/storage/SecureStorage";

export interface BookingData {
  journey: {
    jadwalId: number | null;
    trainName: string;
    trainCode: string;
    departureTime: string;
    departureStation: string;
    departureDate: string;
    arrivalTime: string;
    arrivalStation: string;
    arrivalDate: string;
  };

  booker: {
    fullName: string;
    email: string;
    phone: string;
  };

  passengers: Array<{
    name: string;
    idNumber: string;
    seat: string;
    seatType: string;
  }>;

  foodOrders: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    forPassenger: string;
    image?: string;
  }>;

  pricing: {
    trainTickets: number;
    foodTotal: number;
    serviceFee: number;
    total: number;
  };
}

const initialBookingData: BookingData = {
  journey: {
    jadwalId: null,
    trainName: "",
    trainCode: "",
    departureTime: "",
    departureStation: "",
    departureDate: "",
    arrivalTime: "",
    arrivalStation: "",
    arrivalDate: "",
  },
  booker: {
    fullName: "",
    email: "",
    phone: "",
  },
  passengers: [],
  foodOrders: [],
  pricing: {
    trainTickets: 0,
    foodTotal: 0,
    serviceFee: 15000,
    total: 0,
  },
};

interface CentralBookingContextType {
  bookingData: BookingData;

  setJourneyData: (journey: Partial<BookingData["journey"]>) => void;

  setBookerData: (booker: Partial<BookingData["booker"]>) => void;

  setPassengersData: (passengers: BookingData["passengers"]) => void;
  addPassenger: (passenger: BookingData["passengers"][0]) => void;
  updatePassenger: (index: number, passenger: Partial<BookingData["passengers"][0]>) => void;

  setFoodOrders: (orders: BookingData["foodOrders"]) => void;
  addFoodOrder: (order: BookingData["foodOrders"][0]) => void;
  updateFoodOrder: (id: string, updates: Partial<BookingData["foodOrders"][0]>) => void;
  removeFoodOrder: (id: string) => void;

  updatePricing: () => void;
  setTrainTicketPrice: (price: number) => void;

  clearAllData: () => void;
  getBookingSummary: () => {
    hasJourney: boolean;
    hasBooker: boolean;
    hasPassengers: boolean;
    hasFoodOrders: boolean;
    isComplete: boolean;
  };
}

const CentralBookingContext = createContext<CentralBookingContextType | null>(null);

export function CentralBookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = BookingSecureStorage.getBookingData();
        if (saved) {
          return saved;
        }
      } catch (e) {
        console.error("Error loading saved booking data:", e);
        BookingSecureStorage.clearBookingData();
      }
    }
    return initialBookingData;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        BookingSecureStorage.setBookingData(bookingData);
        console.log("Central Booking - Data saved securely:", bookingData);
      } catch (error) {
        console.error("Error saving booking data:", error);
      }
    }
  }, [bookingData]);

  const setJourneyData = useCallback((journey: Partial<BookingData["journey"]>) => {
    setBookingData((prev) => ({
      ...prev,
      journey: { ...prev.journey, ...journey },
    }));
  }, []);

  const setBookerData = useCallback((booker: Partial<BookingData["booker"]>) => {
    setBookingData((prev) => ({
      ...prev,
      booker: { ...prev.booker, ...booker },
    }));
  }, []);

  const setPassengersData = useCallback((passengers: BookingData["passengers"]) => {
    setBookingData((prev) => ({
      ...prev,
      passengers,
    }));
  }, []);

  const addPassenger = useCallback((passenger: BookingData["passengers"][0]) => {
    setBookingData((prev) => ({
      ...prev,
      passengers: [...prev.passengers, passenger],
    }));
  }, []);

  const updatePassenger = useCallback((index: number, passenger: Partial<BookingData["passengers"][0]>) => {
    setBookingData((prev) => ({
      ...prev,
      passengers: prev.passengers.map((p, i) => (i === index ? { ...p, ...passenger } : p)),
    }));
  }, []);

  const setFoodOrders = useCallback((orders: BookingData["foodOrders"]) => {
    setBookingData((prev) => {
      const newData = {
        ...prev,
        foodOrders: orders,
      };

      const foodTotal = orders.reduce((sum, order) => sum + order.price * order.quantity, 0);
      newData.pricing = {
        ...prev.pricing,
        foodTotal,
        total: prev.pricing.trainTickets + foodTotal + prev.pricing.serviceFee,
      };
      return newData;
    });
  }, []);

  const addFoodOrder = useCallback((order: BookingData["foodOrders"][0]) => {
    setBookingData((prev) => {
      const newOrders = [...prev.foodOrders, order];
      const foodTotal = newOrders.reduce((sum, o) => sum + o.price * o.quantity, 0);
      return {
        ...prev,
        foodOrders: newOrders,
        pricing: {
          ...prev.pricing,
          foodTotal,
          total: prev.pricing.trainTickets + foodTotal + prev.pricing.serviceFee,
        },
      };
    });
  }, []);

  const updateFoodOrder = useCallback((id: string, updates: Partial<BookingData["foodOrders"][0]>) => {
    setBookingData((prev) => {
      const newOrders = prev.foodOrders.map((order) => (order.id === id ? { ...order, ...updates } : order));
      const foodTotal = newOrders.reduce((sum, order) => sum + order.price * order.quantity, 0);
      return {
        ...prev,
        foodOrders: newOrders,
        pricing: {
          ...prev.pricing,
          foodTotal,
          total: prev.pricing.trainTickets + foodTotal + prev.pricing.serviceFee,
        },
      };
    });
  }, []);

  const removeFoodOrder = useCallback((id: string) => {
    setBookingData((prev) => {
      const newOrders = prev.foodOrders.filter((order) => order.id !== id);
      const foodTotal = newOrders.reduce((sum, order) => sum + order.price * order.quantity, 0);
      return {
        ...prev,
        foodOrders: newOrders,
        pricing: {
          ...prev.pricing,
          foodTotal,
          total: prev.pricing.trainTickets + foodTotal + prev.pricing.serviceFee,
        },
      };
    });
  }, []);

  const updatePricing = useCallback(() => {
    setBookingData((prev) => {
      const foodTotal = prev.foodOrders.reduce((sum, order) => sum + order.price * order.quantity, 0);
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          foodTotal,
          total: prev.pricing.trainTickets + foodTotal + prev.pricing.serviceFee,
        },
      };
    });
  }, []);

  const setTrainTicketPrice = useCallback((price: number) => {
    setBookingData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        trainTickets: price,
        total: price + prev.pricing.foodTotal + prev.pricing.serviceFee,
      },
    }));
  }, []);

  const clearAllData = useCallback(() => {
    setBookingData(initialBookingData);
    if (typeof window !== "undefined") {
      BookingSecureStorage.clearBookingData();
    }
  }, []);

  const getBookingSummary = useCallback(() => {
    const hasJourney = bookingData.journey.jadwalId !== null && bookingData.journey.trainName !== "";
    const hasBooker = bookingData.booker.fullName !== "" && bookingData.booker.email !== "";
    const hasPassengers = bookingData.passengers.length > 0;
    const hasFoodOrders = bookingData.foodOrders.length > 0;
    const isComplete = hasJourney && hasBooker && hasPassengers;

    return {
      hasJourney,
      hasBooker,
      hasPassengers,
      hasFoodOrders,
      isComplete,
    };
  }, [bookingData]);

  return (
    <CentralBookingContext.Provider
      value={{
        bookingData,
        setJourneyData,
        setBookerData,
        setPassengersData,
        addPassenger,
        updatePassenger,
        setFoodOrders,
        addFoodOrder,
        updateFoodOrder,
        removeFoodOrder,
        updatePricing,
        setTrainTicketPrice,
        clearAllData,
        getBookingSummary,
      }}
    >
      {children}
    </CentralBookingContext.Provider>
  );
}

export function useCentralBooking() {
  const context = useContext(CentralBookingContext);
  if (!context) {
    throw new Error("useCentralBooking must be used within CentralBookingProvider");
  }
  return context;
}
