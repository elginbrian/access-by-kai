-- Skrip SQL Lengkap untuk Supabase (PostgreSQL)

-- Bagian 0: Membuat Tipe Data Kustom (ENUMs)
CREATE TYPE posisi_kursi AS ENUM ('jendela', 'lorong', 'tengah');
CREATE TYPE status_jadwal_enum AS ENUM ('SESUAI_JADWAL', 'TERLAMBAT', 'DIBATALKAN');
CREATE TYPE status_inventaris_enum AS ENUM ('TERSEDIA', 'DIKUNCI', 'DIPESAN');
CREATE TYPE tipe_identitas_enum AS ENUM ('KTP', 'PASPOR', 'SIM');
CREATE TYPE status_pemesanan_enum AS ENUM ('MENUNGGU_PEMBAYARAN', 'TERKONFIRMASI', 'DIBATALKAN', 'KADALUARSA');
CREATE TYPE status_tiket_enum AS ENUM ('AKTIF', 'DIBATALKAN', 'DIUBAH_JADWALNYA');
CREATE TYPE status_pembayaran_enum AS ENUM ('MENUNGGU', 'BERHASIL', 'GAGAL');
CREATE TYPE status_refund_enum AS ENUM ('MENUNGGU_PROSES', 'DIPROSES', 'SELESAI');
CREATE TYPE tipe_transaksi_poin_enum AS ENUM ('PEROLEHAN', 'PENUKARAN', 'PEMBATALAN', 'KADALUARSA');
CREATE TYPE status_pesanan_makanan_enum AS ENUM ('DIPESAN', 'DISAJIKAN', 'DIBATALKAN');

-- Bagian I: Entitas Inti (Aset dan Data Master)

-- Tabel untuk semua stasiun kereta api
CREATE TABLE stasiun (
    stasiun_id BIGSERIAL PRIMARY KEY,
    kode_stasiun VARCHAR(5) NOT NULL UNIQUE,
    nama_stasiun VARCHAR(100) NOT NULL,
    kota VARCHAR(100) NOT NULL,
    provinsi VARCHAR(100) NOT NULL,
    status_aktif BOOLEAN DEFAULT true
);

-- Tabel untuk KATEGORI UMUM kelas layanan (Eksekutif, Ekonomi, Luxury, dll.)
CREATE TABLE kelas_kereta (
    kelas_id SERIAL PRIMARY KEY,
    nama_kelas_kategori VARCHAR(50) NOT NULL UNIQUE, -- Contoh: 'Eksekutif', 'Ekonomi', 'Luxury'
    deskripsi TEXT
);

-- (BARU) Tabel untuk SUB-KELAS yang lebih spesifik
CREATE TABLE sub_kelas_kereta (
    sub_kelas_id SERIAL PRIMARY KEY,
    kelas_id INT NOT NULL REFERENCES kelas_kereta(kelas_id),
    nama_sub_kelas VARCHAR(50) NOT NULL UNIQUE, -- Contoh: 'Eksekutif (A)', 'Ekonomi (C)', 'Panoramic'
    kode_sub_kelas VARCHAR(10) UNIQUE, -- Contoh: 'EKS-A', 'EKO-C', 'PAN'
    deskripsi TEXT
);

-- Tabel untuk semua nama kereta api
CREATE TABLE kereta (
    kereta_id BIGSERIAL PRIMARY KEY,
    nomor_kereta VARCHAR(20) NOT NULL UNIQUE,
    nama_kereta VARCHAR(100) NOT NULL,
    status_aktif BOOLEAN DEFAULT true
);

-- (MODIFIKASI) Tabel untuk setiap gerbong, sekarang mereferensi ke sub_kelas_kereta
CREATE TABLE gerbong_kereta (
    gerbong_id BIGSERIAL PRIMARY KEY,
    kereta_id BIGINT NOT NULL REFERENCES kereta(kereta_id),
    sub_kelas_id INT NOT NULL REFERENCES sub_kelas_kereta(sub_kelas_id), -- Menggantikan kelas_id
    nomor_gerbong INT NOT NULL,
    konfigurasi_layout VARCHAR(10), -- misal: '2-2'
    UNIQUE (kereta_id, nomor_gerbong)
);

-- Tabel untuk setiap kursi fisik di setiap gerbong
CREATE TABLE kursi (
    kursi_id BIGSERIAL PRIMARY KEY,
    gerbong_id BIGINT NOT NULL REFERENCES gerbong_kereta(gerbong_id),
    kode_kursi VARCHAR(5) NOT NULL,
    info_posisi posisi_kursi,
    UNIQUE (gerbong_id, kode_kursi)
);

-- Bagian II: Rute, Jadwal, dan Ketersediaan

-- Tabel templat untuk rute perjalanan
CREATE TABLE rute (
    rute_id BIGSERIAL PRIMARY KEY,
    nama_rute VARCHAR(255) NOT NULL,
    kode_rute VARCHAR(20) NOT NULL UNIQUE
);

-- Tabel untuk mendefinisikan urutan stasiun dalam sebuah rute
CREATE TABLE perhentian_rute (
    perhentian_rute_id BIGSERIAL PRIMARY KEY,
    rute_id BIGINT NOT NULL REFERENCES rute(rute_id),
    stasiun_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    urutan INT NOT NULL,
    estimasi_waktu_tempuh INTERVAL, -- Waktu dari perhentian sebelumnya
    UNIQUE (rute_id, urutan)
);

-- Tabel instansiasi perjalanan dari sebuah Rute oleh Kereta pada Tanggal tertentu
CREATE TABLE jadwal (
    jadwal_id BIGSERIAL PRIMARY KEY,
    kereta_id BIGINT NOT NULL REFERENCES kereta(kereta_id),
    rute_id BIGINT NOT NULL REFERENCES rute(rute_id),
    tanggal_keberangkatan DATE NOT NULL,
    status_jadwal status_jadwal_enum DEFAULT 'SESUAI_JADWAL'
);

-- Tabel detail waktu untuk setiap perhentian pada jadwal spesifik
CREATE TABLE perhentian_jadwal (
    perhentian_jadwal_id BIGSERIAL PRIMARY KEY,
    jadwal_id BIGINT NOT NULL REFERENCES jadwal(jadwal_id),
    stasiun_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    waktu_kedatangan_estimasi TIMESTAMPTZ,
    waktu_keberangkatan_estimasi TIMESTAMPTZ,
    waktu_kedatangan_aktual TIMESTAMPTZ,
    waktu_keberangkatan_aktual TIMESTAMPTZ,
    UNIQUE (jadwal_id, stasiun_id)
);

-- Bagian III: Pengguna dan Penumpang

-- Tabel untuk data akun pengguna
CREATE TABLE pengguna (
    user_id BIGSERIAL PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    nomor_telepon VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    saldo_kaipay NUMERIC(12, 2) DEFAULT 0.00,
    poin_loyalitas INT DEFAULT 0,
    waktu_registrasi TIMESTAMPTZ DEFAULT now()
);

-- Tabel untuk data penumpang (bisa sama atau beda dengan pengguna)
CREATE TABLE penumpang (
    penumpang_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES pengguna(user_id), -- Nullable, jika penumpang tidak punya akun
    nama_lengkap VARCHAR(255) NOT NULL,
    tipe_identitas tipe_identitas_enum NOT NULL,
    nomor_identitas VARCHAR(50) NOT NULL,
    UNIQUE (tipe_identitas, nomor_identitas)
);

-- Bagian IV: Transaksi Pemesanan

-- Tabel induk untuk satu transaksi pemesanan
CREATE TABLE pemesanan (
    pemesanan_id BIGSERIAL PRIMARY KEY,
    kode_pemesanan VARCHAR(10) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    status_pemesanan status_pemesanan_enum DEFAULT 'MENUNGGU_PEMBAYARAN',
    total_bayar NUMERIC(12, 2) NOT NULL,
    waktu_pembuatan TIMESTAMPTZ DEFAULT now(),
    batas_waktu_pembayaran TIMESTAMPTZ
);

-- Tabel untuk setiap tiket individu
CREATE TABLE tiket (
    tiket_id BIGSERIAL PRIMARY KEY,
    pemesanan_id BIGINT NOT NULL REFERENCES pemesanan(pemesanan_id),
    penumpang_id BIGINT NOT NULL REFERENCES penumpang(penumpang_id),
    harga NUMERIC(10, 2) NOT NULL,
    kode_boarding_pass VARCHAR(255) UNIQUE,
    status_tiket status_tiket_enum DEFAULT 'AKTIF'
);

-- Tabel Kritis: Inventaris setiap kursi yang dapat dijual per jadwal
CREATE TABLE inventaris_kursi (
    inventaris_id BIGSERIAL PRIMARY KEY,
    jadwal_id BIGINT NOT NULL REFERENCES jadwal(jadwal_id),
    kursi_id BIGINT NOT NULL REFERENCES kursi(kursi_id),
    tiket_id BIGINT REFERENCES tiket(tiket_id), -- Nullable, diisi setelah tiket terbit
    status_inventaris status_inventaris_enum DEFAULT 'TERSEDIA',
    harga NUMERIC(10, 2) NOT NULL,
    UNIQUE (jadwal_id, kursi_id)
);

-- Menambahkan Foreign Key yang tertunda untuk menghindari circular dependency
ALTER TABLE tiket
ADD COLUMN inventaris_kursi_id BIGINT UNIQUE REFERENCES inventaris_kursi(inventaris_id);

-- Tabel untuk mencatat semua transaksi pembayaran
CREATE TABLE pembayaran (
    pembayaran_id BIGSERIAL PRIMARY KEY,
    pemesanan_id BIGINT NOT NULL REFERENCES pemesanan(pemesanan_id),
    metode_pembayaran VARCHAR(50) NOT NULL,
    jumlah NUMERIC(12, 2) NOT NULL,
    status_pembayaran status_pembayaran_enum DEFAULT 'MENUNGGU',
    id_transaksi_eksternal VARCHAR(255),
    respon_gateway JSONB,
    waktu_pembayaran TIMESTAMPTZ
);

-- Tabel untuk proses pembatalan tiket
CREATE TABLE pembatalan (
    pembatalan_id BIGSERIAL PRIMARY KEY,
    tiket_id BIGINT NOT NULL REFERENCES tiket(tiket_id),
    alasan TEXT,
    biaya_pembatalan NUMERIC(10, 2) NOT NULL,
    jumlah_refund NUMERIC(10, 2) NOT NULL,
    status_refund status_refund_enum DEFAULT 'MENUNGGU_PROSES',
    waktu_pengajuan TIMESTAMPTZ DEFAULT now()
);

-- Tabel untuk proses perubahan jadwal
CREATE TABLE perubahan_jadwal (
    perubahan_id BIGSERIAL PRIMARY KEY,
    tiket_asli_id BIGINT NOT NULL REFERENCES tiket(tiket_id),
    tiket_baru_id BIGINT NOT NULL REFERENCES tiket(tiket_id),
    biaya_administrasi NUMERIC(10, 2) NOT NULL,
    selisih_harga NUMERIC(10, 2) DEFAULT 0.00,
    waktu_perubahan TIMESTAMPTZ DEFAULT now()
);

-- Bagian V: Program Loyalitas (Railpoints)

-- Tabel akun loyalitas (one-to-one dengan pengguna)
CREATE TABLE akun_railpoints (
    akun_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES pengguna(user_id),
    saldo_terkini INT DEFAULT 0,
    poin_kadaluwarsa_berikutnya INT,
    tanggal_kadaluwarsa DATE
);

-- Tabel buku besar (ledger) untuk semua transaksi poin
CREATE TABLE transaksi_railpoints (
    transaksi_id BIGSERIAL PRIMARY KEY,
    akun_id BIGINT NOT NULL REFERENCES akun_railpoints(akun_id),
    pemesanan_id BIGINT REFERENCES pemesanan(pemesanan_id),
    tipe_transaksi tipe_transaksi_poin_enum NOT NULL,
    poin_debit INT,
    poin_kredit INT,
    deskripsi VARCHAR(255),
    waktu_transaksi TIMESTAMPTZ DEFAULT now()
);

-- Bagian VI: Layanan Tambahan

-- Tabel master untuk menu makanan (Railfood)
CREATE TABLE menu_item_railfood (
    menu_item_id SERIAL PRIMARY KEY,
    nama_item VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    harga NUMERIC(10, 2) NOT NULL,
    ketersediaan BOOLEAN DEFAULT true
);

-- Tabel untuk pesanan makanan
CREATE TABLE pesanan_railfood (
    pesanan_id BIGSERIAL PRIMARY KEY,
    tiket_id BIGINT NOT NULL REFERENCES tiket(tiket_id),
    status_pesanan status_pesanan_makanan_enum DEFAULT 'DIPESAN',
    total_harga NUMERIC(10, 2) NOT NULL,
    waktu_pesanan TIMESTAMPTZ DEFAULT now()
);

-- Tabel perantara untuk detail item dalam satu pesanan makanan (Many-to-Many)
CREATE TABLE pesanan_railfood_items (
    pesanan_id BIGINT NOT NULL REFERENCES pesanan_railfood(pesanan_id),
    menu_item_id INT NOT NULL REFERENCES menu_item_railfood(menu_item_id),
    jumlah INT NOT NULL,
    harga_saat_pesan NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (pesanan_id, menu_item_id)
);

-- Tabel untuk polis asuransi perjalanan
CREATE TABLE polis_asuransi (
    polis_id BIGSERIAL PRIMARY KEY,
    pemesanan_id BIGINT NOT NULL REFERENCES pemesanan(pemesanan_id),
    nama_penyedia VARCHAR(100) NOT NULL,
    nomor_polis VARCHAR(100) NOT NULL UNIQUE,
    premi NUMERIC(10, 2) NOT NULL,
    status_aktif BOOLEAN DEFAULT true
);

-- Tabel untuk layanan pengiriman logistik
CREATE TABLE pengiriman_logistik (
    pengiriman_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    nomor_resi VARCHAR(50) NOT NULL UNIQUE,
    stasiun_asal_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    stasiun_tujuan_id BIGINT NOT NULL REFERENCES stasiun(stasiun_id),
    status_pengiriman VARCHAR(50),
    biaya_pengiriman NUMERIC(12, 2) NOT NULL,
    waktu_pembuatan TIMESTAMPTZ DEFAULT now()
);

-- Bagian VII: Indeks untuk Optimasi Kinerja Kueri

CREATE INDEX idx_jadwal_keberangkatan ON jadwal (tanggal_keberangkatan);
CREATE INDEX idx_perhentian_jadwal_jadwal_id ON perhentian_jadwal (jadwal_id);
CREATE INDEX idx_inventaris_kursi_jadwal_id ON inventaris_kursi (jadwal_id);
CREATE INDEX idx_pemesanan_user_id ON pemesanan (user_id);
CREATE INDEX idx_tiket_pemesanan_id ON tiket (pemesanan_id);
CREATE INDEX idx_pembayaran_pemesanan_id ON pembayaran (pemesanan_id);