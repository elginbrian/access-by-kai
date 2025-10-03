import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const admin: any = createAdminClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requestId, userId } = body;
    if (!requestId || !userId) return NextResponse.json({ ok: false, error: "requestId and userId required" }, { status: 400 });

    const r = await admin.from("transfer_requests").select("*").eq("id", requestId).single();
    const { data: reqRow, error: reqErr } = r as any;
    if (reqErr) return NextResponse.json({ ok: false, error: String(reqErr) }, { status: 500 });
    if (!reqRow) return NextResponse.json({ ok: false, error: "request not found" }, { status: 404 });

    const isFrom = Number(reqRow.from_user_id) === Number(userId);
    const isTo = Number(reqRow.to_user_id) === Number(userId);
    if (!isFrom && !isTo) return NextResponse.json({ ok: false, error: "user not part of transfer" }, { status: 403 });

    const updates: any = {};
    if (isFrom) updates.from_accepted = true;
    if (isTo) updates.to_accepted = true;

    if ((reqRow.from_accepted || isFrom) && (reqRow.to_accepted || isTo)) {
      updates.accepted_at = new Date().toISOString();
    }

    const upd = await admin.from("transfer_requests").update(updates).eq("id", requestId).select().single();
    const { data: updated, error: updErr } = upd as any;
    if (updErr) return NextResponse.json({ ok: false, error: String(updErr) }, { status: 500 });

    return NextResponse.json({ ok: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
