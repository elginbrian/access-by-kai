import { midtransService } from "@/lib/midtrans";
import { BookingData } from "@/lib/hooks/useCentralBooking";
import { validatePaymentBookingData } from "@/lib/validation/schemas";
import { MidtransItemDetails, MidtransCustomerDetails } from "@/lib/midtrans/types";

export interface PaymentRequest {
  bookingData: BookingData;
  paymentMethod?: string[];
}

export interface PaymentResponse {
  success: boolean;
  snapToken?: string;
  orderId?: string;
  paymentId?: string;
  clientConfig?: any;
  error?: string;
  redirectUrl?: string;
}

export interface PaymentStatus {
  orderId: string;
  status: "pending" | "settlement" | "capture" | "deny" | "cancel" | "expire" | "failure";
  transactionStatus: string;
  fraudStatus?: string;
  paymentType?: string;
  grossAmount?: number;
  transactionTime?: string;
  statusMessage?: string;
}

export class PaymentService {
  private static readonly PAYMENT_EXPIRY_HOURS = 2;

  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { bookingData } = request;

      if (!bookingData.journey.jadwalId) {
        throw new Error("Journey schedule ID is required");
      }

      if (!bookingData.booker.fullName || !bookingData.booker.email || !bookingData.booker.phone) {
        throw new Error("Booker information is incomplete");
      }

      if (!bookingData.passengers || bookingData.passengers.length === 0) {
        throw new Error("At least one passenger is required");
      }

      const validation = validatePaymentBookingData(request.bookingData);
      if (!validation.success) {
        throw new Error(`Invalid booking data: ${validation.error?.issues[0]?.message}`);
      }

      const orderId = this.generateOrderId();

      const itemDetails: MidtransItemDetails[] = [
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
          category: "Food & Beverage",
          merchant_name: "KAI Food Service",
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

      const customerDetails: MidtransCustomerDetails = {
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

      const paymentRequest = {
        bookingData,
        paymentMethod: request.paymentMethod,
      };

      const response = await fetch("/api/payments/create-direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment");
      }

      const result = await response.json();

      return {
        success: true,
        snapToken: result.snapToken,
        orderId: result.orderId,
        paymentId: result.paymentId,
        clientConfig: result.clientConfig,
      };
    } catch (error) {
      console.error("Payment creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown payment error",
      };
    }
  }

  static async checkPaymentStatus(orderId: string): Promise<PaymentStatus | null> {
    try {
      const response = await fetch(`/api/payments/status-direct/${orderId}`);

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Payment status check error:", error);
      return null;
    }
  }

  static async cancelPayment(orderId: string): Promise<boolean> {
    try {
      // Call Midtrans API directly
      const response = await fetch(`${process.env.NODE_ENV === "production" ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com"}/v2/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Payment cancellation error:", error);
      return false;
    }
  }

  private static generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `ORDER-${timestamp}-${random.toUpperCase()}`;
  }

  private static mapTransactionStatus(transactionStatus: string, fraudStatus?: string): PaymentStatus["status"] {
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
  }

  static getStatusDisplay(status: PaymentStatus["status"]) {
    const statusMap = {
      pending: {
        label: "Menunggu Pembayaran",
        color: "yellow",
        icon: "⏳",
        description: "Silakan selesaikan pembayaran Anda",
      },
      settlement: {
        label: "Pembayaran Berhasil",
        color: "green",
        icon: "✅",
        description: "Pembayaran telah berhasil diproses",
      },
      capture: {
        label: "Pembayaran Berhasil",
        color: "green",
        icon: "✅",
        description: "Pembayaran telah berhasil diproses",
      },
      deny: {
        label: "Pembayaran Ditolak",
        color: "red",
        icon: "❌",
        description: "Pembayaran ditolak, silakan coba metode lain",
      },
      cancel: {
        label: "Pembayaran Dibatalkan",
        color: "gray",
        icon: "⏹️",
        description: "Pembayaran telah dibatalkan",
      },
      expire: {
        label: "Pembayaran Kadaluarsa",
        color: "red",
        icon: "⏰",
        description: "Waktu pembayaran telah habis",
      },
      failure: {
        label: "Pembayaran Gagal",
        color: "red",
        icon: "❌",
        description: "Terjadi kesalahan dalam proses pembayaran",
      },
    };

    return statusMap[status] || statusMap.pending;
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static validatePaymentAmount(amount: number): boolean {
    return amount >= 10000 && amount <= 500000000;
  }
}

export default PaymentService;
