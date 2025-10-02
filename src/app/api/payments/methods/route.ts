import { NextRequest, NextResponse } from "next/server";

const PAYMENT_METHODS = {
  categories: [
    {
      id: "e_wallet",
      name: "E-Wallet",
      icon: "💳",
      methods: [
        { id: "gopay", name: "GoPay", icon: "🟢", fee: 0 },
        { id: "shopeepay", name: "ShopeePay", icon: "🔸", fee: 0 },
        { id: "ovo", name: "OVO", icon: "🟡", fee: 0 },
        { id: "dana", name: "DANA", icon: "🔵", fee: 0 },
      ],
    },
    {
      id: "bank_transfer",
      name: "Transfer Bank",
      icon: "🏦",
      methods: [
        { id: "bca_va", name: "BCA Virtual Account", icon: "🔷", fee: 4000 },
        { id: "bni_va", name: "BNI Virtual Account", icon: "🟠", fee: 4000 },
        { id: "bri_va", name: "BRI Virtual Account", icon: "🔴", fee: 4000 },
        { id: "mandiri_va", name: "Mandiri Virtual Account", icon: "🟡", fee: 4000 },
        { id: "permata_va", name: "Permata Virtual Account", icon: "⚪", fee: 4000 },
        { id: "other_va", name: "Bank Lainnya", icon: "🏛️", fee: 4000 },
      ],
    },
    {
      id: "credit_card",
      name: "Kartu Kredit",
      icon: "💳",
      methods: [{ id: "credit_card", name: "Visa/Mastercard/JCB", icon: "💳", fee: 0 }],
    },
    {
      id: "retail",
      name: "Gerai Retail",
      icon: "🏪",
      methods: [
        { id: "indomaret", name: "Indomaret", icon: "🏪", fee: 5000 },
        { id: "alfamart", name: "Alfamart", icon: "🏪", fee: 5000 },
      ],
    },
    {
      id: "qris",
      name: "QRIS",
      icon: "📱",
      methods: [{ id: "qris", name: "QRIS (Semua Bank & E-Wallet)", icon: "📱", fee: 0 }],
    },
  ],
  enabled_payments: ["gopay", "shopeepay", "other_qris", "credit_card", "bca_va", "bni_va", "bri_va", "echannel", "permata_va", "other_va", "indomaret", "alfamart"],
  min_amount: 10000,
  max_amount: 50000000,
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: PAYMENT_METHODS,
    });
  } catch (error) {
    console.error("Get payment methods error:", error);

    return NextResponse.json({ error: "Failed to get payment methods" }, { status: 500 });
  }
}
