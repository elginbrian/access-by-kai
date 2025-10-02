import { z } from "zod";

export interface MidtransCustomerDetails {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  billing_address?: MidtransAddress;
  shipping_address?: MidtransAddress;
}

export interface MidtransAddress {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country_code?: string;
}

export interface MidtransItemDetails {
  id: string;
  price: number;
  quantity: number;
  name: string;
  brand?: string;
  category?: string;
  merchant_name?: string;
}

export interface MidtransTransactionDetails {
  order_id: string;
  gross_amount: number;
}

export interface MidtransSnapTokenRequest {
  transaction_details: MidtransTransactionDetails;
  item_details?: MidtransItemDetails[];
  customer_details?: MidtransCustomerDetails;
  enabled_payments?: string[];
  credit_card?: {
    secure?: boolean;
    channel?: "migs";
    bank?: string;
    installment?: {
      required?: boolean;
      terms?: { [bank: string]: number[] };
    };
    whitelist_bins?: string[];
  };
  bca_va?: {
    va_number?: string;
  };
  bni_va?: {
    va_number?: string;
  };
  bri_va?: {
    va_number?: string;
  };
  permata_va?: {
    va_number?: string;
    recipient_name?: string;
  };
  callbacks?: {
    finish?: string;
  };
  expiry?: {
    start_time?: string;
    unit?: "second" | "minute" | "hour" | "day";
    duration?: number;
  };
  custom_field1?: string;
  custom_field2?: string;
  custom_field3?: string;
}

export interface TransactionStatusResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  approval_code?: string;
  signature_key: string;
  bank?: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  bill_key?: string;
  biller_code?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface MidtransWebhookNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  settlement_time?: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status?: string;
  currency: string;
  approval_code?: string;
  masked_card?: string;
  bank?: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  bill_key?: string;
  biller_code?: string;
  store?: string;
  permata_va_number?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
  custom_field1?: string;
  custom_field2?: string;
  custom_field3?: string;
}

export interface MidtransTransaction {
  orderId: string;
  grossAmount: number;
  customerDetails: MidtransCustomerDetails;
  itemDetails: MidtransItemDetails[];
  enabledPayments?: string[];
}

// Zod Schemas for validation
export const MidtransAddressSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country_code: z.string().optional(),
});

export const MidtransCustomerDetailsSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  billing_address: MidtransAddressSchema.optional(),
  shipping_address: MidtransAddressSchema.optional(),
});

export const MidtransItemDetailsSchema = z.object({
  id: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive().int(),
  name: z.string(),
  brand: z.string().optional(),
  category: z.string().optional(),
  merchant_name: z.string().optional(),
});

export const MidtransTransactionDetailsSchema = z.object({
  order_id: z.string(),
  gross_amount: z.number().positive(),
});

export const MidtransSnapTokenRequestSchema = z.object({
  transaction_details: MidtransTransactionDetailsSchema,
  item_details: z.array(MidtransItemDetailsSchema).optional(),
  customer_details: MidtransCustomerDetailsSchema.optional(),
  enabled_payments: z.array(z.string()).optional(),
  credit_card: z
    .object({
      secure: z.boolean().optional(),
      channel: z.literal("migs").optional(),
      bank: z.string().optional(),
      installment: z
        .object({
          required: z.boolean().optional(),
          terms: z.record(z.array(z.number())).optional(),
        })
        .optional(),
      whitelist_bins: z.array(z.string()).optional(),
    })
    .optional(),
  callbacks: z
    .object({
      finish: z.string().url().optional(),
    })
    .optional(),
  expiry: z
    .object({
      start_time: z.string().optional(),
      unit: z.enum(["second", "minute", "hour", "day"]).optional(),
      duration: z.number().positive().optional(),
    })
    .optional(),
  custom_field1: z.string().optional(),
  custom_field2: z.string().optional(),
  custom_field3: z.string().optional(),
});

export const MidtransWebhookNotificationSchema = z.object({
  transaction_time: z.string(),
  transaction_status: z.string(),
  transaction_id: z.string(),
  status_message: z.string(),
  status_code: z.string(),
  signature_key: z.string(),
  settlement_time: z.string().optional(),
  payment_type: z.string(),
  order_id: z.string(),
  merchant_id: z.string(),
  gross_amount: z.string(),
  fraud_status: z.string().optional(),
  currency: z.string(),
  approval_code: z.string().optional(),
  masked_card: z.string().optional(),
  bank: z.string().optional(),
  va_numbers: z
    .array(
      z.object({
        bank: z.string(),
        va_number: z.string(),
      })
    )
    .optional(),
  bill_key: z.string().optional(),
  biller_code: z.string().optional(),
  store: z.string().optional(),
  permata_va_number: z.string().optional(),
  pdf_url: z.string().url().optional(),
  finish_redirect_url: z.string().url().optional(),
  custom_field1: z.string().optional(),
  custom_field2: z.string().optional(),
  custom_field3: z.string().optional(),
});

export const CreatePaymentRequestSchema = z.object({
  pemesananId: z.number().positive(),
  amount: z.number().positive(),
  customerDetails: MidtransCustomerDetailsSchema,
  itemDetails: z.array(MidtransItemDetailsSchema),
  enabledPayments: z.array(z.string()).optional(),
  customFields: z
    .object({
      field1: z.string().optional(),
      field2: z.string().optional(),
      field3: z.string().optional(),
    })
    .optional(),
});

export const PaymentCallbackSchema = z.object({
  orderId: z.string(),
  status: z.enum(["success", "pending", "failure"]),
  transactionId: z.string().optional(),
});

export type CreatePaymentRequest = z.infer<typeof CreatePaymentRequestSchema>;
export type PaymentCallback = z.infer<typeof PaymentCallbackSchema>;

export type InternalPaymentStatus = "MENUNGGU" | "BERHASIL" | "GAGAL";

export type PaymentMethod = "credit_card" | "bank_transfer" | "echannel" | "gopay" | "shopeepay" | "qris" | "cstore" | "akulaku";

export interface MidtransError {
  status_code: string;
  status_message: string;
  id?: string;
}

export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}
