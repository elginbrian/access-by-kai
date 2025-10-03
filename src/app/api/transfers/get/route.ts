import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: Request) {
  const admin: any = createAdminClient();
  try {
    const url = new URL(req.url);
    const ticketId = url.searchParams.get("ticketId");
    if (!ticketId) return NextResponse.json({ ok: false, error: "ticketId required" }, { status: 400 });

    const tiketIdNum = Number(ticketId);
    if (Number.isNaN(tiketIdNum)) return NextResponse.json({ ok: false, error: "ticketId must be a number" }, { status: 400 });

    const r = await admin.from("transfer_requests").select("*").eq("tiket_id", tiketIdNum).neq("status", "COMPLETED").order("created_at", { ascending: false }).limit(1).maybeSingle();

    const { data, error } = r as any;
    if (error) return NextResponse.json({ ok: false, error: JSON.stringify(error) }, { status: 500 });
    return NextResponse.json({ ok: true, data: data ?? null });
  } catch (err: any) {
    const safe = err && typeof err === "object" ? JSON.stringify(err) : String(err);
    return NextResponse.json({ ok: false, error: err?.message ?? safe }, { status: 500 });
  }
}
