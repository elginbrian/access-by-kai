import { BookingData } from "@/lib/hooks/useCentralBooking";

export interface BookingValidationResult {
  isValid: boolean;
  errors: string[];
  missingFields: string[];
}

export function validateBookingCompletion(bookingData: BookingData): BookingValidationResult {
  const errors: string[] = [];
  const missingFields: string[] = [];

  if (!bookingData.booker.fullName.trim()) {
    errors.push("Nama pemesan harus diisi");
    missingFields.push("booker.fullName");
  }

  if (!bookingData.booker.email.trim()) {
    errors.push("Email pemesan harus diisi");
    missingFields.push("booker.email");
  }

  if (!bookingData.booker.phone.trim()) {
    errors.push("Nomor telepon pemesan harus diisi");
    missingFields.push("booker.phone");
  }

  if (bookingData.passengers.length === 0) {
    errors.push("Minimal harus ada 1 penumpang");
    missingFields.push("passengers");
  } else {
    bookingData.passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        errors.push(`Nama penumpang ${index + 1} harus diisi`);
        missingFields.push(`passengers[${index}].name`);
      }

      if (!passenger.idNumber.trim()) {
        errors.push(`Nomor identitas penumpang ${index + 1} harus diisi`);
        missingFields.push(`passengers[${index}].idNumber`);
      }

      if (!passenger.seat.trim()) {
        errors.push(`Kursi untuk penumpang ${index + 1} harus dipilih`);
        missingFields.push(`passengers[${index}].seat`);
      }
    });
  }

  if (!bookingData.journey.jadwalId) {
    errors.push("Jadwal kereta tidak valid");
    missingFields.push("journey.jadwalId");
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingFields,
  };
}

export function getBookingCompletionStatus(bookingData: BookingData) {
  const hasBookerInfo = !!(bookingData.booker.fullName && bookingData.booker.email && bookingData.booker.phone);

  const hasPassengerInfo = bookingData.passengers.length > 0 && bookingData.passengers.every((p) => p.name && p.idNumber);

  const hasSeatsSelected = bookingData.passengers.length > 0 && bookingData.passengers.every((p) => p.seat);

  const hasJourneyInfo = !!bookingData.journey.jadwalId;

  return {
    hasBookerInfo,
    hasPassengerInfo,
    hasSeatsSelected,
    hasJourneyInfo,
    completionPercentage: [hasBookerInfo, hasPassengerInfo, hasSeatsSelected, hasJourneyInfo].filter(Boolean).length * 25,
  };
}
