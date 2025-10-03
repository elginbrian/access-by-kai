import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const admin: any = createAdminClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, contact_user_id } = body;
    if (!user_id || !contact_user_id) return NextResponse.json({ ok: false, error: "user_id and contact_user_id required" }, { status: 400 });

    const res = await admin.from("trusted_contacts").update({ status: "REVOKED" }).match({ user_id, contact_user_id }).select().single();
    const { data, error } = res as any;
    if (error) return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
