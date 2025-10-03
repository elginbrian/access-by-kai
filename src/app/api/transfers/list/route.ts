import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: Request) {
  const admin: any = createAdminClient();
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ ok: false, error: "userId required" }, { status: 400 });

    const r = await admin.from("transfer_requests").select("*").or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`).neq("status", "COMPLETED").order("created_at", { ascending: false });

    const { data, error } = r as any;
    if (error) return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    return NextResponse.json({ ok: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
