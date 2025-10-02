import { Pengguna, TipeIdentitasEnum, JenisKelaminEnum } from "@/types/models";

export type PenggunaUI = {
  id: number;
  nik: string | null;
  tipeIdentitas: TipeIdentitasEnum;
  nomorIdentitas: string;
  namaLengkap: string;
  tanggalLahir: string | null;
  jenisKelamin: JenisKelaminEnum | null;
  email: string | null;
  nomorTelepon: string | null;
  provinsi: string | null;
  kotaKabupaten: string | null;
  alamatLengkap: string | null;
  hobi: string[] | null;
  pekerjaan: string | null;
  saldoKaipay: number | null;
  poinLoyalitas: number | null;
  fotoProfil: string | null;
  isVerified: boolean | null;
  waktuRegistrasi: string | null;
  waktuLoginTerakhir: string | null;
};

export function mapPengguna(row: Pengguna): PenggunaUI {
  return {
    id: row.user_id,
    nik: row.nik ?? null,
    tipeIdentitas: row.tipe_identitas,
    nomorIdentitas: row.nomor_identitas,
    namaLengkap: row.nama_lengkap,
    tanggalLahir: row.tanggal_lahir ?? null,
    jenisKelamin: row.jenis_kelamin ?? null,
    email: row.email ?? null,
    nomorTelepon: row.nomor_telepon ?? null,
    provinsi: row.provinsi ?? null,
    kotaKabupaten: row.kota_kabupaten ?? null,
    alamatLengkap: row.alamat_lengkap ?? null,
    hobi: row.hobi ?? null,
    pekerjaan: row.pekerjaan ?? null,
    saldoKaipay: row.saldo_kaipay ?? null,
    poinLoyalitas: row.poin_loyalitas ?? null,
    fotoProfil: row.foto_profil_url ?? null,
    isVerified: row.is_verified ?? null,
    waktuRegistrasi: row.waktu_registrasi ?? null,
    waktuLoginTerakhir: row.waktu_login_terakhir ?? null,
  };
}

export function mapPenggunaList(rows: Pengguna[]): PenggunaUI[] {
  return rows.map(mapPengguna);
}
