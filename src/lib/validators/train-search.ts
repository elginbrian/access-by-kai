import { z } from "zod";

export const TrainSearchSchema = z
  .object({
    departureStationId: z
      .number({
        required_error: "Stasiun keberangkatan harus dipilih",
      })
      .min(1, "Stasiun keberangkatan harus dipilih"),

    arrivalStationId: z
      .number({
        required_error: "Stasiun tujuan harus dipilih",
      })
      .min(1, "Stasiun tujuan harus dipilih"),

    departureDate: z
      .string({
        required_error: "Tanggal keberangkatan harus dipilih",
      })
      .min(1, "Tanggal keberangkatan harus dipilih"),

    returnDate: z.string().optional(),

    passengers: z.number().min(1, "Minimal 1 penumpang").max(8, "Maksimal 8 penumpang").optional().default(1),

    trainClass: z
      .enum(["EKSEKUTIF", "EKONOMI", "LUXURY", "PRIORITY"], {
        required_error: "Kelas kereta harus dipilih",
      })
      .optional(),
  })
  .refine(
    (data) => {
      return data.departureStationId !== data.arrivalStationId;
    },
    {
      message: "Stasiun keberangkatan dan tujuan tidak boleh sama",
      path: ["arrivalStationId"],
    }
  )
  .refine(
    (data) => {
      if (data.returnDate) {
        const depDate = new Date(data.departureDate);
        const retDate = new Date(data.returnDate);
        return retDate >= depDate;
      }
      return true;
    },
    {
      message: "Tanggal pulang harus setelah atau sama dengan tanggal keberangkatan",
      path: ["returnDate"],
    }
  );

export type TrainSearchFormData = z.infer<typeof TrainSearchSchema>;

export const TrainScheduleSearchSchema = z.object({
  departureStationId: z.number(),
  arrivalStationId: z.number(),
  departureDate: z.string(),
  trainClass: z.enum(["EKSEKUTIF", "EKONOMI", "LUXURY", "PRIORITY"]).optional(),
});

export type TrainScheduleSearchData = z.infer<typeof TrainScheduleSearchSchema>;

export interface StationOption {
  value: number;
  label: string;
  city: string;
  province: string;
  code: string;
}

export interface TrainScheduleResult {
  jadwal_id: number;
  kode_jadwal: string;
  nomor_ka: string;
  nama_kereta: string;
  jenis_layanan: string;
  tanggal_keberangkatan: string;
  waktu_berangkat: string;
  waktu_tiba: string;
  durasi: string;
  harga_mulai: number;
  harga_sampai: number;
  kelas_tersedia: string[];
  stasiun_asal: {
    nama: string;
    kode: string;
  };
  stasiun_tujuan: {
    nama: string;
    kode: string;
  };
  kursi_tersedia: number;
  fasilitas: string[];
  rute_nama: string;
  jarak_km: number;
}
