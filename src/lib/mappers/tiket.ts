import { Tiket, StatusTiketEnum } from "@/types/models";

export type TiketUI = {
  id: number;
  segmentId: number;
  penumpangId: number;
  jadwalKursiId: number;
  kodeTiket: string;
  hargaTiket: number;
  status: StatusTiketEnum | null;
  waktuCheckIn: string | null;
  waktuBoarding: string | null;
  gateBoarding: string | null;
  keterangan: string | null;
};

export function mapTiket(row: Tiket): TiketUI {
  return {
    id: row.tiket_id,
    segmentId: row.segment_id, // Updated field name
    penumpangId: row.penumpang_id,
    jadwalKursiId: row.jadwal_kursi_id, // New field
    kodeTiket: row.kode_tiket, // Updated field name
    hargaTiket: row.harga_tiket, // Updated field name
    status: row.status_tiket ?? null,
    waktuCheckIn: row.waktu_check_in ?? null,
    waktuBoarding: row.waktu_boarding ?? null,
    gateBoarding: row.gate_boarding ?? null,
    keterangan: row.keterangan ?? null,
  };
}

export function mapTiketList(rows: Tiket[]): TiketUI[] {
  return rows.map(mapTiket);
}
