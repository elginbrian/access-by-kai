import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth/AuthContext";
import type { TicketData, TicketDetailData, TicketListParams, TicketDetailParams } from "@/types/ticket";

const supabase = createClient();

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

export function useUserTickets(params?: TicketListParams) {
  const { user } = useAuth();
  // parse user id to number and guard against invalid values (NaN)
  const rawUserId = user?.id;
  const parsedUserId = rawUserId == null ? NaN : typeof rawUserId === "string" ? parseInt(rawUserId, 10) : (rawUserId as number);

  return useQuery<TicketData[], Error>({
    queryKey: ["userTickets", parsedUserId, params],
    queryFn: async (): Promise<TicketData[]> => {
      if (!user?.id) throw new Error("User not authenticated");
      if (Number.isNaN(parsedUserId)) {
        // Avoid making a bad request to Supabase (penumpang.user_id=NaN). Return empty list.
        return [];
      }

      const userId = parsedUserId;

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
            tanggal_berangkat,
            waktu_berangkat,
            waktu_tiba,
            pemesanan!inner(
              pemesanan_id,
              user_id,
              total_harga,
              biaya_admin,
              waktu_pembuatan,
              status_pemesanan
            )
          ),
          penumpang!inner(
            penumpang_id,
            nama_penumpang,
            user_id
          ),
          jadwal_kursi!inner(
            jadwal_kursi_id,
            nomor_kursi,
            kelas_layanan,
            harga_kursi,
            jadwal_gerbong!inner(
              jadwal_gerbong_id,
              nama_gerbong,
              jadwal!inner(
                jadwal_id,
                nama_jadwal,
                nomor_kereta,
                master_kereta!inner(
                  kereta_id,
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
        const segment = ticket.pemesanan_segment;
        const booking = segment.pemesanan;
        const passenger = ticket.penumpang;
        const seatInfo = ticket.jadwal_kursi;
        const railcar = seatInfo.jadwal_gerbong;
        const schedule = railcar.jadwal;
        const train = schedule.master_kereta;

        return {
          id: ticket.kode_tiket,
          ticketNumber: ticket.kode_tiket,
          trainName: train.nama_kereta,
          trainNumber: schedule.nomor_kereta,
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
          date: segment.tanggal_berangkat,
          duration: "7j 30m",
          passenger: {
            id: passenger.penumpang_id,
            name: passenger.nama_penumpang,
          },
          seat: {
            car: railcar.nama_gerbong,
            number: seatInfo.nomor_kursi,
            class: seatInfo.kelas_layanan,
          },
          price: {
            ticketPrice: ticket.harga_tiket,
            adminFee: booking.biaya_admin || 5000,
            total: booking.total_harga,
            currency: "IDR",
          },
          status: mapTicketStatus(ticket.status_tiket),
          bookingId: booking.pemesanan_id,
          segmentId: segment.segment_id,
          checkInTime: ticket.waktu_check_in ?? undefined,
          boardingTime: ticket.waktu_boarding ?? undefined,
          boardingGate: ticket.gate_boarding ?? undefined,
          createdAt: undefined,
          updatedAt: undefined,
        } as TicketData;
      });
    },
    enabled: !!user?.id && !Number.isNaN(parsedUserId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTicketDetail(params: TicketDetailParams) {
  const { user } = useAuth();
  const rawUserId = user?.id;
  const parsedUserId = rawUserId == null ? NaN : typeof rawUserId === "string" ? parseInt(rawUserId, 10) : (rawUserId as number);

  return useQuery<TicketDetailData | null, Error>({
    queryKey: ["ticketDetail", params.ticketId, parsedUserId],
    queryFn: async (): Promise<TicketDetailData | null> => {
      if (!user?.id) throw new Error("User not authenticated");
      if (!params.ticketId) return null;
      if (Number.isNaN(parsedUserId)) return null;

      const userId = parsedUserId;

      const res: any = await supabase
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
            tanggal_berangkat,
            waktu_berangkat,
            waktu_tiba,
            pemesanan!inner(
              pemesanan_id,
              kode_pemesanan,
              user_id,
              total_harga,
              biaya_admin,
              waktu_pembuatan,
              status_pemesanan
            ),
            rute!inner(
              rute_id,
              nama_rute,
              jarak_km
            )
          ),
          penumpang!inner(
            penumpang_id,
            nama_penumpang,
            user_id
          ),
          jadwal_kursi!inner(
            jadwal_kursi_id,
            nomor_kursi,
            kelas_layanan,
            harga_kursi,
            jadwal_gerbong!inner(
              jadwal_gerbong_id,
              nama_gerbong,
              tipe_gerbong,
              fasilitas,
              jadwal!inner(
                jadwal_id,
                nama_jadwal,
                nomor_kereta,
                frekuensi_operasi,
                hari_operasi,
                master_kereta!inner(
                  kereta_id,
                  nama_kereta
                )
              )
            )
          )
        `
        )
        .eq("kode_tiket", params.ticketId)
        .eq("penumpang.user_id", userId)
        .single();

      const data = (res as any).data as any | null;
      const error = (res as any).error;

      if (error) throw error;
      if (!data) return null;

      const segment = data.pemesanan_segment;
      const booking = segment.pemesanan;
      const passenger = data.penumpang;
      const seatInfo = data.jadwal_kursi;
      const railcar = seatInfo.jadwal_gerbong;
      const schedule = railcar.jadwal;
      const train = schedule.master_kereta;
      const route = segment.rute;

      const baseTicket: TicketData = {
        id: data.kode_tiket,
        ticketNumber: data.kode_tiket,
        trainName: train.nama_kereta,
        trainNumber: schedule.nomor_kereta,
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
        date: segment.tanggal_berangkat,
        duration: "7j 30m",
        passenger: {
          id: passenger.penumpang_id,
          name: passenger.nama_penumpang,
        },
        seat: {
          car: railcar.nama_gerbong,
          number: seatInfo.nomor_kursi,
          class: seatInfo.kelas_layanan,
        },
        price: {
          ticketPrice: data.harga_tiket,
          adminFee: booking.biaya_admin || 5000,
          total: booking.total_harga,
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
        ...baseTicket,
        booking: {
          id: booking.pemesanan_id,
          bookingCode: booking.kode_pemesanan || booking.pemesanan_id.toString(),
          createdAt: booking.waktu_pembuatan,
          paymentStatus: booking.status_pemesanan,
        },
        route: {
          id: route.rute_id,
          name: route.nama_rute,
          distance: route.jarak_km,
        },
        schedule: {
          id: schedule.jadwal_id,
          frequency: schedule.frekuensi_operasi || "daily",
          operationalDays: schedule.hari_operasi || [],
        },
        railcar: {
          id: railcar.jadwal_gerbong_id,
          name: railcar.nama_gerbong,
          type: railcar.tipe_gerbong || "standard",
          facilities: railcar.fasilitas || [],
        },
      } as TicketDetailData;
    },
    enabled: !!user?.id && !!params.ticketId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTicketActions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const cancelTicket = useMutation({
    mutationFn: async (ticketId: string) => {
      if (!user?.id) throw new Error("User not authenticated");

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
      if (!user?.id) throw new Error("User not authenticated");

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
