-- Migration: Quick Booking System
-- Description: Menambahkan sistem rekomendasi pesan cepat dengan auto-update preferences

-- 1. Tabel untuk menyimpan preferensi user
CREATE TABLE IF NOT EXISTS user_booking_preferences (
    preference_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    favorite_route_ids BIGINT[], -- Rute favorit berdasarkan frekuensi
    preferred_departure_time_start TIME,
    preferred_departure_time_end TIME,
    preferred_service_types TEXT[], -- ['EKONOMI', 'EKSEKUTIF', 'LUXURY']
    frequent_origin_station_ids BIGINT[],
    frequent_destination_station_ids BIGINT[],
    total_bookings INT DEFAULT 0,
    successful_bookings INT DEFAULT 0,
    last_booking_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 2. Tabel untuk tracking interaksi dengan rekomendasi
CREATE TABLE IF NOT EXISTS quick_booking_interactions (
    interaction_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES pengguna(user_id),
    jadwal_id BIGINT NOT NULL REFERENCES jadwal(jadwal_id),
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('VIEW', 'CLICK', 'BOOK', 'ABANDON')),
    recommendation_position INT, -- 1, 2, 3
    recommendation_reason VARCHAR(50),
    session_id VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Function untuk update preferences otomatis
CREATE OR REPLACE FUNCTION update_user_booking_preferences()
RETURNS TRIGGER AS $$
BEGIN
    -- Hanya update jika status pemesanan adalah TERKONFIRMASI atau CHECK_IN
    IF NEW.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN') THEN
        -- Insert atau update preferences berdasarkan tiket yang COMPLETED
        INSERT INTO user_booking_preferences (
            user_id,
            favorite_route_ids,
            preferred_departure_time_start,
            preferred_departure_time_end,
            preferred_service_types,
            frequent_origin_station_ids,
            frequent_destination_station_ids,
            total_bookings,
            successful_bookings,
            last_booking_date,
            updated_at
        )
        SELECT 
            NEW.user_id,
            ARRAY_AGG(DISTINCT j.rute_id ORDER BY route_count DESC) FILTER (WHERE j.rute_id IS NOT NULL),
            MIN(j.waktu_berangkat)::TIME,
            MAX(j.waktu_berangkat)::TIME,
            ARRAY_AGG(DISTINCT j.kelas_kereta ORDER BY class_count DESC) FILTER (WHERE j.kelas_kereta IS NOT NULL),
            ARRAY_AGG(DISTINCT r.stasiun_asal_id ORDER BY origin_count DESC) FILTER (WHERE r.stasiun_asal_id IS NOT NULL),
            ARRAY_AGG(DISTINCT r.stasiun_tujuan_id ORDER BY dest_count DESC) FILTER (WHERE r.stasiun_tujuan_id IS NOT NULL),
            COUNT(*),
            COUNT(*) FILTER (WHERE p.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN')),
            MAX(p.waktu_pembuatan)::DATE,
            now()
        FROM pemesanan p
        JOIN pemesanan_segment ps ON p.pemesanan_id = ps.pemesanan_id
        JOIN tiket t ON ps.segment_id = t.segment_id
        JOIN jadwal j ON ps.jadwal_id = j.jadwal_id
        JOIN rute r ON j.rute_id = r.rute_id
        LEFT JOIN (
            -- Count routes by frequency for ordering
            SELECT j2.rute_id, COUNT(*) as route_count
            FROM pemesanan p2
            JOIN pemesanan_segment ps2 ON p2.pemesanan_id = ps2.pemesanan_id
            JOIN tiket t2 ON ps2.segment_id = t2.segment_id AND t2.status_tiket = 'COMPLETED'
            JOIN jadwal j2 ON ps2.jadwal_id = j2.jadwal_id
            WHERE p2.user_id = NEW.user_id AND p2.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN')
            GROUP BY j2.rute_id
        ) route_freq ON j.rute_id = route_freq.rute_id
        LEFT JOIN (
            -- Count service classes by frequency
            SELECT j2.kelas_kereta, COUNT(*) as class_count
            FROM pemesanan p2
            JOIN pemesanan_segment ps2 ON p2.pemesanan_id = ps2.pemesanan_id
            JOIN tiket t2 ON ps2.segment_id = t2.segment_id AND t2.status_tiket = 'COMPLETED'
            JOIN jadwal j2 ON ps2.jadwal_id = j2.jadwal_id
            WHERE p2.user_id = NEW.user_id AND p2.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN')
            GROUP BY j2.kelas_kereta
        ) class_freq ON j.kelas_kereta = class_freq.kelas_kereta
        LEFT JOIN (
            -- Count origin stations by frequency
            SELECT r2.stasiun_asal_id, COUNT(*) as origin_count
            FROM pemesanan p2
            JOIN pemesanan_segment ps2 ON p2.pemesanan_id = ps2.pemesanan_id
            JOIN tiket t2 ON ps2.segment_id = t2.segment_id AND t2.status_tiket = 'COMPLETED'
            JOIN jadwal j2 ON ps2.jadwal_id = j2.jadwal_id
            JOIN rute r2 ON j2.rute_id = r2.rute_id
            WHERE p2.user_id = NEW.user_id AND p2.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN')
            GROUP BY r2.stasiun_asal_id
        ) origin_freq ON r.stasiun_asal_id = origin_freq.stasiun_asal_id
        LEFT JOIN (
            -- Count destination stations by frequency
            SELECT r2.stasiun_tujuan_id, COUNT(*) as dest_count
            FROM pemesanan p2
            JOIN pemesanan_segment ps2 ON p2.pemesanan_id = ps2.pemesanan_id
            JOIN tiket t2 ON ps2.segment_id = t2.segment_id AND t2.status_tiket = 'COMPLETED'
            JOIN jadwal j2 ON ps2.jadwal_id = j2.jadwal_id
            JOIN rute r2 ON j2.rute_id = r2.rute_id
            WHERE p2.user_id = NEW.user_id AND p2.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN')
            GROUP BY r2.stasiun_tujuan_id
        ) dest_freq ON r.stasiun_tujuan_id = dest_freq.stasiun_tujuan_id
        WHERE p.user_id = NEW.user_id
            AND p.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN')
            AND t.status_tiket = 'COMPLETED'  -- Only consider completed trips
        GROUP BY p.user_id
        ON CONFLICT (user_id) DO UPDATE SET
            favorite_route_ids = EXCLUDED.favorite_route_ids,
            preferred_departure_time_start = EXCLUDED.preferred_departure_time_start,
            preferred_departure_time_end = EXCLUDED.preferred_departure_time_end,
            preferred_service_types = EXCLUDED.preferred_service_types,
            frequent_origin_station_ids = EXCLUDED.frequent_origin_station_ids,
            frequent_destination_station_ids = EXCLUDED.frequent_destination_station_ids,
            total_bookings = EXCLUDED.total_bookings,
            successful_bookings = EXCLUDED.successful_bookings,
            last_booking_date = EXCLUDED.last_booking_date,
            updated_at = now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger yang akan menjalankan function di atas
DROP TRIGGER IF EXISTS trigger_update_user_booking_preferences ON pemesanan;
CREATE TRIGGER trigger_update_user_booking_preferences
    AFTER INSERT OR UPDATE OF status_pemesanan ON pemesanan
    FOR EACH ROW
    EXECUTE FUNCTION update_user_booking_preferences();

-- 5. Index untuk performance
CREATE INDEX IF NOT EXISTS idx_user_booking_preferences_user_id ON user_booking_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_booking_interactions_user_id ON quick_booking_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_booking_interactions_jadwal_id ON quick_booking_interactions(jadwal_id);
CREATE INDEX IF NOT EXISTS idx_quick_booking_interactions_session ON quick_booking_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_quick_booking_interactions_created_at ON quick_booking_interactions(created_at);

-- 6. Function untuk populate existing data (manual execution)
CREATE OR REPLACE FUNCTION populate_existing_user_preferences()
RETURNS INTEGER AS $$
DECLARE
    user_count INTEGER := 0;
BEGIN
    -- Generate preferences untuk semua user yang sudah punya booking sukses
    INSERT INTO user_booking_preferences (
        user_id,
        favorite_route_ids,
        preferred_departure_time_start,
        preferred_departure_time_end,
        preferred_service_types,
        frequent_origin_station_ids,
        frequent_destination_station_ids,
        total_bookings,
        successful_bookings,
        last_booking_date,
        created_at,
        updated_at
    )
    SELECT 
        p.user_id,
        ARRAY_AGG(DISTINCT j.rute_id) FILTER (WHERE j.rute_id IS NOT NULL),
        MIN(j.waktu_berangkat)::TIME,
        MAX(j.waktu_berangkat)::TIME,
        ARRAY_AGG(DISTINCT j.kelas_kereta) FILTER (WHERE j.kelas_kereta IS NOT NULL),
        ARRAY_AGG(DISTINCT r.stasiun_asal_id) FILTER (WHERE r.stasiun_asal_id IS NOT NULL),
        ARRAY_AGG(DISTINCT r.stasiun_tujuan_id) FILTER (WHERE r.stasiun_tujuan_id IS NOT NULL),
        COUNT(*),
        COUNT(*) FILTER (WHERE p.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN')),
        MAX(p.tanggal_pemesanan)::DATE,
        now(),
        now()
    FROM pemesanan p
    JOIN jadwal j ON p.jadwal_id = j.jadwal_id
    JOIN rute r ON j.rute_id = r.rute_id
    WHERE p.status_pemesanan IN ('TERKONFIRMASI', 'CHECK_IN')
    GROUP BY p.user_id
    ON CONFLICT (user_id) DO NOTHING;
    
    GET DIAGNOSTICS user_count = ROW_COUNT;
    RETURN user_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Permissions
ALTER TABLE user_booking_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_booking_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies untuk user_booking_preferences
CREATE POLICY "Users can view own preferences" ON user_booking_preferences
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own preferences" ON user_booking_preferences
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- RLS Policies untuk quick_booking_interactions
CREATE POLICY "Users can view own interactions" ON quick_booking_interactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own interactions" ON quick_booking_interactions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Comments untuk dokumentasi
COMMENT ON TABLE user_booking_preferences IS 'Tabel untuk menyimpan preferensi booking user berdasarkan riwayat pemesanan';
COMMENT ON TABLE quick_booking_interactions IS 'Tabel untuk tracking interaksi user dengan rekomendasi quick booking';
COMMENT ON FUNCTION update_user_booking_preferences() IS 'Function yang otomatis update preferensi user setiap ada pemesanan baru';
COMMENT ON FUNCTION populate_existing_user_preferences() IS 'Function untuk generate preferensi untuk user existing yang sudah punya riwayat booking';