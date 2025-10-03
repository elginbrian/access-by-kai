import { createClient } from "@/lib/supabase";

const supabase = createClient();

export async function getStationIdByCode(stationCode: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("stasiun")
      .select("stasiun_id")
      .eq("kode_stasiun", stationCode)
      .single();

    if (error) throw error;
    return data?.stasiun_id || null;
  } catch (error) {
    console.error("Error fetching station ID:", error);
    return null;
  }
}

export async function getStationIdsByName(stationName: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("stasiun")
      .select("stasiun_id")
      .eq("nama_stasiun", stationName)
      .single();

    if (error) throw error;
    return data?.stasiun_id || null;
  } catch (error) {
    console.error("Error fetching station ID by name:", error);
    return null;
  }
}