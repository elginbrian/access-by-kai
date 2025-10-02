import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export interface TrainBookingDetails {
  jadwal_id: number;
  kode_jadwal: string;
  nomor_ka: string;
  nama_kereta: string;
  jenis_layanan: string;
  tanggal_keberangkatan: string;
  waktu_berangkat: string;
  waktu_tiba: string;
  durasi: string;
  harga_base: number;
  kursi_tersedia: number;
  kelas_tersedia: string[];
  stasiun_asal: {
    nama: string;
    kode: string;
  };
  stasiun_tujuan: {
    nama: string;
    kode: string;
  };
  fasilitas: string[];
  deskripsi?: string;
  foto_kereta?: string;
}

export function useTrainBookingDetails(jadwalId: number | null) {
  return useQuery({
    queryKey: ["train-booking-details", jadwalId],
    queryFn: async (): Promise<TrainBookingDetails | null> => {
      if (!jadwalId) return null;

      try {
        const { data: schedule, error } = await supabase
          .from("jadwal")
          .select(
            `
          jadwal_id,
          kode_jadwal,
          nomor_ka,
          tanggal_keberangkatan,
          waktu_berangkat_origin,
          waktu_tiba_destination,
          harga_base,
          status_jadwal,
          master_kereta (
            nama_kereta,
            jenis_layanan,
            kapasitas_total,
            fasilitas_umum,
            keterangan
          ),
          rute (
            nama_rute,
            jarak_total_km
          )
        `
          )
          .eq("jadwal_id", jadwalId)
          .eq("status_jadwal", "SESUAI_JADWAL")
          .single();

        if (error) {
          console.error("Error fetching train booking details:", error);
          throw new Error(`Failed to fetch train details: ${error.message}`);
        }

        if (!schedule) {
          throw new Error("Train schedule not found");
        }

        const startTime = new Date(schedule.waktu_berangkat_origin);
        const endTime = new Date(schedule.waktu_tiba_destination);
        const duration = Math.abs(endTime.getTime() - startTime.getTime());
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

        const { data: gerbongList } = await supabase.from("jadwal_gerbong").select("jadwal_gerbong_id").eq("jadwal_id", jadwalId);

        let totalAvailableSeats = 0;
        if (gerbongList && gerbongList.length > 0) {
          const gerbongIds = gerbongList.map((g) => g.jadwal_gerbong_id);
          const { data: availableSeats } = await supabase.from("jadwal_kursi").select("jadwal_kursi_id").in("jadwal_gerbong_id", gerbongIds).eq("status_inventaris", "TERSEDIA").eq("is_blocked", false);

          totalAvailableSeats = availableSeats?.length || 0;
        }

        const availableClasses = [];
        switch (schedule.master_kereta.jenis_layanan) {
          case "LUXURY":
            availableClasses.push("LUXURY", "EKSEKUTIF", "EKONOMI");
            break;
          case "EKSEKUTIF":
            availableClasses.push("EKSEKUTIF", "EKONOMI");
            break;
          case "PRIORITY":
            availableClasses.push("PRIORITY", "EKSEKUTIF");
            break;
          default:
            availableClasses.push("EKONOMI");
        }

        const { data: jadwalStops } = await supabase
          .from("perhentian_jadwal")
          .select(
            `
          urutan,
          stasiun (
            nama_stasiun,
            kode_stasiun
          )
        `
          )
          .eq("jadwal_id", jadwalId)
          .order("urutan", { ascending: true });

        const originStop = jadwalStops?.[0];
        const destinationStop = jadwalStops?.[jadwalStops.length - 1];

        return {
          jadwal_id: schedule.jadwal_id,
          kode_jadwal: schedule.kode_jadwal,
          nomor_ka: schedule.nomor_ka,
          nama_kereta: schedule.master_kereta.nama_kereta,
          jenis_layanan: schedule.master_kereta.jenis_layanan,
          tanggal_keberangkatan: schedule.tanggal_keberangkatan,
          waktu_berangkat: schedule.waktu_berangkat_origin,
          waktu_tiba: schedule.waktu_tiba_destination,
          durasi: `${hours}h ${minutes}m`,
          harga_base: schedule.harga_base,
          kursi_tersedia: totalAvailableSeats,
          kelas_tersedia: availableClasses,
          stasiun_asal: {
            nama: originStop?.stasiun.nama_stasiun || "Unknown",
            kode: originStop?.stasiun.kode_stasiun || "---",
          },
          stasiun_tujuan: {
            nama: destinationStop?.stasiun.nama_stasiun || "Unknown",
            kode: destinationStop?.stasiun.kode_stasiun || "---",
          },
          fasilitas: schedule.master_kereta.fasilitas_umum
            ? Object.keys(schedule.master_kereta.fasilitas_umum as Record<string, boolean>).filter((key) => (schedule.master_kereta.fasilitas_umum as Record<string, boolean>)[key] === true)
            : ["AC", "Wi-Fi", "Colokan Listrik", "Toilet"],
          deskripsi: schedule.master_kereta.keterangan || undefined,
          foto_kereta: undefined,
        };
      } catch (error) {
        console.error("Error in useTrainBookingDetails:", error);
        throw error;
      }
    },
    enabled: !!jadwalId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrainRouteStations(jadwalId: number | null) {
  return useQuery({
    queryKey: ["train-route-stations", jadwalId],
    queryFn: async () => {
      if (!jadwalId) return [];

      const { data: stops, error } = await supabase
        .from("perhentian_jadwal")
        .select(
          `
          urutan,
          waktu_kedatangan_estimasi,
          waktu_keberangkatan_estimasi,
          stasiun (
            nama_stasiun,
            kode_stasiun
          )
        `
        )
        .eq("jadwal_id", jadwalId)
        .order("urutan", { ascending: true });

      if (error) {
        console.error("Error fetching route stations:", {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          jadwalId,
        });
        return [];
      }

      if (!stops || stops.length === 0) return [];

      const routeStations = stops.map((stop: any, index: number) => {
        // Use actual estimated times from database if available, otherwise fallback to calculated time
        const timeToShow = stop.waktu_keberangkatan_estimasi || stop.waktu_kedatangan_estimasi;
        const displayTime = timeToShow
          ? new Date(timeToShow).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--:--";

        return {
          name: `${stop.stasiun.nama_stasiun} (${stop.stasiun.kode_stasiun})`,
          time: displayTime,
          active: index === 0 || index === stops.length - 1, // First and last stations are active
          urutan: stop.urutan,
        };
      });

      return routeStations;
    },
    enabled: !!jadwalId,
    staleTime: 1000 * 60 * 5,
  });
}
