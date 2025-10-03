import { NextRequest, NextResponse } from "next/server";
import { midtransService } from "@/lib/midtrans";
import { createClient } from "@/lib/supabase";

const supabase = createClient() as any;

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

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

    if (internalStatus === "BERHASIL") {
      const { data: payment } = await supabase.from("pembayaran").select("pemesanan_id").eq("id_transaksi_eksternal", orderId).single();

      if (payment) {
        await supabase.from("pemesanan").update({ status_pemesanan: "TERKONFIRMASI" }).eq("pemesanan_id", payment.pemesanan_id);
      }
    }

    return NextResponse.json({
      success: true,
      ...transactionStatus,
      internal_status: internalStatus,
    });
  } catch (error) {
    console.error("Get transaction status error:", error);

    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
