import { NextRequest, NextResponse } from "next/server";
import { midtransService } from "@/lib/midtrans";
import { createClient } from "@/lib/supabase";
import { MidtransWebhookNotificationSchema } from "@/lib/midtrans/types";

const supabase = createClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const notification = MidtransWebhookNotificationSchema.parse(body);

    if (!midtransService.verifyWebhookSignature(notification)) {
      console.error("Invalid webhook signature:", notification.order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { order_id, transaction_status, fraud_status } = notification;

    const internalStatus = midtransService.mapToInternalStatus(transaction_status, fraud_status);

    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .update({
        status_pembayaran: internalStatus,
        respon_gateway: notification,
        waktu_pembayaran: internalStatus === "BERHASIL" ? new Date().toISOString() : null,
      })
      .eq("id_transaksi_eksternal", order_id)
      .select("pemesanan_id")
      .single();

    if (paymentError) {
      console.error("Failed to update payment:", paymentError);
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
    }

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

      if (internalStatus === "BERHASIL") {
        await supabase.from("tiket").update({ status_tiket: "AKTIF" }).eq("pemesanan_id", payment.pemesanan_id);

        const { data: tickets } = await supabase.from("tiket").select("jadwal_kursi_id").eq("pemesanan_id", payment.pemesanan_id);

        if (tickets && tickets.length > 0) {
          const seatIds = tickets.map((t) => t.jadwal_kursi_id).filter(Boolean);

          if (seatIds.length > 0) {
            await supabase.from("jadwal_kursi").update({ status_inventaris: "DIPESAN" }).in("jadwal_kursi_id", seatIds);
          }
        }
      }

      if (internalStatus === "GAGAL") {
        const { data: tickets } = await supabase.from("tiket").select("jadwal_kursi_id").eq("pemesanan_id", payment.pemesanan_id);

        if (tickets && tickets.length > 0) {
          const seatIds = tickets.map((t) => t.jadwal_kursi_id).filter(Boolean);

          if (seatIds.length > 0) {
            await supabase.from("jadwal_kursi").update({ status_inventaris: "TERSEDIA" }).in("jadwal_kursi_id", seatIds);
          }
        }
      }
    }

    console.log(`Webhook processed successfully for order: ${order_id}, status: ${internalStatus}`);

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
