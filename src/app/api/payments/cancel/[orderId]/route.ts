import { NextRequest, NextResponse } from "next/server";
import { midtransService } from "@/lib/midtrans";
import { createClient } from "@/lib/supabase";

const supabase = createClient() as any;

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const cancelResult = await midtransService.cancelTransaction(orderId);

    await supabase
      .from("pembayaran")
      .update({
        status_pembayaran: "GAGAL",
        respon_gateway: cancelResult as any,
      })
      .eq("id_transaksi_eksternal", orderId);

    const { data: payment } = await supabase.from("pembayaran").select("pemesanan_id").eq("id_transaksi_eksternal", orderId).single();

    if (payment) {
      await supabase.from("pemesanan").update({ status_pemesanan: "DIBATALKAN" }).eq("pemesanan_id", payment.pemesanan_id);

      const { data: tickets } = await supabase.from("tiket").select("jadwal_kursi_id").eq("pemesanan_id", payment.pemesanan_id);

      if (tickets && tickets.length > 0) {
        const seatIds = tickets.map((t: { jadwal_kursi_id: any }) => t.jadwal_kursi_id).filter(Boolean);

        if (seatIds.length > 0) {
          await supabase.from("jadwal_kursi").update({ status_inventaris: "TERSEDIA" }).in("jadwal_kursi_id", seatIds);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel payment error:", error);

    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
