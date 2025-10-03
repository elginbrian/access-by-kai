-- =====================================================================
-- SKRIP RESET & SEEDING DATA MASTER (NON-JADWAL)
-- TUJUAN: Mengosongkan dan mengisi ulang semua data master.
-- =====================================================================

-- LANGKAH 1: Hapus semua data di semua tabel terkait untuk memastikan kebersihan.
TRUNCATE TABLE perhentian_jadwal, jadwal, perhentian_rute, rute, master_gerbong, master_kereta, stasiun, menu_railfood RESTART IDENTITY CASCADE;

-- LANGKAH 2: Isi kembali data master yang bersih dan lengkap.

-- 2.1. Tabel stasiun (108 Stasiun digabung dalam satu perintah)
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
(58, 'PBM', 'Stasiun Prabumulih', 'Prabumulih', 'Kota Prabumulih', 'Sumatera Selatan', -3.43500000, 104.23888900, 34),
(59, 'AK', 'Stasiun Angke', 'Jakarta Barat', 'Kota Administrasi Jakarta Barat', 'DKI Jakarta', -6.1453, 106.7905, 3),
(60, 'CLG', 'Stasiun Cilegon', 'Cilegon', 'Kota Cilegon', 'Banten', -6.0189, 106.0553, 6),
(61, 'MRI', 'Stasiun Manggarai', 'Jakarta Selatan', 'Kota Administrasi Jakarta Selatan', 'DKI Jakarta', -6.209, 106.8503, 13),
(62, 'MER', 'Stasiun Merak', 'Cilegon', 'Kota Cilegon', 'Banten', -5.9961, 106.0025, 3),
(63, 'PLM', 'Stasiun Palmerah', 'Jakarta Pusat', 'Kota Administrasi Jakarta Pusat', 'DKI Jakarta', -6.2057, 106.7979, 9),
(64, 'RK', 'Stasiun Rangkasbitung', 'Lebak', 'Lebak', 'Banten', -6.3572, 106.2475, 22),
(65, 'SRG', 'Stasiun Serang', 'Serang', 'Kota Serang', 'Banten', -6.1150, 106.1550, 9),
(66, 'SRP', 'Stasiun Serpong', 'Tangerang Selatan', 'Kota Tangerang Selatan', 'Banten', -6.3218, 106.6669, 46),
(67, 'SUD', 'Stasiun Sudirman', 'Jakarta Pusat', 'Kota Administrasi Jakarta Pusat', 'DKI Jakarta', -6.2023, 106.8236, 9),
(68, 'THB', 'Stasiun Tanah Abang', 'Jakarta Pusat', 'Kota Administrasi Jakarta Pusat', 'DKI Jakarta', -6.1856, 106.8123, 9),
(69, 'TNG', 'Stasiun Tangerang', 'Tangerang', 'Kota Tangerang', 'Banten', -6.1756, 106.6322, 11),
(70, 'TPK', 'Stasiun Tanjung Priok', 'Jakarta Utara', 'Kota Administrasi Jakarta Utara', 'DKI Jakarta', -6.1089, 106.8732, 4),
(71, 'BOO', 'Stasiun Bogor', 'Bogor', 'Kota Bogor', 'Jawa Barat', -6.5950, 106.7914, 246),
(72, 'CI', 'Stasiun Ciamis', 'Ciamis', 'Ciamis', 'Jawa Barat', -7.3323, 108.3490, 199),
(73, 'CJ', 'Stasiun Cianjur', 'Cianjur', 'Cianjur', 'Jawa Barat', -6.8276, 107.1420, 439),
(74, 'CB', 'Stasiun Cibatu', 'Garut', 'Garut', 'Jawa Barat', -7.1322, 108.0055, 612),
(75, 'DP', 'Stasiun Depok', 'Depok', 'Kota Depok', 'Jawa Barat', -6.3986, 106.8231, 93),
(76, 'GRT', 'Stasiun Garut', 'Garut', 'Garut', 'Jawa Barat', -7.2185, 107.9030, 717),
(77, 'HGL', 'Stasiun Haurgeulis', 'Indramayu', 'Indramayu', 'Jawa Barat', -6.4526, 107.9405, 21),
(78, 'JTB', 'Stasiun Jatibarang', 'Indramayu', 'Indramayu', 'Jawa Barat', -6.4714, 108.3079, 8),
(79, 'KW', 'Stasiun Karawang', 'Karawang', 'Karawang', 'Jawa Barat', -6.3116, 107.3060, 16),
(80, 'KAC', 'Stasiun Kiaracondong', 'Bandung', 'Kota Bandung', 'Jawa Barat', -6.9189, 107.6432, 681),
(81, 'PDL', 'Stasiun Padalarang', 'Bandung Barat', 'Bandung Barat', 'Jawa Barat', -6.8378, 107.4913, 695),
(82, 'SI', 'Stasiun Sukabumi', 'Sukabumi', 'Kota Sukabumi', 'Jawa Barat', -6.9231, 106.9292, 584),
(83, 'TSM', 'Stasiun Tasikmalaya', 'Tasikmalaya', 'Kota Tasikmalaya', 'Jawa Barat', -7.3275, 108.2238, 349),
(84, 'BTG', 'Stasiun Batang', 'Batang', 'Batang', 'Jawa Tengah', -6.9095, 109.7346, 3),
(85, 'BB', 'Stasiun Brebes', 'Brebes', 'Brebes', 'Jawa Tengah', -6.8722, 109.0392, 4),
(86, 'CU', 'Stasiun Cepu', 'Blora', 'Blora', 'Jawa Tengah', -7.1517, 111.5898, 28),
(87, 'CP', 'Stasiun Cilacap', 'Cilacap', 'Cilacap', 'Jawa Tengah', -7.7397, 109.0140, 8),
(88, 'KA', 'Stasiun Karanganyar', 'Kebumen', 'Kebumen', 'Jawa Tengah', -7.6322, 109.5658, 14),
(89, 'PML', 'Stasiun Pemalang', 'Pemalang', 'Pemalang', 'Jawa Tengah', -6.8926, 109.3789, 6),
(90, 'SK', 'Stasiun Solo Jebres', 'Surakarta', 'Kota Surakarta', 'Jawa Tengah', -7.5622, 110.8354, 91),
(91, 'SR', 'Stasiun Sragen', 'Sragen', 'Sragen', 'Jawa Tengah', -7.4260, 111.0261, 86),
(92, 'BBT', 'Stasiun Babat', 'Lamongan', 'Lamongan', 'Jawa Timur', -7.1065, 112.1643, 22),
(93, 'BWI', 'Stasiun Banyuwangi Kota', 'Banyuwangi', 'Banyuwangi', 'Jawa Timur', -8.2140, 114.3642, 89),
(94, 'KTP', 'Stasiun Ketapang', 'Banyuwangi', 'Banyuwangi', 'Jawa Timur', -8.1478, 114.3820, 7),
(95, 'LMG', 'Stasiun Lamongan', 'Lamongan', 'Lamongan', 'Jawa Timur', -7.1235, 112.4137, 2),
(96, 'PS', 'Stasiun Pasuruan', 'Pasuruan', 'Kota Pasuruan', 'Jawa Timur', -7.6416, 112.9054, 3),
(97, 'PB', 'Stasiun Probolinggo', 'Probolinggo', 'Kota Probolinggo', 'Jawa Timur', -7.7473, 113.2163, 4),
(98, 'SB', 'Stasiun Surabaya Kota', 'Surabaya', 'Kota Surabaya', 'Jawa Timur', -7.2348, 112.7410, 3),
(99, 'WO', 'Stasiun Wonokromo', 'Surabaya', 'Kota Surabaya', 'Jawa Timur', -7.2929, 112.7350, 7),
(100, 'ARB', 'Stasiun Araskabu', 'Deli Serdang', 'Deli Serdang', 'Sumatra Utara', 3.6338, 98.8475, 7),
(101, 'BIJ', 'Stasiun Binjai', 'Binjai', 'Kota Binjai', 'Sumatra Utara', 3.6053, 98.4878, 28),
(102, 'KLN', 'Stasiun Kualanamu', 'Deli Serdang', 'Deli Serdang', 'Sumatra Utara', 3.6358, 98.8788, 7),
(103, 'SIR', 'Stasiun Siantar', 'Pematangsiantar', 'Kota Pematangsiantar', 'Sumatra Utara', 2.9641, 99.0664, 383),
(104, 'BIM', 'Stasiun Bandara Internasional Minangkabau', 'Padang Pariaman', 'Padang Pariaman', 'Sumatra Barat', -0.8711, 100.2797, 2),
(105, 'PMN', 'Stasiun Pariaman', 'Pariaman', 'Kota Pariaman', 'Sumatra Barat', -0.6272, 100.1221, 2),
(106, 'KBU', 'Stasiun Kotabumi', 'Lampung Utara', 'Lampung Utara', 'Lampung', -4.8325, 104.8906, 62),
(107, 'LT', 'Stasiun Lahat', 'Lahat', 'Lahat', 'Sumatra Selatan', -3.7925, 103.5410, 80),
(108, 'MP', 'Stasiun Martapura', 'Ogan Komering Ulu Timur', 'Ogan Komering Ulu Timur', 'Sumatra Selatan', -4.3703, 104.3598, 94);

-- 2.2. Tabel menu_railfood
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

-- 2.3. Tabel master_kereta (45 Kereta)
INSERT INTO master_kereta (master_kereta_id, kode_kereta, nama_kereta, jenis_layanan, kapasitas_total, jumlah_gerbong) VALUES
(1, 'MK-ABA', 'Argo Bromo Anggrek', 'LUXURY', 450, 9),
(2, 'MK-TRG', 'Turangga', 'CAMPURAN', 400, 8),
(3, 'MK-AWS', 'Argo Wilis', 'CAMPURAN', 400, 8),
(4, 'MK-BIM', 'Bima', 'CAMPURAN', 400, 9),
(5, 'MK-GYN', 'Gajayana', 'LUXURY', 450, 9),
(6, 'MK-LAW', 'Argo Lawu', 'LUXURY', 450, 9),
(7, 'MK-DWP', 'Argo Dwipangga', 'LUXURY', 450, 9),
(8, 'MK-MRA', 'Argo Muria', 'LUXURY', 450, 9),
(9, 'MK-SMR', 'Argo Semeru', 'CAMPURAN', 400, 9),
(10, 'MK-SDO', 'Argo Sindoro', 'CAMPURAN', 450, 9),
(11, 'MK-TSK', 'Taksaka', 'LUXURY', 450, 10),
(12, 'MK-BRW', 'Brawijaya', 'EKSEKUTIF', 450, 10),
(13, 'MK-SMB', 'Sembrani', 'LUXURY', 450, 9),
(14, 'MK-MLB', 'Malabar', 'CAMPURAN', 600, 9),
(15, 'MK-MUT', 'Mutiara Selatan', 'CAMPURAN', 650, 10),
(16, 'MK-PJY', 'Purwojaya', 'CAMPURAN', 650, 10),
(17, 'MK-SWH', 'Sawunggalih', 'CAMPURAN', 650, 10),
(18, 'MK-LOD', 'Lodaya', 'CAMPURAN', 650, 10),
(19, 'MK-FUS', 'Fajar Utama Solo', 'CAMPURAN', 650, 10),
(20, 'MK-GBMS', 'Gaya Baru Malam Selatan', 'CAMPURAN', 600, 9),
(21, 'MK-JYB', 'Jayabaya', 'CAMPURAN', 600, 10),
(22, 'MK-SAK', 'Sancaka', 'CAMPURAN', 650, 10),
(23, 'MK-WJK', 'Wijayakusuma', 'CAMPURAN', 650, 10),
(24, 'MK-RGT', 'Ranggajati', 'CAMPURAN', 550, 9),
(25, 'MK-DRW', 'Dharmawangsa', 'CAMPURAN', 600, 10),
(26, 'MK-GMR', 'Gumarang', 'CAMPURAN', 550, 9),
(27, 'MK-MTR', 'Mataram', 'CAMPURAN', 650, 10),
(28, 'MK-PND', 'Pangandaran', 'CAMPURAN', 500, 8),
(29, 'MK-HNA', 'Harina', 'CAMPURAN', 650, 10),
(30, 'MK-BLB', 'Blambangan Ekspres', 'CAMPURAN', 600, 10),
(31, 'MK-PDL', 'Pandalungan', 'EKSEKUTIF', 400, 9),
(32, 'MK-AGG', 'Airlangga', 'EKONOMI', 850, 9),
(33, 'MK-TWJ', 'Tawang Jaya', 'EKONOMI', 750, 9),
(34, 'MK-PRG', 'Progo', 'EKONOMI', 850, 9),
(35, 'MK-KHP', 'Kahuripan', 'EKONOMI', 750, 8),
(36, 'MK-KTJ', 'Kertajaya', 'EKONOMI', 750, 8),
(37, 'MK-JKT', 'Jayakarta', 'EKONOMI', 750, 9),
(38, 'MK-BGW', 'Bengawan', 'EKONOMI', 850, 9),
(39, 'MK-PSD', 'Pasundan', 'EKONOMI', 750, 8),
(40, 'MK-SRY', 'Serayu', 'EKONOMI', 650, 8),
(41, 'MK-PPY', 'Papandayan', 'CAMPURAN', 500, 8),
(42, 'MK-RJA', 'Rajabasa', 'EKONOMI', 850, 9),
(43, 'MK-KLS', 'Kuala Stabas', 'EKONOMI', 530, 6),
(44, 'MK-SRB', 'Sribilah', 'CAMPURAN', 500, 8),
(45, 'MK-PUD', 'Putri Deli', 'EKONOMI', 750, 7);

-- 2.4. Tabel master_gerbong (untuk semua 45 kereta)
INSERT INTO master_gerbong (master_kereta_id, nomor_gerbong, tipe_gerbong, layout_kursi, kapasitas_kursi) VALUES
(1, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (1, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(1, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (1, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(1, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(1, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (1, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(1, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (1, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(2, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (2, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(2, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (2, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(2, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (2, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(2, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (2, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(3, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (3, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(3, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (3, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(3, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (3, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(3, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (3, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(4, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (4, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(4, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (4, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(4, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(4, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (4, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(4, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (4, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(5, 1, 'LUXURY_GEN_2', '2-1', 26),
(5, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (5, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(5, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (5, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(5, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (5, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(5, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (5, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(6, 1, 'LUXURY_GEN_2', '2-1', 26),
(6, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (6, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(6, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (6, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(6, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (6, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(6, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (6, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(7, 1, 'LUXURY_GEN_2', '2-1', 26),
(7, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (7, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(7, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (7, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(7, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (7, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(7, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (7, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(8, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (8, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(8, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (8, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(8, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(8, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (8, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(8, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (8, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(9, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (9, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(9, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (9, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(9, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (9, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(9, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (9, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(9, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(10, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (10, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(10, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (10, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(10, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(10, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (10, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(10, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (10, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(11, 1, 'LUXURY_GEN_2', '2-1', 26),
(11, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (11, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(11, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (11, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(11, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (11, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(11, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (11, 9, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(11, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(12, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (12, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(12, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (12, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(12, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(12, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (12, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(12, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (12, 9, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(12, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(13, 1, 'LUXURY_GEN_2', '2-1', 26),
(13, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (13, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(13, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (13, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(13, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (13, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(13, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (13, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(14, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (14, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(14, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (14, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(14, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (14, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(14, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (14, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(14, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(15, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (15, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(15, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (15, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(15, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (15, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(15, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (15, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(15, 9, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (15, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(16, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (16, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(16, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (16, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(16, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (16, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(16, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (16, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(16, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (16, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(17, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (17, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(17, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (17, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(17, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (17, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(17, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (17, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(17, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (17, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(18, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (18, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(18, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (18, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(18, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (18, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(18, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (18, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(18, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (18, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(19, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (19, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(19, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (19, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(19, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (19, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(19, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (19, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(19, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (19, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(20, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (20, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(20, 3, 'KERETA_MAKAN_M1', 'N/A', 0),
(20, 4, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (20, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(20, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (20, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(20, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (20, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(21, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (21, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(21, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (21, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(21, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(21, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (21, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(21, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (21, 9, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(21, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(22, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (22, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(22, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (22, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(22, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(22, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (22, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(22, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (22, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(22, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(23, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (23, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(23, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (23, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(23, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (23, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(23, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (23, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(23, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (23, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(24, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (24, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(24, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (24, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(24, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (24, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(24, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (24, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(24, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(25, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (25, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(25, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (25, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(25, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (25, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(25, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (25, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(25, 9, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (25, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(26, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (26, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(26, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (26, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(26, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (26, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(26, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (26, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(26, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(27, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (27, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(27, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (27, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(27, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (27, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(27, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (27, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(27, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (27, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(28, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (28, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(28, 3, 'KERETA_MAKAN_M1', 'N/A', 0),
(28, 4, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (28, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(28, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (28, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(28, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(29, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (29, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(29, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (29, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(29, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (29, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(29, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (29, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(29, 9, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (29, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(30, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (30, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(30, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (30, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(30, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (30, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(30, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (30, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(30, 9, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (30, 10, 'KERETA_PEMBANGKIT', 'N/A', 0),
(31, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (31, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(31, 3, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (31, 4, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(31, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(31, 6, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (31, 7, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(31, 8, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (31, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(32, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (32, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(32, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (32, 4, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(32, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(32, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (32, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(32, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (32, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(33, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (33, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(33, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (33, 4, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(33, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(33, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (33, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(33, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (33, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(34, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (34, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(34, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (34, 4, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(34, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(34, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (34, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(34, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (34, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(35, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (35, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(35, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (35, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(35, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (35, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(35, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (35, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(36, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (36, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(36, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (36, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(36, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (36, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(36, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (36, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(37, 1, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (37, 2, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(37, 3, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (37, 4, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(37, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(37, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (37, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(37, 8, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (37, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(38, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (38, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(38, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (38, 4, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(38, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(38, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (38, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(38, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (38, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(39, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (39, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(39, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (39, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(39, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (39, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(39, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (39, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(40, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (40, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(40, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (40, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(40, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (40, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(40, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (40, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(41, 1, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50), (41, 2, 'EKSEKUTIF_STAINLESS_STEEL_K1_18', '2-2', 50),
(41, 3, 'KERETA_MAKAN_M1', 'N/A', 0),
(41, 4, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (41, 5, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(41, 6, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80), (41, 7, 'EKONOMI_PREMIUM_STAINLESS_STEEL_2018', '2-2', 80),
(41, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(42, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (42, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(42, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (42, 4, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(42, 5, 'KERETA_MAKAN_M1', 'N/A', 0),
(42, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (42, 7, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(42, 8, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (42, 9, 'KERETA_PEMBANGKIT', 'N/A', 0),
(43, 1, 'EKONOMI_KEMENHUB', '2-2', 64), (43, 2, 'EKONOMI_KEMENHUB', '2-2', 64),
(43, 3, 'KERETA_MAKAN_M1', 'N/A', 0),
(43, 4, 'EKONOMI_KEMENHUB', '2-2', 64), (43, 5, 'EKONOMI_KEMENHUB', '2-2', 64),
(43, 6, 'KERETA_PEMBANGKIT', 'N/A', 0),
(44, 1, 'EKSEKUTIF_MILD_STEEL_SATWA', '2-2', 50), (44, 2, 'EKSEKUTIF_MILD_STEEL_SATWA', '2-2', 50),
(44, 3, 'KERETA_MAKAN_M1', 'N/A', 0),
(44, 4, 'EKONOMI_KEMENHUB', '2-2', 64), (44, 5, 'EKONOMI_KEMENHUB', '2-2', 64),
(44, 6, 'EKONOMI_KEMENHUB', '2-2', 64), (44, 7, 'EKONOMI_KEMENHUB', '2-2', 64),
(44, 8, 'KERETA_PEMBANGKIT', 'N/A', 0),
(45, 1, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (45, 2, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(45, 3, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (45, 4, 'KERETA_MAKAN_M1', 'N/A', 0),
(45, 5, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72), (45, 6, 'EKONOMI_NEW_GENERATION_2024', '2-2', 72),
(45, 7, 'KERETA_PEMBANGKIT', 'N/A', 0);

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
(28, 'SGU-PWT-SELATAN', 'Surabaya Gubeng - Purwokerto (via Lempuyangan)'),
(29, 'LPN-SGU-SELATAN', 'Lempuyangan - Surabaya Gubeng (Lintas Selatan)'),
(30, 'SGU-LPN-SELATAN', 'Surabaya Gubeng - Lempuyangan (Lintas Selatan)'),
(31, 'PSE-SMT-UTARA', 'Pasar Senen - Semarang Tawang (Lintas Utara)'),
(32, 'SMT-PSE-UTARA', 'Semarang Tawang - Pasar Senen (Lintas Utara)'),
(33, 'SGU-JR-TIMUR', 'Surabaya Gubeng - Jember (Lintas Timur)'),
(34, 'JR-SGU-TIMUR', 'Jember - Surabaya Gubeng (Lintas Timur)'),
(35, 'KPT-LLG-SUMSEL', 'Kertapati - Lubuklinggau (Lintas Sumatera Selatan)'),
(36, 'LLG-KPT-SUMSEL', 'Lubuklinggau - Kertapati (Lintas Sumatera Selatan)'),
(37, 'PWT-SLO-SELATAN', 'Purwokerto - Solo Balapan (Lintas Selatan)'),
(38, 'SLO-PWT-SELATAN', 'Solo Balapan - Purwokerto (Lintas Selatan)'),
(39, 'BD-SGU-LOKAL', 'Bandung - Surabaya Gubeng (via Cirebon/Utara)'),
(40, 'SGU-BD-LOKAL', 'Surabaya Gubeng - Bandung (via Cirebon/Utara)'),
(41, 'JAKK-CKP-LOKAL', 'Jakarta Kota - Cikampek (Lokal)'),
(42, 'CKP-JAKK-LOKAL', 'Cikampek - Jakarta Kota (Lokal)'),
(43, 'SBI-ML-TIMUR', 'Surabaya Pasarturi - Malang (via Sidoarjo)'),
(44, 'ML-SBI-TIMUR', 'Malang - Surabaya Pasarturi (via Sidoarjo)');

INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan) VALUES
-- Rute 1 & 2
(1, 1, 1), (1, 6, 2), (1, 28, 3), (1, 7, 4), (1, 29, 5), (1, 13, 6),
(2, 13, 1), (2, 29, 2), (2, 7, 3), (2, 28, 4), (2, 6, 5), (2, 1, 6),
-- Rute 3 & 4
(3, 1, 1), (3, 4, 2), (3, 25, 3), (3, 6, 4), (3, 16, 5), (3, 17, 6), (3, 19, 7), (3, 18, 8), (3, 43, 9), (3, 9, 10),
(4, 9, 1), (4, 43, 2), (4, 18, 3), (4, 19, 4), (4, 17, 5), (4, 16, 6), (4, 6, 7), (4, 25, 8), (4, 4, 9), (4, 1, 10),
-- Rute 5 & 6
(5, 1, 1), (5, 27, 2), (5, 5, 3),
(6, 5, 1), (6, 27, 2), (6, 1, 3),
-- Rute 7 & 8
(7, 1, 1), (7, 25, 2), (7, 6, 3), (7, 16, 4), (7, 17, 5), (7, 19, 6), (7, 18, 7), (7, 9, 8), (7, 11, 9), (7, 24, 10), (7, 37, 11), (7, 38, 12), (7, 32, 13), (7, 36, 14), (7, 33, 15), (7, 35, 16), (7, 34, 17), (7, 15, 18), (7, 14, 19),
(8, 14, 1), (8, 15, 2), (8, 34, 3), (8, 35, 4), (8, 33, 5), (8, 36, 6), (8, 32, 7), (8, 38, 8), (8, 37, 9), (8, 24, 10), (8, 11, 11), (8, 9, 12), (8, 18, 13), (8, 19, 14), (8, 17, 15), (8, 16, 16), (8, 6, 17), (8, 25, 18), (8, 1, 19),
-- Rute 9 & 10
(9, 2, 1), (9, 45, 2), (9, 6, 3), (9, 31, 4), (9, 28, 5), (9, 8, 6), (9, 29, 7), (9, 13, 8), (9, 12, 9), (9, 46, 10), (9, 47, 11), (9, 48, 12), (9, 14, 13),
(10, 14, 1), (10, 48, 2), (10, 47, 3), (10, 46, 4), (10, 12, 5), (10, 13, 6), (10, 29, 7), (10, 8, 8), (10, 28, 9), (10, 31, 10), (10, 6, 11), (10, 45, 12), (10, 2, 13),
-- Rute 11 & 12
(11, 5, 1), (11, 22, 2), (11, 17, 3), (11, 9, 4), (11, 11, 5), (11, 24, 6), (11, 38, 7), (11, 39, 8), (11, 40, 9), (11, 12, 10),
(12, 12, 1), (12, 40, 2), (12, 39, 3), (12, 38, 4), (12, 24, 5), (12, 11, 6), (12, 9, 7), (12, 17, 8), (12, 22, 9), (12, 5, 10),
-- Rute 13 & 14
(13, 20, 1), (13, 55, 2), (13, 54, 3), (13, 53, 4),
(14, 53, 1), (14, 54, 2), (14, 55, 3), (14, 20, 4),
-- Rute 15 & 16
(15, 1, 1), (15, 25, 2), (15, 45, 3), (15, 6, 4),
(16, 6, 1), (16, 45, 2), (16, 25, 3), (16, 1, 4),
-- Rute 17 & 18
(17, 11, 1), (17, 9, 2), (17, 18, 3), (17, 17, 4), (17, 22, 5), (17, 5, 6),
(18, 5, 1), (18, 22, 2), (18, 17, 3), (18, 18, 4), (18, 9, 5), (18, 11, 6),
-- Rute 19 & 20
(19, 9, 1), (19, 11, 2), (19, 24, 3), (19, 32, 4), (19, 33, 5), (19, 14, 6),
(20, 14, 1), (20, 33, 2), (20, 32, 3), (20, 24, 4), (20, 11, 5), (20, 9, 6),
-- Rute 21 & 22
(21, 2, 1), (21, 6, 2), (21, 16, 3), (21, 17, 4), (21, 19, 5), (21, 18, 6),
(22, 18, 1), (22, 19, 2), (22, 17, 3), (22, 16, 4), (22, 6, 5), (22, 2, 6),
-- Rute 23 & 24
(23, 10, 1), (23, 42, 2), (23, 41, 3), (23, 16, 4), (23, 30, 5), (23, 4, 6), (23, 2, 7),
(24, 2, 1), (24, 4, 2), (24, 30, 3), (24, 16, 4), (24, 41, 5), (24, 42, 6), (24, 10, 7),
-- Rute 25 & 26
(25, 52, 1), (25, 57, 2), (25, 58, 3), (25, 21, 4),
(26, 21, 1), (26, 58, 2), (26, 57, 3), (26, 52, 4),
-- Rute 27 & 28
(27, 16, 1), (27, 17, 2), (27, 9, 3), (27, 11, 4), (27, 24, 5), (27, 12, 6),
(28, 12, 1), (28, 24, 2), (28, 11, 3), (28, 9, 4), (28, 17, 5), (28, 16, 6),
-- Rute 29 & 30
(29, 10, 1), (29, 42, 2), (29, 11, 3), (29, 24, 4), (29, 38, 5), (29, 39, 6), (29, 40, 7), (29, 12, 8),
(30, 12, 1), (30, 40, 2), (30, 39, 3), (30, 38, 4), (30, 24, 5), (30, 11, 6), (30, 42, 7), (30, 10, 8),
-- Rute 31 & 32
(31, 2, 1), (31, 45, 2), (31, 30, 3), (31, 31, 4), (31, 28, 5), (31, 7, 6),
(32, 7, 1), (32, 28, 2), (32, 31, 3), (32, 30, 4), (32, 45, 5), (32, 2, 6),
-- Rute 33 & 34
(33, 12, 1), (33, 46, 2), (33, 47, 3), (33, 23, 4),
(34, 23, 1), (34, 47, 2), (34, 46, 3), (34, 12, 4),
-- Rute 35 & 36
(35, 21, 1), (35, 58, 2), (35, 56, 3),
(36, 56, 1), (36, 58, 2), (36, 21, 3),
-- Rute 37 & 38
(37, 16, 1), (37, 17, 2), (37, 18, 3), (37, 9, 4), (37, 10, 5), (37, 42, 6), (37, 11, 7),
(38, 11, 1), (38, 42, 2), (38, 10, 3), (38, 9, 4), (38, 18, 5), (38, 17, 6), (38, 16, 7),
-- Rute 39 & 40
(39, 5, 1), (39, 26, 2), (39, 45, 3), (39, 6, 4), (39, 7, 5), (39, 29, 6), (39, 13, 7), (39, 12, 8),
(40, 12, 1), (40, 13, 2), (40, 29, 3), (40, 7, 4), (40, 6, 5), (40, 45, 6), (40, 26, 7), (40, 5, 8),
-- Rute 41 & 42
(41, 3, 1), (41, 2, 2), (41, 4, 3), (41, 25, 4), (41, 45, 5),
(42, 45, 1), (42, 25, 2), (42, 4, 3), (42, 2, 4), (42, 3, 5),
-- Rute 43 & 44
(43, 13, 1), (43, 12, 2), (43, 46, 3), (43, 47, 4), (43, 48, 5), (43, 14, 6),
(44, 14, 1), (44, 48, 2), (44, 47, 3), (44, 46, 4), (44, 12, 5), (44, 13, 6);

-- LANGKAH 1: Hapus data jadwal lama untuk memastikan kebersihan
TRUNCATE TABLE jadwal, perhentian_jadwal RESTART IDENTITY CASCADE;

-- LANGKAH 2: Masukkan data jadwal baru (132 jadwal)
INSERT INTO jadwal (kode_jadwal, master_kereta_id, rute_id, nomor_ka, tanggal_keberangkatan, waktu_berangkat_origin, waktu_tiba_destination, harga_base) VALUES
-- ==================== TANGGAL 4 OKTOBER 2025 ====================
('JDW-20251004-001', 1, 1, 'KA 2', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 16:30:00+07', 720000),
('JDW-20251004-002', 1, 2, 'KA 1', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 04:30:00+07', 720000),
('JDW-20251004-003', 11, 3, 'KA 46', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 14:30:00+07', 600000),
('JDW-20251004-004', 11, 4, 'KA 43', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 02:30:00+07', 600000),
('JDW-20251004-005', 28, 5, 'KA 132', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 11:00:00+07', 250000),
('JDW-20251004-006', 28, 6, 'KA 131', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-04 23:00:00+07', 250000),
('JDW-20251004-007', 5, 7, 'KA 36', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 20:00:00+07', 650000),
('JDW-20251004-008', 5, 8, 'KA 35', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 08:00:00+07', 650000),
('JDW-20251004-009', 21, 9, 'KA 92', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 20:30:00+07', 380000),
('JDW-20251004-010', 21, 10, 'KA 91', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 08:30:00+07', 380000),
('JDW-20251004-011', 2, 11, 'KA 6', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 18:00:00+07', 550000),
('JDW-20251004-012', 2, 12, 'KA 5', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 06:00:00+07', 550000),
('JDW-20251004-013', 44, 13, 'KA U52', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 14:00:00+07', 180000),
('JDW-20251004-014', 44, 14, 'KA U51', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 02:00:00+07', 180000),
('JDW-20251004-015', 10, 15, 'KA 22', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 10:30:00+07', 150000),
('JDW-20251004-016', 10, 16, 'KA 21', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-04 22:30:00+07', 150000),
('JDW-20251004-017', 18, 17, 'KA 101', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 16:00:00+07', 450000),
('JDW-20251004-018', 18, 18, 'KA 102', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 04:00:00+07', 450000),
('JDW-20251004-019', 22, 19, 'KA 112', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 12:00:00+07', 300000),
('JDW-20251004-020', 22, 20, 'KA 111', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 00:00:00+07', 300000),
('JDW-20251004-021', 17, 21, 'KA 152', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 14:00:00+07', 280000),
('JDW-20251004-022', 17, 22, 'KA 151', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 02:00:00+07', 280000),
('JDW-20251004-023', 34, 23, 'KA 247', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 16:00:00+07', 240000),
('JDW-20251004-024', 34, 24, 'KA 248', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 04:00:00+07', 240000),
('JDW-20251004-025', 42, 25, 'KA S12', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 17:00:00+07', 35000),
('JDW-20251004-026', 42, 26, 'KA S11', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 05:00:00+07', 35000),
('JDW-20251004-027', 23, 27, 'KA 122', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 15:00:00+07', 320000),
('JDW-20251004-028', 23, 28, 'KA 121', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 03:00:00+07', 320000),
('JDW-20251004-029', 20, 29, 'KA 118', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 16:00:00+07', 350000),
('JDW-20251004-030', 20, 30, 'KA 117', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 04:00:00+07', 350000),
('JDW-20251004-031', 33, 31, 'KA 212', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 14:00:00+07', 200000),
('JDW-20251004-032', 33, 32, 'KA 211', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 02:00:00+07', 200000),
('JDW-20251004-033', 24, 33, 'KA 142', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 12:30:00+07', 280000),
('JDW-20251004-034', 24, 34, 'KA 141', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 00:30:00+07', 280000),
('JDW-20251004-035', 43, 35, 'KA S4', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 12:00:00+07', 100000),
('JDW-20251004-036', 43, 36, 'KA S3', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 00:00:00+07', 100000),
('JDW-20251004-037', 16, 37, 'KA 110', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 14:00:00+07', 290000),
('JDW-20251004-038', 16, 38, 'KA 109', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 02:00:00+07', 290000),
('JDW-20251004-039', 29, 39, 'KA 162', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 18:30:00+07', 400000),
('JDW-20251004-040', 29, 40, 'KA 161', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-05 06:30:00+07', 400000),
('JDW-20251004-041', 37, 41, 'KA 322', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 10:30:00+07', 75000),
('JDW-20251004-042', 37, 42, 'KA 321', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-04 22:30:00+07', 75000),
('JDW-20251004-043', 32, 43, 'KA 236', '2025-10-04', '2025-10-04 08:00:00+07', '2025-10-04 11:30:00+07', 150000),
('JDW-20251004-044', 32, 44, 'KA 235', '2025-10-04', '2025-10-04 20:00:00+07', '2025-10-04 23:30:00+07', 150000),

-- ==================== TANGGAL 5 OKTOBER 2025 ====================
('JDW-20251005-045', 1, 1, 'KA 2', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 16:30:00+07', 720000),
('JDW-20251005-046', 1, 2, 'KA 1', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 04:30:00+07', 720000),
('JDW-20251005-047', 11, 3, 'KA 46', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 14:30:00+07', 600000),
('JDW-20251005-048', 11, 4, 'KA 43', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 02:30:00+07', 600000),
('JDW-20251005-049', 28, 5, 'KA 132', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 11:00:00+07', 250000),
('JDW-20251005-050', 28, 6, 'KA 131', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-05 23:00:00+07', 250000),
('JDW-20251005-051', 5, 7, 'KA 36', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 20:00:00+07', 650000),
('JDW-20251005-052', 5, 8, 'KA 35', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 08:00:00+07', 650000),
('JDW-20251005-053', 21, 9, 'KA 92', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 20:30:00+07', 380000),
('JDW-20251005-054', 21, 10, 'KA 91', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 08:30:00+07', 380000),
('JDW-20251005-055', 2, 11, 'KA 6', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 18:00:00+07', 550000),
('JDW-20251005-056', 2, 12, 'KA 5', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 06:00:00+07', 550000),
('JDW-20251005-057', 44, 13, 'KA U52', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 14:00:00+07', 180000),
('JDW-20251005-058', 44, 14, 'KA U51', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 02:00:00+07', 180000),
('JDW-20251005-059', 10, 15, 'KA 22', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 10:30:00+07', 150000),
('JDW-20251005-060', 10, 16, 'KA 21', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-05 22:30:00+07', 150000),
('JDW-20251005-061', 18, 17, 'KA 101', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 16:00:00+07', 450000),
('JDW-20251005-062', 18, 18, 'KA 102', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 04:00:00+07', 450000),
('JDW-20251005-063', 22, 19, 'KA 112', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 12:00:00+07', 300000),
('JDW-20251005-064', 22, 20, 'KA 111', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 00:00:00+07', 300000),
('JDW-20251005-065', 17, 21, 'KA 152', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 14:00:00+07', 280000),
('JDW-20251005-066', 17, 22, 'KA 151', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 02:00:00+07', 280000),
('JDW-20251005-067', 34, 23, 'KA 247', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 16:00:00+07', 240000),
('JDW-20251005-068', 34, 24, 'KA 248', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 04:00:00+07', 240000),
('JDW-20251005-069', 42, 25, 'KA S12', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 17:00:00+07', 35000),
('JDW-20251005-070', 42, 26, 'KA S11', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 05:00:00+07', 35000),
('JDW-20251005-071', 23, 27, 'KA 122', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 15:00:00+07', 320000),
('JDW-20251005-072', 23, 28, 'KA 121', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 03:00:00+07', 320000),
('JDW-20251005-073', 20, 29, 'KA 118', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 16:00:00+07', 350000),
('JDW-20251005-074', 20, 30, 'KA 117', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 04:00:00+07', 350000),
('JDW-20251005-075', 33, 31, 'KA 212', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 14:00:00+07', 200000),
('JDW-20251005-076', 33, 32, 'KA 211', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 02:00:00+07', 200000),
('JDW-20251005-077', 24, 33, 'KA 142', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 12:30:00+07', 280000),
('JDW-20251005-078', 24, 34, 'KA 141', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 00:30:00+07', 280000),
('JDW-20251005-079', 43, 35, 'KA S4', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 12:00:00+07', 100000),
('JDW-20251005-080', 43, 36, 'KA S3', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 00:00:00+07', 100000),
('JDW-20251005-081', 16, 37, 'KA 110', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 14:00:00+07', 290000),
('JDW-20251005-082', 16, 38, 'KA 109', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 02:00:00+07', 290000),
('JDW-20251005-083', 29, 39, 'KA 162', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 18:30:00+07', 400000),
('JDW-20251005-084', 29, 40, 'KA 161', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-06 06:30:00+07', 400000),
('JDW-20251005-085', 37, 41, 'KA 322', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 10:30:00+07', 75000),
('JDW-20251005-086', 37, 42, 'KA 321', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-05 22:30:00+07', 75000),
('JDW-20251005-087', 32, 43, 'KA 236', '2025-10-05', '2025-10-05 08:00:00+07', '2025-10-05 11:30:00+07', 150000),
('JDW-20251005-088', 32, 44, 'KA 235', '2025-10-05', '2025-10-05 20:00:00+07', '2025-10-05 23:30:00+07', 150000),

-- ==================== TANGGAL 6 OKTOBER 2025 ====================
('JDW-20251006-089', 1, 1, 'KA 2', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 16:30:00+07', 680000),
('JDW-20251006-090', 1, 2, 'KA 1', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 04:30:00+07', 680000),
('JDW-20251006-091', 11, 3, 'KA 46', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 14:30:00+07', 580000),
('JDW-20251006-092', 11, 4, 'KA 43', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 02:30:00+07', 580000),
('JDW-20251006-093', 28, 5, 'KA 132', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 11:00:00+07', 220000),
('JDW-20251006-094', 28, 6, 'KA 131', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-06 23:00:00+07', 220000),
('JDW-20251006-095', 5, 7, 'KA 36', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 20:00:00+07', 620000),
('JDW-20251006-096', 5, 8, 'KA 35', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 08:00:00+07', 620000),
('JDW-20251006-097', 21, 9, 'KA 92', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 20:30:00+07', 350000),
('JDW-20251006-098', 21, 10, 'KA 91', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 08:30:00+07', 350000),
('JDW-20251006-099', 2, 11, 'KA 6', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 18:00:00+07', 520000),
('JDW-20251006-100', 2, 12, 'KA 5', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 06:00:00+07', 520000),
('JDW-20251006-101', 44, 13, 'KA U52', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 14:00:00+07', 160000),
('JDW-20251006-102', 44, 14, 'KA U51', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 02:00:00+07', 160000),
('JDW-20251006-103', 10, 15, 'KA 22', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 10:30:00+07', 130000),
('JDW-20251006-104', 10, 16, 'KA 21', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-06 22:30:00+07', 130000),
('JDW-20251006-105', 18, 17, 'KA 101', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 16:00:00+07', 420000),
('JDW-20251006-106', 18, 18, 'KA 102', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 04:00:00+07', 420000),
('JDW-20251006-107', 22, 19, 'KA 112', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 12:00:00+07', 280000),
('JDW-20251006-108', 22, 20, 'KA 111', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 00:00:00+07', 280000),
('JDW-20251006-109', 17, 21, 'KA 152', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 14:00:00+07', 260000),
('JDW-20251006-110', 17, 22, 'KA 151', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 02:00:00+07', 260000),
('JDW-20251006-111', 34, 23, 'KA 247', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 16:00:00+07', 220000),
('JDW-20251006-112', 34, 24, 'KA 248', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 04:00:00+07', 220000),
('JDW-20251006-113', 42, 25, 'KA S12', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 17:00:00+07', 32000),
('JDW-20251006-114', 42, 26, 'KA S11', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 05:00:00+07', 32000),
('JDW-20251006-115', 23, 27, 'KA 122', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 15:00:00+07', 300000),
('JDW-20251006-116', 23, 28, 'KA 121', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 03:00:00+07', 300000),
('JDW-20251006-117', 20, 29, 'KA 118', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 16:00:00+07', 330000),
('JDW-20251006-118', 20, 30, 'KA 117', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 04:00:00+07', 330000),
('JDW-20251006-119', 33, 31, 'KA 212', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 14:00:00+07', 190000),
('JDW-20251006-120', 33, 32, 'KA 211', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 02:00:00+07', 190000),
('JDW-20251006-121', 24, 33, 'KA 142', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 12:30:00+07', 260000),
('JDW-20251006-122', 24, 34, 'KA 141', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 00:30:00+07', 260000),
('JDW-20251006-123', 43, 35, 'KA S4', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 12:00:00+07', 90000),
('JDW-20251006-124', 43, 36, 'KA S3', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 00:00:00+07', 90000),
('JDW-20251006-125', 16, 37, 'KA 110', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 14:00:00+07', 270000),
('JDW-20251006-126', 16, 38, 'KA 109', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 02:00:00+07', 270000),
('JDW-20251006-127', 29, 39, 'KA 162', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 18:30:00+07', 380000),
('JDW-20251006-128', 29, 40, 'KA 161', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-07 06:30:00+07', 380000),
('JDW-20251006-129', 37, 41, 'KA 322', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 10:30:00+07', 70000),
('JDW-20251006-130', 37, 42, 'KA 321', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-06 22:30:00+07', 70000),
('JDW-20251006-131', 32, 43, 'KA 236', '2025-10-06', '2025-10-06 08:00:00+07', '2025-10-06 11:30:00+07', 140000),
('JDW-20251006-132', 32, 44, 'KA 235', '2025-10-06', '2025-10-06 20:00:00+07', '2025-10-06 23:30:00+07', 140000);

CREATE OR REPLACE FUNCTION populate_schedule_stops()
RETURNS VARCHAR AS $$
DECLARE
    j RECORD; -- Untuk setiap baris di tabel jadwal
    s RECORD; -- Untuk setiap baris di tabel perhentian_rute
    stop_count INT;
    total_duration INTERVAL;
    time_per_leg INTERVAL;
    current_stop_arrival TIMESTAMP WITH TIME ZONE;
    total_stops_inserted INT := 0;
BEGIN
    -- 1. Hapus data lama untuk memastikan kebersihan
    RAISE NOTICE 'Clearing old schedule stops data...';
    TRUNCATE TABLE perhentian_jadwal RESTART IDENTITY;

    -- 2. Loop melalui setiap jadwal yang ada
    RAISE NOTICE 'Populating schedule stops...';
    FOR j IN SELECT * FROM jadwal ORDER BY jadwal_id LOOP
        -- Hitung durasi total dan jumlah perhentian untuk jadwal ini
        total_duration := j.waktu_tiba_destination - j.waktu_berangkat_origin;
        SELECT count(*) INTO stop_count FROM perhentian_rute WHERE rute_id = j.rute_id;

        -- Hitung rata-rata waktu antar perhentian
        IF stop_count > 1 THEN
            time_per_leg := total_duration / (stop_count - 1);
        ELSE
            time_per_leg := '0 minutes'::interval;
        END IF;

        -- 3. Loop melalui setiap perhentian di rute jadwal ini
        FOR s IN SELECT * FROM perhentian_rute WHERE rute_id = j.rute_id ORDER BY urutan LOOP
            IF s.urutan = 1 THEN
                -- Stasiun pertama (origin)
                INSERT INTO perhentian_jadwal(jadwal_id, stasiun_id, urutan, waktu_kedatangan_estimasi, waktu_keberangkatan_estimasi)
                VALUES (j.jadwal_id, s.stasiun_id, s.urutan, NULL, j.waktu_berangkat_origin);
            ELSIF s.urutan = stop_count THEN
                -- Stasiun terakhir (destination)
                INSERT INTO perhentian_jadwal(jadwal_id, stasiun_id, urutan, waktu_kedatangan_estimasi, waktu_keberangkatan_estimasi)
                VALUES (j.jadwal_id, s.stasiun_id, s.urutan, j.waktu_tiba_destination, j.waktu_tiba_destination);
            ELSE
                -- Stasiun perhentian di tengah
                current_stop_arrival := j.waktu_berangkat_origin + (time_per_leg * (s.urutan - 1));
                INSERT INTO perhentian_jadwal(jadwal_id, stasiun_id, urutan, waktu_kedatangan_estimasi, waktu_keberangkatan_estimasi)
                VALUES (j.jadwal_id, s.stasiun_id, s.urutan, current_stop_arrival, current_stop_arrival + '3 minutes'::interval);
            END IF;
            total_stops_inserted := total_stops_inserted + 1;
        END LOOP;
    END LOOP;

    RETURN 'Successfully generated ' || total_stops_inserted || ' schedule stops for ' || (SELECT count(*) FROM jadwal) || ' schedules.';
END;
$$ LANGUAGE plpgsql;

SELECT populate_schedule_stops();

CREATE OR REPLACE FUNCTION generate_template_kursi()
RETURNS VOID AS $$
DECLARE
    gerbong RECORD;
    baris INT;
    total_kursi INT;
    kolom_kiri INT;
    kolom_kanan INT;
    kolom_labels TEXT[];
    posisi_kursi_enum posisi_kursi;
    is_premium_flag BOOLEAN;
    fasilitas JSONB;
BEGIN
    TRUNCATE TABLE template_kursi RESTART IDENTITY CASCADE;

    FOR gerbong IN SELECT * FROM master_gerbong WHERE layout_kursi != 'N/A' LOOP
        kolom_kiri := CAST(SPLIT_PART(gerbong.layout_kursi, '-', 1) AS INT);
        kolom_kanan := CAST(SPLIT_PART(gerbong.layout_kursi, '-', 2) AS INT);

        IF gerbong.layout_kursi = '1-1' THEN kolom_labels := ARRAY['A', 'C'];
        ELSEIF gerbong.layout_kursi = '2-1' THEN kolom_labels := ARRAY['A', 'B', 'C'];
        ELSEIF gerbong.layout_kursi = '2-2' THEN kolom_labels := ARRAY['A', 'B', 'C', 'D'];
        ELSEIF gerbong.layout_kursi = '3-2' THEN kolom_labels := ARRAY['A', 'B', 'C', 'D', 'E'];
        ELSE kolom_labels := ARRAY['A', 'B', 'C', 'D', 'E', 'F'];
        END IF;

        is_premium_flag := gerbong.tipe_gerbong::TEXT LIKE '%LUXURY%' OR gerbong.tipe_gerbong::TEXT LIKE '%SUITES%';

        IF is_premium_flag THEN
            fasilitas := '{"recliner": true, "leg_rest": true, "personal_light": true, "usb_port": true, "entertainment_screen": true}';
        ELSEIF gerbong.tipe_gerbong::TEXT LIKE '%EKSEKUTIF%' THEN
            fasilitas := '{"recliner": true, "leg_rest": false, "personal_light": true, "usb_port": true}';
        ELSE
            fasilitas := '{"recliner": false, "leg_rest": false, "personal_light": false, "usb_port": true}';
        END IF;

        baris := 1;
        total_kursi := 0;
        WHILE total_kursi < gerbong.kapasitas_kursi LOOP
            -- Loop untuk kolom kiri (kursi sisi kiri)
            FOR i IN 1..kolom_kiri LOOP
                IF total_kursi < gerbong.kapasitas_kursi THEN
                    -- ================== PERBAIKAN DI SINI ==================
                    IF i = 1 THEN posisi_kursi_enum := 'jendela';
                    ELSEIF i = kolom_kiri THEN posisi_kursi_enum := 'lorong';
                    ELSE posisi_kursi_enum := 'tengah';
                    END IF;
                    
                    INSERT INTO template_kursi(master_gerbong_id, kode_kursi, posisi, is_premium, fasilitas_kursi)
                    VALUES (gerbong.master_gerbong_id, baris || kolom_labels[i], posisi_kursi_enum, is_premium_flag, fasilitas);
                    total_kursi := total_kursi + 1;
                END IF;
            END LOOP;

            FOR i IN 1..kolom_kanan LOOP
                IF total_kursi < gerbong.kapasitas_kursi THEN
                    IF i = 1 THEN posisi_kursi_enum := 'lorong';
                    ELSEIF i = kolom_kanan THEN posisi_kursi_enum := 'jendela';
                    ELSE posisi_kursi_enum := 'tengah';
                    END IF;

                    INSERT INTO template_kursi(master_gerbong_id, kode_kursi, posisi, is_premium, fasilitas_kursi)
                    VALUES (gerbong.master_gerbong_id, baris || kolom_labels[kolom_kiri + i], posisi_kursi_enum, is_premium_flag, fasilitas);
                    total_kursi := total_kursi + 1;
                END IF;
            END LOOP;

            baris := baris + 1;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT generate_template_kursi();