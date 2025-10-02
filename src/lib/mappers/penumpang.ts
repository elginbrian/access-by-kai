import { Penumpang } from "@/types/models";

export type PenumpangUI = {
  id: number;
  nama: string;
  nomorIdentitas: string;
  tipeIdentitas: string;
  userId: number | null;
  tanggalLahir: string | null;
  jenisKelamin: string | null;
  kewarganegaraan: string | null;
  isDifabel: boolean;
  kebutuhanKhusus: string | null;
  umur?: number; // computed field
};

export function mapPenumpang(row: Penumpang): PenumpangUI {
  const calculateAge = (birthDate: string | null): number | undefined => {
    if (!birthDate) return undefined;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return {
    id: row.penumpang_id,
    nama: row.nama_lengkap,
    nomorIdentitas: row.nomor_identitas,
    tipeIdentitas: row.tipe_identitas,
    userId: row.user_id ?? null,
    tanggalLahir: row.tanggal_lahir,
    jenisKelamin: row.jenis_kelamin,
    kewarganegaraan: row.kewarganegaraan || "Indonesia",
    isDifabel: row.is_difabel || false,
    kebutuhanKhusus: row.kebutuhan_khusus,
    umur: calculateAge(row.tanggal_lahir),
  };
}

export function mapPenumpangList(rows: Penumpang[]): PenumpangUI[] {
  return rows.map(mapPenumpang);
}
