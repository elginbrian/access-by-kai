import { EporterBooking, EporterBookingStatusEnum } from "@/types/models";

type ValidationResult<T> = { value?: T; error?: string | null };

export function validateEporterBooking(payload: any): ValidationResult<Partial<EporterBooking>> {
  if (!payload) return { error: "Missing payload" };

  const user_id = Number(payload.user_id || payload.userId || payload.user);
  if (!user_id || Number.isNaN(user_id)) return { error: "Invalid or missing user_id" };

  const meeting_point = typeof payload.meeting_point === "string" ? payload.meeting_point : payload.meetingPoint;
  if (!meeting_point || meeting_point.trim().length === 0) return { error: "Missing meeting_point" };

  const jumlah_penumpang = payload.jumlah_penumpang ? Number(payload.jumlah_penumpang) : payload.jumlahPenumpang ? Number(payload.jumlahPenumpang) : 1;
  if (Number.isNaN(jumlah_penumpang) || jumlah_penumpang <= 0) return { error: "Invalid jumlah_penumpang" };

  const result: Partial<EporterBooking> = {
    pemesanan_id: payload.pemesanan_id ?? payload.pemesananId ?? null,
    tiket_id: payload.tiket_id ?? payload.tiketId ?? null,
    user_id,
    jumlah_penumpang,
    passenger_ids: Array.isArray(payload.passenger_ids) ? payload.passenger_ids : payload.passengerIds ?? null,
    meeting_point,
    meeting_lat: payload.meeting_lat ?? payload.meetingLat ?? null,
    meeting_lon: payload.meeting_lon ?? payload.meetingLon ?? null,
    notes: payload.notes ?? null,
    preferred_time: payload.preferred_time ?? payload.preferredTime ?? null,
    status: "REQUESTED" as unknown as EporterBookingStatusEnum,
  };

  return { value: result };
}
