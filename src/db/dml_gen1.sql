-- SEEDING DATA UNTUK SISTEM RESERVASI KERETA API
TRUNCATE 
    stasiun, kelas_kereta, sub_kelas_kereta, kereta, 
    gerbong_kereta, kursi, rute, perhentian_rute, 
    jadwal, perhentian_jadwal, menu_item_railfood
RESTART IDENTITY CASCADE;

-- MASTER DATA
INSERT INTO stasiun (kode_stasiun, nama_stasiun, kota, provinsi, status_aktif) VALUES
-- Jakarta & Sekitarnya
('GMR', 'Gambir', 'Jakarta Pusat', 'DKI Jakarta', true),
('PSE', 'Pasar Senen', 'Jakarta Pusat', 'DKI Jakarta', true),
('JNG', 'Jatinegara', 'Jakarta Timur', 'DKI Jakarta', true),
('JAKK', 'Jakarta Kota', 'Jakarta Barat', 'DKI Jakarta', true),
('MRI', 'Manggarai', 'Jakarta Selatan', 'DKI Jakarta', true),
('THB', 'Tanah Abang', 'Jakarta Pusat', 'DKI Jakarta', true),
('TPK', 'Tanjung Priok', 'Jakarta Utara', 'DKI Jakarta', true),
('DPN', 'Depok', 'Depok', 'Jawa Barat', true),
('BUA', 'Bogor', 'Bogor', 'Jawa Barat', true),
('TGR', 'Tangerang', 'Tangerang', 'Banten', true),
('SPG', 'Serpong', 'Tangerang Selatan', 'Banten', true),
-- Jawa Barat
('BD', 'Bandung', 'Bandung', 'Jawa Barat', true),
('KAC', 'Kiaracondong', 'Bandung', 'Jawa Barat', true),
('CMI', 'Cimahi', 'Cimahi', 'Jawa Barat', true),
('BJR', 'Banjar', 'Banjar', 'Jawa Barat', true),
('CN', 'Cirebon', 'Cirebon', 'Jawa Barat', true),
('CNP', 'Cirebon Prujakan', 'Cirebon', 'Jawa Barat', true),
('PWK', 'Purwakarta', 'Purwakarta', 'Jawa Barat', true),
('TSM', 'Tasikmalaya', 'Tasikmalaya', 'Jawa Barat', true),
('BKS', 'Bekasi', 'Bekasi', 'Jawa Barat', true),
('CKR', 'Cikarang', 'Bekasi', 'Jawa Barat', true),
('KW', 'Karawang', 'Karawang', 'Jawa Barat', true),
('CPD', 'Cipeundeuy', 'Garut', 'Jawa Barat', true),
('CB', 'Cibatu', 'Garut', 'Jawa Barat', true),
('LL', 'Leles', 'Garut', 'Jawa Barat', true),
('PDL', 'Padalarang', 'Bandung Barat', 'Jawa Barat', true),
('JTB', 'Jatibarang', 'Indramayu', 'Jawa Barat', true),
('HGL', 'Haurgeulis', 'Indramayu', 'Jawa Barat', true),
('SKH', 'Sukabumi', 'Sukabumi', 'Jawa Barat', true),
('CJT', 'Cianjur', 'Cianjur', 'Jawa Barat', true),
('RKB', 'Rangkasbitung', 'Lebak', 'Banten', true),
('MER', 'Merak', 'Cilegon', 'Banten', true),
('CLG', 'Cilegon', 'Cilegon', 'Banten', true),
-- Jawa Tengah
('SMT', 'Semarang Tawang', 'Semarang', 'Jawa Tengah', true),
('SMC', 'Semarang Poncol', 'Semarang', 'Jawa Tengah', true),
('PWT', 'Purwokerto', 'Banyumas', 'Jawa Tengah', true),
('SLO', 'Solo Balapan', 'Surakarta', 'Jawa Tengah', true),
('PWS', 'Purwosari', 'Surakarta', 'Jawa Tengah', true),
('TG', 'Tegal', 'Tegal', 'Jawa Tengah', true),
('PK', 'Pekalongan', 'Pekalongan', 'Jawa Tengah', true),
('KYA', 'Kroya', 'Cilacap', 'Jawa Tengah', true),
('KTA', 'Kutoarjo', 'Purworejo', 'Jawa Tengah', true),
('GB', 'Gombong', 'Kebumen', 'Jawa Tengah', true),
('KM', 'Kebumen', 'Kebumen', 'Jawa Tengah', true),
('BB', 'Brebes', 'Brebes', 'Jawa Tengah', true),
('WLR', 'Weleri', 'Kendal', 'Jawa Tengah', true),
('CP', 'Cilacap', 'Cilacap', 'Jawa Tengah', true),
('SDR', 'Sidareja', 'Cilacap', 'Jawa Tengah', true),
('MA', 'Maos', 'Cilacap', 'Jawa Tengah', true),
('GDM', 'Gandrungmangun', 'Cilacap', 'Jawa Tengah', true),
('JRL', 'Jeruklegi', 'Cilacap', 'Jawa Tengah', true),
('WG', 'Wonogiri', 'Wonogiri', 'Jawa Tengah', true),
('KR', 'Klaten', 'Klaten', 'Jawa Tengah', true),
-- DIY
('YK', 'Yogyakarta', 'Yogyakarta', 'DI Yogyakarta', true),
('LPN', 'Lempuyangan', 'Yogyakarta', 'DI Yogyakarta', true),
('WT', 'Wates', 'Kulon Progo', 'DI Yogyakarta', true),
-- Jawa Timur
('SGU', 'Surabaya Gubeng', 'Surabaya', 'Jawa Timur', true),
('SBI', 'Surabaya Pasarturi', 'Surabaya', 'Jawa Timur', true),
('WO', 'Wonokromo', 'Surabaya', 'Jawa Timur', true),
('ML', 'Malang', 'Malang', 'Jawa Timur', true),
('MLK', 'Malang Kotalama', 'Malang', 'Jawa Timur', true),
('JR', 'Jember', 'Jember', 'Jawa Timur', true),
('BWI', 'Banyuwangi Kota', 'Banyuwangi', 'Jawa Timur', true),
('KTG', 'Ketapang', 'Banyuwangi', 'Jawa Timur', true),
('MN', 'Madiun', 'Madiun', 'Jawa Timur', true),
('KD', 'Kediri', 'Kediri', 'Jawa Timur', true),
('JG', 'Jombang', 'Jombang', 'Jawa Timur', true),
('BJ', 'Bojonegoro', 'Bojonegoro', 'Jawa Timur', true),
('BG', 'Bangil', 'Pasuruan', 'Jawa Timur', true),
('BL', 'Blitar', 'Blitar', 'Jawa Timur', true),
('TA', 'Tulungagung', 'Tulungagung', 'Jawa Timur', true),
('KTS', 'Kertosono', 'Nganjuk', 'Jawa Timur', true),
('LW', 'Lawang', 'Malang', 'Jawa Timur', true),
('TGL', 'Tanggul', 'Jember', 'Jawa Timur', true),
('KLT', 'Kalisat', 'Jember', 'Jawa Timur', true),
('PBL', 'Probolinggo', 'Probolinggo', 'Jawa Timur', true),
('MDR', 'Mojokerto', 'Mojokerto', 'Jawa Timur', true),
('SDA', 'Sidoarjo', 'Sidoarjo', 'Jawa Timur', true),
-- Sumatera
('MDN', 'Medan', 'Medan', 'Sumatera Utara', true),
('KIS', 'Kisaran', 'Asahan', 'Sumatera Utara', true),
('RAP', 'Rantau Prapat', 'Labuhanbatu', 'Sumatera Utara', true),
('TBI', 'Tebing Tinggi', 'Tebing Tinggi', 'Sumatera Utara', true),
('SIR', 'Siantar', 'Pematangsiantar', 'Sumatera Utara', true),
('TJB', 'Tanjung Balai', 'Tanjungbalai', 'Sumatera Utara', true),
('LBP', 'Lubuk Pakam', 'Deli Serdang', 'Sumatera Utara', true),
('PD', 'Padang', 'Padang', 'Sumatera Barat', true),
('BIM', 'Bandara Minangkabau', 'Padang Pariaman', 'Sumatera Barat', true),
('KPT', 'Kertapati', 'Palembang', 'Sumatera Selatan', true),
('LLG', 'Lubuklinggau', 'Lubuklinggau', 'Sumatera Selatan', true),
('PBM', 'Prabumulih', 'Prabumulih', 'Sumatera Selatan', true),
('BTA', 'Baturaja', 'Ogan Komering Ulu', 'Sumatera Selatan', true),
('ME', 'Muara Enim', 'Muara Enim', 'Sumatera Selatan', true),
('TNK', 'Tanjungkarang', 'Bandar Lampung', 'Lampung', true),
('KOT', 'Kotabumi', 'Lampung Utara', 'Lampung', true);

-- 1.2: Seeding Tabel kelas_kereta
INSERT INTO kelas_kereta (nama_kelas_kategori, deskripsi) VALUES ('Eksekutif', 'Kelas layanan tertinggi'), ('Bisnis', 'Kelas layanan menengah'), ('Ekonomi', 'Kelas layanan paling terjangkau'), ('Luxury', 'Kelas layanan spesial dengan kursi sleeper'), ('Panoramic', 'Gerbong khusus dengan jendela besar');

-- 1.3: Seeding Tabel sub_kelas_kereta
INSERT INTO sub_kelas_kereta (kelas_id, nama_sub_kelas, kode_sub_kelas) VALUES (1, 'Eksekutif (AA)', 'EKS-AA'), (1, 'Eksekutif (A)', 'EKS-A'), (1, 'Eksekutif (H)', 'EKS-H'), (1, 'Eksekutif (I)', 'EKS-I'), (1, 'Eksekutif (J)', 'EKS-J'), (1, 'Eksekutif (X)', 'EKS-X'), (2, 'Bisnis (BA)', 'BIS-BA'), (2, 'Bisnis (B)', 'BIS-B'), (2, 'Bisnis (K)', 'BIS-K'), (2, 'Bisnis (N)', 'BIS-N'), (2, 'Bisnis (O)', 'BIS-O'), (2, 'Bisnis (Y)', 'BIS-Y'), (3, 'Ekonomi (CA)', 'EKO-CA'), (3, 'Ekonomi (C)', 'EKO-C'), (3, 'Ekonomi (P)', 'EKO-P'), (3, 'Ekonomi (Q)', 'EKO-Q'), (3, 'Ekonomi (S)', 'EKO-S'), (3, 'Ekonomi (Z)', 'EKO-Z'), (4, 'Luxury (A)', 'LUX-A'), (4, 'Luxury (H)', 'LUX-H'), (4, 'Luxury (I)', 'LUX-I'), (4, 'Luxury (J)', 'LUX-J'), (5, 'Panoramic', 'PAN');

INSERT INTO kereta (nomor_kereta, nama_kereta, status_aktif) VALUES
-- Kereta Eksekutif Premium
('1-4', 'Argo Bromo Anggrek', true),
('5-6', 'Argo Wilis', true),
('7-8', 'Argo Lawu', true),
('9-10', 'Argo Dwipangga', true),
('11-14', 'Argo Sindoro', true),
('15-16', 'Argo Muria', true),
('17-18', 'Argo Semeru', true),
('19-20', 'Argo Parahyangan', true),
('21-22', 'Argo Jati', true),
('23-24', 'Harina', true),
-- Kereta Jarak Jauh
('55-56', 'Gajayana', true),
('57-58', 'Brawijaya', true),
('59-60', 'Bima', true),
('61-64', 'Sembrani', true),
('65-66', 'Turangga', true),
('67-70', 'Taksaka', true),
('71-72', 'Sancaka', true),
('73-74', 'Wijayakusuma', true),
-- Kereta Malam
('103-104', 'Gaya Baru Malam Selatan', true),
('105-108', 'Jayabaya', true),
('109-110', 'Brantas', true),
('111-112', 'Majapahit', true),
('113-114', 'Sawunggalih', true),
-- Kereta Campuran
('119-120', 'Malabar', true),
('121-122', 'Lodaya', true),
('123-124', 'Siliwangi', true),
-- Kereta Ekonomi
('281-282', 'Matarmaja', true),
('283-284', 'Kahuripan', true),
('285-286', 'Pasundan', true),
('287-288', 'Ciremai', true),
('289-290', 'Kutojaya Utara', true),
('291-292', 'Bengawan', true),
('293-294', 'Progo', true),
('295-296', 'Fajar Utama', true),
('297-298', 'Menoreh', true),
('299-300', 'Purwojaya', true),
('301-308', 'Serayu', true),
('309-310', 'Logawa', true),
('311-312', 'Kamandaka', true),
-- Kereta Regional
('401-402', 'Prameks', true),
('403-404', 'KRD Bogor', true),
('405-406', 'KRD Cikarang', true),
('407-408', 'Lokal Merak', true),
('409-410', 'Commuter Surabaya', true),
-- Kereta Sumatera
('S11-S12', 'Rajabasa', true),
('S13-S14', 'Krakatau', true),
('S15-S16', 'Andalas', true),
('U65-U70', 'Putri Deli', true),
('U71-U72', 'Simalungun', true),
('U73-U74', 'Toba', true);

-- KONFIGURASI GERBONG
INSERT INTO gerbong_kereta (kereta_id, sub_kelas_id, nomor_gerbong, konfigurasi_layout) VALUES
-- KA 1: Argo Bromo Anggrek (Eks + Lux)
(1, 2, 1, '2-2'), (1, 3, 2, '2-2'), (1, 4, 3, '2-2'), (1, 4, 4, '2-2'), (1, 5, 5, '2-2'), (1, 20, 6, '1-1'),
-- KA 2: Argo Wilis (Eks + Pan)
(2, 2, 1, '2-2'), (2, 3, 2, '2-2'), (2, 4, 3, '2-2'), (2, 4, 4, '2-2'), (2, 5, 5, '2-2'), (2, 23, 6, 'Panoramic'),
-- KA 3: Argo Lawu (Eks + Lux)
(3, 2, 1, '2-2'), (3, 3, 2, '2-2'), (3, 4, 3, '2-2'), (3, 4, 4, '2-2'), (3, 5, 5, '2-2'), (3, 20, 6, '1-1'),
-- KA 4: Argo Dwipangga (Eks + Lux)
(4, 2, 1, '2-2'), (4, 3, 2, '2-2'), (4, 4, 3, '2-2'), (4, 4, 4, '2-2'), (4, 5, 5, '2-2'), (4, 20, 6, '1-1'),
-- KA 5: Argo Sindoro (Eks)
(5, 2, 1, '2-2'), (5, 3, 2, '2-2'), (5, 4, 3, '2-2'), (5, 4, 4, '2-2'), (5, 5, 5, '2-2'), (5, 5, 6, '2-2'),
-- KA 6: Argo Muria (Eks)
(6, 2, 1, '2-2'), (6, 3, 2, '2-2'), (6, 4, 3, '2-2'), (6, 4, 4, '2-2'), (6, 5, 5, '2-2'), (6, 5, 6, '2-2'),
-- KA 7: Argo Semeru (Eks)
(7, 2, 1, '2-2'), (7, 3, 2, '2-2'), (7, 4, 3, '2-2'), (7, 4, 4, '2-2'), (7, 5, 5, '2-2'), (7, 5, 6, '2-2'),
-- KA 8: Gajayana (Eks + Lux)
(8, 2, 1, '2-2'), (8, 3, 2, '2-2'), (8, 4, 3, '2-2'), (8, 4, 4, '2-2'), (8, 5, 5, '2-2'), (8, 20, 6, '1-1'),
-- KA 9: Brawijaya (Eks)
(9, 2, 1, '2-2'), (9, 3, 2, '2-2'), (9, 4, 3, '2-2'), (9, 4, 4, '2-2'), (9, 5, 5, '2-2'), (9, 5, 6, '2-2'),
-- KA 10: Bima (Eks)
(10, 2, 1, '2-2'), (10, 3, 2, '2-2'), (10, 4, 3, '2-2'), (10, 4, 4, '2-2'), (10, 5, 5, '2-2'), (10, 5, 6, '2-2'),
-- KA 11: Sembrani (Eks + Lux)
(11, 2, 1, '2-2'), (11, 3, 2, '2-2'), (11, 4, 3, '2-2'), (11, 4, 4, '2-2'), (11, 5, 5, '2-2'), (11, 20, 6, '1-1'),
-- KA 12: Turangga (Eks + Lux)
(12, 2, 1, '2-2'), (12, 3, 2, '2-2'), (12, 4, 3, '2-2'), (12, 4, 4, '2-2'), (12, 5, 5, '2-2'), (12, 20, 6, '1-1'),
-- KA 13: Taksaka (Eks + Lux)
(13, 2, 1, '2-2'), (13, 3, 2, '2-2'), (13, 4, 3, '2-2'), (13, 4, 4, '2-2'), (13, 5, 5, '2-2'), (13, 20, 6, '1-1'),
-- KA 14: Gaya Baru Malam Selatan (Eks + Eko)
(14, 2, 1, '2-2'), (14, 3, 2, '2-2'), (14, 13, 3, '2-2'), (14, 14, 4, '2-2'), (14, 14, 5, '2-2'), (14, 15, 6, '2-2'),
-- KA 15: Jayabaya (Eks + Eko)
(15, 2, 1, '2-2'), (15, 3, 2, '2-2'), (15, 13, 3, '2-2'), (15, 14, 4, '2-2'), (15, 14, 5, '2-2'), (15, 15, 6, '2-2'),
-- KA 16: Brantas (Eks + Eko)
(16, 2, 1, '2-2'), (16, 13, 2, '2-2'), (16, 14, 3, '2-2'), (16, 14, 4, '2-2'), (16, 15, 5, '2-2'), (16, 15, 6, '2-2'),
-- KA 17: Malabar (Eks + Bis + Eko)
(17, 2, 1, '2-2'), (17, 3, 2, '2-2'), (17, 8, 3, '2-2'), (17, 9, 4, '2-2'), (17, 13, 5, '2-2'), (17, 14, 6, '2-2'),
-- KA 18: Matarmaja (Eko)
(18, 14, 1, '3-2'), (18, 15, 2, '3-2'), (18, 15, 3, '3-2'), (18, 16, 4, '3-2'), (18, 16, 5, '3-2'), (18, 17, 6, '3-2'),
-- KA 19: Kahuripan (Eko)
(19, 17, 1, '3-2'), (19, 17, 2, '3-2'), (19, 17, 3, '3-2'), (19, 17, 4, '3-2'), (19, 17, 5, '3-2'), (19, 17, 6, '3-2'),
-- KA 20: Pasundan (Eko)
(20, 17, 1, '3-2'), (20, 17, 2, '3-2'), (20, 17, 3, '3-2'), (20, 17, 4, '3-2'), (20, 17, 5, '3-2'), (20, 17, 6, '3-2'),
-- KA 21: Bengawan (Eko)
(21, 17, 1, '3-2'), (21, 17, 2, '3-2'), (21, 17, 3, '3-2'), (21, 17, 4, '3-2'), (21, 17, 5, '3-2'), (21, 17, 6, '3-2'),
-- KA 22: Serayu (Eko)
(22, 17, 1, '3-2'), (22, 17, 2, '3-2'), (22, 17, 3, '3-2'), (22, 17, 4, '3-2'), (22, 17, 5, '3-2'), (22, 17, 6, '3-2'),
-- KA 23: Rajabasa (Eko)
(23, 17, 1, '3-2'), (23, 17, 2, '3-2'), (23, 17, 3, '3-2'), (23, 17, 4, '3-2'), (23, 17, 5, '3-2'), (23, 17, 6, '3-2'),
-- KA 24: Putri Deli (Eko)
(24, 17, 1, '3-2'), (24, 17, 2, '3-2'), (24, 17, 3, '3-2'), (24, 17, 4, '3-2'), (24, 17, 5, '3-2'), (24, 17, 6, '3-2'),
-- KA 25-48: Kereta tambahan
(25, 2, 1, '2-2'), (25, 3, 2, '2-2'), (25, 4, 3, '2-2'), (25, 5, 4, '2-2'), (25, 20, 5, '1-1'),
(26, 2, 1, '2-2'), (26, 3, 2, '2-2'), (26, 4, 3, '2-2'), (26, 5, 4, '2-2'),
(27, 2, 1, '2-2'), (27, 3, 2, '2-2'), (27, 13, 3, '2-2'), (27, 14, 4, '2-2'),
(28, 17, 1, '3-2'), (28, 17, 2, '3-2'), (28, 17, 3, '3-2'), (28, 17, 4, '3-2'),
(29, 17, 1, '3-2'), (29, 17, 2, '3-2'), (29, 17, 3, '3-2'), (29, 17, 4, '3-2'),
(30, 17, 1, '3-2'), (30, 17, 2, '3-2'), (30, 17, 3, '3-2'), (30, 17, 4, '3-2'),
(31, 17, 1, '3-2'), (31, 17, 2, '3-2'), (31, 17, 3, '3-2'), (31, 17, 4, '3-2'),
(32, 17, 1, '3-2'), (32, 17, 2, '3-2'), (32, 17, 3, '3-2'), (32, 17, 4, '3-2'),
(33, 17, 1, '3-2'), (33, 17, 2, '3-2'), (33, 17, 3, '3-2'), (33, 17, 4, '3-2'),
(34, 17, 1, '3-2'), (34, 17, 2, '3-2'), (34, 17, 3, '3-2'), (34, 17, 4, '3-2'),
(35, 17, 1, '3-2'), (35, 17, 2, '3-2'), (35, 17, 3, '3-2'), (35, 17, 4, '3-2'),
(36, 17, 1, '3-2'), (36, 17, 2, '3-2'), (36, 17, 3, '3-2'), (36, 17, 4, '3-2'),
(37, 17, 1, '3-2'), (37, 17, 2, '3-2'), (37, 17, 3, '3-2'), (37, 17, 4, '3-2'),
(38, 17, 1, '3-2'), (38, 17, 2, '3-2'), (38, 17, 3, '3-2'), (38, 17, 4, '3-2'),
(39, 13, 1, '2-2'), (39, 14, 2, '2-2'), (39, 15, 3, '2-2'), (39, 16, 4, '2-2'),
(40, 13, 1, '2-2'), (40, 14, 2, '2-2'), (40, 15, 3, '2-2'), (40, 16, 4, '2-2'),
(41, 13, 1, '2-2'), (41, 14, 2, '2-2'), (41, 15, 3, '2-2'), (41, 16, 4, '2-2'),
(42, 17, 1, '3-2'), (42, 17, 2, '3-2'), (42, 17, 3, '3-2'),
(43, 17, 1, '3-2'), (43, 17, 2, '3-2'), (43, 17, 3, '3-2'),
(44, 17, 1, '3-2'), (44, 17, 2, '3-2'), (44, 17, 3, '3-2'),
(45, 17, 1, '3-2'), (45, 17, 2, '3-2'), (45, 17, 3, '3-2'),
(46, 17, 1, '3-2'), (46, 17, 2, '3-2'), (46, 17, 3, '3-2'),
(47, 17, 1, '3-2'), (47, 17, 2, '3-2'), (47, 17, 3, '3-2'),
(48, 17, 1, '3-2'), (48, 17, 2, '3-2'), (48, 17, 3, '3-2');

-- FUNGSI GENERATE KURSI
CREATE OR REPLACE FUNCTION generate_seats_for_gerbong(p_gerbong_id BIGINT)
RETURNS VOID AS $$
DECLARE
    layout TEXT;
    i INT;
BEGIN
    -- Ambil konfigurasi layout dari gerbong yang bersangkutan
    SELECT konfigurasi_layout INTO layout FROM gerbong_kereta WHERE gerbong_id = p_gerbong_id;

    -- Generate kursi berdasarkan layout
    IF layout = '2-2' THEN -- Untuk Eksekutif, Bisnis, Ekonomi Premium
        FOR i IN 1..13 LOOP
            INSERT INTO kursi (gerbong_id, kode_kursi, info_posisi) VALUES
            (p_gerbong_id, i || 'A', 'jendela'),
            (p_gerbong_id, i || 'B', 'lorong'),
            (p_gerbong_id, i || 'C', 'lorong'),
            (p_gerbong_id, i || 'D', 'jendela');
        END LOOP;
    ELSIF layout = '3-2' THEN -- Untuk Ekonomi PSO
        FOR i IN 1..21 LOOP
            INSERT INTO kursi (gerbong_id, kode_kursi, info_posisi) VALUES
            (p_gerbong_id, i || 'A', 'jendela'),
            (p_gerbong_id, i || 'B', 'tengah'),
            (p_gerbong_id, i || 'C', 'lorong'),
            (p_gerbong_id, i || 'D', 'lorong'),
            (p_gerbong_id, i || 'E', 'jendela');
        END LOOP;
        INSERT INTO kursi (gerbong_id, kode_kursi, info_posisi) VALUES
        (p_gerbong_id, '22A', 'jendela'), (p_gerbong_id, '22B', 'tengah'), (p_gerbong_id, '22C', 'lorong');
    ELSIF layout = '1-1' THEN -- Untuk Luxury
        FOR i IN 1..8 LOOP
             INSERT INTO kursi (gerbong_id, kode_kursi, info_posisi) VALUES
            (p_gerbong_id, i || 'A', 'jendela'),
            (p_gerbong_id, i || 'B', 'jendela');
        END LOOP;
    ELSIF layout = 'Panoramic' THEN -- Untuk Panoramic
        FOR i IN 1..10 LOOP
             INSERT INTO kursi (gerbong_id, kode_kursi, info_posisi) VALUES
            (p_gerbong_id, i || 'A', 'jendela'),
            (p_gerbong_id, i || 'B', 'lorong'),
            (p_gerbong_id, i || 'C', 'lorong'),
            (p_gerbong_id, i || 'D', 'jendela');
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- RUTE DAN JADWAL
INSERT INTO rute (nama_rute, kode_rute) VALUES
-- Rute Utama Jawa
('Gambir - Surabaya Pasarturi (Utara)', 'GMR-SBI-UTARA'),
('Surabaya Pasarturi - Gambir (Utara)', 'SBI-GMR-UTARA'),
('Gambir - Yogyakarta (Tengah)', 'GMR-YK-TENGAH'),
('Yogyakarta - Gambir (Tengah)', 'YK-GMR-TENGAH'),
('Pasar Senen - Purwokerto (via Bandung)', 'PSE-PWT-BDG'),
('Purwokerto - Pasar Senen (via Bandung)', 'PWT-PSE-BDG'),
('Bandung - Surabaya Gubeng (Selatan)', 'BD-SGU-SELATAN'),
('Surabaya Gubeng - Bandung (Selatan)', 'SGU-BD-SELATAN'),
('Gambir - Malang (Selatan)', 'GMR-ML-SELATAN'),
('Malang - Gambir (Selatan)', 'ML-GMR-SELATAN'),
-- Rute Regional
('Jakarta Kota - Rangkasbitung', 'JAKK-RKB'),
('Rangkasbitung - Jakarta Kota', 'RKB-JAKK'),
('Jakarta Kota - Merak', 'JAKK-MER'),
('Merak - Jakarta Kota', 'MER-JAKK'),
('Gambir - Bandung', 'GMR-BD'),
('Bandung - Gambir', 'BD-GMR'),
('Yogyakarta - Solo Balapan', 'YK-SLO'),
('Solo Balapan - Yogyakarta', 'SLO-YK'),
('Surabaya Gubeng - Malang', 'SGU-ML'),
('Malang - Surabaya Gubeng', 'ML-SGU'),
('Surabaya Gubeng - Banyuwangi', 'SGU-BWI'),
('Banyuwangi - Surabaya Gubeng', 'BWI-SGU'),
-- Rute Sumatera
('Medan - Rantau Prapat', 'MDN-RAP'),
('Rantau Prapat - Medan', 'RAP-MDN'),
('Kertapati - Lubuklinggau', 'KPT-LLG'),
('Lubuklinggau - Kertapati', 'LLG-KPT'),
('Tanjungkarang - Kertapati', 'TNK-KPT'),
('Kertapati - Tanjungkarang', 'KPT-TNK'),
-- Rute Komuter
('Gambir - Bogor', 'GMR-BUA'),
('Bogor - Gambir', 'BUA-GMR'),
('Jakarta Kota - Bekasi', 'JAKK-BKS'),
('Bekasi - Jakarta Kota', 'BKS-JAKK'),
('Jakarta Kota - Cikarang', 'JAKK-CKR'),
('Cikarang - Jakarta Kota', 'CKR-JAKK');


-- PERHENTIAN RUTE SAMPLE
INSERT INTO perhentian_rute (rute_id, stasiun_id, urutan, estimasi_waktu_tempuh) VALUES 
-- Rute 1: GMR-SBI-UTARA
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'GMR'), 1, NULL),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'CN'), 2, '2 hours 23 minutes'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'PK'), 3, '1 hour 19 minutes'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'SMT'), 4, '1 hour 2 minutes'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'BJ'), 5, '1 hour 57 minutes'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'SBI'), 6, '1 hour 14 minutes'),
-- Rute 2: SBI-GMR-UTARA
(2, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'SBI'), 1, NULL),
(2, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'BJ'), 2, '1 hour 9 minutes'),
(2, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'SMT'), 3, '1 hour 53 minutes'),
(2, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'PK'), 4, '1 hour 3 minutes'),
(2, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'CN'), 5, '1 hour 20 minutes'),
(2, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'GMR'), 6, '2 hours 30 minutes'),
-- Rute 3: GMR-YK-TENGAH
(3, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'GMR'), 1, NULL),
(3, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'CN'), 2, '2 hours 23 minutes'),
(3, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'PWT'), 3, '1 hour 41 minutes'),
(3, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KYA'), 4, '22 minutes'),
(3, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KM'), 5, '33 minutes'),
(3, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KTA'), 6, '20 minutes'),
(3, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'YK'), 7, '49 minutes'),
-- Rute 4: YK-GMR-TENGAH
(4, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'YK'), 1, NULL),
(4, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KTA'), 2, '43 minutes'),
(4, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KM'), 3, '19 minutes'),
(4, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KYA'), 4, '32 minutes'),
(4, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'PWT'), 5, '24 minutes'),
(4, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'CN'), 6, '1 hour 42 minutes'),
(4, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'GMR'), 7, '2 hours 34 minutes');

INSERT INTO jadwal (kereta_id, rute_id, tanggal_keberangkatan, status_jadwal) VALUES
-- Jadwal Reguler Kereta Utama
(1, 2, '2025-10-01', 'SESUAI_JADWAL'), (1, 1, '2025-10-02', 'SESUAI_JADWAL'),
(2, 8, '2025-10-01', 'SESUAI_JADWAL'), (2, 7, '2025-10-02', 'SESUAI_JADWAL'),
(3, 4, '2025-10-01', 'SESUAI_JADWAL'), (3, 3, '2025-10-02', 'SESUAI_JADWAL'),
(8, 10, '2025-10-01', 'SESUAI_JADWAL'), (8, 9, '2025-10-02', 'SESUAI_JADWAL'),
(13, 4, '2025-10-01', 'SESUAI_JADWAL'), (13, 3, '2025-10-02', 'SESUAI_JADWAL'),
(22, 6, '2025-10-01', 'SESUAI_JADWAL'), (22, 5, '2025-10-02', 'SESUAI_JADWAL'),
-- Jadwal Harian (Oktober 2025)
(1, 2, '2025-10-03', 'SESUAI_JADWAL'), (1, 1, '2025-10-04', 'SESUAI_JADWAL'),
(1, 2, '2025-10-05', 'SESUAI_JADWAL'), (1, 1, '2025-10-06', 'SESUAI_JADWAL'),
(2, 8, '2025-10-03', 'SESUAI_JADWAL'), (2, 7, '2025-10-04', 'SESUAI_JADWAL'),
(3, 4, '2025-10-03', 'SESUAI_JADWAL'), (3, 3, '2025-10-04', 'SESUAI_JADWAL'),
(8, 10, '2025-10-03', 'SESUAI_JADWAL'), (8, 9, '2025-10-04', 'SESUAI_JADWAL'),
(13, 4, '2025-10-03', 'SESUAI_JADWAL'), (13, 3, '2025-10-04', 'SESUAI_JADWAL'),
-- Jadwal Regional dan Komuter
(42, 11, '2025-10-01', 'SESUAI_JADWAL'), (42, 12, '2025-10-01', 'SESUAI_JADWAL'),
(43, 13, '2025-10-01', 'SESUAI_JADWAL'), (43, 14, '2025-10-01', 'SESUAI_JADWAL'),
(44, 15, '2025-10-01', 'SESUAI_JADWAL'), (44, 16, '2025-10-01', 'SESUAI_JADWAL'),
(45, 29, '2025-10-01', 'SESUAI_JADWAL'), (45, 30, '2025-10-01', 'SESUAI_JADWAL'),
(46, 31, '2025-10-01', 'SESUAI_JADWAL'), (46, 32, '2025-10-01', 'SESUAI_JADWAL'),
-- Jadwal Sumatera
(47, 23, '2025-10-01', 'SESUAI_JADWAL'), (47, 24, '2025-10-01', 'SESUAI_JADWAL'),
(48, 25, '2025-10-01', 'SESUAI_JADWAL'), (48, 26, '2025-10-01', 'SESUAI_JADWAL');

-- JADWAL PERHENTIAN SAMPLE
INSERT INTO perhentian_jadwal (jadwal_id, stasiun_id, waktu_kedatangan_estimasi, waktu_keberangkatan_estimasi) VALUES 
-- Jadwal 1: Argo Bromo Anggrek (SBI-GMR)
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'SBI'), NULL, '2025-10-01 09:10:00+07'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'BJ'), '2025-10-01 10:19:00+07', '2025-10-01 10:21:00+07'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'SMT'), '2025-10-01 12:14:00+07', '2025-10-01 12:17:00+07'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'PK'), '2025-10-01 13:20:00+07', '2025-10-01 13:22:00+07'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'CN'), '2025-10-01 14:42:00+07', '2025-10-01 14:45:00+07'),
(1, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'GMR'), '2025-10-01 17:15:00+07', NULL),
-- Jadwal 5: Taksaka (YK-GMR)
(5, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'YK'), NULL, '2025-10-01 08:45:00+07'),
(5, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KTA'), '2025-10-01 09:28:00+07', '2025-10-01 09:30:00+07'),
(5, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KM'), '2025-10-01 09:49:00+07', '2025-10-01 09:51:00+07'),
(5, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'KYA'), '2025-10-01 10:23:00+07', '2025-10-01 10:25:00+07'),
(5, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'PWT'), '2025-10-01 10:47:00+07', '2025-10-01 10:50:00+07'),
(5, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'CN'), '2025-10-01 12:32:00+07', '2025-10-01 12:35:00+07'),
(5, (SELECT stasiun_id FROM stasiun WHERE kode_stasiun = 'GMR'), '2025-10-01 15:09:00+07', NULL);

-- MENU RAILFOOD
INSERT INTO menu_item_railfood (nama_item, deskripsi, harga, ketersediaan) VALUES
-- Makanan Utama
('Nasi Goreng Parahyangan', 'Nasi goreng legendaris dengan suwiran ayam, telur, dan acar', 35000.00, true),
('Nasi Rames Nusantara', 'Nasi dengan lauk ayam, orek tempe, dan sambal', 38000.00, true),
('Nasi Gudeg Yogya', 'Nasi gudeg khas Yogyakarta dengan ayam dan sambal krecek', 42000.00, true),
('Nasi Rendang Padang', 'Nasi dengan rendang daging sapi autentik Padang', 45000.00, true),
('Nasi Liwet Solo', 'Nasi liwet dengan lauk lengkap khas Solo', 40000.00, true),
('Ayam Goreng Kremes', 'Ayam goreng renyah dengan kremesan', 32000.00, true),
('Pecel Lele', 'Lele goreng dengan lalapan dan sambal pecel', 28000.00, true),
('Gado-gado Jakarta', 'Gado-gado dengan sayuran segar dan bumbu kacang', 25000.00, true),
-- Makanan Ringan
('Bakso Kuah', 'Bakso sapi hangat dengan bihun dan sawi', 25000.00, true),
('Mie Ayam', 'Mie ayam dengan pangsit dan bakso', 22000.00, true),
('Ketoprak', 'Ketoprak dengan tahu, lontong, dan bumbu kacang', 20000.00, true),
('Soto Betawi', 'Soto Betawi dengan daging dan jeroan', 30000.00, true),
('Pop Mie Ayam Bawang', 'Mie instan cup rasa ayam bawang', 15000.00, true),
('Pop Mie Soto', 'Mie instan cup rasa soto', 15000.00, true),
('Roti Cokelat', 'Roti lembut dengan isian selai cokelat', 12000.00, true),
('Roti Keju', 'Roti lembut dengan isian keju', 12000.00, true),
('Donat Gula', 'Donat manis dengan taburan gula', 10000.00, true),
('Pisang Goreng', 'Pisang goreng renyah', 8000.00, true),
-- Minuman
('Air Mineral 600ml', 'Air mineral dalam kemasan botol', 5000.00, true),
('Air Mineral 1500ml', 'Air mineral dalam kemasan botol besar', 10000.00, true),
('Teh Manis Panas', 'Minuman teh panas manis', 8000.00, true),
('Teh Tawar Panas', 'Minuman teh panas tawar', 6000.00, true),
('Kopi Hitam Panas', 'Kopi hitam tubruk panas', 10000.00, true),
('Kopi Susu Panas', 'Kopi susu hangat', 12000.00, true),
('Jus Jeruk Kemasan', 'Jus jeruk dalam kemasan kotak', 10000.00, true),
('Jus Apel Kemasan', 'Jus apel dalam kemasan kotak', 10000.00, true),
('Pocari Sweat', 'Minuman isotonik', 12000.00, true),
('Aquarius', 'Minuman isotonik rasa lemon', 12000.00, true),
('Es Teh Manis', 'Es teh manis segar', 8000.00, true),
('Es Jeruk', 'Es jeruk segar', 10000.00, true);

-- GENERATE KURSI UNTUK SEMUA GERBONG
DO $$
DECLARE
    gerbong_rec RECORD;
BEGIN
    FOR gerbong_rec IN SELECT gerbong_id FROM gerbong_kereta ORDER BY gerbong_id
    LOOP
        PERFORM generate_seats_for_gerbong(gerbong_rec.gerbong_id);
    END LOOP;
END $$;