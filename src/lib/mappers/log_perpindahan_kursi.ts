import type { Tables } from "../../types/supabase";

export interface LogPerpindahanKursiMapper {
  log_id: number;
  perpindahan_id: number;
  tiket_id: number;
  kursi_lama_id: number;
  kursi_baru_id: number;
  waktu_perpindahan: string | null;
  lokasi_perpindahan: string | null;
  petugas_yang_membantu: string | null;
  keterangan: string | null;
  waktu_perpindahan_formatted: string | null;
  is_completed: boolean;
  has_assistance: boolean;
  duration_since_request: string | null;
  kursi_change_summary: string;
}

export function mapLogPerpindahanKursi(row: Tables<"log_perpindahan_kursi">): LogPerpindahanKursiMapper {
  const waktuFormatted = row.waktu_perpindahan
    ? new Date(row.waktu_perpindahan).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const kursiChangeSummary = `Kursi ${row.kursi_lama_id} → Kursi ${row.kursi_baru_id}`;

  const durationSinceRequest = row.waktu_perpindahan ? `Selesai pada ${waktuFormatted}` : "Belum selesai";

  return {
    log_id: row.log_id,
    perpindahan_id: row.perpindahan_id,
    tiket_id: row.tiket_id,
    kursi_lama_id: row.kursi_lama_id,
    kursi_baru_id: row.kursi_baru_id,
    waktu_perpindahan: row.waktu_perpindahan,
    lokasi_perpindahan: row.lokasi_perpindahan,
    petugas_yang_membantu: row.petugas_yang_membantu,
    keterangan: row.keterangan,

    // Computed fields
    waktu_perpindahan_formatted: waktuFormatted,
    is_completed: row.waktu_perpindahan !== null,
    has_assistance: row.petugas_yang_membantu !== null,
    duration_since_request: durationSinceRequest,
    kursi_change_summary: kursiChangeSummary,
  };
}
