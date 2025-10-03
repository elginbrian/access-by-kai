import { createClient } from "@/lib/supabase";

const supabase = createClient();

export async function getStationFromTicket(ticketId: string) {
  try {
    // Query the ticket to get station information
    const { data: ticketData, error } = await supabase
      .from("tiket")
      .select(`
        segment_id,
        pemesanan_segment!inner(
          stasiun_asal_id,
          stasiun_tujuan_id,
          stasiun_asal:stasiun!stasiun_asal_id(
            stasiun_id,
            kode_stasiun,
            nama_stasiun,
            kota,
            provinsi
          ),
          stasiun_tujuan:stasiun!stasiun_tujuan_id(
            stasiun_id,
            kode_stasiun,
            nama_stasiun,
            kota,
            provinsi
          )
        )
      `)
      .eq("kode_tiket", ticketId)
      .single();

    if (error) throw error;
    if (!ticketData) return null;

    const segment = ticketData.pemesanan_segment;
    
    return {
      departure: segment.stasiun_asal,
      arrival: segment.stasiun_tujuan,
    };
  } catch (error) {
    console.error("Error fetching station from ticket:", error);
    return null;
  }
}

export async function searchStations(query: string) {
  try {
    const { data, error } = await supabase
      .from("stasiun")
      .select("stasiun_id, kode_stasiun, nama_stasiun, kota, provinsi")
      .or(`nama_stasiun.ilike.%${query}%,kota.ilike.%${query}%,kode_stasiun.ilike.%${query}%`)
      .eq("status_aktif", true)
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error searching stations:", error);
    return [];
  }
}