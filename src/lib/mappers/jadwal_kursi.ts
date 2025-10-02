import { JadwalKursi } from "../../types/models";

export interface JadwalKursiUI {
  jadwalKursiId: number;
  jadwalGerbongId: number;
  templateKursiId: number;
  kodeKursi: string;
  statusInventaris: string;
  statusLabel: string;
  hargaKursi: number;
  multiplierKursi: number;
  isBlocked: boolean;
  statusBlocked: string;
  keterangan: string | null;
  hargaFinal: number;
}

export function mapJadwalKursi(row: JadwalKursi): JadwalKursiUI {
  // Map status inventaris to readable label
  const statusLabels: Record<string, string> = {
    TERSEDIA: "Tersedia",
    DIKUNCI: "Dikunci",
    DIPESAN: "Dipesan",
    TERISI: "Terisi",
  };

  const statusLabel = statusLabels[String(row.status_inventaris)] || String(row.status_inventaris);
  const hargaKursi = Number(row.harga_kursi);
  const multiplier = Number(row.multiplier_kursi) || 1.0;
  const hargaFinal = hargaKursi * multiplier;

  return {
    jadwalKursiId: Number(row.jadwal_kursi_id),
    jadwalGerbongId: Number(row.jadwal_gerbong_id),
    templateKursiId: Number(row.template_kursi_id),
    kodeKursi: String(row.kode_kursi),
    statusInventaris: String(row.status_inventaris),
    statusLabel,
    hargaKursi,
    multiplierKursi: multiplier,
    isBlocked: row.is_blocked ?? false,
    statusBlocked: row.is_blocked ?? false ? "Diblokir" : "Aktif",
    keterangan: row.keterangan || null,
    hargaFinal,
  };
}
