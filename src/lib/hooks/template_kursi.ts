import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { mapTemplateKursiList, mapTemplateKursi } from "@/lib/mappers/template_kursi";
import { TemplateKursiSchema } from "@/lib/validators/template_kursi";
import { useUserRole } from "@/lib/auth/useRbac";
import type { TemplateKursi } from "@/types/models";

const supabase = createClient();

export function useTemplateKursiByGerbong(gerbongId: number) {
  return useQuery({
    queryKey: ["template_kursi", "byGerbong", gerbongId],
    queryFn: async () => {
      const res = await supabase.from("template_kursi").select("*").eq("master_gerbong_id", gerbongId);
      const { data: rows, error } = res as any;
      if (error) throw error;
      const parsed = rows.map((r: any) => TemplateKursiSchema.parse(r) as TemplateKursi);
      return mapTemplateKursiList(parsed as TemplateKursi[]);
    },
    enabled: !!gerbongId,
  });
}

export function useTemplateKursi(id: number) {
  return useQuery({
    queryKey: ["template_kursi", id],
    queryFn: async () => {
      const res = await supabase.from("template_kursi").select("*").eq("template_kursi_id", id).single();
      const { data: row, error } = res as any;
      if (error) throw error;
      const parsed = TemplateKursiSchema.parse(row) as TemplateKursi;
      return mapTemplateKursi(parsed);
    },
    enabled: !!id,
  });
}

export function useCreateTemplateKursi(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (payload: any) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = TemplateKursiSchema.parse(payload);
      const res = await supabase.from("template_kursi").insert(parsed).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["template_kursi", "byGerbong", parsed.master_gerbong_id] });
      return data as TemplateKursi;
    },
  });
}

export function useUpdateTemplateKursi(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const parsed = TemplateKursiSchema.parse(payload);
      const res = await supabase.from("template_kursi").update(parsed).eq("template_kursi_id", id).select().single();
      const { data, error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["template_kursi", id] });
      qc.invalidateQueries({ queryKey: ["template_kursi", "byGerbong", parsed.master_gerbong_id] });
      return data as TemplateKursi;
    },
  });
}

export function useDeleteTemplateKursi(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  const role = useUserRole(currentUserId);
  return useMutation({
    mutationFn: async (id: number) => {
      if (role.data !== "admin") throw new Error("forbidden: admin role required");
      const res = await supabase.from("template_kursi").delete().eq("template_kursi_id", id);
      const { error } = res as any;
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["template_kursi"] });
    },
  });
}
