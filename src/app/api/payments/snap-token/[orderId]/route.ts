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

    const { data: payment, error } = await supabase
      .from("pembayaran")
      .select(
        `
        *,
        pemesanan (
          *,
          penumpang (*),
          tiket (*)
        )
      `
      )
      .eq("id_transaksi_eksternal", orderId)
      .single();

    if (error || !payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status_pembayaran !== "MENUNGGU") {
      return NextResponse.json({ error: "Payment is no longer pending" }, { status: 400 });
    }

    const pemesanan = payment.pemesanan as any;

    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: payment.jumlah,
      },
      item_details: [
        {
          id: `tiket-${pemesanan.pemesanan_id}`,
          price: payment.jumlah,
          quantity: 1,
          name: `Tiket Kereta - ${pemesanan.kode_pemesanan}`,
        },
      ],
      customer_details: pemesanan.penumpang
        ? {
            first_name: pemesanan.penumpang.nama_lengkap?.split(" ")[0] || "Customer",
            last_name: pemesanan.penumpang.nama_lengkap?.split(" ").slice(1).join(" ") || "",
            email: pemesanan.pengguna?.email || "customer@example.com",
          }
        : undefined,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?order_id=${orderId}`,
      },
      expiry: {
        unit: "hour" as const,
        duration: 24,
      },
    };

    const snapToken = await midtransService.createSnapToken(transactionDetails);

    return NextResponse.json({
      success: true,
      snapToken,
      clientConfig: midtransService.getClientConfig(),
    });
  } catch (error) {
    console.error("Get snap token error:", error);

    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
