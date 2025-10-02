-- =====================================================================
-- DDL GEN 3: SKRIP SEEDING DATA SUPER LENGKAP (PostgreSQL)
-- TUJUAN: Mengisi data master dan operasional secara komprehensif.
-- DATABASE TARGET: PostgreSQL
-- UPDATE: Penambahan master kereta, gerbong, rute, dan jadwal yang signifikan.
-- =====================================================================

-- Hapus data lama untuk memastikan kebersihan (opsional, gunakan dengan hati-hati)
TRUNCATE TABLE perhentian_jadwal, jadwal, perhentian_rute, rute, master_gerbong, master_kereta, stasiun, menu_railfood RESTART IDENTITY CASCADE;

-- -----------------------------------------------------
-- Bagian I: Data Master Statis
-- -----------------------------------------------------

-- Tabel `stasiun` (Data tetap sama, sudah cukup lengkap)
INSERT INTO stasiun (stasiun_id, kode_stasiun, nama_stasiun, kota, kabupaten, provinsi, koordinat_latitude, koordinat_longitude, elevasi_meter) VALUES
(1, 'GMR', 'Stasiun Gambir', 'Jakarta Pusat', 'Kota Administrasi Jakarta Pusat', 'DKI Jakarta', -6.17671600, 106.83050800, 16),
(2, 'PSE', 'Stasiun Pasar Senen', 'Jakarta Pusat', 'Kota Administrasi Jakarta Pusat', 'DKI Jakarta', -6.17444400, 106.84444400, 5),
(3, 'JAKK', 'Stasiun Jakarta Kota', 'Jakarta Barat', 'Kota Administrasi Jakarta Barat', 'DKI Jakarta', -6.13750000, 106.81416700, 4),
(4, 'JNG', 'Stasiun Jatinegara', 'Jakarta Timur', 'Kota Administrasi Jakarta Timur', 'DKI Jakarta', -6.21555600, 106.86805600, 16),
(5, 'BD', 'Stasiun Bandung', 'Bandung', 'Kota Bandung', 'Jawa Barat', -6.91416700, 107.60250000, 709),
(6, 'CN', 'Stasiun Cirebon', 'Cirebon', 'Kota Cirebon', 'Jawa Barat', -6.70526900, 108.55544200, 4),
(7, 'SMT', 'Stasiun Semarang Tawang', 'Semarang', 'Kota Semarang', 'Jawa Tengah', -6.96444400, 110.42777800, 2),
(8, 'SMC', 'Stasiun Semarang Poncol', 'Semarang', 'Kota Semarang', 'Jawa Tengah', -6.97250000, 110.41833300, 3),
(9, 'YK', 'Stasiun Yogyakarta', 'Yogyakarta', 'Kota Yogyakarta', 'DI Yogyakarta', -7.78916700, 110.36388900, 113),
(10, 'LPN', 'Stasiun Lempuyangan', 'Yogyakarta', 'Kota Yogyakarta', 'DI Yogyakarta', -7.79388900, 110.37361100, 114),
(11, 'SLO', 'Stasiun Solo Balapan', 'Surakarta', 'Kota Surakarta', 'Jawa Tengah', -7.55861100, 110.82138900, 93),
(12, 'SGU', 'Stasiun Surabaya Gubeng', 'Surabaya', 'Kota Surabaya', 'Jawa Timur', -7.26500000, 112.75166700, 5),
(13, 'SBI', 'Stasiun Surabaya Pasarturi', 'Surabaya', 'Kota Surabaya', 'Jawa Timur', -7.24166700, 112.73472200, 1),
(14, 'ML', 'Stasiun Malang', 'Malang', 'Kota Malang', 'Jawa Timur', -7.97972200, 112.63694400, 444),
(15, 'MLK', 'Stasiun Malang Kotalama', 'Malang', 'Kota Malang', 'Jawa Timur', -7.99476580, 112.63301150, 429),
(16, 'PWT', 'Stasiun Purwokerto', 'Banyumas', 'Banyumas', 'Jawa Tengah', -7.42083300, 109.22361100, 75),
(17, 'KYA', 'Stasiun Kroya', 'Cilacap', 'Cilacap', 'Jawa Tengah', -7.63194400, 109.25527800, 11),
(18, 'KTA', 'Stasiun Kutoarjo', 'Purworejo', 'Purworejo', 'Jawa Tengah', -7.72166700, 109.91138900, 16),
(19, 'KBM', 'Stasiun Kebumen', 'Kebumen', 'Kebumen', 'Jawa Tengah', -7.67388900, 109.66111100, 21),
(20, 'MDN', 'Stasiun Medan', 'Medan', 'Kota Medan', 'Sumatera Utara', 3.59087800, 98.67974200, 22),
(21, 'KPT', 'Stasiun Kertapati', 'Palembang', 'Kota Palembang', 'Sumatera Selatan', -3.01653300, 104.75160200, 2),
(22, 'BJR', 'Stasiun Banjar', 'Banjar', 'Kota Banjar', 'Jawa Barat', -7.36944400, 108.53277800, 32),
(23, 'JR', 'Stasiun Jember', 'Jember', 'Jember', 'Jawa Timur', -8.16888900, 113.70000000, 89),
(24, 'MN', 'Stasiun Madiun', 'Madiun', 'Kota Madiun', 'Jawa Timur', -7.62583300, 111.52500000, 63),
(25, 'BKS', 'Stasiun Bekasi', 'Bekasi', 'Kota Bekasi', 'Jawa Barat', -6.23694400, 106.99583300, 19),
(26, 'PWK', 'Stasiun Purwakarta', 'Purwakarta', 'Purwakarta', 'Jawa Barat', -6.55194400, 107.44361100, 84),
(27, 'CMI', 'Stasiun Cimahi', 'Cimahi', 'Kota Cimahi', 'Jawa Barat', -6.88333300, 107.54027800, 783),
(28, 'PK', 'Stasiun Pekalongan', 'Pekalongan', 'Kota Pekalongan', 'Jawa Tengah', -6.88638900, 109.66694400, 4),
(29, 'BJN', 'Stasiun Bojonegoro', 'Bojonegoro', 'Bojonegoro', 'Jawa Timur', -7.15388900, 111.88638900, 15),
(30, 'CNP', 'Stasiun Cirebon Prujakan', 'Cirebon', 'Kota Cirebon', 'Jawa Barat', -6.71638900, 108.56138900, 4),
(31, 'TG', 'Stasiun Tegal', 'Tegal', 'Kota Tegal', 'Jawa Tengah', -6.86694400, 109.14361100, 4),
(32, 'KDN', 'Stasiun Kediri', 'Kediri', 'Kota Kediri', 'Jawa Timur', -7.82138900, 112.01138900, 68),
(33, 'BL', 'Stasiun Blitar', 'Blitar', 'Kota Blitar', 'Jawa Timur', -8.09805600, 112.16361100, 167),
(34, 'KPN', 'Stasiun Kepanjen', 'Malang', 'Malang', 'Jawa Timur', -8.13166700, 112.57611100, 335),
(35, 'WLG', 'Stasiun Wlingi', 'Blitar', 'Blitar', 'Jawa Timur', -8.07583300, 112.31138900, 274),
(36, 'TA', 'Stasiun Tulungagung', 'Tulungagung', 'Tulungagung', 'Jawa Timur', -8.06500000, 111.90138900, 85),
(37, 'NJ', 'Stasiun Nganjuk', 'Nganjuk', 'Nganjuk', 'Jawa Timur', -7.60194400, 111.90111100, 54),
(38, 'KTS', 'Stasiun Kertosono', 'Nganjuk', 'Nganjuk', 'Jawa Timur', -7.58805600, 112.09500000, 44),
(39, 'JG', 'Stasiun Jombang', 'Jombang', 'Jombang', 'Jawa Timur', -7.55000000, 112.23194400, 43),
(40, 'MR', 'Stasiun Mojokerto', 'Mojokerto', 'Kota Mojokerto', 'Jawa Timur', -7.46500000, 112.43500000, 22),
(41, 'PWS', 'Stasiun Purwosari', 'Surakarta', 'Kota Surakarta', 'Jawa Tengah', -7.56861100, 110.80861100, 98),
(42, 'KT', 'Stasiun Klaten', 'Klaten', 'Klaten', 'Jawa Tengah', -7.70888900, 110.59861100, 151),
(43, 'WT', 'Stasiun Wates', 'Kulon Progo', 'Kulon Progo', 'DI Yogyakarta', -7.85888900, 110.15638900, 18),
(44, 'GB', 'Stasiun Gombong', 'Kebumen', 'Kebumen', 'Jawa Tengah', -7.60888900, 109.51138900, 18),
(45, 'CKP', 'Stasiun Cikampek', 'Karawang', 'Karawang', 'Jawa Barat', -6.40888900, 107.45500000, 46),
(46, 'SDA', 'Stasiun Sidoarjo', 'Sidoarjo', 'Sidoarjo', 'Jawa Timur', -7.45500000, 112.71694400, 4),
(47, 'BG', 'Stasiun Bangil', 'Pasuruan', 'Pasuruan', 'Jawa Timur', -7.59500000, 112.81888900, 9),
(48, 'LW', 'Stasiun Lawang', 'Malang', 'Malang', 'Jawa Timur', -7.83194400, 112.69888900, 491),
(49, 'CLD', 'Stasiun Ciledug', 'Cirebon', 'Cirebon', 'Jawa Barat', -6.88305600, 108.73500000, 16),
(50, 'BBK', 'Stasiun Babakan', 'Cirebon', 'Cirebon', 'Jawa Barat', -6.80694400, 108.68194400, 12),
(51, 'PD', 'Stasiun Padang', 'Padang', 'Kota Padang', 'Sumatera Barat', -0.94352000, 100.37436000, 8),
(52, 'TNK', 'Stasiun Tanjungkarang', 'Bandar Lampung', 'Kota Bandar Lampung', 'Lampung', -5.42361100, 105.25305600, 96),
(53, 'RAP', 'Stasiun Rantau Prapat', 'Labuhanbatu', 'Labuhanbatu', 'Sumatera Utara', 2.10000000, 99.83194400, 27),
(54, 'KIS', 'Stasiun Kisaran', 'Asahan', 'Asahan', 'Sumatera Utara', 2.98333300, 99.61666700, 19),
(55, 'TBI', 'Stasiun Tebing Tinggi', 'Tebing Tinggi', 'Kota Tebing Tinggi', 'Sumatera Utara', 3.32611100, 99.16111100, 21),
(56, 'LLG', 'Stasiun Lubuklinggau', 'Lubuklinggau', 'Kota Lubuklinggau', 'Sumatera Selatan', -3.29500000, 102.86111100, 130),
(57, 'BTA', 'Stasiun Baturaja', 'Ogan Komering Ulu', 'Ogan Komering Ulu', 'Sumatera Selatan', -4.12888900, 104.16694400, 49),
(58, 'PBM', 'Stasiun Prabumulih', 'Prabumulih', 'Kota Prabumulih', 'Sumatera Selatan', -3.43500000, 104.23888900, 34);

-- Tabel `menu_railfood` (Data tetap sama)
INSERT INTO menu_railfood (menu_id, nama_menu, kategori, harga) VALUES
(1, 'Nasi Goreng Parahyangan Legend', 'MAKANAN_UTAMA', 40000.00),
(2, 'Bistik Legend', 'MAKANAN_UTAMA', 50000.00),
(3, 'Nasi Sapi Lada Hitam', 'MAKANAN_UTAMA', 40000.00),
(4, 'Nasi Rames Nusantara', 'MAKANAN_UTAMA', 40000.00),
(5, 'Mie Godog', 'MAKANAN_UTAMA', 40000.00),
(6, 'Reska Nasi Goreng Bakso', 'MAKANAN_UTAMA', 35000.00),
(7, 'Sei Sapi', 'MAKANAN_UTAMA', 50000.00),
(8, 'Pop Mie Rasa Ayam', 'SNACK', 10000.00),
(9, 'Air Mineral', 'MINUMAN', 8000.00),
(10, 'Teh Panas', 'MINUMAN', 10000.00),
(11, 'Kopi Hitam', 'MINUMAN', 12000.00),
(12, 'Chicken Strip Wedges Potato', 'SNACK', 40000.00);

-- -----------------------------------------------------
-- Bagian II: Data Master Kereta & Gerbong (Diperluas)
-- -----------------------------------------------------

-- Tabel `master_kereta`
INSERT INTO master_kereta (master_kereta_id, kode_kereta, nama_kereta, jenis_layanan, kapasitas_total, jumlah_gerbong) VALUES
(1, 'MK-ABA', 'Argo Bromo Anggrek', 'CAMPURAN', 466, 11),
(2, 'MK-TKS', 'Taksaka', 'LUXURY', 426, 11),
(3, 'MK-PRY', 'Parahyangan', 'CAMPURAN', 458, 10),
(4, 'MK-GJN', 'Gajayana', 'LUXURY', 426, 11),
(5, 'MK-BMA', 'Bima', 'CAMPURAN', 416, 10),
(6, 'MK-JBY', 'Jayabaya', 'CAMPURAN', 560, 10),
(7, 'MK-MTM', 'Matarmaja', 'EKONOMI', 768, 9),
(8, 'MK-MLB', 'Malabar', 'CAMPURAN', 422, 8),
(9, 'MK-SBU', 'Sribilah Utama', 'CAMPURAN', 230, 5),
(10, 'MK-ACR', 'Argo Cheribon', 'CAMPURAN', 450, 9),
(11, 'MK-LDY', 'Lodaya', 'CAMPURAN', 456, 10),
(12, 'MK-SNJ', 'Senja Utama Solo', 'CAMPURAN', 536, 10),
(13, 'MK-MLE', 'Malioboro Ekspres', 'CAMPURAN', 456, 10),
(14, 'MK-MUT', 'Mutiara Selatan', 'CAMPURAN', 456, 10),
(15, 'MK-SAW', 'Sawunggalih', 'CAMPURAN', 536, 10),
(16, 'MK-PRO', 'Progo', 'EKONOMI', 608, 9),
(17, 'MK-KMP', 'Kuala Stabas', 'EKONOMI', 384, 6),
(18, 'MK-RJW', 'Rajabasa', 'EKONOMI', 512, 7),
(19, 'MK-SRD', 'Serayu', 'EKONOMI', 768, 9),
(20, 'MK-AWL', 'Argo Wilis', 'CAMPURAN', 428, 10);


-- Tabel `master_gerbong`
-- Rangkaian 1: Argo Bromo Anggrek
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(1, 1, 'COMPARTEMEN_SUITES', '1-1', 16),
(1, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (1, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(1, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (1, 5, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(1, 6, 'KERETA_MAKAN_M1', 'N/A', 0),
(1, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (1, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(1, 9, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (1, 10, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(1, 11, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 2: Taksaka
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(2, 1, 'LUXURY_GEN_2', '2-1', 26),
(2, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (2, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(2, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (2, 5, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(2, 6, 'KERETA_MAKAN_M1', 'N/A', 0),
(2, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (2, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(2, 9, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (2, 10, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(2, 11, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 3: Parahyangan
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(3, 1, 'PANORAMIC', '2-2', 38),
(3, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (3, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(3, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(3, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (3, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(3, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (3, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(3, 9, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(3, 10, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 4: Gajayana
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(4, 1, 'LUXURY_GEN_2', '2-1', 26),
(4, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (4, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(4, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (4, 5, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(4, 6, 'KERETA_MAKAN_M1', 'N/A', 0),
(4, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (4, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(4, 9, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (4, 10, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(4, 11, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 5: Bima
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(5, 1, 'COMPARTEMEN_SUITES', '1-1', 16),
(5, 2, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50), (5, 3, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50),
(5, 4, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50), (5, 5, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50),
(5, 6, 'KERETA_MAKAN_M1', 'N/A', 0),
(5, 7, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50), (5, 8, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50),
(5, 9, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50),
(5, 10, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 6: Jayabaya
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(6, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (6, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(6, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (6, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(6, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(6, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (6, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(6, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (6, 9, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(6, 10, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72);
-- Rangkaian 7: Matarmaja
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(7, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (7, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(7, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (7, 4, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(7, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(7, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (7, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(7, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (7, 9, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72);
-- Rangkaian 8: Malabar
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(8, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (8, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(8, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(8, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(8, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (8, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(8, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(8, 8, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 9: Sribilah Utama
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(9, 1, 'EKSEKUTIF_MILD_STEEL_SATWA', '2-2', 50),
(9, 2, 'KERETA_MAKAN_M1', 'N/A', 0),
(9, 3, 'EKONOMI_KEMENHUB', '2-2', 64),
(9, 4, 'EKONOMI_KEMENHUB', '2-2', 64),
(9, 5, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 10: Argo Cheribon
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(10, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (10, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(10, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(10, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(10, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (10, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(10, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (10, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(10, 9, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 11: Lodaya
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(11, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (11, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(11, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (11, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(11, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(11, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (11, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(11, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (11, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(11, 10, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 12: Senja Utama Solo
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(12, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (12, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(12, 3, 'KERETA_MAKAN_M1', 'N/A', 0),
(12, 4, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (12, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(12, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (12, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(12, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (12, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(12, 10, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 13: Malioboro Ekspres
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(13, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (13, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(13, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (13, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(13, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(13, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (13, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(13, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (13, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(13, 10, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 14: Mutiara Selatan
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(14, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (14, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(14, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(14, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(14, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (14, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(14, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (14, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(14, 9, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(14, 10, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 15: Sawunggalih
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(15, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (15, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(15, 3, 'KERETA_MAKAN_M1', 'N/A', 0),
(15, 4, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (15, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(15, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (15, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(15, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (15, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(15, 10, 'KERETA_PEMBANGKIT', 'N/A', 0);
-- Rangkaian 16: Progo
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(16, 1, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(16, 2, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(16, 3, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(16, 4, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(16, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(16, 6, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(16, 7, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(16, 8, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(16, 9, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106);
-- Rangkaian 17: Kuala Stabas
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(17, 1, 'EKONOMI_KEMENHUB', '2-2', 64), (17, 2, 'EKONOMI_KEMENHUB', '2-2', 64),
(17, 3, 'EKONOMI_KEMENHUB', '2-2', 64), (17, 4, 'EKONOMI_KEMENHUB', '2-2', 64),
(17, 5, 'EKONOMI_KEMENHUB', '2-2', 64), (17, 6, 'EKONOMI_KEMENHUB', '2-2', 64);
-- Rangkaian 18: Rajabasa
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(18, 1, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106), (18, 2, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(18, 3, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106), (18, 4, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106),
(18, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(18, 6, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106), (18, 7, 'EKONOMI_NEW_GENERATION_2024', '3-2', 106);
-- Rangkaian 19: Serayu
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(19, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (19, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(19, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (19, 4, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(19, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(19, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (19, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(19, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (19, 9, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72);
-- Rangkaian 20: Argo Wilis
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(20, 1, 'PANORAMIC', '2-2', 38),
(20, 2, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50), (20, 3, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50),
(20, 4, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50), (20, 5, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50),
(20, 6, 'KERETA_MAKAN_M1', 'N/A', 0),
(20, 7, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50), (20, 8, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50),
(20, 9, 'EKSEKUTIF_NEW_GENERATION_2024', '2-2', 50),
(20, 10, 'KERETA_PEMBANGKIT', 'N/A', 0);


-- -----------------------------------------------------
-- Bagian III: Data Rute (Diperluas)
-- -----------------------------------------------------

-- Tabel `rute`
INSERT INTO rute (rute_id, kode_rute, nama_rute) VALUES
(1, 'GMR-SBI-UTARA', 'Gambir - Surabaya Pasarturi (Lintas Utara)'),
(2, 'SBI-GMR-UTARA', 'Surabaya Pasarturi - Gambir (Lintas Utara)'),
(3, 'GMR-YK-SELATAN', 'Gambir - Yogyakarta (Lintas Selatan)'),
(4, 'YK-GMR-SELATAN', 'Yogyakarta - Gambir (Lintas Selatan)'),
(5, 'GMR-BD', 'Gambir - Bandung'),
(6, 'BD-GMR', 'Bandung - Gambir'),
(7, 'GMR-ML-SELATAN', 'Gambir - Malang (Lintas Selatan)'),
(8, 'ML-GMR-SELATAN', 'Malang - Gambir (Lintas Selatan)'),
(9, 'PSE-ML-UTARA', 'Pasar Senen - Malang (Lintas Utara)'),
(10, 'ML-PSE-UTARA', 'Malang - Pasar Senen (Lintas Utara)'),
(11, 'BD-SGU-SELATAN', 'Bandung - Surabaya Gubeng (Lintas Selatan)'),
(12, 'SGU-BD-SELATAN', 'Surabaya Gubeng - Bandung (Lintas Selatan)'),
(13, 'MDN-RAP', 'Medan - Rantau Prapat'),
(14, 'RAP-MDN', 'Rantau Prapat - Medan'),
(15, 'GMR-CN-UTARA', 'Gambir - Cirebon (Lintas Utara)'),
(16, 'CN-GMR-UTARA', 'Cirebon - Gambir (Lintas Utara)'),
(17, 'SLO-BD-SELATAN', 'Solo Balapan - Bandung (Lintas Selatan)'),
(18, 'BD-SLO-SELATAN', 'Bandung - Solo Balapan (Lintas Selatan)'),
(19, 'YK-ML-SELATAN', 'Yogyakarta - Malang (Lintas Selatan)'),
(20, 'ML-YK-SELATAN', 'Malang - Yogyakarta (Lintas Selatan)'),
(21, 'PSE-KTA-SELATAN', 'Pasar Senen - Kutoarjo (Lintas Selatan)'),
(22, 'KTA-PSE-SELATAN', 'Kutoarjo - Pasar Senen (Lintas Selatan)'),
(23, 'LPN-PSE-SELATAN', 'Lempuyangan - Pasar Senen (Lintas Selatan)'),
(24, 'PSE-LPN-SELATAN', 'Pasar Senen - Lempuyangan (Lintas Selatan)'),
(25, 'TNK-KPT-SELATAN-SUM', 'Tanjungkarang - Kertapati (Lintas Selatan Sumatera)'),
(26, 'KPT-TNK-SELATAN-SUM', 'Kertapati - Tanjungkarang (Lintas Selatan Sumatera)'),
(27, 'PWT-SGU-SELATAN', 'Purwokerto - Surabaya Gubeng (via Lempuyangan)'),
(28, 'SGU-PWT-SELATAN', 'Surabaya Gubeng - Purwokerto (via Lempuyangan)');

-- Tabel `perhentian_rute`
-- Rute 1 & 2: GMR <-> SBI
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(1, 1, 1), (1, 6, 2), (1, 28, 3), (1, 7, 4), (1, 29, 5), (1, 13, 6),
(2, 13, 1), (2, 29, 2), (2, 7, 3), (2, 28, 4), (2, 6, 5), (2, 1, 6);
-- Rute 3 & 4: GMR <-> YK
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(3, 1, 1), (3, 4, 2), (3, 25, 3), (3, 6, 4), (3, 16, 5), (3, 17, 6), (3, 19, 7), (3, 18, 8), (3, 43, 9), (3, 9, 10),
(4, 9, 1), (4, 43, 2), (4, 18, 3), (4, 19, 4), (4, 17, 5), (4, 16, 6), (4, 6, 7), (4, 25, 8), (4, 4, 9), (4, 1, 10);
-- Rute 5 & 6: GMR <-> BD
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(5, 1, 1), (5, 27, 2), (5, 5, 3),
(6, 5, 1), (6, 27, 2), (6, 1, 3);
-- Rute 7 & 8: GMR <-> ML
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(7, 1, 1), (7, 25, 2), (7, 6, 3), (7, 16, 4), (7, 17, 5), (7, 19, 6), (7, 18, 7), (7, 9, 8), (7, 11, 9), (7, 24, 10), (7, 37, 11), (7, 38, 12), (7, 32, 13), (7, 36, 14), (7, 33, 15), (7, 35, 16), (7, 34, 17), (7, 15, 18), (7, 14, 19),
(8, 14, 1), (8, 15, 2), (8, 34, 3), (8, 35, 4), (8, 33, 5), (8, 36, 6), (8, 32, 7), (8, 38, 8), (8, 37, 9), (8, 24, 10), (8, 11, 11), (8, 9, 12), (8, 18, 13), (8, 19, 14), (8, 17, 15), (8, 16, 16), (8, 6, 17), (8, 25, 18), (8, 1, 19);
-- Rute 9 & 10: PSE <-> ML
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(9, 2, 1), (9, 45, 2), (9, 6, 3), (9, 31, 4), (9, 28, 5), (9, 8, 6), (9, 29, 7), (9, 13, 8), (9, 12, 9), (9, 46, 10), (9, 47, 11), (9, 48, 12), (9, 14, 13),
(10, 14, 1), (10, 48, 2), (10, 47, 3), (10, 46, 4), (10, 12, 5), (10, 13, 6), (10, 29, 7), (10, 8, 8), (10, 28, 9), (10, 31, 10), (10, 6, 11), (10, 45, 12), (10, 2, 13);
-- Rute 11 & 12: BD <-> SGU
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(11, 5, 1), (11, 22, 2), (11, 17, 3), (11, 9, 4), (11, 11, 5), (11, 24, 6), (11, 38, 7), (11, 39, 8), (11, 40, 9), (11, 12, 10),
(12, 12, 1), (12, 40, 2), (12, 39, 3), (12, 38, 4), (12, 24, 5), (12, 11, 6), (12, 9, 7), (12, 17, 8), (12, 22, 9), (12, 5, 10);
-- Rute 13 & 14: MDN <-> RAP
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(13, 20, 1), (13, 55, 2), (13, 54, 3), (13, 53, 4),
(14, 53, 1), (14, 54, 2), (14, 55, 3), (14, 20, 4);
-- Rute 15 & 16: GMR <-> CN
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(15, 1, 1), (15, 25, 2), (15, 45, 3), (15, 6, 4),
(16, 6, 1), (16, 45, 2), (16, 25, 3), (16, 1, 4);
-- Rute 17 & 18: SLO <-> BD
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(17, 11, 1), (17, 9, 2), (17, 18, 3), (17, 17, 4), (17, 22, 5), (17, 5, 6),
(18, 5, 1), (18, 22, 2), (18, 17, 3), (18, 18, 4), (18, 9, 5), (18, 11, 6);
-- Rute 19 & 20: YK <-> ML
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(19, 9, 1), (19, 11, 2), (19, 24, 3), (19, 32, 4), (19, 33, 5), (19, 14, 6),
(20, 14, 1), (20, 33, 2), (20, 32, 3), (20, 24, 4), (20, 11, 5), (20, 9, 6);
-- Rute 21 & 22: PSE <-> KTA
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(21, 2, 1), (21, 6, 2), (21, 16, 3), (21, 17, 4), (21, 19, 5), (21, 18, 6),
(22, 18, 1), (22, 19, 2), (22, 17, 3), (22, 16, 4), (22, 6, 5), (22, 2, 6);
-- Rute 23 & 24: LPN <-> PSE
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(23, 10, 1), (23, 42, 2), (23, 41, 3), (23, 16, 4), (23, 30, 5), (23, 4, 6), (23, 2, 7),
(24, 2, 1), (24, 4, 2), (24, 30, 3), (24, 16, 4), (24, 41, 5), (24, 42, 6), (24, 10, 7);
-- Rute 25 & 26: TNK <-> KPT
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(25, 52, 1), (25, 57, 2), (25, 58, 3), (25, 21, 4),
(26, 21, 1), (26, 58, 2), (26, 57, 3), (26, 52, 4);
-- Rute 27 & 28: PWT <-> SGU
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
(27, 16, 1), (27, 17, 2), (27, 9, 3), (27, 11, 4), (27, 24, 5), (27, 12, 6),
(28, 12, 1), (28, 24, 2), (28, 11, 3), (28, 9, 4), (28, 17, 5), (28, 16, 6);


-- -----------------------------------------------------
-- Bagian IV: Data Jadwal (Diperluas untuk 1 Oktober 2025)
-- -----------------------------------------------------
-- KOSONGKAN DATA JADWAL LAMA
TRUNCATE TABLE jadwal, perhentian_jadwal RESTART IDENTITY CASCADE;

-- =====================================================================
-- BAGIAN I: PENGISIAN JADWAL (2 - 5 OKTOBER 2025)
-- =====================================================================

INSERT INTO jadwal (kode_jadwal, master_kereta_id, rute_id, nomor_ka, tanggal_keberangkatan, waktu_berangkat_origin, waktu_tiba_destination, harga_base) VALUES
-- ==================== TANGGAL 2 OKTOBER 2025 ====================
-- Argo Bromo Anggrek (GMR-SBI PP)
('JDW-20251002-001', 1, 1, 'KA 2', '2025-10-02', '2025-10-02 08:20:00+07', '2025-10-02 16:05:00+07', 680000),
('JDW-20251002-002', 1, 1, 'KA 4', '2025-10-02', '2025-10-02 20:30:00+07', '2025-10-03 04:15:00+07', 680000),
('JDW-20251002-003', 1, 2, 'KA 1', '2025-10-02', '2025-10-02 09:10:00+07', '2025-10-02 17:15:00+07', 680000),
('JDW-20251002-004', 1, 2, 'KA 3', '2025-10-02', '2025-10-02 21:15:00+07', '2025-10-03 05:20:00+07', 680000),
-- Taksaka (GMR-YK PP)
('JDW-20251002-005', 2, 3, 'KA 46', '2025-10-02', '2025-10-02 07:45:00+07', '2025-10-02 13:50:00+07', 570000),
('JDW-20251002-006', 2, 3, 'KA 48', '2025-10-02', '2025-10-02 21:20:00+07', '2025-10-03 03:30:00+07', 570000),
('JDW-20251002-007', 2, 4, 'KA 43', '2025-10-02', '2025-10-02 07:30:00+07', '2025-10-02 13:35:00+07', 570000),
-- Gajayana (GMR-ML PP)
('JDW-20251002-008', 4, 7, 'KA 36', '2025-10-02', '2025-10-02 18:50:00+07', '2025-10-03 07:06:00+07', 620000),
('JDW-20251002-009', 4, 8, 'KA 35', '2025-10-02', '2025-10-02 14:55:00+07', '2025-10-03 03:05:00+07', 620000),
-- Jayabaya (PSE-ML PP)
('JDW-20251002-010', 6, 9, 'KA 92', '2025-10-02', '2025-10-02 17:25:00+07', '2025-10-03 06:05:00+07', 350000),
('JDW-20251002-011', 6, 10, 'KA 91', '2025-10-02', '2025-10-02 13:45:00+07', '2025-10-03 01:58:00+07', 350000),
-- Argo Wilis (BD-SGU PP)
('JDW-20251002-012', 20, 11, 'KA 5', '2025-10-02', '2025-10-02 08:15:00+07', '2025-10-02 18:10:00+07', 700000),
('JDW-20251002-013', 20, 12, 'KA 6', '2025-10-02', '2025-10-02 07:00:00+07', '2025-10-02 17:05:00+07', 700000),

-- ==================== TANGGAL 3 OKTOBER 2025 ====================
-- Argo Bromo Anggrek (GMR-SBI PP)
('JDW-20251003-001', 1, 1, 'KA 2', '2025-10-03', '2025-10-03 08:20:00+07', '2025-10-03 16:05:00+07', 700000),
('JDW-20251003-002', 1, 1, 'KA 4', '2025-10-03', '2025-10-03 20:30:00+07', '2025-10-04 04:15:00+07', 700000),
('JDW-20251003-003', 1, 2, 'KA 1', '2025-10-03', '2025-10-03 09:10:00+07', '2025-10-03 17:15:00+07', 700000),
('JDW-20251003-004', 1, 2, 'KA 3', '2025-10-03', '2025-10-03 21:15:00+07', '2025-10-04 05:20:00+07', 700000),
-- Bima (BD-SGU PP)
('JDW-20251003-005', 5, 12, 'KA 7', '2025-10-03', '2025-10-03 19:25:00+07', '2025-10-04 05:45:00+07', 680000),
-- Lodaya (SLO-BD PP)
('JDW-20251003-006', 11, 17, 'KA 101', '2025-10-03', '2025-10-03 18:55:00+07', '2025-10-04 03:30:00+07', 450000),
('JDW-20251003-007', 11, 18, 'KA 102', '2025-10-03', '2025-10-03 07:20:00+07', '2025-10-03 15:55:00+07', 450000),
-- Progo (LPN-PSE PP)
('JDW-20251003-008', 16, 23, 'KA 247', '2025-10-03', '2025-10-03 15:10:00+07', '2025-10-03 23:45:00+07', 240000),
-- Matarmaja (ML-PSE PP)
('JDW-20251003-009', 7, 10, 'KA 269', '2025-10-03', '2025-10-03 07:40:00+07', '2025-10-03 23:09:00+07', 280000),
-- Sribilah (MDN-RAP PP)
('JDW-20251003-010', 9, 13, 'KA U52', '2025-10-03', '2025-10-03 15:00:00+07', '2025-10-03 21:03:00+07', 180000),
('JDW-20251003-011', 9, 14, 'KA U51', '2025-10-03', '2025-10-03 08:00:00+07', '2025-10-03 14:00:00+07', 180000),

-- ==================== TANGGAL 4 OKTOBER 2025 ====================
-- Argo Bromo Anggrek (GMR-SBI PP)
('JDW-20251004-001', 1, 1, 'KA 2', '2025-10-04', '2025-10-04 08:20:00+07', '2025-10-04 16:05:00+07', 720000),
('JDW-20251004-002', 1, 1, 'KA 4', '2025-10-04', '2025-10-04 20:30:00+07', '2025-10-05 04:15:00+07', 720000),
('JDW-20251004-003', 1, 2, 'KA 1', '2025-10-04', '2025-10-04 09:10:00+07', '2025-10-04 17:15:00+07', 720000),
('JDW-20251004-004', 1, 2, 'KA 3', '2025-10-04', '2025-10-04 21:15:00+07', '2025-10-05 05:20:00+07', 720000),
-- Taksaka (GMR-YK PP)
('JDW-20251004-005', 2, 3, 'KA 46', '2025-10-04', '2025-10-04 07:45:00+07', '2025-10-04 13:50:00+07', 600000),
('JDW-20251004-006', 2, 3, 'KA 48', '2025-10-04', '2025-10-04 21:20:00+07', '2025-10-05 03:30:00+07', 600000),
('JDW-20251004-007', 2, 4, 'KA 43', '2025-10-04', '2025-10-04 07:30:00+07', '2025-10-04 13:35:00+07', 600000),
-- Gajayana (GMR-ML PP)
('JDW-20251004-008', 4, 7, 'KA 36', '2025-10-04', '2025-10-04 18:50:00+07', '2025-10-05 07:06:00+07', 650000),
('JDW-20251004-009', 4, 8, 'KA 35', '2025-10-04', '2025-10-04 14:55:00+07', '2025-10-05 03:05:00+07', 650000),
-- Argo Wilis (BD-SGU PP)
('JDW-20251004-010', 20, 11, 'KA 5', '2025-10-04', '2025-10-04 08:15:00+07', '2025-10-04 18:10:00+07', 750000),
('JDW-20251004-011', 20, 12, 'KA 6', '2025-10-04', '2025-10-04 07:00:00+07', '2025-10-04 17:05:00+07', 750000),
-- Rajabasa (KPT-TNK PP)
('JDW-20251004-012', 18, 26, 'KA S12', '2025-10-04', '2025-10-04 08:30:00+07', '2025-10-04 17:45:00+07', 35000),

-- ==================== TANGGAL 5 OKTOBER 2025 ====================
-- Argo Bromo Anggrek (GMR-SBI PP)
('JDW-20251005-001', 1, 1, 'KA 2', '2025-10-05', '2025-10-05 08:20:00+07', '2025-10-05 16:05:00+07', 720000),
('JDW-20251005-002', 1, 1, 'KA 4', '2025-10-05', '2025-10-05 20:30:00+07', '2025-10-06 04:15:00+07', 720000),
('JDW-20251005-003', 1, 2, 'KA 1', '2025-10-05', '2025-10-05 09:10:00+07', '2025-10-05 17:15:00+07', 720000),
('JDW-20251005-004', 1, 2, 'KA 3', '2025-10-05', '2025-10-05 21:15:00+07', '2025-10-06 05:20:00+07', 720000),
-- Taksaka (GMR-YK PP)
('JDW-20251005-005', 2, 3, 'KA 46', '2025-10-05', '2025-10-05 07:45:00+07', '2025-10-05 13:50:00+07', 600000),
('JDW-20251005-006', 2, 3, 'KA 48', '2025-10-05', '2025-10-05 21:20:00+07', '2025-10-06 03:30:00+07', 600000),
('JDW-20251005-007', 2, 4, 'KA 43', '2025-10-05', '2025-10-05 07:30:00+07', '2025-10-05 13:35:00+07', 600000),
-- Jayabaya (PSE-ML PP)
('JDW-20251005-008', 6, 9, 'KA 92', '2025-10-05', '2025-10-05 17:25:00+07', '2025-10-06 06:05:00+07', 380000),
('JDW-20251005-009', 6, 10, 'KA 91', '2025-10-05', '2025-10-05 13:45:00+07', '2025-10-06 01:58:00+07', 380000),
-- Lodaya (SLO-BD PP)
('JDW-20251005-010', 11, 17, 'KA 101', '2025-10-05', '2025-10-05 18:55:00+07', '2025-10-06 03:30:00+07', 480000),
('JDW-20251005-011', 11, 18, 'KA 102', '2025-10-05', '2025-10-05 07:20:00+07', '2025-10-05 15:55:00+07', 480000),
-- Parahyangan (GMR-BD)
('JDW-20251005-012', 3, 5, 'KA 132', '2025-10-05', '2025-10-05 07:30:00+07', '2025-10-05 10:21:00+07', 250000);

-- =====================================================================
-- BAGIAN II: PENGISIAN PERHENTIAN JADWAL (2 - 5 OKTOBER 2025)
-- (CATATAN: jadwal_id merujuk pada ID dari tabel jadwal di atas)
-- =====================================================================

INSERT INTO perhentian_jadwal (jadwal_id, stasiun_id, urutan, waktu_kedatangan_estimasi, waktu_keberangkatan_estimasi) VALUES
-- ==================== TANGGAL 2 OKTOBER 2025 ====================
-- Jadwal 1: KA 2 Argo Bromo Anggrek (GMR-SBI Pagi)
(1, 1, 1, NULL, '2025-10-02 08:20:00+07'),
(1, 6, 2, '2025-10-02 10:43:00+07', '2025-10-02 10:46:00+07'),
(1, 7, 3, '2025-10-02 13:09:00+07', '2025-10-02 13:12:00+07'),
(1, 13, 4, '2025-10-02 16:05:00+07', '2025-10-02 16:05:00+07'),
-- Jadwal 2: KA 4 Argo Bromo Anggrek (GMR-SBI Malam)
(2, 1, 1, NULL, '2025-10-02 20:30:00+07'),
(2, 6, 2, '2025-10-02 22:53:00+07', '2025-10-02 22:56:00+07'),
(2, 7, 3, '2025-10-03 01:19:00+07', '2025-10-03 01:22:00+07'),
(2, 13, 4, '2025-10-03 04:15:00+07', '2025-10-03 04:15:00+07'),
-- Jadwal 3: KA 1 Argo Bromo Anggrek (SBI-GMR Pagi)
(3, 13, 1, NULL, '2025-10-02 09:10:00+07'),
(3, 29, 2, '2025-10-02 10:10:00+07', '2025-10-02 10:13:00+07'),
(3, 7, 3, '2025-10-02 12:00:00+07', '2025-10-02 12:03:00+07'),
(3, 6, 4, '2025-10-02 14:30:00+07', '2025-10-02 14:33:00+07'),
(3, 1, 5, '2025-10-02 17:15:00+07', '2025-10-02 17:15:00+07'),
-- Jadwal 4: KA 3 Argo Bromo Anggrek (SBI-GMR Malam)
(4, 13, 1, NULL, '2025-10-02 21:15:00+07'),
(4, 29, 2, '2025-10-02 22:15:00+07', '2025-10-02 22:18:00+07'),
(4, 7, 3, '2025-10-03 00:05:00+07', '2025-10-03 00:08:00+07'),
(4, 6, 4, '2025-10-03 02:45:00+07', '2025-10-03 02:48:00+07'),
(4, 1, 5, '2025-10-03 05:20:00+07', '2025-10-03 05:20:00+07'),
-- Jadwal 8: KA 36 Gajayana (GMR-ML)
(8, 1, 1, NULL, '2025-10-02 18:50:00+07'),
(8, 6, 2, '2025-10-02 21:15:00+07', '2025-10-02 21:20:00+07'),
(8, 16, 3, '2025-10-02 23:10:00+07', '2025-10-02 23:15:00+07'),
(8, 9, 4, '2025-10-03 01:10:00+07', '2025-10-03 01:15:00+07'),
(8, 11, 5, '2025-10-03 02:00:00+07', '2025-10-03 02:05:00+07'),
(8, 24, 6, '2025-10-03 03:10:00+07', '2025-10-03 03:15:00+07'),
(8, 33, 7, '2025-10-03 05:00:00+07', '2025-10-03 05:03:00+07'),
(8, 14, 8, '2025-10-03 07:06:00+07', '2025-10-03 07:06:00+07'),
-- Jadwal 12: KA 5 Argo Wilis (BD-SGU)
(12, 5, 1, NULL, '2025-10-02 08:15:00+07'),
(12, 22, 2, '2025-10-02 10:45:00+07', '2025-10-02 10:48:00+07'),
(12, 17, 3, '2025-10-02 12:00:00+07', '2025-10-02 12:03:00+07'),
(12, 9, 4, '2025-10-02 13:40:00+07', '2025-10-02 13:45:00+07'),
(12, 11, 5, '2025-10-02 14:30:00+07', '2025-10-02 14:35:00+07'),
(12, 24, 6, '2025-10-02 15:40:00+07', '2025-10-02 15:45:00+07'),
(12, 12, 7, '2025-10-02 18:10:00+07', '2025-10-02 18:10:00+07'),

-- ==================== TANGGAL 3 OKTOBER 2025 ====================
-- Jadwal 13: KA 2 Argo Bromo Anggrek (GMR-SBI Pagi)
(13, 1, 1, NULL, '2025-10-03 08:20:00+07'),
(13, 6, 2, '2025-10-03 10:43:00+07', '2025-10-03 10:46:00+07'),
(13, 7, 3, '2025-10-03 13:09:00+07', '2025-10-03 13:12:00+07'),
(13, 13, 4, '2025-10-03 16:05:00+07', '2025-10-03 16:05:00+07'),
-- Jadwal 14: KA 4 Argo Bromo Anggrek (GMR-SBI Malam)
(14, 1, 1, NULL, '2025-10-03 20:30:00+07'),
(14, 6, 2, '2025-10-03 22:53:00+07', '2025-10-03 22:56:00+07'),
(14, 7, 3, '2025-10-04 01:19:00+07', '2025-10-04 01:22:00+07'),
(14, 13, 4, '2025-10-04 04:15:00+07', '2025-10-04 04:15:00+07'),
-- Jadwal 19: KA 102 Lodaya (BD-SLO Pagi)
(19, 5, 1, NULL, '2025-10-03 07:20:00+07'),
(19, 22, 2, '2025-10-03 09:50:00+07', '2025-10-03 09:53:00+07'),
(19, 17, 3, '2025-10-03 11:05:00+07', '2025-10-03 11:08:00+07'),
(19, 9, 4, '2025-10-03 12:45:00+07', '2025-10-03 12:50:00+07'),
(19, 11, 5, '2025-10-03 13:35:00+07', '2025-10-03 13:35:00+07'),

-- ==================== TANGGAL 4 OKTOBER 2025 ====================
-- Jadwal 25: KA 2 Argo Bromo Anggrek (GMR-SBI Pagi)
(25, 1, 1, NULL, '2025-10-04 08:20:00+07'),
(25, 6, 2, '2025-10-04 10:43:00+07', '2025-10-04 10:46:00+07'),
(25, 7, 3, '2025-10-04 13:09:00+07', '2025-10-04 13:12:00+07'),
(25, 13, 4, '2025-10-04 16:05:00+07', '2025-10-04 16:05:00+07'),
-- Jadwal 26: KA 4 Argo Bromo Anggrek (GMR-SBI Malam)
(26, 1, 1, NULL, '2025-10-04 20:30:00+07'),
(26, 6, 2, '2025-10-04 22:53:00+07', '2025-10-04 22:56:00+07'),
(26, 7, 3, '2025-10-05 01:19:00+07', '2025-10-05 01:22:00+07'),
(26, 13, 4, '2025-10-05 04:15:00+07', '2025-10-05 04:15:00+07'),
-- Jadwal 31: KA 43 Taksaka (YK-GMR Pagi)
(31, 9, 1, NULL, '2025-10-04 07:30:00+07'),
(31, 16, 2, '2025-10-04 09:18:00+07', '2025-10-04 09:22:00+07'),
(31, 6, 3, '2025-10-04 11:04:00+07', '2025-10-04 11:09:00+07'),
(31, 1, 4, '2025-10-04 13:35:00+07', '2025-10-04 13:35:00+07'),

-- ==================== TANGGAL 5 OKTOBER 2025 ====================
-- Jadwal 37: KA 2 Argo Bromo Anggrek (GMR-SBI Pagi)
(37, 1, 1, NULL, '2025-10-05 08:20:00+07'),
(37, 6, 2, '2025-10-05 10:43:00+07', '2025-10-05 10:46:00+07'),
(37, 7, 3, '2025-10-05 13:09:00+07', '2025-10-05 13:12:00+07'),
(37, 13, 4, '2025-10-05 16:05:00+07', '2025-10-05 16:05:00+07'),
-- Jadwal 38: KA 4 Argo Bromo Anggrek (GMR-SBI Malam)
(38, 1, 1, NULL, '2025-10-05 20:30:00+07'),
(38, 6, 2, '2025-10-05 22:53:00+07', '2025-10-05 22:56:00+07'),
(38, 7, 3, '2025-10-06 01:19:00+07', '2025-10-06 01:22:00+07'),
(38, 13, 4, '2025-10-06 04:15:00+07', '2025-10-06 04:15:00+07'),
-- Jadwal 44: KA 92 Jayabaya (PSE-ML Malam)
(44, 2, 1, NULL, '2025-10-05 17:25:00+07'),
(44, 25, 2, '2025-10-05 17:53:00+07', '2025-10-05 17:55:00+07'),
(44, 8, 3, '2025-10-05 20:32:00+07', '2025-10-05 20:45:00+07'),
(44, 13, 4, '2025-10-05 22:45:00+07', '2025-10-05 22:55:00+07'),
(44, 12, 5, '2025-10-05 23:58:00+07', '2025-10-06 00:01:00+07'),
(44, 14, 6, '2025-10-06 02:05:00+07', '2025-10-06 02:05:00+07'),
-- Jadwal 48: KA 132 Parahyangan (GMR-BD Pagi)
(48, 1, 1, NULL, '2025-10-05 07:30:00+07'),
(48, 27, 2, '2025-10-05 09:30:00+07', '2025-10-05 09:33:00+07'),
(48, 5, 3, '2025-10-05 10:21:00+07', '2025-10-05 10:21:00+07');