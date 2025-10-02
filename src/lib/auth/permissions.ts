import { createClient } from "@/lib/supabase";

const supabase = createClient();

export type Role = "admin" | "user" | "guest";

export async function getUserRole(userId?: number): Promise<Role> {
  if (!userId) return "guest";
  try {
    const res = (await supabase.from("pengguna").select("role").eq("user_id", userId).single()) as any;
    if (res.error || !res.data) return "user";
    const role = res.data.role as string | undefined;
    if (!role) return "user";
    if (role === "admin") return "admin";
    return "user";
  } catch (err) {
    return "user";
  }
}

