import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const admin: any = createAdminClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requestId, performedBy } = body;
    if (!requestId) return NextResponse.json({ ok: false, error: "requestId required" }, { status: 400 });

    const r = await admin.from("transfer_requests").select("*").eq("id", requestId).single();
    const { data: reqRow, error: reqErr } = r as any;
    if (reqErr) return NextResponse.json({ ok: false, error: String(reqErr) }, { status: 500 });
    if (!reqRow) return NextResponse.json({ ok: false, error: "request not found" }, { status: 404 });

    if (!reqRow.from_accepted || !reqRow.to_accepted) {
      return NextResponse.json({ ok: false, error: "both_parties_must_accept" }, { status: 409 });
    }

    const acceptedAt = reqRow.accepted_at ? new Date(reqRow.accepted_at) : null;
    const waitingSeconds = reqRow.waiting_period_seconds ?? 0;
    if (acceptedAt) {
      const readyAt = new Date(acceptedAt.getTime() + waitingSeconds * 1000);
      const now = new Date();
      if (now < readyAt) {
        const remainMs = readyAt.getTime() - now.getTime();
        return NextResponse.json({ ok: false, error: "waiting_period_not_elapsed", remaining_ms: remainMs }, { status: 409 });
      }
    }

    const rpcRes = await admin.rpc("perform_ticket_transfer", { req_id: requestId, performed_by: performedBy }).single();
    const { data: rpcData, error: rpcErr } = rpcRes as any;
    if (rpcErr) return NextResponse.json({ ok: false, error: String(rpcErr) }, { status: 500 });
    return NextResponse.json({ ok: true, data: rpcData });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
