import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { PaymentCallbackSchema } from "@/lib/midtrans/types";
import { midtransService } from "@/lib/midtrans";

const supabase = createClient() as any;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const callback = PaymentCallbackSchema.parse(body);
    const { orderId, status, transactionId } = callback;

    const transactionStatus = await midtransService.getTransactionStatus(orderId);

    const internalStatus = midtransService.mapToInternalStatus(transactionStatus.transaction_status, transactionStatus.fraud_status);

    await supabase
      .from("pembayaran")
      .update({
        status_pembayaran: internalStatus,
        respon_gateway: transactionStatus as any,
        waktu_pembayaran: internalStatus === "BERHASIL" ? new Date().toISOString() : null,
      })
      .eq("id_transaksi_eksternal", orderId);

    const { data: payment } = await supabase.from("pembayaran").select("pemesanan_id").eq("id_transaksi_eksternal", orderId).single();

    if (payment) {
      let pemesananStatus: "MENUNGGU_PEMBAYARAN" | "TERKONFIRMASI" | "DIBATALKAN" | "KADALUARSA";

      switch (internalStatus) {
        case "BERHASIL":
          pemesananStatus = "TERKONFIRMASI";
          break;
        case "GAGAL":
          pemesananStatus = "DIBATALKAN";
          break;
        default:
          pemesananStatus = "MENUNGGU_PEMBAYARAN";
      }

      await supabase.from("pemesanan").update({ status_pemesanan: pemesananStatus }).eq("pemesanan_id", payment.pemesanan_id);
    }

    return NextResponse.json({
      success: true,
      status: internalStatus,
      message: "Callback processed successfully",
    });
  } catch (error) {
    console.error("Payment callback error:", error);

    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
