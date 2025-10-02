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
            jarak_total_km,
            perhentian_rute (
              stasiun_id,
              urutan,
              stasiun (
                stasiun_id,
                nama_stasiun,
                kode_stasiun
              )
            )
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

      const { data: availableSeats } = await supabase.from("jadwal_kursi").select("jadwal_kursi_id").eq("jadwal_gerbong_id", jadwalId).eq("status_inventaris", "TERSEDIA").eq("is_blocked", false);

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

      const stops = schedule.rute.perhentian_rute;
      const originStop = stops.find((stop: any) => stop.urutan === 1);
      const destinationStop = stops.find((stop: any) => stop.urutan === Math.max(...stops.map((s: any) => s.urutan)));

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
        kursi_tersedia: availableSeats?.length || 0,
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

      const { data: schedule, error } = await supabase
        .from("jadwal")
        .select(
          `
          waktu_berangkat_origin,
          rute (
            perhentian_rute (
              stasiun_id,
              urutan,
              waktu_tiba_estimasi,
              waktu_berangkat_estimasi,
              stasiun (
                nama_stasiun,
                kode_stasiun
              )
            )
          )
        `
        )
        .eq("jadwal_id", jadwalId)
        .single();

      if (error) {
        console.error("Error fetching route stations:", error);
        return [];
      }

      if (!schedule?.rute?.perhentian_rute) return [];

      const stops = schedule.rute.perhentian_rute
        .sort((a: any, b: any) => a.urutan - b.urutan)
        .map((stop: any, index: number) => {
          const originTime = new Date(schedule.waktu_berangkat_origin);
          const estimatedTime = new Date(originTime.getTime() + index * 30 * 60 * 1000);

          return {
            name: `${stop.stasiun.nama_stasiun} (${stop.stasiun.kode_stasiun})`,
            time: estimatedTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            active: index === 0 || index === schedule.rute.perhentian_rute.length - 1,
            urutan: stop.urutan,
          };
        });

      return stops;
    },
    enabled: !!jadwalId,
    staleTime: 1000 * 60 * 5,
  });
}
