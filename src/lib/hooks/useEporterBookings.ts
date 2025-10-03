import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { validateEporterBooking } from "@/lib/validators/eporter";
import type { EporterBooking } from "@/types/models";

const supabase = createClient();

export function useEporterBookingsList() {
  return useQuery({
    queryKey: ["e-porter", "bookings", "list"],
    queryFn: async () => {
      const res = await supabase.from("e_porter_booking").select("*").order("created_at", { ascending: false });
      const { data, error } = res as any;
      if (error) throw error;
      return data as EporterBooking[];
    },
  });
}

export function useCreateEporterBooking(currentUserId?: number) {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { value, error: validationError } = validateEporterBooking(payload);
      if (validationError) throw new Error(validationError || "validation_failed");
      const res = await fetch("/api/e-porter/bookings", { method: "POST", body: JSON.stringify(value), headers: { "Content-Type": "application/json" } });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "create_booking_failed");
      return result as { booking: EporterBooking; assignmentResult?: any; porter?: any };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["e-porter", "bookings"] });
      qc.invalidateQueries({ queryKey: ["e-porter", "bookings", "list"] });
    },
  });
}
