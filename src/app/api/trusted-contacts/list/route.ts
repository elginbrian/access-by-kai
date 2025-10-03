import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

const admin: any = createAdminClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ ok: false, error: "userId required" }, { status: 400 });

    const res = await admin.from("trusted_contacts").select("*").or(`user_id.eq.${userId},contact_user_id.eq.${userId}`);
    const { data, error } = res as any;
    if (error) return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
