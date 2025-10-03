-- DDL GEN 2: Enhanced Railway Reservation System with Advanced Features
-- Supports: Seat Transfer, Connecting Trains, Detailed Train Types, Enhanced User Management

-- Bagian 0: Enhanced ENUMs & Custom Types
CREATE TYPE posisi_kursi AS ENUM ('jendela', 'lorong', 'tengah');
CREATE TYPE status_jadwal_enum AS ENUM ('SESUAI_JADWAL', 'TERLAMBAT', 'DIBATALKAN', 'MENUNGGU_BOARDING');
CREATE TYPE status_inventaris_enum AS ENUM ('TERSEDIA', 'DIKUNCI', 'DIPESAN', 'TERISI');
CREATE TYPE tipe_identitas_enum AS ENUM ('KTP', 'PASPOR', 'SIM', 'KITAS', 'KITAP');
CREATE TYPE status_pemesanan_enum AS ENUM ('MENUNGGU_PEMBAYARAN', 'TERKONFIRMASI', 'DIBATALKAN', 'KADALUARSA', 'CHECK_IN');
CREATE TYPE status_tiket_enum AS ENUM ('AKTIF', 'DIBATALKAN', 'DIUBAH_JADWALNYA', 'BOARDING', 'COMPLETED');
CREATE TYPE status_pembayaran_enum AS ENUM ('MENUNGGU', 'BERHASIL', 'GAGAL', 'REFUND');
CREATE TYPE status_refund_enum AS ENUM ('MENUNGGU_PROSES', 'DIPROSES', 'SELESAI');
CREATE TYPE tipe_transaksi_poin_enum AS ENUM ('PEROLEHAN', 'PENUKARAN', 'PEMBATALAN', 'KADALUARSA');
CREATE TYPE status_pesanan_makanan_enum AS ENUM ('DIPESAN', 'DISAJIKAN', 'DIBATALKAN');
CREATE TYPE jenis_kelamin_enum AS ENUM ('LAKI_LAKI', 'PEREMPUAN');
CREATE TYPE jenis_layanan_kereta_enum AS ENUM ('EKSEKUTIF', 'EKONOMI', 'CAMPURAN', 'LUXURY', 'PRIORITY', 'IMPERIAL');
CREATE TYPE tipe_fasilitas_stasiun_enum AS ENUM ('SHOWER', 'LOCKER', 'SHOWER_LOCKER_COMBO');
CREATE TYPE status_unit_fasilitas_enum AS ENUM ('TERSEDIA', 'DIGUNAKAN', 'MAINTENANCE', 'RUSAK');
CREATE TYPE status_booking_fasilitas_enum AS ENUM ('MENUNGGU_PEMBAYARAN', 'DIBAYAR', 'SEDANG_DIGUNAKAN', 'SELESAI', 'DIBATALKAN', 'EXPIRED');
CREATE TYPE priority_notifikasi_enum AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE tipe_gerbong_enum AS ENUM (
    'EKSEKUTIF_MILD_STEEL_SATWA', 'EKSEKUTIF_MILD_STEEL_NEW_IMAGE_K1_16', 
    'EKSEKUTIF_STAINLESS_STEEL_K1_18', 'EKSEKUTIF_NEW_GENERATION_2024',
    'EKONOMI_PSO_160TD', 'EKONOMI_KEMENHUB', 'EKONOMI_REHAB', 
    'EKONOMI_MILD_STEEL_NEW_IMAGE_2016', 'EKONOMI_PREMIUM_MILDSTEEL_2017',
    'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', 'EKONOMI_MODIFIKASI_NEW_GENERATION_BY_MRI',
    'EKONOMI_NEW_GENERATION_2024', 'PRIORITY', 'IMPERIAL', 'PANORAMIC',
    'LUXURY_GEN_1', 'LUXURY_GEN_2', 'LUXURY_GEN_3', 'COMPARTEMEN_SUITES',
    'KERETA_MAKAN_M1', 'KERETA_MAKAN_M3', 'KERETA_PEMBANGKIT', 'KERETA_BAGASI'
);
CREATE TYPE status_perpindahan_kursi_enum AS ENUM ('MENUNGGU_PERSETUJUAN', 'DISETUJUI', 'DITOLAK', 'DIBATALKAN');
CREATE TYPE tipe_koneksi_enum AS ENUM ('LANGSUNG', 'TRANSIT', 'CONNECTING');

-- Bagian I: Enhanced Master Data

-- Enhanced Stasiun dengan informasi lebih detail
CREATE TABLE stasiun (
    stasiun_id BIGSERIAL PRIMARY KEY,
    kode_stasiun VARCHAR(10) NOT NULL UNIQUE,
    nama_stasiun VARCHAR(150) NOT NULL,
    kota VARCHAR(100) NOT NULL,
    kabupaten VARCHAR(100),
    provinsi VARCHAR(100) NOT NULL,
    koordinat_latitude DECIMAL(10, 8),
    koordinat_longitude DECIMAL(11, 8),
    elevasi_meter INT,
    zona_waktu VARCHAR(10) DEFAULT 'WIB',
    fasilitas JSONB, -- {"wifi": true, "restaurant": true, "atm": true, "parking": true}
    status_aktif BOOLEAN DEFAULT true,
    waktu_dibuat TIMESTAMPTZ DEFAULT now(),
    waktu_diperbarui TIMESTAMPTZ DEFAULT now()
);

-- Enhanced User Management
CREATE TABLE pengguna (
    user_id BIGSERIAL PRIMARY KEY,
    nik VARCHAR(20) UNIQUE, -- bisa null untuk user tanpa NIK
    tipe_identitas tipe_identitas_enum NOT NULL DEFAULT 'KTP',
    nomor_identitas VARCHAR(50) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    tanggal_lahir DATE,
    jenis_kelamin jenis_kelamin_enum,
    email VARCHAR(255) UNIQUE,
    nomor_telepon VARCHAR(20),
    password_hash VARCHAR(255),
    provinsi VARCHAR(100),
    kota_kabupaten VARCHAR(100),
    alamat_lengkap TEXT,
    hobi TEXT[],
    pekerjaan VARCHAR(100),
    saldo_kaipay NUMERIC(12, 2) DEFAULT 0.00,
    poin_loyalitas INT DEFAULT 0,
    foto_profil_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    waktu_registrasi TIMESTAMPTZ DEFAULT now(),
    waktu_login_terakhir TIMESTAMPTZ,
    UNIQUE (tipe_identitas, nomor_identitas)
);

-- Enhanced Train Master Data with Detailed Types
CREATE TABLE master_kereta (
    master_kereta_id BIGSERIAL PRIMARY KEY,
    kode_kereta VARCHAR(20) NOT NULL UNIQUE, -- KA001, KA002, etc
    nama_kereta VARCHAR(150) NOT NULL, -- Argo Parahyangan, Taksaka, etc
    jenis_layanan jenis_layanan_kereta_enum NOT NULL,
    nomor_seri_rangkaian VARCHAR(50), -- K10-AC, etc
    kapasitas_total INT NOT NULL,
    jumlah_gerbong INT NOT NULL,
    tahun_pembuatan INT,
    pabrik_pembuat VARCHAR(100),
    kecepatan_maksimal_kmh INT,
    fasilitas_umum JSONB, -- {"ac": true, "wifi": true, "power_outlet": true}
    status_operasional BOOLEAN DEFAULT true,
    keterangan TEXT,
    waktu_dibuat TIMESTAMPTZ DEFAULT now(),
    waktu_diperbarui TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Gerbong dengan tipe yang lebih detail
CREATE TABLE master_gerbong (
    master_gerbong_id BIGSERIAL PRIMARY KEY,
    master_kereta_id BIGINT NOT NULL REFERENCES master_kereta(master_kereta_id),
    nomor_gerbong INT NOT NULL,
    tipe_gerbong tipe_gerbong_enum NOT NULL,
    layout_kursi VARCHAR(20), -- '2-2', '3-2', '1-1', 'sleeper', etc
    kapasitas_kursi INT NOT NULL,
    fasilitas_gerbong JSONB, -- {"toilet": true, "ac": true, "charging_port": true}
    panjang_meter DECIMAL(5,2),
    lebar_meter DECIMAL(5,2),
    berat_ton DECIMAL(6,2),
    status_aktif BOOLEAN DEFAULT true,
    UNIQUE (master_kereta_id, nomor_gerbong)
);

-- Template Kursi untuk setiap master gerbong
CREATE TABLE template_kursi (
    template_kursi_id BIGSERIAL PRIMARY KEY,
    master_gerbong_id BIGINT NOT NULL REFERENCES master_gerbong(master_gerbong_id),
    kode_kursi VARCHAR(10) NOT NULL, -- A1, A2, B1, etc
    posisi posisi_kursi NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    is_difabel BOOLEAN DEFAULT false,
    koordinat_x INT, -- posisi dalam gerbong
    koordinat_y INT,
    fasilitas_kursi JSONB, -- {"recliner": true, "leg_rest": true, "personal_light": true}
    UNIQUE (master_gerbong_id, kode_kursi)
);

-- Enhanced Rute dengan support connecting trains
CREATE TABLE rute (
    rute_id BIGSERIAL PRIMARY KEY,
    kode_rute VARCHAR(30) NOT NULL UNIQUE,
    nama_rute VARCHAR(300) NOT NULL,
    tipe_koneksi tipe_koneksi_enum DEFAULT 'LANGSUNG',
    jarak_total_km DECIMAL(8,2),
    estimasi_waktu_tempuh INTERVAL,
    tarif_dasar NUMERIC(10,2),
    is_aktif BOOLEAN DEFAULT true,
    keterangan TEXT,
    waktu_dibuat TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Perhentian Rute
CREATE TABLE perhentian_rute (
    perhentian_rute_id BIGSERIAL PRIMARY KEY,
    rute_id BIGINT NOT NULL REFERENCES rute(rute_id),
    stasiun_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    urutan INT NOT NULL,
    jarak_dari_origin_km DECIMAL(8,2),
    estimasi_waktu_tempuh INTERVAL, -- dari perhentian sebelumnya
    durasi_berhenti INTERVAL DEFAULT '2 minutes',
    is_comercial_stop BOOLEAN DEFAULT true, -- apakah bisa naik/turun penumpang
    platform_info VARCHAR(50),
    UNIQUE (rute_id, urutan),
    UNIQUE (rute_id, stasiun_id)
);

-- Connecting Routes untuk multi-segment journey
CREATE TABLE connecting_routes (
    connecting_id BIGSERIAL PRIMARY KEY,
    rute_utama_id BIGINT NOT NULL REFERENCES rute(rute_id),
    rute_lanjutan_id BIGINT NOT NULL REFERENCES rute(rute_id),
    stasiun_transit_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    min_transit_time INTERVAL DEFAULT '30 minutes',
    max_transit_time INTERVAL DEFAULT '4 hours',
    is_guaranteed_connection BOOLEAN DEFAULT false,
    tarif_connecting NUMERIC(10,2) DEFAULT 0.00,
    UNIQUE (rute_utama_id, rute_lanjutan_id)
);

-- Bagian II: Enhanced Scheduling System

-- Enhanced Jadwal dengan instansiasi dari master kereta
CREATE TABLE jadwal (
    jadwal_id BIGSERIAL PRIMARY KEY,
    kode_jadwal VARCHAR(20) NOT NULL UNIQUE, -- Auto-generate: JDW-20251001-001
    master_kereta_id BIGINT NOT NULL REFERENCES master_kereta(master_kereta_id),
    rute_id BIGINT NOT NULL REFERENCES rute(rute_id),
    nomor_ka VARCHAR(20) NOT NULL, -- KA 7016, KA 205, etc
    tanggal_keberangkatan DATE NOT NULL,
    waktu_berangkat_origin TIMESTAMPTZ NOT NULL,
    waktu_tiba_destination TIMESTAMPTZ NOT NULL,
    status_jadwal status_jadwal_enum DEFAULT 'SESUAI_JADWAL',
    harga_base NUMERIC(10,2) NOT NULL,
    multiplier_harga DECIMAL(3,2) DEFAULT 1.00, -- untuk peak season, weekend, etc
    keterangan TEXT,
    created_by BIGINT REFERENCES pengguna(user_id),
    waktu_dibuat TIMESTAMPTZ DEFAULT now(),
    waktu_diperbarui TIMESTAMPTZ DEFAULT now(),
    UNIQUE (master_kereta_id, tanggal_keberangkatan, waktu_berangkat_origin)
);

-- Instansiasi Gerbong untuk jadwal spesifik
CREATE TABLE jadwal_gerbong (
    jadwal_gerbong_id BIGSERIAL PRIMARY KEY,
    jadwal_id BIGINT NOT NULL REFERENCES jadwal(jadwal_id),
    master_gerbong_id BIGINT NOT NULL REFERENCES master_gerbong(master_gerbong_id),
    nomor_gerbong_aktual INT NOT NULL, -- bisa berbeda dari master jika ada penggantian
    status_operasional BOOLEAN DEFAULT true,
    keterangan TEXT,
    UNIQUE (jadwal_id, nomor_gerbong_aktual)
);

-- Instansiasi Kursi untuk jadwal spesifik (auto-generated dari template)
CREATE TABLE jadwal_kursi (
    jadwal_kursi_id BIGSERIAL PRIMARY KEY,
    jadwal_gerbong_id BIGINT NOT NULL REFERENCES jadwal_gerbong(jadwal_gerbong_id),
    template_kursi_id BIGINT NOT NULL REFERENCES template_kursi(template_kursi_id),
    kode_kursi VARCHAR(10) NOT NULL,
    status_inventaris status_inventaris_enum DEFAULT 'TERSEDIA',
    harga_kursi NUMERIC(10,2) NOT NULL,
    multiplier_kursi DECIMAL(3,2) DEFAULT 1.00, -- untuk premium seat, etc
    is_blocked BOOLEAN DEFAULT false, -- untuk maintenance atau reserved
    keterangan TEXT,
    UNIQUE (jadwal_gerbong_id, kode_kursi)
);

-- Enhanced Perhentian Jadwal
CREATE TABLE perhentian_jadwal (
    perhentian_jadwal_id BIGSERIAL PRIMARY KEY,
    jadwal_id BIGINT NOT NULL REFERENCES jadwal(jadwal_id),
    stasiun_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    urutan INT NOT NULL,
    waktu_kedatangan_estimasi TIMESTAMPTZ,
    waktu_keberangkatan_estimasi TIMESTAMPTZ NOT NULL,
    waktu_kedatangan_aktual TIMESTAMPTZ,
    waktu_keberangkatan_aktual TIMESTAMPTZ,
    platform VARCHAR(10),
    delay_menit INT DEFAULT 0,
    keterangan TEXT,
    UNIQUE (jadwal_id, urutan),
    UNIQUE (jadwal_id, stasiun_id)
);

-- Bagian III: Enhanced Booking & Ticketing System

-- Enhanced Penumpang
CREATE TABLE penumpang (
    penumpang_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES pengguna(user_id), -- nullable untuk guest booking
    nama_lengkap VARCHAR(255) NOT NULL,
    tipe_identitas tipe_identitas_enum NOT NULL,
    nomor_identitas VARCHAR(50) NOT NULL,
    tanggal_lahir DATE,
    jenis_kelamin jenis_kelamin_enum,
    kewarganegaraan VARCHAR(50) DEFAULT 'Indonesia',
    is_difabel BOOLEAN DEFAULT false,
    kebutuhan_khusus TEXT,
    UNIQUE (tipe_identitas, nomor_identitas)
);

-- Enhanced Pemesanan dengan connecting support
CREATE TABLE pemesanan (
    pemesanan_id BIGSERIAL PRIMARY KEY,
    kode_pemesanan VARCHAR(12) NOT NULL UNIQUE, -- PNR style: ABC123DEF
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    is_connecting_journey BOOLEAN DEFAULT false,
    total_segment INT DEFAULT 1,
    status_pemesanan status_pemesanan_enum DEFAULT 'MENUNGGU_PEMBAYARAN',
    total_bayar NUMERIC(12, 2) NOT NULL,
    biaya_admin NUMERIC(10, 2) DEFAULT 0.00,
    biaya_asuransi NUMERIC(10, 2) DEFAULT 0.00,
    contact_person_nama VARCHAR(255),
    contact_person_phone VARCHAR(20),
    contact_person_email VARCHAR(255),
    waktu_pembuatan TIMESTAMPTZ DEFAULT now(),
    batas_waktu_pembayaran TIMESTAMPTZ,
    waktu_check_in TIMESTAMPTZ,
    keterangan TEXT
);

-- Segment untuk connecting journey
CREATE TABLE pemesanan_segment (
    segment_id BIGSERIAL PRIMARY KEY,
    pemesanan_id BIGINT NOT NULL REFERENCES pemesanan(pemesanan_id),
    urutan_segment INT NOT NULL,
    jadwal_id BIGINT NOT NULL REFERENCES jadwal(jadwal_id),
    stasiun_asal_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    stasiun_tujuan_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    waktu_berangkat TIMESTAMPTZ NOT NULL,
    waktu_tiba TIMESTAMPTZ NOT NULL,
    harga_segment NUMERIC(10, 2) NOT NULL,
    UNIQUE (pemesanan_id, urutan_segment)
);

-- Enhanced Tiket untuk setiap penumpang di setiap segment
CREATE TABLE tiket (
    tiket_id BIGSERIAL PRIMARY KEY,
    segment_id BIGINT NOT NULL REFERENCES pemesanan_segment(segment_id),
    penumpang_id BIGINT NOT NULL REFERENCES penumpang(penumpang_id),
    jadwal_kursi_id BIGINT NOT NULL REFERENCES jadwal_kursi(jadwal_kursi_id),
    kode_tiket VARCHAR(20) NOT NULL UNIQUE, -- Boarding pass code
    harga_tiket NUMERIC(10, 2) NOT NULL,
    status_tiket status_tiket_enum DEFAULT 'AKTIF',
    waktu_check_in TIMESTAMPTZ,
    waktu_boarding TIMESTAMPTZ,
    gate_boarding VARCHAR(10),
    keterangan TEXT
);

-- Bagian IV: Advanced Features - Seat Transfer System

-- Sistem Perpindahan Kursi (Real-time & Pre-journey)
CREATE TABLE permintaan_perpindahan_kursi (
    perpindahan_id BIGSERIAL PRIMARY KEY,
    tiket_asal_id BIGINT NOT NULL REFERENCES tiket(tiket_id),
    tiket_tujuan_id BIGINT REFERENCES tiket(tiket_id), -- nullable saat pertama dibuat
    jadwal_kursi_tujuan_id BIGINT NOT NULL REFERENCES jadwal_kursi(jadwal_kursi_id),
    pemohon_user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    target_user_id BIGINT REFERENCES pengguna(user_id), -- untuk seat swap
    tipe_perpindahan VARCHAR(20) NOT NULL, -- 'UPGRADE', 'DOWNGRADE', 'SWAP', 'MOVE'
    alasan TEXT,
    biaya_perpindahan NUMERIC(10, 2) DEFAULT 0.00,
    status_perpindahan status_perpindahan_kursi_enum DEFAULT 'MENUNGGU_PERSETUJUAN',
    waktu_permintaan TIMESTAMPTZ DEFAULT now(),
    waktu_diproses TIMESTAMPTZ,
    diproses_oleh BIGINT REFERENCES pengguna(user_id),
    keterangan_admin TEXT
);

-- Log Perpindahan Kursi untuk audit trail
CREATE TABLE log_perpindahan_kursi (
    log_id BIGSERIAL PRIMARY KEY,
    perpindahan_id BIGINT NOT NULL REFERENCES permintaan_perpindahan_kursi(perpindahan_id),
    tiket_id BIGINT NOT NULL REFERENCES tiket(tiket_id),
    kursi_lama_id BIGINT NOT NULL REFERENCES jadwal_kursi(jadwal_kursi_id),
    kursi_baru_id BIGINT NOT NULL REFERENCES jadwal_kursi(jadwal_kursi_id),
    waktu_perpindahan TIMESTAMPTZ DEFAULT now(),
    lokasi_perpindahan VARCHAR(100), -- 'SEBELUM_BOARDING', 'DI_KERETA', 'DI_STASIUN_X'
    petugas_yang_membantu VARCHAR(255),
    keterangan TEXT
);

-- Bagian V: Enhanced Payment & Financial System

CREATE TABLE pembayaran (
    pembayaran_id BIGSERIAL PRIMARY KEY,
    pemesanan_id BIGINT NOT NULL REFERENCES pemesanan(pemesanan_id),
    metode_pembayaran VARCHAR(50) NOT NULL,
    provider_pembayaran VARCHAR(100), -- 'MIDTRANS', 'GOPAY', 'OVO', etc
    jumlah NUMERIC(12, 2) NOT NULL,
    biaya_admin NUMERIC(10, 2) DEFAULT 0.00,
    status_pembayaran status_pembayaran_enum DEFAULT 'MENUNGGU',
    id_transaksi_eksternal VARCHAR(255),
    reference_number VARCHAR(100),
    respon_gateway JSONB,
    waktu_pembayaran TIMESTAMPTZ,
    waktu_expire TIMESTAMPTZ,
    virtual_account VARCHAR(50),
    qr_code_url VARCHAR(500),
    keterangan TEXT
);

-- Enhanced Cancellation dengan partial cancellation support
CREATE TABLE pembatalan_tiket (
    pembatalan_id BIGSERIAL PRIMARY KEY,
    tiket_id BIGINT NOT NULL REFERENCES tiket(tiket_id),
    pemohon_user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    alasan_pembatalan TEXT NOT NULL,
    kategori_pembatalan VARCHAR(50), -- 'VOLUNTARY', 'INVOLUNTARY', 'FORCE_MAJEURE'
    biaya_pembatalan NUMERIC(10, 2) NOT NULL,
    jumlah_refund NUMERIC(10, 2) NOT NULL,
    status_refund status_refund_enum DEFAULT 'MENUNGGU_PROSES',
    waktu_pengajuan TIMESTAMPTZ DEFAULT now(),
    waktu_diproses TIMESTAMPTZ,
    diproses_oleh BIGINT REFERENCES pengguna(user_id),
    keterangan_admin TEXT
);

-- Bagian VI: Enhanced Additional Services

-- Enhanced RailFood dengan menu per segment
CREATE TABLE menu_railfood (
    menu_id BIGSERIAL PRIMARY KEY,
    nama_menu VARCHAR(150) NOT NULL,
    kategori VARCHAR(50), -- 'MAKANAN_UTAMA', 'SNACK', 'MINUMAN', 'DESSERT'
    deskripsi TEXT,
    harga NUMERIC(10, 2) NOT NULL,
    gambar_url VARCHAR(500),
    kalori INT,
    ingredients TEXT[],
    allergens TEXT[],
    is_halal BOOLEAN DEFAULT true,
    is_vegetarian BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    estimasi_persiapan_menit INT DEFAULT 15
);

-- Menu availability per route/train
CREATE TABLE menu_ketersediaan (
    ketersediaan_id BIGSERIAL PRIMARY KEY,
    menu_id BIGINT NOT NULL REFERENCES menu_railfood(menu_id),
    jadwal_id BIGINT REFERENCES jadwal(jadwal_id), -- untuk menu khusus jadwal tertentu
    rute_id BIGINT REFERENCES rute(rute_id), -- untuk menu khusus rute tertentu
    stok_tersedia INT DEFAULT 999,
    waktu_tersedia_mulai TIME,
    waktu_tersedia_selesai TIME,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE pesanan_railfood (
    pesanan_railfood_id BIGSERIAL PRIMARY KEY,
    tiket_id BIGINT NOT NULL REFERENCES tiket(tiket_id),
    total_harga NUMERIC(10, 2) NOT NULL,
    waktu_pesanan TIMESTAMPTZ DEFAULT now(),
    waktu_diinginkan_delivery TIME, -- jam berapa mau diantar
    stasiun_delivery_id BIGINT REFERENCES stasiun(stasiun_id), -- antar di stasiun mana
    catatan_khusus TEXT,
    status_pesanan status_pesanan_makanan_enum DEFAULT 'DIPESAN',
    waktu_disiapkan TIMESTAMPTZ,
    waktu_diantarkan TIMESTAMPTZ,
    rating_makanan INT CHECK (rating_makanan >= 1 AND rating_makanan <= 5),
    review_makanan TEXT
);

CREATE TABLE pesanan_railfood_detail (
    detail_id BIGSERIAL PRIMARY KEY,
    pesanan_railfood_id BIGINT NOT NULL REFERENCES pesanan_railfood(pesanan_railfood_id),
    menu_id BIGINT NOT NULL REFERENCES menu_railfood(menu_id),
    jumlah INT NOT NULL DEFAULT 1,
    harga_satuan NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    catatan_item TEXT
);

-- Bagian VII: Enhanced Loyalty & Points System

CREATE TABLE program_loyalitas (
    program_id BIGSERIAL PRIMARY KEY,
    nama_program VARCHAR(100) NOT NULL,
    tier_level VARCHAR(20) NOT NULL, -- 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM'
    min_poin_required INT NOT NULL,
    max_poin_limit INT,
    multiplier_earning DECIMAL(3,2) DEFAULT 1.00,
    benefits JSONB, -- {"priority_booking": true, "lounge_access": true, "upgrade_discount": 0.5}
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE akun_railpoints (
    akun_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES pengguna(user_id),
    program_id BIGINT NOT NULL REFERENCES program_loyalitas(program_id),
    saldo_poin INT DEFAULT 0,
    tier_saat_ini VARCHAR(20) DEFAULT 'BRONZE',
    poin_untuk_tier_berikutnya INT,
    total_poin_earned_lifetime INT DEFAULT 0,
    tanggal_join TIMESTAMPTZ DEFAULT now(),
    tanggal_tier_upgrade TIMESTAMPTZ
);

CREATE TABLE transaksi_railpoints (
    transaksi_poin_id BIGSERIAL PRIMARY KEY,
    akun_id BIGINT NOT NULL REFERENCES akun_railpoints(akun_id),
    pemesanan_id BIGINT REFERENCES pemesanan(pemesanan_id),
    tipe_transaksi tipe_transaksi_poin_enum NOT NULL,
    poin_debit INT DEFAULT 0,
    poin_kredit INT DEFAULT 0,
    deskripsi TEXT NOT NULL,
    referensi VARCHAR(100),
    waktu_transaksi TIMESTAMPTZ DEFAULT now(),
    tanggal_kadaluwarsa DATE,
    is_expired BOOLEAN DEFAULT false
);

-- Bagian VIII: Analytics & Reporting Tables

CREATE TABLE train_performance_metrics (
    metric_id BIGSERIAL PRIMARY KEY,
    jadwal_id BIGINT NOT NULL REFERENCES jadwal(jadwal_id),
    on_time_departure BOOLEAN,
    on_time_arrival BOOLEAN,
    total_delay_minutes INT DEFAULT 0,
    occupancy_rate DECIMAL(5,2), -- percentage
    revenue_per_km NUMERIC(10,2),
    customer_satisfaction_score DECIMAL(3,2),
    tanggal_laporan DATE DEFAULT CURRENT_DATE
);

CREATE TABLE seat_utilization_analytics (
    analytics_id BIGSERIAL PRIMARY KEY,
    jadwal_id BIGINT NOT NULL REFERENCES jadwal(jadwal_id),
    master_gerbong_id BIGINT NOT NULL REFERENCES master_gerbong(master_gerbong_id),
    total_seats INT NOT NULL,
    seats_sold INT DEFAULT 0,
    seats_available INT DEFAULT 0,
    seats_blocked INT DEFAULT 0,
    occupancy_percentage DECIMAL(5,2),
    revenue_generated NUMERIC(12,2),
    tanggal_snapshot DATE DEFAULT CURRENT_DATE,
    waktu_snapshot TIMESTAMPTZ DEFAULT now()
);

-- Bagian IX: Enhanced Indexes for Performance

-- Core indexes
CREATE INDEX idx_jadwal_tanggal_keberangkatan ON jadwal (tanggal_keberangkatan);
CREATE INDEX idx_jadwal_rute ON jadwal (rute_id);
CREATE INDEX idx_jadwal_master_kereta ON jadwal (master_kereta_id);
CREATE INDEX idx_jadwal_status ON jadwal (status_jadwal);

-- Booking related indexes
CREATE INDEX idx_pemesanan_user ON pemesanan (user_id);
CREATE INDEX idx_pemesanan_status ON pemesanan (status_pemesanan);
CREATE INDEX idx_pemesanan_waktu ON pemesanan (waktu_pembuatan);
CREATE INDEX idx_tiket_segment ON tiket (segment_id);
CREATE INDEX idx_tiket_penumpang ON tiket (penumpang_id);
CREATE INDEX idx_tiket_jadwal_kursi ON tiket (jadwal_kursi_id);

-- Seat management indexes
CREATE INDEX idx_jadwal_kursi_status ON jadwal_kursi (status_inventaris);
CREATE INDEX idx_jadwal_kursi_gerbong ON jadwal_kursi (jadwal_gerbong_id);
CREATE INDEX idx_perpindahan_kursi_status ON permintaan_perpindahan_kursi (status_perpindahan);
CREATE INDEX idx_perpindahan_kursi_pemohon ON permintaan_perpindahan_kursi (pemohon_user_id);

-- Search and filtering indexes
CREATE INDEX idx_stasiun_kode ON stasiun (kode_stasiun);
CREATE INDEX idx_stasiun_kota ON stasiun (kota);
CREATE INDEX idx_stasiun_provinsi ON stasiun (provinsi);
CREATE INDEX idx_pengguna_email ON pengguna (email);
CREATE INDEX idx_pengguna_nik ON pengguna (nik);
CREATE INDEX idx_penumpang_identitas ON penumpang (tipe_identitas, nomor_identitas);

-- Performance indexes for analytics
CREATE INDEX idx_train_metrics_jadwal ON train_performance_metrics (jadwal_id);
CREATE INDEX idx_seat_analytics_jadwal ON seat_utilization_analytics (jadwal_id);
CREATE INDEX idx_seat_analytics_tanggal ON seat_utilization_analytics (tanggal_snapshot);

-- Composite indexes for common queries
CREATE INDEX idx_perhentian_jadwal_composite ON perhentian_jadwal (jadwal_id, urutan);
CREATE INDEX idx_jadwal_kursi_composite ON jadwal_kursi (jadwal_gerbong_id, status_inventaris);
CREATE INDEX idx_pemesanan_composite ON pemesanan (user_id, status_pemesanan, waktu_pembuatan);

-- Bagian X: Auto-generated Functions and Triggers

-- Function untuk auto-generate seat dari template saat jadwal dibuat
CREATE OR REPLACE FUNCTION generate_jadwal_kursi_from_template()
RETURNS TRIGGER AS $$
DECLARE
    template_rec RECORD;
    harga_base NUMERIC(10,2);
BEGIN
    -- Ambil harga base dari jadwal
    SELECT j.harga_base INTO harga_base 
    FROM jadwal j 
    WHERE j.jadwal_id = (
        SELECT jg.jadwal_id FROM jadwal_gerbong jg 
        WHERE jg.jadwal_gerbong_id = NEW.jadwal_gerbong_id
    );

    -- Generate kursi dari template
    FOR template_rec IN 
        SELECT * FROM template_kursi tk 
        WHERE tk.master_gerbong_id = NEW.master_gerbong_id
    LOOP
        INSERT INTO jadwal_kursi (
            jadwal_gerbong_id, 
            template_kursi_id, 
            kode_kursi, 
            harga_kursi,
            multiplier_kursi
        ) VALUES (
            NEW.jadwal_gerbong_id,
            template_rec.template_kursi_id,
            template_rec.kode_kursi,
            harga_base * (CASE WHEN template_rec.is_premium THEN 1.5 ELSE 1.0 END),
            CASE WHEN template_rec.is_premium THEN 1.5 ELSE 1.0 END
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-generate kursi
CREATE TRIGGER trigger_generate_jadwal_kursi
    AFTER INSERT ON jadwal_gerbong
    FOR EACH ROW
    EXECUTE FUNCTION generate_jadwal_kursi_from_template();

-- Function untuk update seat status setelah booking
CREATE OR REPLACE FUNCTION update_seat_status_after_booking()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status kursi menjadi TERISI
    UPDATE jadwal_kursi 
    SET status_inventaris = 'TERISI'
    WHERE jadwal_kursi_id = NEW.jadwal_kursi_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk update status kursi
CREATE TRIGGER trigger_update_seat_status
    AFTER INSERT ON tiket
    FOR EACH ROW
    EXECUTE FUNCTION update_seat_status_after_booking();

-- Comments untuk dokumentasi
COMMENT ON TABLE master_kereta IS 'Master data kereta dengan informasi lengkap tentang spesifikasi kereta';
COMMENT ON TABLE master_gerbong IS 'Template gerbong dengan tipe-tipe gerbong yang sangat detail sesuai spesifikasi PT KAI';
COMMENT ON TABLE template_kursi IS 'Template kursi yang akan digunakan untuk generate kursi aktual pada setiap jadwal';
COMMENT ON TABLE jadwal_kursi IS 'Instansiasi kursi yang dapat dijual pada jadwal tertentu';
COMMENT ON TABLE permintaan_perpindahan_kursi IS 'Sistem perpindahan kursi real-time baik sebelum maupun sesudah boarding';
COMMENT ON TABLE connecting_routes IS 'Mendukung perjalanan multi-segment dengan connecting trains';
COMMENT ON TABLE pemesanan_segment IS 'Setiap segment dalam perjalanan connecting';
COMMENT ON COLUMN pengguna.hobi IS 'Array hobi pengguna untuk personalisasi layanan';
COMMENT ON COLUMN master_gerbong.tipe_gerbong IS 'Tipe gerbong sesuai 22 jenis yang diminta mulai dari Eksekutif Mild Steel Satwa hingga Kereta Bagasi';

-- ========================================
-- BAGIAN XI: STATION FACILITIES SYSTEM
-- ========================================

-- Master Fasilitas Stasiun (Shower & Locker)
CREATE TABLE station_facilities (
    facility_id BIGSERIAL PRIMARY KEY,
    kode_fasilitas VARCHAR(20) NOT NULL UNIQUE,
    nama_fasilitas VARCHAR(150) NOT NULL,
    stasiun_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    tipe_fasilitas tipe_fasilitas_stasiun_enum NOT NULL,
    lokasi_dalam_stasiun VARCHAR(100),
    kapasitas_total INT NOT NULL,
    rating_rata DECIMAL(3,1) DEFAULT 0.0,
    jumlah_review INT DEFAULT 0,
    gambar_utama_url VARCHAR(500),
    deskripsi TEXT,
    jam_operasional JSONB, -- {"open": "05:00", "close": "23:00"}
    is_tersedia BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unit Fasilitas Individual
CREATE TABLE facility_units (
    unit_id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT NOT NULL REFERENCES station_facilities(facility_id),
    nomor_unit VARCHAR(10) NOT NULL,
    tipe_unit VARCHAR(50) NOT NULL, -- 'SHOWER_STANDARD', 'SHOWER_PREMIUM', 'LOCKER_SMALL', 'LOCKER_LARGE'
    kapasitas_barang INT DEFAULT 0, -- untuk locker (dalam liter/kg)
    fasilitas_unit JSONB, -- {"handuk": true, "sabun": true, "pengering": true, "kunci_digital": true}
    harga_per_jam NUMERIC(10,2) NOT NULL,
    status_unit status_unit_fasilitas_enum DEFAULT 'TERSEDIA',
    terakhir_dibersihkan TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (facility_id, nomor_unit)
);

-- Booking Shower/Locker
CREATE TABLE facility_bookings (
    booking_id BIGSERIAL PRIMARY KEY,
    kode_booking VARCHAR(12) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    facility_id BIGINT NOT NULL REFERENCES station_facilities(facility_id),
    unit_id BIGINT REFERENCES facility_units(unit_id),
    tiket_id BIGINT REFERENCES tiket(tiket_id),
    
    -- Detail Booking
    tipe_layanan VARCHAR(50) NOT NULL, -- 'SHOWER_ONLY', 'LOCKER_ONLY', 'SHOWER_AND_LOCKER'
    durasi_penggunaan_menit INT NOT NULL,
    waktu_mulai_booking TIMESTAMPTZ NOT NULL,
    waktu_selesai_booking TIMESTAMPTZ NOT NULL,
    
    -- Detail Locker (jika ada)
    jumlah_barang INT DEFAULT 0,
    deskripsi_barang TEXT,
    estimasi_berat_kg DECIMAL(5,2),
    
    -- Pembayaran
    harga_shower NUMERIC(10,2) DEFAULT 0.00,
    harga_locker NUMERIC(10,2) DEFAULT 0.00,
    biaya_admin NUMERIC(10,2) DEFAULT 0.00,
    total_bayar NUMERIC(10,2) NOT NULL,
    metode_pembayaran VARCHAR(50),
    
    -- Status
    status_booking status_booking_fasilitas_enum DEFAULT 'MENUNGGU_PEMBAYARAN',
    kode_akses VARCHAR(10), -- untuk buka locker/shower
    waktu_checkin TIMESTAMPTZ,
    waktu_checkout TIMESTAMPTZ,
    catatan_khusus TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Log Penggunaan Real-time
CREATE TABLE facility_usage_logs (
    log_id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES facility_bookings(booking_id),
    unit_id BIGINT NOT NULL REFERENCES facility_units(unit_id),
    status_penggunaan VARCHAR(30) NOT NULL, -- 'MULAI_SHOWER', 'SELESAI_SHOWER', 'BARANG_MASUK_LOCKER', 'BARANG_KELUAR_LOCKER'
    waktu_log TIMESTAMPTZ DEFAULT now(),
    durasi_aktual_menit INT,
    catatan TEXT,
    foto_kondisi_url VARCHAR(500)
);

-- Review Fasilitas
CREATE TABLE facility_reviews (
    review_id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT NOT NULL REFERENCES station_facilities(facility_id),
    booking_id BIGINT NOT NULL REFERENCES facility_bookings(booking_id),
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    
    -- Rating per aspek
    rating_kebersihan INT CHECK (rating_kebersihan >= 1 AND rating_kebersihan <= 5),
    rating_kelengkapan INT CHECK (rating_kelengkapan >= 1 AND rating_kelengkapan <= 5),
    rating_kenyamanan INT CHECK (rating_kenyamanan >= 1 AND rating_kenyamanan <= 5),
    rating_keamanan INT CHECK (rating_keamanan >= 1 AND rating_keamanan <= 5),
    rating_overall INT CHECK (rating_overall >= 1 AND rating_overall <= 5),
    
    review_text TEXT,
    foto_review_urls TEXT[],
    tipe_layanan_direview VARCHAR(50), -- 'SHOWER', 'LOCKER', 'BOTH'
    created_at TIMESTAMPTZ DEFAULT now(),
    is_verified BOOLEAN DEFAULT false
);

-- ========================================
-- BAGIAN XII: ENHANCED SYSTEM FEATURES
-- ========================================

-- Notifications
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    tipe_notifikasi VARCHAR(50) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    pesan TEXT NOT NULL,
    reference_id BIGINT,
    reference_type VARCHAR(50), -- 'TRAIN_BOOKING', 'FACILITY_BOOKING'
    is_read BOOLEAN DEFAULT false,
    priority_level priority_notifikasi_enum DEFAULT 'NORMAL',
    action_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT now(),
    read_at TIMESTAMPTZ
);

-- Promo Vouchers
CREATE TABLE promo_vouchers (
    voucher_id BIGSERIAL PRIMARY KEY,
    kode_voucher VARCHAR(20) NOT NULL UNIQUE,
    nama_promo VARCHAR(150) NOT NULL,
    tipe_promo VARCHAR(50), -- 'DISCOUNT_PERCENT', 'DISCOUNT_AMOUNT', 'FREE_SERVICE'
    nilai_diskon NUMERIC(10,2),
    persen_diskon DECIMAL(5,2),
    minimal_transaksi NUMERIC(10,2) DEFAULT 0.00,
    maksimal_diskon NUMERIC(10,2),
    tipe_layanan VARCHAR(50), -- 'ALL', 'TRAIN_ONLY', 'FACILITY_ONLY'
    kuota_penggunaan INT DEFAULT 1000,
    sudah_digunakan INT DEFAULT 0,
    tanggal_mulai DATE NOT NULL,
    tanggal_berakhir DATE NOT NULL,
    is_aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Voucher Usage
CREATE TABLE voucher_usage (
    usage_id BIGSERIAL PRIMARY KEY,
    voucher_id BIGINT NOT NULL REFERENCES promo_vouchers(voucher_id),
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    pemesanan_id BIGINT REFERENCES pemesanan(pemesanan_id),
    facility_booking_id BIGINT REFERENCES facility_bookings(booking_id),
    nilai_diskon_applied NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat Messages (Customer Service)
CREATE TABLE chat_messages (
    message_id BIGSERIAL PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL,
    user_id BIGINT REFERENCES pengguna(user_id),
    cs_staff_id BIGINT,
    message_text TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'TEXT', -- 'TEXT', 'IMAGE', 'FILE', 'QUICK_REPLY'
    attachment_url VARCHAR(500),
    is_from_user BOOLEAN DEFAULT true,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Facility Analytics Summary
CREATE TABLE facility_analytics (
    analytics_id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT NOT NULL REFERENCES station_facilities(facility_id),
    tanggal_laporan DATE NOT NULL,
    
    total_booking_shower INT DEFAULT 0,
    total_booking_locker INT DEFAULT 0,
    total_booking_combo INT DEFAULT 0,
    rata_durasi_shower_menit DECIMAL(5,1),
    rata_durasi_locker_menit DECIMAL(5,1),
    tingkat_okupansi_persen DECIMAL(5,2),
    
    revenue_shower NUMERIC(10,2) DEFAULT 0.00,
    revenue_locker NUMERIC(10,2) DEFAULT 0.00,
    revenue_total NUMERIC(10,2) DEFAULT 0.00,
    
    rata_rating_overall DECIMAL(3,1),
    jumlah_komplain INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (facility_id, tanggal_laporan)
);

-- ========================================
-- BAGIAN XIII: ADDITIONAL INDEXES FOR NEW FEATURES
-- ========================================

-- Facility related indexes
CREATE INDEX idx_station_facilities_stasiun ON station_facilities (stasiun_id);
CREATE INDEX idx_station_facilities_tipe ON station_facilities (tipe_fasilitas);
CREATE INDEX idx_facility_units_facility ON facility_units (facility_id);
CREATE INDEX idx_facility_units_status ON facility_units (status_unit);
CREATE INDEX idx_facility_bookings_user ON facility_bookings (user_id);
CREATE INDEX idx_facility_bookings_facility ON facility_bookings (facility_id);
CREATE INDEX idx_facility_bookings_status ON facility_bookings (status_booking);
CREATE INDEX idx_facility_bookings_waktu ON facility_bookings (waktu_mulai_booking);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_read ON notifications (is_read);
CREATE INDEX idx_notifications_priority ON notifications (priority_level);

-- Voucher indexes
CREATE INDEX idx_promo_vouchers_kode ON promo_vouchers (kode_voucher);
CREATE INDEX idx_promo_vouchers_aktif ON promo_vouchers (is_aktif);
CREATE INDEX idx_voucher_usage_user ON voucher_usage (user_id);
CREATE INDEX idx_voucher_usage_voucher ON voucher_usage (voucher_id);

-- Chat indexes
CREATE INDEX idx_chat_messages_conversation ON chat_messages (conversation_id);
CREATE INDEX idx_chat_messages_user ON chat_messages (user_id);

-- ========================================
-- BAGIAN XIV: ADDITIONAL COMMENTS FOR NEW TABLES
-- ========================================

COMMENT ON TABLE station_facilities IS 'Master data fasilitas shower dan locker di stasiun';
COMMENT ON TABLE facility_units IS 'Unit individual shower/locker yang dapat dibooking';
COMMENT ON TABLE facility_bookings IS 'Booking shower/locker dengan durasi dan pricing fleksibel';
COMMENT ON TABLE notifications IS 'Sistem notifikasi real-time untuk semua layanan';
COMMENT ON TABLE promo_vouchers IS 'Sistem voucher dan promo yang dapat diterapkan ke semua layanan';
COMMENT ON TABLE facility_analytics IS 'Analytics dan reporting untuk performa fasilitas stasiun';