import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { midtransService } from "@/lib/midtrans";
import { createClient } from "@/lib/supabase";
import { CreatePaymentRequestSchema } from "@/lib/midtrans/types";
import type { CreatePaymentRequest, MidtransSnapTokenRequest, MidtransItemDetails } from "@/lib/midtrans/types";

const supabase = createClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedRequest = CreatePaymentRequestSchema.parse(body) as CreatePaymentRequest;

    const { pemesananId, amount, customerDetails, itemDetails, enabledPayments, customFields } = validatedRequest;

    const { data: pemesanan, error: pemesananError } = await supabase
      .from("pemesanan")
      .select(
        `
        *,
        penumpang (*)
      `
      )
      .eq("pemesanan_id", pemesananId)
      .single();

    if (pemesananError || !pemesanan) {
      return NextResponse.json({ error: "Pemesanan tidak ditemukan" }, { status: 404 });
    }

    const { data: existingPayment } = await supabase.from("pembayaran").select("pembayaran_id, status_pembayaran, order_id").eq("pemesanan_id", pemesananId).eq("status_pembayaran", "MENUNGGU").single();

    if (existingPayment) {
      return NextResponse.json({ error: "Payment yang masih pending sudah ada untuk pemesanan ini" }, { status: 400 });
    }

    const orderId = `ORDER-${pemesananId}-${Date.now()}`;

    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .insert({
        pemesanan_id: pemesananId,
        jumlah: amount,
        metode_pembayaran: "MIDTRANS",
        status_pembayaran: "MENUNGGU",
        id_transaksi_eksternal: orderId,
        waktu_pembayaran: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Gagal membuat record pembayaran" }, { status: 500 });
    }

    const transactionDetails: MidtransSnapTokenRequest = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: itemDetails,
      customer_details: customerDetails,
      enabled_payments: enabledPayments,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?order_id=${orderId}`,
      },
      expiry: {
        unit: "hour",
        duration: 24,
      },
      custom_field1: customFields?.field1,
      custom_field2: customFields?.field2,
      custom_field3: customFields?.field3,
    };

    const snapToken = await midtransService.createSnapToken(transactionDetails);

    await supabase
      .from("pembayaran")
      .update({
        metode_pembayaran: `MIDTRANS_${snapToken.substring(0, 8)}`,
      })
      .eq("pembayaran_id", payment.pembayaran_id);

    return NextResponse.json({
      success: true,
      snapToken,
      orderId,
      paymentId: payment.pembayaran_id,
      clientConfig: midtransService.getClientConfig(),
    });
  } catch (error) {
    console.error("Create payment error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
