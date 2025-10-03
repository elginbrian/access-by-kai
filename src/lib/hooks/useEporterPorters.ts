import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export type UIPorter = {
  id: string;
  name: string;
  image?: string;
  status?: string;
  whatsapp_number?: string | null;
  phone_number?: string | null;
  is_available?: boolean | null;
};

export function useEporterPorters() {
  return useQuery({
    queryKey: ["e-porter", "porters", "list"],
    queryFn: async (): Promise<UIPorter[]> => {
      const res = await supabase.from("e_porter_porter").select("*").order("rating", { ascending: false });

      const { data, error } = res as any;
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: String(p.porter_id),
        name: p.nama || "Porter",
        image: p.foto_url || "/ic_person_blue.svg",
        status: p.is_available ? "Tersedia" : p.is_active ? "Tidak tersedia" : "Non-active",
        whatsapp_number: p.whatsapp_number ?? null,
        phone_number: p.phone_number ?? null,
        is_available: p.is_available ?? null,
      }));
    },
  });
}
