import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured");
    }

    const midtransUrl = process.env.MIDTRANS_ENVIRONMENT === "production" ? `https://api.midtrans.com/v2/${orderId}/status` : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

    const response = await fetch(midtransUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Midtrans API error: ${errorData.error_messages?.[0] || "Failed to check payment status"}`);
    }

    const result = await response.json();

    const mapTransactionStatus = (transactionStatus: string, fraudStatus?: string) => {
      if (fraudStatus === "deny") return "deny";

      switch (transactionStatus) {
        case "capture":
          return fraudStatus === "challenge" ? "pending" : "capture";
        case "settlement":
          return "settlement";
        case "pending":
          return "pending";
        case "deny":
          return "deny";
        case "cancel":
          return "cancel";
        case "expire":
          return "expire";
        case "failure":
          return "failure";
        default:
          return "pending";
      }
    };

    const paymentStatus = {
      orderId: result.order_id,
      status: mapTransactionStatus(result.transaction_status, result.fraud_status),
      transactionStatus: result.transaction_status,
      fraudStatus: result.fraud_status,
      paymentType: result.payment_type,
      grossAmount: parseFloat(result.gross_amount),
      transactionTime: result.transaction_time,
      statusMessage: result.status_message,
    };

    return NextResponse.json(paymentStatus);
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error occurred" }, { status: 500 });
  }
}
