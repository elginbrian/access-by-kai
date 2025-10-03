import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const admin: any = createAdminClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ticketId = url.searchParams.get("ticketId");
    if (!ticketId) return NextResponse.json({ ok: false, error: "ticketId required" }, { status: 400 });

    const r = await admin.from("transfer_requests").select("*").eq("tiket_id", ticketId).neq("status", "COMPLETED").order("created_at", { ascending: false }).limit(1).maybeSingle();

    const { data, error } = r as any;
    if (error) return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    return NextResponse.json({ ok: true, data: data ?? null });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
