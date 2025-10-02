export interface MidtransConfig {
  serverKey: string;
  clientKey: string;
  isProduction: boolean;
  snapUrl: string;
  coreApiUrl: string;
}

export const getMidtransConfig = (): MidtransConfig => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.MIDTRANS_ENVIRONMENT === "production";

  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY is required");
  }

  if (!clientKey) {
    throw new Error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is required");
  }

  return {
    serverKey,
    clientKey,
    isProduction,
    snapUrl: isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js",
    coreApiUrl: isProduction ? "https://api.midtrans.com/v2" : "https://api.sandbox.midtrans.com/v2",
  };
};

export const MIDTRANS_CONSTANTS = {
  TRANSACTION_STATUS: {
    CAPTURE: "capture",
    SETTLEMENT: "settlement",
    PENDING: "pending",
    DENY: "deny",
    CANCEL: "cancel",
    EXPIRE: "expire",
    FAILURE: "failure",
    REFUND: "refund",
    PARTIAL_REFUND: "partial_refund",
    AUTHORIZE: "authorize",
  },
  FRAUD_STATUS: {
    ACCEPT: "accept",
    DENY: "deny",
    CHALLENGE: "challenge",
  },
  PAYMENT_TYPE: {
    CREDIT_CARD: "credit_card",
    BANK_TRANSFER: "bank_transfer",
    ECHANNEL: "echannel",
    GOPAY: "gopay",
    SHOPEEPAY: "shopeepay",
    QRIS: "qris",
    CSTORE: "cstore",
    AKULAKU: "akulaku",
  },
} as const;
