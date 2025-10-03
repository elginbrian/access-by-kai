import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";
import { midtransService } from "@/lib/midtrans";

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
    const pengirimanId = body?.pengiriman_id ?? body?.orderId ?? null;

    if (!pengirimanId) {
      return NextResponse.json({ error: "pengiriman_id is required" }, { status: 400 });
    }

    let { data: orderRow, error: orderError } = await (supabase as any).from("pemesanan").select("*").eq("pemesanan_id", Number(pengirimanId)).maybeSingle();

    if (orderError) {
      console.error("Failed to fetch pemesanan", orderError);
      return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }

    if (!orderRow) {
      const byRes = await (supabase as any).from("pemesanan").select("*").eq("kode_pemesanan", String(pengirimanId)).maybeSingle();
      if (byRes.error) return NextResponse.json({ error: byRes.error.message }, { status: 500 });
      if (!byRes.data) return NextResponse.json({ error: "Order not found" }, { status: 404 });

      (orderRow as any) = byRes.data;
    }

    const orderId = `LOG-${orderRow.pemesanan_id}-${Date.now()}`;

    const itemDetails: any[] = [
      {
        id: `logistic-${orderRow.pemesanan_id}`,
        name: `Logistic - ${orderRow.kode_pemesanan || orderRow.pemesanan_id}`,
        price: Number(orderRow.total_bayar || 0),
        quantity: 1,
      },
    ];

    const customerDetails = {
      first_name: (orderRow.contact_person_nama || "")?.split?.(" ")?.[0] || "",
      last_name: (orderRow.contact_person_nama || "")?.split?.(" ")?.slice(1).join(" ") || "",
      email: orderRow.contact_person_email || null,
      phone: orderRow.contact_person_phone || null,
    };

    const transactionDetails: any = {
      transaction_details: { order_id: orderId, gross_amount: Number(orderRow.total_bayar || 0) },
      item_details: itemDetails,
      customer_details: customerDetails,
      enabled_payments: ["credit_card", "bca_va", "bni_va", "bri_va", "mandiri_va", "gopay", "shopeepay", "qris"],
      callbacks: { finish: `${process.env.NEXT_PUBLIC_APP_URL}/logistic/payment/success?order_id=${orderId}` },
      expiry: { unit: "hour", duration: 2 },
    };

    const snapToken = await midtransService.createSnapToken(transactionDetails as any);

    return NextResponse.json({ success: true, pengirimanId: orderRow.pemesanan_id, orderId, snapToken, clientConfig: midtransService.getClientConfig() });
  } catch (err) {
    console.error("/api/logistic/checkout error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
