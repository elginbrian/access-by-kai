"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Types
interface PassengerData {
  passengerName: string;
  idNumber: string;
  seat?: string;
  seatType?: string;
}

interface BookerData {
  bookerName: string;
  email: string;
  phone: string;
}

interface TrainJourneyData {
  trainName: string;
  trainCode: string;
  departureTime: string;
  departureStation: string;
  departureDate: string;
  arrivalTime: string;
  arrivalStation: string;
  arrivalDate: string;
  jadwalId: number;
}

interface FoodOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  forPassenger?: string;
}

interface BookingDataContextType {
  // Journey data
  journeyData: TrainJourneyData | null;
  setJourneyData: (data: TrainJourneyData) => void;

  // Passenger data
  passengerData: PassengerData[];
  setPassengerData: (data: PassengerData[]) => void;

  // Booker data
  bookerData: BookerData | null;
  setBookerData: (data: BookerData) => void;

  // Food orders
  foodOrders: FoodOrderItem[];
  setFoodOrders: (orders: FoodOrderItem[]) => void;

  // Pricing
  trainTicketPrice: number;
  setTrainTicketPrice: (price: number) => void;

  // Clear all data
  clearBookingData: () => void;
}

const BookingDataContext = createContext<BookingDataContextType | null>(null);

export function BookingDataProvider({ children }: { children: ReactNode }) {
  const [journeyData, setJourneyData] = useState<TrainJourneyData | null>(null);
  const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
  const [bookerData, setBookerData] = useState<BookerData | null>(null);
  const [foodOrders, setFoodOrders] = useState<FoodOrderItem[]>([]);
  const [trainTicketPrice, setTrainTicketPrice] = useState<number>(0);

  const clearBookingData = () => {
    setJourneyData(null);
    setPassengerData([]);
    setBookerData(null);
    setFoodOrders([]);
    setTrainTicketPrice(0);
  };

  return (
    <BookingDataContext.Provider
      value={{
        journeyData,
        setJourneyData,
        passengerData,
        setPassengerData,
        bookerData,
        setBookerData,
        foodOrders,
        setFoodOrders,
        trainTicketPrice,
        setTrainTicketPrice,
        clearBookingData,
      }}
    >
      {children}
    </BookingDataContext.Provider>
  );
}

export function useBookingData() {
  const context = useContext(BookingDataContext);
  if (!context) {
    throw new Error("useBookingData must be used within BookingDataProvider");
  }
  return context;
}

export type { PassengerData, BookerData, TrainJourneyData, FoodOrderItem };
