export interface StationFacility {
  facility_id: number;
  kode_fasilitas: string;
  nama_fasilitas: string;
  stasiun_id: number;
  tipe_fasilitas: 'SHOWER' | 'LOCKER' | 'SHOWER_LOCKER_COMBO';
  lokasi_dalam_stasiun: string;
  kapasitas_total: number;
  rating_rata: number;
  jumlah_review: number;
  gambar_utama_url?: string;
  deskripsi?: string;
  jam_operasional: {
    open: string;
    close: string;
  };
  is_tersedia: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacilityUnit {
  unit_id: number;
  facility_id: number;
  nomor_unit: string;
  tipe_unit: string; // 'SHOWER_STANDARD', 'SHOWER_PREMIUM', 'LOCKER_SMALL', 'LOCKER_LARGE'
  kapasitas_barang: number;
  fasilitas_unit: {
    handuk?: boolean;
    sabun?: boolean;
    pengering?: boolean;
    kunci_digital?: boolean;
    [key: string]: any;
  };
  harga_per_jam: number;
  status_unit: 'TERSEDIA' | 'DIGUNAKAN' | 'MAINTENANCE' | 'RUSAK';
  terakhir_dibersihkan?: string;
  created_at: string;
}

export interface FacilityBooking {
  booking_id: number;
  kode_booking: string;
  user_id: number;
  facility_id: number;
  unit_id?: number;
  tiket_id?: number;
  tipe_layanan: 'SHOWER_ONLY' | 'LOCKER_ONLY' | 'SHOWER_AND_LOCKER';
  durasi_penggunaan_menit: number;
  waktu_mulai_booking: string;
  waktu_selesai_booking: string;
  jumlah_barang?: number;
  deskripsi_barang?: string;
  estimasi_berat_kg?: number;
  harga_shower: number;
  harga_locker: number;
  biaya_admin: number;
  total_bayar: number;
  metode_pembayaran?: string;
  status_booking: 'MENUNGGU_PEMBAYARAN' | 'DIBAYAR' | 'SEDANG_DIGUNAKAN' | 'SELESAI' | 'DIBATALKAN' | 'EXPIRED';
  kode_akses?: string;
  waktu_checkin?: string;
  waktu_checkout?: string;
  catatan_khusus?: string;
  created_at: string;
  updated_at: string;
}

export interface FacilityReview {
  review_id: number;
  facility_id: number;
  booking_id: number;
  user_id: number;
  rating_kebersihan: number;
  rating_kelengkapan: number;
  rating_kenyamanan: number;
  rating_keamanan: number;
  rating_overall: number;
  review_text?: string;
  foto_review_urls?: string[];
  tipe_layanan_direview: 'SHOWER' | 'LOCKER' | 'BOTH';
  created_at: string;
  is_verified: boolean;
}

export interface Station {
  stasiun_id: number;
  kode_stasiun: string;
  nama_stasiun: string;
  kota: string;
  provinsi: string;
  koordinat_latitude?: number;
  koordinat_longitude?: number;
}

// Extended types for UI
export interface FacilityWithUnits extends StationFacility {
  units: FacilityUnit[];
  station?: Station;
}

export interface BookingFormData {
  facilityId: number;
  unitId?: number;
  serviceType: 'SHOWER_ONLY' | 'LOCKER_ONLY' | 'SHOWER_AND_LOCKER';
  duration: number; // in minutes
  startTime: string; // ISO string
  itemCount?: number;
  itemDescription?: string;
  estimatedWeight?: number;
  specialNotes?: string;
}

export interface BookingPricing {
  showerPrice: number;
  lockerPrice: number;
  adminFee: number;
  total: number;
}