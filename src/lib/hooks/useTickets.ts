import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth/AuthContext";
import type { TicketData, TicketDetailData, TicketListParams, TicketDetailParams } from "@/types/ticket";

const supabase = createClient();

function formatTime(value: string | undefined | null) {
  if (!value) return "";
  try {
    const d = new Date(String(value));
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return String(value);
  }
}

function formatDate(value: string | undefined | null) {
  if (!value) return "";
  try {
    const d = new Date(String(value));
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) {
    return String(value);
  }
}

function formatDateTimeRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "";
  const s = formatTime(start || undefined);
  const e = formatTime(end || undefined);
  if (s && e) return `${s} - ${e}`;
  return s || e || "";
}

function mapUIStatusToDb(status: "active" | "cancelled" | "completed" | "expired") {
  switch (status) {
    case "active":
      return "AKTIF";
    case "cancelled":
      return "DIBATALKAN";
    case "completed":
      return "COMPLETED";
    case "expired":
      return "DIBATALKAN";
    default:
      return "AKTIF";
  }
}

function mapTicketStatus(dbStatus: string | null): "active" | "cancelled" | "completed" | "expired" {
  switch (dbStatus) {
    case "AKTIF":
      return "active";
    case "DIBATALKAN":
      return "cancelled";
    case "COMPLETED":
      return "completed";
    case "BOARDING":
      return "active";
    case "DIUBAH_JADWALNYA":
      return "active";
    default:
      return "active";
  }
}

export function useUserTickets(userId: number, params?: TicketListParams) {
  if (userId == null || Number.isNaN(userId)) {
    return useQuery<TicketData[], Error>({
      queryKey: ["userTickets", userId, params],
      queryFn: async () => {
        throw new Error("useUserTickets requires a numeric userId parameter (pengguna.user_id)");
      },
      enabled: false,
    });
  }

  return useQuery<TicketData[], Error>({
    queryKey: ["userTickets", userId, params],
    queryFn: async (): Promise<TicketData[]> => {
      const query = supabase
        .from("tiket")
        .select(
          `
          tiket_id,
          kode_tiket,
          harga_tiket,
          status_tiket,
          waktu_check_in,
          waktu_boarding,
          gate_boarding,
          keterangan,
          segment_id,
          penumpang_id,
          jadwal_kursi_id,
          pemesanan_segment!inner(
            segment_id,
            pemesanan_id,
            stasiun_asal_id,
            stasiun_tujuan_id,
            waktu_berangkat,
            waktu_berangkat,
            waktu_tiba,
              pemesanan!inner(
              pemesanan_id,
              user_id,
              total_bayar,
              biaya_admin,
              waktu_pembuatan,
              status_pemesanan
            )
          ),
          penumpang!inner(
            penumpang_id,
            nama_lengkap,
            user_id
          ),
          jadwal_kursi!inner(
            jadwal_kursi_id,
            kode_kursi,
            keterangan,
            harga_kursi,
            jadwal_gerbong!inner(
              jadwal_gerbong_id,
              nomor_gerbong_aktual,
              master_gerbong!inner(
                master_gerbong_id,
                nomor_gerbong,
                tipe_gerbong
              ),
              jadwal!inner(
                jadwal_id,
                kode_jadwal,
                nomor_ka,
                tanggal_keberangkatan,
                waktu_berangkat_origin,
                waktu_tiba_destination,
                  master_kereta!inner(
                  master_kereta_id,
                  nama_kereta
                )
              )
            )
          )
        `
        )
        .eq("penumpang.user_id", userId)
        .order("tiket_id", { ascending: false });

      if (params?.status) {
        const dbStatus = mapUIStatusToDb(params.status);
        query.eq("status_tiket", dbStatus);
      }

      if (params?.limit) {
        query.limit(params.limit);
      }

      if (params?.offset) {
        query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      const res: any = await query;
      const data = res.data as any[] | null;
      const error = res.error;

      if (error) throw error;

      return (data || []).map((ticket: any) => {
        // Top-level tiket attributes (guaranteed by the tiket table)
        const top = ticket;

        // Optional nested relations (may be undefined) used as fallbacks
        const segment = ticket.pemesanan_segment ?? null;
        const booking = segment?.pemesanan ?? null;
        const passenger = ticket.penumpang ?? null;
        const seatInfo = ticket.jadwal_kursi ?? null;
        const railcar = seatInfo?.jadwal_gerbong ?? null;
        const schedule = railcar?.jadwal ?? null;
        const train = schedule?.master_kereta ?? null;

        return {
          // numeric tiket_id from DB for cases where we want to route by numeric id
          tiketId: Number(top.tiket_id ?? 0),
          // identify by kode_tiket (top-level)
          id: String(top.kode_tiket ?? ""),
          ticketNumber: String(top.kode_tiket ?? ""),

          // fallback to nested values only if available
          trainName: String(train?.nama_kereta ?? ""),
          trainNumber: schedule?.nomor_ka ? String(schedule.nomor_ka) : undefined,

          // keep station placeholders but prefer nested if available
          departureStation: {
            code: segment?.stasiun_asal_id ? String(segment.stasiun_asal_id) : "",
            name: "",
          },
          arrivalStation: {
            code: segment?.stasiun_tujuan_id ? String(segment.stasiun_tujuan_id) : "",
            name: "",
          },

          departureTime: formatTime(segment?.waktu_berangkat ?? schedule?.waktu_berangkat_origin ?? ""),
          arrivalTime: formatTime(segment?.waktu_tiba ?? schedule?.waktu_tiba_destination ?? ""),
          date: formatDate(segment?.waktu_berangkat ?? schedule?.tanggal_keberangkatan ?? ""),
          dateIso: segment?.waktu_berangkat ?? schedule?.tanggal_keberangkatan ?? null,
          departureIso: segment?.waktu_berangkat ?? schedule?.waktu_berangkat_origin ?? null,
          arrivalIso: segment?.waktu_tiba ?? schedule?.waktu_tiba_destination ?? null,
          duration: "",

          // passenger/seat info: prefer nested but fallback to top-level ids
          passenger: {
            id: Number(passenger?.penumpang_id ?? top.penumpang_id ?? 0),
            name: String(passenger?.nama_lengkap ?? ""),
          },
          seat: {
            car: String(railcar?.nomor_gerbong_aktual ?? railcar?.master_gerbong?.nomor_gerbong ?? ""),
            number: String(seatInfo?.kode_kursi ?? top.jadwal_kursi_id ?? ""),
            class: String(railcar?.master_gerbong?.tipe_gerbong ?? ""),
          },

          // pricing: prefer booking total if available, otherwise use ticket harga
          price: {
            ticketPrice: Number(top.harga_tiket ?? 0),
            adminFee: Number(booking?.biaya_admin ?? 0),
            total: Number(booking?.total_bayar ?? top.harga_tiket ?? 0),
            currency: "IDR",
          },

          status: mapTicketStatus(top.status_tiket),

          bookingId: Number(booking?.pemesanan_id ?? 0),
          segmentId: Number(top.segment_id ?? 0),
          qrCode: undefined,
          checkInTime: top.waktu_check_in ?? undefined,
          boardingTime: top.waktu_boarding ?? undefined,
          boardingGate: top.gate_boarding ?? undefined,
          createdAt: undefined,
          updatedAt: undefined,
        } as TicketData & { tiketId?: number };
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}
export function useTicketDetail(userId: number, params: TicketDetailParams) {
  if (userId == null || Number.isNaN(userId)) {
    return useQuery<TicketDetailData | null, Error>({
      queryKey: ["ticketDetail", params.ticketId, userId],
      queryFn: async () => {
        throw new Error("useTicketDetail requires a numeric userId parameter (pengguna.user_id)");
      },
      enabled: false,
    });
  }

  return useQuery<TicketDetailData | null, Error>({
    queryKey: ["ticketDetail", params.ticketId, userId],
    queryFn: async (): Promise<TicketDetailData | null> => {
      if (!params.ticketId) return null;

      let queryBuilder: any = supabase.from("tiket").select(
        `
          tiket_id,
          kode_tiket,
          harga_tiket,
          status_tiket,
          waktu_check_in,
          waktu_boarding,
          gate_boarding,
          keterangan,
          segment_id,
          penumpang_id,
          jadwal_kursi_id,
          pemesanan_segment!inner(
            segment_id,
            pemesanan_id,
            stasiun_asal_id,
            stasiun_tujuan_id,
            waktu_berangkat,
            waktu_berangkat,
            waktu_tiba,
            pemesanan!inner(
              pemesanan_id,
              kode_pemesanan,
              user_id,
              total_bayar,
              biaya_admin,
              waktu_pembuatan,
              status_pemesanan
            )
          ),
          penumpang!inner(
            penumpang_id,
            nama_lengkap,
            user_id
          ),
          jadwal_kursi!inner(
            jadwal_kursi_id,
            kode_kursi,
            keterangan,
            harga_kursi,
            jadwal_gerbong!inner(
              jadwal_gerbong_id,
              nomor_gerbong_aktual,
              master_gerbong!inner(
                master_gerbong_id,
                nomor_gerbong,
                tipe_gerbong
              ),
              jadwal!inner(
                jadwal_id,
                kode_jadwal,
                nomor_ka,
                tanggal_keberangkatan,
                waktu_berangkat_origin,
                waktu_tiba_destination,
                  master_kereta!inner(
                  master_kereta_id,
                  nama_kereta
                )
              )
            )
          )
        `
      );

      const maybeNumber = Number(params.ticketId);
      if (!Number.isNaN(maybeNumber) && String(maybeNumber) !== "") {
        queryBuilder = queryBuilder.eq("tiket_id", maybeNumber as any);
      } else {
        queryBuilder = queryBuilder.eq("kode_tiket", params.ticketId);
      }

      queryBuilder = queryBuilder.eq("penumpang.user_id", userId).single();

      const res: any = await queryBuilder;

      const data = (res as any).data as any | null;
      const error = (res as any).error;

      if (error) throw error;
      if (!data) return null;

      const segment = data.pemesanan_segment;
      const booking = segment.pemesanan;
      const passenger = data.penumpang;
      const seatInfo = data.jadwal_kursi;
      const railcar = seatInfo.jadwal_gerbong as any;
      const schedule = railcar?.jadwal as any;
      const train = schedule?.master_kereta as any;
      const route = segment?.rute ?? null;

      let masterGerbongRow = (railcar?.master_gerbong as any) ?? null;
      try {
        if (!masterGerbongRow && (railcar?.master_gerbong_id || railcar?.master_gerbong_id === 0)) {
          const mgRes: any = await supabase.from("master_gerbong").select("master_gerbong_id,nomor_gerbong,tipe_gerbong,fasilitas_gerbong").eq("master_gerbong_id", railcar.master_gerbong_id).single();
          if (!mgRes.error && mgRes.data) {
            masterGerbongRow = mgRes.data;
          }
        }
      } catch (e) {}

      const baseTicket: TicketData = {
        id: data.kode_tiket,
        ticketNumber: data.kode_tiket,
        trainName: train.nama_kereta,
        trainNumber: schedule.nomor_ka,
        departureStation: {
          code: "GMR",
          name: "JAKARTA",
        },
        arrivalStation: {
          code: "SBY",
          name: "SURABAYA",
        },
        departureTime: segment.waktu_berangkat || "08:00",
        arrivalTime: segment.waktu_tiba || "15:30",
        date: segment.waktu_berangkat,
        duration: "7j 30m",
        passenger: {
          id: passenger.penumpang_id,
          name: passenger.nama_lengkap,
        },
        seat: {
          car: railcar.nomor_gerbong_aktual ?? masterGerbongRow?.nomor_gerbong ?? "",
          number: seatInfo.kode_kursi,
          class: masterGerbongRow?.tipe_gerbong ?? railcar.master_gerbong?.tipe_gerbong ?? "",
        },
        price: {
          ticketPrice: data.harga_tiket,
          adminFee: booking.biaya_admin || 5000,
          total: booking.total_bayar,
          currency: "IDR",
        },
        status: mapTicketStatus(data.status_tiket),
        bookingId: booking.pemesanan_id,
        segmentId: segment.segment_id,
        checkInTime: data.waktu_check_in ?? undefined,
        boardingTime: data.waktu_boarding ?? undefined,
        boardingGate: data.gate_boarding ?? undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      return {
        tiketId: Number(data.tiket_id ?? 0),
        ...baseTicket,
        booking: {
          id: booking.pemesanan_id,
          bookingCode: booking.kode_pemesanan || booking.pemesanan_id.toString(),
          createdAt: booking.waktu_pembuatan,
          paymentStatus: booking.status_pemesanan,
        },
        route: {
          id: route?.rute_id ?? 0,
          name: route?.nama_rute ?? "",
          distance: route?.jarak_km ?? 0,
        },
        schedule: {
          id: schedule.jadwal_id,
          frequency: schedule.tanggal_keberangkatan || "daily",
          operationalDays: [],
        },
        railcar: {
          id: railcar.jadwal_gerbong_id,
          name: railcar.nomor_gerbong_aktual ?? masterGerbongRow?.nomor_gerbong ?? "",
          type: (masterGerbongRow?.tipe_gerbong ?? railcar.master_gerbong?.tipe_gerbong) || "standard",
          facilities: Array.isArray(masterGerbongRow?.fasilitas_gerbong) ? masterGerbongRow.fasilitas_gerbong : Array.isArray(railcar.master_gerbong?.fasilitas_gerbong) ? railcar.master_gerbong.fasilitas_gerbong : [],
        },
      } as TicketDetailData;
    },
    enabled: !!params.ticketId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTicketActions(userId: number) {
  const queryClient = useQueryClient();

  const isValidUserId = userId != null && !Number.isNaN(userId);

  const cancelTicket = useMutation({
    mutationFn: async (ticketId: string) => {
      if (!isValidUserId) {
        throw new Error("useTicketActions requires a numeric userId parameter (pengguna.user_id)");
      }

      const { error } = await supabase.from("tiket").update({ status_tiket: "DIBATALKAN" }).eq("kode_tiket", ticketId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketDetail"] });
    },
  });

  const updateTicket = useMutation({
    mutationFn: async ({ ticketId, updates }: { ticketId: string; updates: any }) => {
      if (!isValidUserId) {
        throw new Error("useTicketActions requires a numeric userId parameter (pengguna.user_id)");
      }

      const { error } = await supabase.from("tiket").update(updates).eq("kode_tiket", ticketId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketDetail"] });
    },
  });

  return {
    cancelTicket,
    updateTicket,
  };
}
