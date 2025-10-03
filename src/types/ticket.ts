export interface TicketData {
  tiketId?: number;
  id: string;
  ticketNumber: string;
  trainName: string;
  trainNumber?: string;
  departureStation: {
    code: string;
    name: string;
  };
  arrivalStation: {
    code: string;
    name: string;
  };
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;

  dateIso?: string | null;
  departureIso?: string | null;
  arrivalIso?: string | null;

  timeRange?: string;
  travelClass?: string;
  passenger: {
    id: number;
    name: string;
  };
  seat: {
    car: string;
    number: string;
    class: string;
  };
  price: {
    ticketPrice: number;
    adminFee: number;
    total: number;
    currency: string;
  };
  status: "active" | "cancelled" | "completed" | "expired";
  bookingId: number;
  segmentId: number;
  qrCode?: string;
  checkInTime?: string;
  boardingTime?: string;
  boardingGate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketListParams {
  userId?: number;
  status?: "active" | "cancelled" | "completed" | "expired";
  limit?: number;
  offset?: number;
}

export interface TicketDetailParams {
  ticketId: string;
  userId?: number;
}

export interface TicketDetailData extends TicketData {
  booking: {
    id: number;
    bookingCode: string;
    createdAt: string;
    paymentStatus: string;
  };
  route: {
    id: number;
    name: string;
    distance: number;
  };
  schedule: {
    id: number;
    frequency: string;
    operationalDays: string[];
  };
  railcar: {
    id: number;
    name: string;
    type: string;
    facilities: string[];
  };
  services?: {
    id: number;
    name: string;
    description: string;
    price: number;
  }[];
}
