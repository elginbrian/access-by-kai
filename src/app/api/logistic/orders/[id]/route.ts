import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (err) {
      console.warn("createAdminClient failed, falling back to legacy server client", err);
      supabase = createLegacyServerClient();
    }

    const id = params.id;

    let query = (supabase as any).from("pemesanan").select("*").eq("pemesanan_id", Number(id)).maybeSingle();
    const { data: byIdData, error: byIdError } = await query;
    if (byIdError) return NextResponse.json({ error: byIdError.message }, { status: 500 });

    let data = byIdData;

    if (!data) {
      const byCode = await (supabase as any).from("pemesanan").select("*").eq("kode_pemesanan", id).maybeSingle();
      if (byCode.error) return NextResponse.json({ error: byCode.error.message }, { status: 500 });
      data = byCode.data;
    }

    if (!data) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = {
      pengiriman_id: data.pemesanan_id,
      nomor_resi: data.kode_pemesanan,
      biaya_pengiriman: Number(data.total_bayar || 0),
      pengirim_nama: data.contact_person_nama,
      pengirim_nomor_telepon: data.contact_person_phone,
      pengirim_email: data.contact_person_email,
      waktu_pembuatan: data.waktu_pembuatan,
      ...(data.keterangan
        ? {
            keterangan: (() => {
              try {
                return JSON.parse(data.keterangan);
              } catch (e) {
                return data.keterangan;
              }
            })(),
          }
        : {}),
    } as any;

    return NextResponse.json({ order });
  } catch (err) {
    console.error("/api/logistic/orders/[id] error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
