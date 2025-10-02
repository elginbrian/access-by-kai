import { JadwalKursi } from "@/types/models";

export type KursiUI = {
  id: number;
  jadwalGerbongId: number;
  templateKursiId: number;
  kodeKursi: string;
  hargaKursi: number;
  multiplierKursi: number | null;
  statusInventaris: string | null;
  isBlocked: boolean | null;
  keterangan: string | null;
  statusLabel?: string;
  hargaFinal?: number;
  isAvailable?: boolean;
  kategoriStatus?: string;
};

export function mapKursi(row: JadwalKursi): KursiUI {
  const statusLabels = {
    TERSEDIA: "Tersedia",
    DIKUNCI: "Dikunci",
    DIPESAN: "Dipesan",
    TERISI: "Terisi",
  };

  const hargaFinal = row.multiplier_kursi ? row.harga_kursi * row.multiplier_kursi : row.harga_kursi;

  const isAvailable = row.status_inventaris === "TERSEDIA" && !row.is_blocked;

  let kategoriStatus = "Unknown";
  if (row.is_blocked) {
    kategoriStatus = "Blocked";
  } else if (row.status_inventaris) {
    switch (row.status_inventaris) {
      case "TERSEDIA":
        kategoriStatus = "Available";
        break;
      case "DIKUNCI":
        kategoriStatus = "Locked";
        break;
      case "DIPESAN":
      case "TERISI":
        kategoriStatus = "Occupied";
        break;
    }
  }

  return {
    id: row.jadwal_kursi_id,
    jadwalGerbongId: row.jadwal_gerbong_id,
    templateKursiId: row.template_kursi_id,
    kodeKursi: row.kode_kursi,
    hargaKursi: row.harga_kursi,
    multiplierKursi: row.multiplier_kursi,
    statusInventaris: row.status_inventaris,
    isBlocked: row.is_blocked,
    keterangan: row.keterangan,
    statusLabel: row.status_inventaris ? statusLabels[row.status_inventaris as keyof typeof statusLabels] : undefined,
    hargaFinal,
    isAvailable,
    kategoriStatus,
  };
}

export function mapKursiList(rows: JadwalKursi[]): KursiUI[] {
  return rows.map(mapKursi);
}
