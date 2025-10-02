import { Database } from "./supabase";

// ===== CORE TABLES =====

// Master Data Tables
export type Stasiun = Database["public"]["Tables"]["stasiun"]["Row"];
export type NewStasiun = Database["public"]["Tables"]["stasiun"]["Insert"];
export type UpdateStasiun = Database["public"]["Tables"]["stasiun"]["Update"];

export type Pengguna = Database["public"]["Tables"]["pengguna"]["Row"];
export type NewPengguna = Database["public"]["Tables"]["pengguna"]["Insert"];
export type UpdatePengguna = Database["public"]["Tables"]["pengguna"]["Update"];

export type MasterKereta = Database["public"]["Tables"]["master_kereta"]["Row"];
export type NewMasterKereta = Database["public"]["Tables"]["master_kereta"]["Insert"];
export type UpdateMasterKereta = Database["public"]["Tables"]["master_kereta"]["Update"];

export type MasterGerbong = Database["public"]["Tables"]["master_gerbong"]["Row"];
export type NewMasterGerbong = Database["public"]["Tables"]["master_gerbong"]["Insert"];
export type UpdateMasterGerbong = Database["public"]["Tables"]["master_gerbong"]["Update"];

export type TemplateKursi = Database["public"]["Tables"]["template_kursi"]["Row"];
export type NewTemplateKursi = Database["public"]["Tables"]["template_kursi"]["Insert"];
export type UpdateTemplateKursi = Database["public"]["Tables"]["template_kursi"]["Update"];

// Route Management Tables
export type Rute = Database["public"]["Tables"]["rute"]["Row"];
export type NewRute = Database["public"]["Tables"]["rute"]["Insert"];
export type UpdateRute = Database["public"]["Tables"]["rute"]["Update"];

export type PerhentianRute = Database["public"]["Tables"]["perhentian_rute"]["Row"];
export type NewPerhentianRute = Database["public"]["Tables"]["perhentian_rute"]["Insert"];
export type UpdatePerhentianRute = Database["public"]["Tables"]["perhentian_rute"]["Update"];

export type ConnectingRoutes = Database["public"]["Tables"]["connecting_routes"]["Row"];
export type NewConnectingRoutes = Database["public"]["Tables"]["connecting_routes"]["Insert"];
export type UpdateConnectingRoutes = Database["public"]["Tables"]["connecting_routes"]["Update"];

// ===== SCHEDULING SYSTEM =====

export type Jadwal = Database["public"]["Tables"]["jadwal"]["Row"];
export type NewJadwal = Database["public"]["Tables"]["jadwal"]["Insert"];
export type UpdateJadwal = Database["public"]["Tables"]["jadwal"]["Update"];

export type JadwalGerbong = Database["public"]["Tables"]["jadwal_gerbong"]["Row"];
export type NewJadwalGerbong = Database["public"]["Tables"]["jadwal_gerbong"]["Insert"];
export type UpdateJadwalGerbong = Database["public"]["Tables"]["jadwal_gerbong"]["Update"];

export type JadwalKursi = Database["public"]["Tables"]["jadwal_kursi"]["Row"];
export type NewJadwalKursi = Database["public"]["Tables"]["jadwal_kursi"]["Insert"];
export type UpdateJadwalKursi = Database["public"]["Tables"]["jadwal_kursi"]["Update"];

export type PerhentianJadwal = Database["public"]["Tables"]["perhentian_jadwal"]["Row"];
export type NewPerhentianJadwal = Database["public"]["Tables"]["perhentian_jadwal"]["Insert"];
export type UpdatePerhentianJadwal = Database["public"]["Tables"]["perhentian_jadwal"]["Update"];

export type Penumpang = Database["public"]["Tables"]["penumpang"]["Row"];
export type NewPenumpang = Database["public"]["Tables"]["penumpang"]["Insert"];
export type UpdatePenumpang = Database["public"]["Tables"]["penumpang"]["Update"];

export type Pemesanan = Database["public"]["Tables"]["pemesanan"]["Row"];
export type NewPemesanan = Database["public"]["Tables"]["pemesanan"]["Insert"];
export type UpdatePemesanan = Database["public"]["Tables"]["pemesanan"]["Update"];

export type PemesananSegment = Database["public"]["Tables"]["pemesanan_segment"]["Row"];
export type NewPemesananSegment = Database["public"]["Tables"]["pemesanan_segment"]["Insert"];
export type UpdatePemesananSegment = Database["public"]["Tables"]["pemesanan_segment"]["Update"];

export type Tiket = Database["public"]["Tables"]["tiket"]["Row"];
export type NewTiket = Database["public"]["Tables"]["tiket"]["Insert"];
export type UpdateTiket = Database["public"]["Tables"]["tiket"]["Update"];

export type PermintaanPerpindahanKursi = Database["public"]["Tables"]["permintaan_perpindahan_kursi"]["Row"];
export type NewPermintaanPerpindahanKursi = Database["public"]["Tables"]["permintaan_perpindahan_kursi"]["Insert"];
export type UpdatePermintaanPerpindahanKursi = Database["public"]["Tables"]["permintaan_perpindahan_kursi"]["Update"];

export type LogPerpindahanKursi = Database["public"]["Tables"]["log_perpindahan_kursi"]["Row"];
export type NewLogPerpindahanKursi = Database["public"]["Tables"]["log_perpindahan_kursi"]["Insert"];
export type UpdateLogPerpindahanKursi = Database["public"]["Tables"]["log_perpindahan_kursi"]["Update"];

export type Pembayaran = Database["public"]["Tables"]["pembayaran"]["Row"];
export type NewPembayaran = Database["public"]["Tables"]["pembayaran"]["Insert"];
export type UpdatePembayaran = Database["public"]["Tables"]["pembayaran"]["Update"];

export type PembatalanTiket = Database["public"]["Tables"]["pembatalan_tiket"]["Row"];
export type NewPembatalanTiket = Database["public"]["Tables"]["pembatalan_tiket"]["Insert"];
export type UpdatePembatalanTiket = Database["public"]["Tables"]["pembatalan_tiket"]["Update"];

export type MenuRailfood = Database["public"]["Tables"]["menu_railfood"]["Row"];
export type NewMenuRailfood = Database["public"]["Tables"]["menu_railfood"]["Insert"];
export type UpdateMenuRailfood = Database["public"]["Tables"]["menu_railfood"]["Update"];

export type MenuKetersediaan = Database["public"]["Tables"]["menu_ketersediaan"]["Row"];
export type NewMenuKetersediaan = Database["public"]["Tables"]["menu_ketersediaan"]["Insert"];
export type UpdateMenuKetersediaan = Database["public"]["Tables"]["menu_ketersediaan"]["Update"];

export type PesananRailfood = Database["public"]["Tables"]["pesanan_railfood"]["Row"];
export type NewPesananRailfood = Database["public"]["Tables"]["pesanan_railfood"]["Insert"];
export type UpdatePesananRailfood = Database["public"]["Tables"]["pesanan_railfood"]["Update"];

export type PesananRailfoodDetail = Database["public"]["Tables"]["pesanan_railfood_detail"]["Row"];
export type NewPesananRailfoodDetail = Database["public"]["Tables"]["pesanan_railfood_detail"]["Insert"];
export type UpdatePesananRailfoodDetail = Database["public"]["Tables"]["pesanan_railfood_detail"]["Update"];

export type ProgramLoyalitas = Database["public"]["Tables"]["program_loyalitas"]["Row"];
export type NewProgramLoyalitas = Database["public"]["Tables"]["program_loyalitas"]["Insert"];
export type UpdateProgramLoyalitas = Database["public"]["Tables"]["program_loyalitas"]["Update"];

export type AkunRailpoints = Database["public"]["Tables"]["akun_railpoints"]["Row"];
export type NewAkunRailpoints = Database["public"]["Tables"]["akun_railpoints"]["Insert"];
export type UpdateAkunRailpoints = Database["public"]["Tables"]["akun_railpoints"]["Update"];

export type TransaksiRailpoints = Database["public"]["Tables"]["transaksi_railpoints"]["Row"];
export type NewTransaksiRailpoints = Database["public"]["Tables"]["transaksi_railpoints"]["Insert"];
export type UpdateTransaksiRailpoints = Database["public"]["Tables"]["transaksi_railpoints"]["Update"];

export type TrainPerformanceMetrics = Database["public"]["Tables"]["train_performance_metrics"]["Row"];
export type NewTrainPerformanceMetrics = Database["public"]["Tables"]["train_performance_metrics"]["Insert"];
export type UpdateTrainPerformanceMetrics = Database["public"]["Tables"]["train_performance_metrics"]["Update"];

export type SeatUtilizationAnalytics = Database["public"]["Tables"]["seat_utilization_analytics"]["Row"];
export type NewSeatUtilizationAnalytics = Database["public"]["Tables"]["seat_utilization_analytics"]["Insert"];
export type UpdateSeatUtilizationAnalytics = Database["public"]["Tables"]["seat_utilization_analytics"]["Update"];

export type VMasterDataStatistics = Database["public"]["Views"]["v_master_data_statistics"]["Row"];

export type PosisiKursi = Database["public"]["Enums"]["posisi_kursi"];
export type StatusJadwalEnum = Database["public"]["Enums"]["status_jadwal_enum"];
export type StatusInventarisEnum = Database["public"]["Enums"]["status_inventaris_enum"];
export type TipeIdentitasEnum = Database["public"]["Enums"]["tipe_identitas_enum"];
export type StatusPemesananEnum = Database["public"]["Enums"]["status_pemesanan_enum"];
export type StatusTiketEnum = Database["public"]["Enums"]["status_tiket_enum"];
export type StatusPembayaranEnum = Database["public"]["Enums"]["status_pembayaran_enum"];
export type StatusRefundEnum = Database["public"]["Enums"]["status_refund_enum"];
export type TipeTransaksiPoinEnum = Database["public"]["Enums"]["tipe_transaksi_poin_enum"];
export type StatusPesananMakananEnum = Database["public"]["Enums"]["status_pesanan_makanan_enum"];
export type JenisKelaminEnum = Database["public"]["Enums"]["jenis_kelamin_enum"];
export type JenisLayananKeretaEnum = Database["public"]["Enums"]["jenis_layanan_kereta_enum"];
export type TipeGerbongEnum = Database["public"]["Enums"]["tipe_gerbong_enum"];
export type StatusPerpindahanKursiEnum = Database["public"]["Enums"]["status_perpindahan_kursi_enum"];
export type TipeKoneksiEnum = Database["public"]["Enums"]["tipe_koneksi_enum"];

// ===== UTILITY TYPES =====

// Combined types for relations
export type JadwalWithRelations = Jadwal & {
  master_kereta?: MasterKereta;
  rute?: Rute;
  jadwal_gerbong?: JadwalGerbong[];
  perhentian_jadwal?: PerhentianJadwal[];
};

export type PemesananWithRelations = Pemesanan & {
  pengguna?: Pengguna;
  pemesanan_segment?: PemesananSegment[];
  pembayaran?: Pembayaran[];
};

export type TiketWithRelations = Tiket & {
  penumpang?: Penumpang;
  jadwal_kursi?: JadwalKursi;
  pemesanan_segment?: PemesananSegment;
};

export type MasterKeretaWithRelations = MasterKereta & {
  master_gerbong?: MasterGerbong[];
};

export type MasterGerbongWithRelations = MasterGerbong & {
  master_kereta?: MasterKereta;
  template_kursi?: TemplateKursi[];
};

// Search and filter types
export type JadwalSearchFilters = {
  stasiun_asal?: string;
  stasiun_tujuan?: string;
  tanggal_keberangkatan?: string;
  jenis_layanan?: JenisLayananKeretaEnum;
  status_jadwal?: StatusJadwalEnum;
};

export type PemesananSearchFilters = {
  kode_pemesanan?: string;
  status_pemesanan?: StatusPemesananEnum;
  user_id?: number;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
};

export type TableRow<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
