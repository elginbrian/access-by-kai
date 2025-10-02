import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import type { StationOption, TrainScheduleSearchData, TrainScheduleResult } from "@/lib/validators/train-search";
import type { Stasiun } from "@/types/models";

const supabase = createClient();

export function useStationsForSearch() {
  return useQuery({
    queryKey: ["stations", "search-options"],
    queryFn: async (): Promise<StationOption[]> => {
      const { data: stations, error } = await supabase.from("stasiun").select("stasiun_id, kode_stasiun, nama_stasiun, kota, provinsi").eq("status_aktif", true).order("nama_stasiun");

      if (error) throw error;

      return (stations as any[]).map((station: any) => ({
        value: station.stasiun_id,
        label: station.nama_stasiun,
        city: station.kota,
        province: station.provinsi,
        code: station.kode_stasiun,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTrainScheduleSearch(searchParams: TrainScheduleSearchData | null) {
  return useQuery({
    queryKey: ["train-schedule", "search", searchParams],
    queryFn: async (): Promise<TrainScheduleResult[]> => {
      if (!searchParams) return [];

      const { departureStationId, arrivalStationId, departureDate, trainClass } = searchParams;

      console.log("🔍 Searching trains with params:", {
        departureStationId,
        arrivalStationId,
        departureDate,
        trainClass,
      });

      let query = supabase
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
            fasilitas_umum
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
        .eq("tanggal_keberangkatan", departureDate)
        .eq("status_jadwal", "SESUAI_JADWAL");

      if (trainClass) {
        query = query.eq("master_kereta.jenis_layanan", trainClass);
      }

      const { data: schedules, error } = await query;

      if (error) {
        console.error("❌ Train search query error:", error);
        throw new Error(`Failed to search trains: ${error.message}`);
      }

      console.log("✅ Found schedules:", schedules?.length || 0);

      const filteredSchedules = (schedules as any[]).filter((schedule) => {
        const stops = schedule.rute.perhentian_rute;
        const departureStop = stops.find((stop: any) => stop.stasiun_id === departureStationId);
        const arrivalStop = stops.find((stop: any) => stop.stasiun_id === arrivalStationId);

        return departureStop && arrivalStop && departureStop.urutan < arrivalStop.urutan;
      });

      const results: TrainScheduleResult[] = await Promise.all(
        filteredSchedules.map(async (schedule) => {
          const stops = schedule.rute.perhentian_rute;
          const departureStop = stops.find((stop: any) => stop.stasiun_id === departureStationId);
          const arrivalStop = stops.find((stop: any) => stop.stasiun_id === arrivalStationId);

          const startTime = new Date(schedule.waktu_berangkat_origin);
          const endTime = new Date(schedule.waktu_tiba_destination);
          const duration = Math.abs(endTime.getTime() - startTime.getTime());
          const hours = Math.floor(duration / (1000 * 60 * 60));
          const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

          const { data: availableSeats } = await supabase.from("jadwal_kursi").select("jadwal_kursi_id").eq("status_inventaris", "TERSEDIA").eq("is_blocked", false).in("jadwal_gerbong_id", []);

          // Get available classes for this train
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
            harga_mulai: schedule.harga_base,
            harga_sampai: schedule.harga_base * (availableClasses.includes("LUXURY") ? 3 : availableClasses.includes("EKSEKUTIF") ? 2 : 1.5),
            kursi_tersedia: availableSeats?.length || 0,
            kelas_tersedia: availableClasses,
            stasiun_asal: {
              nama: departureStop.stasiun.nama_stasiun,
              kode: departureStop.stasiun.kode_stasiun,
            },
            stasiun_tujuan: {
              nama: arrivalStop.stasiun.nama_stasiun,
              kode: arrivalStop.stasiun.kode_stasiun,
            },
            fasilitas: schedule.master_kereta.fasilitas_umum ? Object.keys(schedule.master_kereta.fasilitas_umum).filter((key) => schedule.master_kereta.fasilitas_umum[key] === true) : ["AC", "Wi-Fi", "Colokan Listrik", "Toilet"],
            rute_nama: schedule.rute.nama_rute,
            jarak_km: schedule.rute.jarak_total_km,
          };
        })
      );

      return results.sort((a, b) => new Date(a.waktu_berangkat).getTime() - new Date(b.waktu_berangkat).getTime());
    },
    enabled: !!searchParams && !!searchParams.departureStationId && !!searchParams.arrivalStationId && !!searchParams.departureDate,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook untuk mendapatkan rute populer
 */
export function usePopularRoutes() {
  return useQuery({
    queryKey: ["routes", "popular"],
    queryFn: async (): Promise<{ from: StationOption; to: StationOption }[]> => {
      // Query untuk mendapatkan rute yang paling sering digunakan
      const { data: popularRoutes, error } = await supabase
        .from("rute")
        .select(
          `
          rute_id,
          nama_rute,
          perhentian_rute (
            stasiun_id,
            urutan,
            stasiun (
              stasiun_id,
              kode_stasiun,
              nama_stasiun,
              kota,
              provinsi
            )
          )
        `
        )
        .eq("is_aktif", true)
        .limit(10);

      if (error) throw error;

      // Transform ke format yang dibutuhkan
      const routes = (popularRoutes as any[])
        .map((route) => {
          const stops = route.perhentian_rute.sort((a: any, b: any) => a.urutan - b.urutan);
          const origin = stops[0]?.stasiun;
          const destination = stops[stops.length - 1]?.stasiun;

          if (!origin || !destination) return null;

          return {
            from: {
              value: origin.stasiun_id,
              label: origin.nama_stasiun,
              city: origin.kota,
              province: origin.provinsi,
              code: origin.kode_stasiun,
            },
            to: {
              value: destination.stasiun_id,
              label: destination.nama_stasiun,
              city: destination.kota,
              province: destination.provinsi,
              code: destination.kode_stasiun,
            },
          };
        })
        .filter(Boolean);

      return routes.filter((route): route is { from: StationOption; to: StationOption } => route !== null);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useAllTrainSchedules() {
  return useQuery({
    queryKey: ["train-schedule", "all"],
    queryFn: async (): Promise<TrainScheduleResult[]> => {
      const today = new Date().toISOString().split("T")[0];

      console.log("🚂 Loading all train schedules from:", today);

      const { data: schedules, error } = await supabase
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
            fasilitas_umum
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
        .gte("tanggal_keberangkatan", today)
        .eq("status_jadwal", "SESUAI_JADWAL")
        .order("tanggal_keberangkatan")
        .order("waktu_berangkat_origin")
        .limit(50);

      if (error) {
        console.error("❌ All trains query error:", error);
        throw new Error(`Failed to load all trains: ${error.message}`);
      }

      console.log("✅ Found all schedules:", schedules?.length || 0);

      const results: TrainScheduleResult[] = await Promise.all(
        (schedules as any[]).map(async (schedule) => {
          const stops = schedule.rute.perhentian_rute.sort((a: any, b: any) => a.urutan - b.urutan);
          const originStop = stops[0];
          const destinationStop = stops[stops.length - 1];

          const startTime = new Date(schedule.waktu_berangkat_origin);
          const endTime = new Date(schedule.waktu_tiba_destination);
          const duration = Math.abs(endTime.getTime() - startTime.getTime());
          const hours = Math.floor(duration / (1000 * 60 * 60));
          const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

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

          const { data: seatData } = await supabase
            .from("jadwal_gerbong")
            .select(
              `
              jadwal_kursi (
                status_inventaris
              )
            `
            )
            .eq("jadwal_id", schedule.jadwal_id);

          let availableSeats = 0;
          if (seatData) {
            seatData.forEach((gerbong: any) => {
              if (gerbong.jadwal_kursi) {
                availableSeats += gerbong.jadwal_kursi.filter((kursi: any) => kursi.status_inventaris === "TERSEDIA").length;
              }
            });
          }

          if (availableSeats === 0) {
            availableSeats = Math.floor(schedule.master_kereta.kapasitas_total * 0.7) || 50;
          }

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
            harga_mulai: schedule.harga_base,
            harga_sampai: schedule.harga_base * (availableClasses.includes("LUXURY") ? 3 : availableClasses.includes("EKSEKUTIF") ? 2 : 1.5),
            kursi_tersedia: availableSeats,
            stasiun_asal: {
              nama: originStop.stasiun.nama_stasiun,
              kode: originStop.stasiun.kode_stasiun,
            },
            stasiun_tujuan: {
              nama: destinationStop.stasiun.nama_stasiun,
              kode: destinationStop.stasiun.kode_stasiun,
            },
            kelas_tersedia: availableClasses,
            fasilitas: schedule.master_kereta.fasilitas_umum ? Object.keys(schedule.master_kereta.fasilitas_umum).filter((key) => schedule.master_kereta.fasilitas_umum[key] === true) : ["AC", "Wi-Fi", "Colokan Listrik", "Toilet"],
            rute_nama: schedule.rute.nama_rute,
            jarak_km: schedule.rute.jarak_total_km,
          };
        })
      );

      return results;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
