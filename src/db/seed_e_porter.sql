-- Seed data for e-porter feature (compatible with ddl_gen2.sql)

-- Insert sample porters
INSERT INTO e_porter_porter (nama, phone_number, whatsapp_number, foto_url, kapasitas, layanan_tags, rating, is_active, is_available, last_known_lat, last_known_lon)
VALUES
('Andi Porter', '+628111000111', '+628111000111', '/images/porters/andi.jpg', 2, ARRAY['bawa_bagasi','difabel_assist'], 4.8, true, true, -6.176716, 106.830508),
('Siti Porter', '+628111000222', '+628111000222', '/images/porters/siti.jpg', 3, ARRAY['bawa_bagasi','anak_bayi'], 4.6, true, true, -6.174444, 106.844444),
('Budi Porter', '+628111000333', '+628111000333', '/images/porters/budi.jpg', 1, ARRAY['express'], 4.2, true, false, -6.914167, 107.602500);

-- Insert sample e-porter bookings
INSERT INTO e_porter_booking (pemesanan_id, tiket_id, user_id, jumlah_penumpang, passenger_ids, meeting_point, meeting_lat, meeting_lon, notes, status, created_at)
VALUES
(NULL, 1, 1, 1, ARRAY[1], 'Gate A - Peron 2 (Stasiun Gambir)', -6.176716, 106.830508, 'Membantu dengan 1 koper besar', 'REQUESTED', now()),
(NULL, 2, 2, 2, ARRAY[2,3], 'Depan pintu utama Pasar Senen', -6.174444, 106.844444, 'Butuh kursi roda', 'REQUESTED', now());

-- Create sample assignments (offers sent)
INSERT INTO e_porter_assignment (e_porter_booking_id, porter_id, action, action_metadata, sent_via, provider_message_id)
VALUES
(1, 1, 'OFFERED', '{"message":"Anda memiliki tawaran tugas di Stasiun Gambir"}', 'WHATSAPP', NULL),
(1, 2, 'OFFERED', '{"message":"Anda memiliki tawaran tugas di Stasiun Gambir"}', 'WHATSAPP', NULL),
(2, 2, 'OFFERED', '{"message":"Tawaran tugas Pasar Senen, bantuan kursi roda"}', 'WHATSAPP', NULL);

-- Create sample notification logs
INSERT INTO e_porter_notification (e_porter_booking_id, porter_id, channel, payload, provider_response, status)
VALUES
(1, 1, 'WHATSAPP', '{"text":"Silakan terima tawaran"}', NULL, 'SENT'),
(1, 2, 'WHATSAPP', '{"text":"Silakan terima tawaran"}', NULL, 'SENT'),
(2, 2, 'WHATSAPP', '{"text":"Tawaran kursi roda"}', NULL, 'SENT');
