import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DirectPaymentRequestSchema = z.object({
  bookingData: z.object({
    journey: z.object({
      jadwalId: z.number(),
      trainName: z.string(),
      trainCode: z.string(),
      departureTime: z.string(),
      departureStation: z.string(),
      departureDate: z.string(),
      arrivalTime: z.string(),
      arrivalStation: z.string(),
      arrivalDate: z.string(),
    }),
    booker: z.object({
      fullName: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
    passengers: z.array(
      z.object({
        name: z.string(),
        idNumber: z.string(),
        seat: z.string(),
        seatType: z.string(),
      })
    ),
    foodOrders: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        forPassenger: z.string(),
        image: z.string().optional(),
      })
    ),
    pricing: z.object({
      trainTickets: z.number(),
      foodTotal: z.number(),
      serviceFee: z.number(),
      total: z.number(),
    }),
  }),
  paymentMethod: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = DirectPaymentRequestSchema.parse(body);

    const { bookingData, paymentMethod } = validatedRequest;

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const orderId = `ORDER-${timestamp}-${random.toUpperCase()}`;

    const itemDetails = [
      {
        id: `train-${bookingData.journey.jadwalId}`,
        name: `${bookingData.journey.trainName} (${bookingData.journey.trainCode})`,
        price: bookingData.pricing.trainTickets,
        quantity: bookingData.passengers.length,
        category: "Transportation",
        merchant_name: "AccessBy KAI",
      },
    ];

    bookingData.foodOrders.forEach((food) => {
      itemDetails.push({
        id: `food-${food.id}`,
        name: food.name,
        price: food.price,
        quantity: food.quantity,
        category: "Food",
        merchant_name: "AccessBy KAI",
      });
    });

    if (bookingData.pricing.serviceFee > 0) {
      itemDetails.push({
        id: "service-fee",
        name: "Biaya Layanan",
        price: bookingData.pricing.serviceFee,
        quantity: 1,
        category: "Service",
        merchant_name: "AccessBy KAI",
      });
    }

    const customerDetails = {
      first_name: bookingData.booker.fullName.split(" ")[0] || "",
      last_name: bookingData.booker.fullName.split(" ").slice(1).join(" ") || "",
      email: bookingData.booker.email,
      phone: bookingData.booker.phone,
      billing_address: {
        first_name: bookingData.booker.fullName.split(" ")[0] || "",
        last_name: bookingData.booker.fullName.split(" ").slice(1).join(" ") || "",
        email: bookingData.booker.email,
        phone: bookingData.booker.phone,
        country_code: "IDN",
      },
    };

    const enabledPayments = paymentMethod || ["credit_card", "bca_va", "bni_va", "bri_va", "mandiri_va", "permata_va", "other_va", "gopay", "shopeepay", "qris"];

    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: bookingData.pricing.total,
      },
      item_details: itemDetails,
      customer_details: customerDetails,
      enabled_payments: enabledPayments,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/trains/payment/success?order_id=${orderId}`,
      },
      expiry: {
        unit: "hour",
        duration: 2,
      },
      custom_field1: `train-${bookingData.journey.jadwalId}`,
      custom_field2: `passengers-${bookingData.passengers.length}`,
      custom_field3: `route-${bookingData.journey.departureStation}-${bookingData.journey.arrivalStation}`,
      credit_card: {
        secure: true,
        save_card: true,
      },
    };

    const midtransUrl = process.env.MIDTRANS_ENVIRONMENT === "production" ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured");
    }

    const response = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      body: JSON.stringify(transactionDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Midtrans API error: ${errorData.error_messages?.[0] || "Failed to create payment"}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      snapToken: result.token,
      orderId: orderId,
      paymentId: orderId,
      clientConfig: {
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
        environment: process.env.MIDTRANS_ENVIRONMENT || "sandbox",
      },
    });
  } catch (error) {
    console.error("Direct payment creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown payment error" }, { status: 500 });
  }
}
