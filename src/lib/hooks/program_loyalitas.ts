import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { ProgramLoyalitas, NewProgramLoyalitas, UpdateProgramLoyalitas } from "@/types/models";
import { ProgramLoyalitasParsed, ProgramLoyalitasSchema } from "@/lib/validators/program_loyalitas";
import { mapProgramLoyalitas, ProgramLoyalitasUI } from "@/lib/mappers/program_loyalitas";
import { useUserRole } from "@/lib/auth/useRbac";

const supabase = createClient();

// Get all program loyalitas
export function useProgramLoyalitas() {
  return useQuery({
    queryKey: ["program_loyalitas"],
    queryFn: async (): Promise<ProgramLoyalitasUI[]> => {
      const { data, error } = await supabase.from("program_loyalitas").select("*").order("tier_level", { ascending: true });

      if (error) throw error;
      return data.map(mapProgramLoyalitas);
    },
  });
}

// Get active program loyalitas only
export function useActiveProgramLoyalitas() {
  return useQuery({
    queryKey: ["program_loyalitas", "active"],
    queryFn: async (): Promise<ProgramLoyalitasUI[]> => {
      const { data, error } = await supabase.from("program_loyalitas").select("*").eq("is_active", true).order("min_poin_required", { ascending: true });

      if (error) throw error;
      return data.map(mapProgramLoyalitas);
    },
  });
}

// Get program loyalitas by tier level
export function useProgramLoyalitasByTier(tierLevel: string) {
  return useQuery({
    queryKey: ["program_loyalitas", "tier", tierLevel],
    queryFn: async (): Promise<ProgramLoyalitasUI | null> => {
      const { data, error } = await supabase.from("program_loyalitas").select("*").eq("tier_level", tierLevel).eq("is_active", true).single();

      if (error) {
        if (error.code === "PGRST116") return null; // No rows found
        throw error;
      }
      return mapProgramLoyalitas(data);
    },
    enabled: !!tierLevel,
  });
}

// Get program loyalitas by ID
export function useProgramLoyalitasById(programId: number) {
  return useQuery({
    queryKey: ["program_loyalitas", programId],
    queryFn: async (): Promise<ProgramLoyalitasUI | null> => {
      const { data, error } = await supabase.from("program_loyalitas").select("*").eq("program_id", programId).single();

      if (error) {
        if (error.code === "PGRST116") return null; // No rows found
        throw error;
      }
      return mapProgramLoyalitas(data);
    },
    enabled: !!programId,
  });
}

// Create program loyalitas
export function useCreateProgramLoyalitas(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (program: ProgramLoyalitasParsed): Promise<ProgramLoyalitasUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const validatedProgram = ProgramLoyalitasSchema.parse(program);

      const { data, error } = await supabase.from("program_loyalitas").insert(validatedProgram).select().single();

      if (error) throw error;
      return mapProgramLoyalitas(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program_loyalitas"] });
    },
  });
}

// Update program loyalitas
export function useUpdateProgramLoyalitas(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async ({ programId, updates }: { programId: number; updates: Partial<ProgramLoyalitasParsed> }): Promise<ProgramLoyalitasUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const validatedUpdates = ProgramLoyalitasSchema.partial().parse(updates);

      const { data, error } = await supabase.from("program_loyalitas").update(validatedUpdates).eq("program_id", programId).select().single();

      if (error) throw error;
      return mapProgramLoyalitas(data);
    },
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["program_loyalitas"] });
      queryClient.invalidateQueries({ queryKey: ["program_loyalitas", programId] });
    },
  });
}

// Delete program loyalitas
export function useDeleteProgramLoyalitas(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (programId: number): Promise<void> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      const { error } = await supabase.from("program_loyalitas").delete().eq("program_id", programId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program_loyalitas"] });
      queryClient.invalidateQueries({ queryKey: ["akun_railpoints"] }); // Related table
    },
  });
}

// Toggle program loyalitas status
export function useToggleProgramLoyalitasStatus(currentUserId?: number) {
  const queryClient = useQueryClient();
  const role = useUserRole(currentUserId);

  return useMutation({
    mutationFn: async (programId: number): Promise<ProgramLoyalitasUI> => {
      // Check admin role
      if (role.data !== "admin") {
        throw new Error("forbidden: admin role required");
      }

      // First get current status
      const { data: currentData, error: fetchError } = await supabase.from("program_loyalitas").select("is_active").eq("program_id", programId).single();

      if (fetchError) throw fetchError;

      // Toggle status
      const newStatus = !currentData.is_active;

      const { data, error } = await supabase.from("program_loyalitas").update({ is_active: newStatus }).eq("program_id", programId).select().single();

      if (error) throw error;
      return mapProgramLoyalitas(data);
    },
    onSuccess: (_, programId) => {
      queryClient.invalidateQueries({ queryKey: ["program_loyalitas"] });
      queryClient.invalidateQueries({ queryKey: ["program_loyalitas", programId] });
    },
  });
}
