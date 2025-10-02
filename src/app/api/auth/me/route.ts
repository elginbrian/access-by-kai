import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("sb-access-token")?.value || request.cookies.get("supabase-auth-token")?.value || null;

    const { data, error } = await supabase.auth.getUser(token || undefined);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const user = data.user || null;

    if (!user) return NextResponse.json({ user: null, profile: null });

    const { data: profile, error: profileError } = await supabase
      .from("pengguna")
      .select("*")
      .eq("email", user.email ?? "")
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching pengguna profile:", profileError);
    }

    return NextResponse.json({ user, profile: profile || null });
  } catch (err) {
    console.error("/api/auth/me error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
