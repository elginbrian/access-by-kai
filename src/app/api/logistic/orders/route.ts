import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";
import { PengirimanLogistikSchema } from "@/lib/validators/pengiriman_logistik";

// Note: The project DDL doesn't include a `pengiriman_logistik` table.
// To avoid changing the DB schema we map logistic orders into the
// existing `pemesanan` table and return a logistic-shaped object so
// the client code (which expects `pengiriman_id`, `nomor_resi`, etc.)
// keeps working.

export async function POST(req: NextRequest) {
  try {
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (err) {
      console.warn("createAdminClient failed, falling back to legacy server client", err);
      supabase = createLegacyServerClient();
    }

    const body = await req.json();

    const parsed = PengirimanLogistikSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map((err) => err.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    const payload = parsed.data as any;

    function makeShortCode(input?: string) {
      if (input) {
        const asStr = String(input).replace(/[^A-Za-z0-9]/g, "");
        if (asStr.length <= 12) return asStr;
        return asStr.slice(0, 12);
      }

      const val = `LOG${Date.now().toString(36)}`.toUpperCase();
      return val.slice(0, 12);
    }

    const kodePemesanan = makeShortCode(payload.nomor_resi);
    const pemesananPayload: any = {
      kode_pemesanan: kodePemesanan,
      user_id: payload.user_id ?? 1,
      total_bayar: Number(payload.biaya_pengiriman ?? 0),
      biaya_admin: 0,
      biaya_asuransi: 0,
      status_pemesanan: "MENUNGGU_PEMBAYARAN",
      contact_person_nama: payload.pengirim_nama || null,
      contact_person_phone: payload.pengirim_nomor_telepon || null,
      contact_person_email: payload.pengirim_email || null,
      waktu_pembuatan: payload.waktu_pembuatan || undefined,
      keterangan: JSON.stringify({
        stasiun_asal_id: payload.stasiun_asal_id,
        stasiun_tujuan_id: payload.stasiun_tujuan_id,
        penerima_nama: payload.penerima_nama,
        penerima_nomor_telepon: payload.penerima_nomor_telepon,
        penerima_alamat: payload.penerima_alamat,
      }),
    };

    const { data: created, error: insertError } = await (supabase as any).from("pemesanan").insert(pemesananPayload).select("*").single();

    if (insertError) {
      console.error("pemesanan insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const order = {
      pengiriman_id: created.pemesanan_id,
      nomor_resi: created.kode_pemesanan,
      biaya_pengiriman: Number(created.total_bayar),
      pengirim_nama: created.contact_person_nama,
      pengirim_nomor_telepon: created.contact_person_phone,
      pengirim_email: created.contact_person_email,
      waktu_pembuatan: created.waktu_pembuatan,

      ...(created.keterangan ? { keterangan: JSON.parse(created.keterangan) } : {}),
    } as any;

    return NextResponse.json({ order });
  } catch (err) {
    console.error("/api/logistic/orders error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
