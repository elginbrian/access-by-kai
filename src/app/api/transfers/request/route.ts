import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { TransferRequestSchema } from "@/lib/validators/transfer";
import { checkTransferAllowed } from "@/lib/services/transferAntiFraud";

export async function POST(req: Request) {
  const admin: any = createAdminClient();
  try {
    const body = await req.json();
    const parsed = TransferRequestSchema.parse(body);

    const allowed = await checkTransferAllowed({ fromUserId: parsed.from_user_id, toUserId: parsed.to_user_id, tiketCount: 1 });
    if (!allowed.allowed) {
      return NextResponse.json({ ok: false, error: allowed.reason, details: allowed }, { status: 403 });
    }

    if (!parsed.waiting_period_seconds) parsed.waiting_period_seconds = 24 * 3600; // default 24h

    const res = await admin.from("transfer_requests").insert(parsed).select().single();
    const { data, error } = res as any;
    if (error) return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 400 });
  }
}
