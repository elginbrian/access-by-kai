import { CoreApi, Snap } from "midtrans-client";
import { getMidtransConfig, MIDTRANS_CONSTANTS } from "./config";
import { createHash } from "crypto";
import { MidtransSnapTokenRequest, MidtransWebhookNotification, TransactionStatusResponse } from "./types";

class MidtransService {
  private snap: Snap;
  private coreApi: CoreApi;
  private config: ReturnType<typeof getMidtransConfig>;

  constructor() {
    this.config = getMidtransConfig();

    this.snap = new Snap({
      isProduction: this.config.isProduction,
      serverKey: this.config.serverKey,
      clientKey: this.config.clientKey,
    });

    this.coreApi = new CoreApi({
      isProduction: this.config.isProduction,
      serverKey: this.config.serverKey,
      clientKey: this.config.clientKey,
    });
  }

  async createSnapToken(transactionDetails: MidtransSnapTokenRequest): Promise<string> {
    try {
      const response = await this.snap.createTransaction(transactionDetails);
      return response.token;
    } catch (error: any) {
      throw new Error(`Failed to create Snap token: ${error.message}`);
    }
  }

  async getTransactionStatus(orderId: string): Promise<TransactionStatusResponse> {
    try {
      const response = await this.coreApi.transaction.status(orderId);
      return response as TransactionStatusResponse;
    } catch (error: any) {
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  async captureTransaction(orderId: string): Promise<TransactionStatusResponse> {
    try {
      const response = await this.coreApi.transaction.capture(orderId);
      return response as TransactionStatusResponse;
    } catch (error: any) {
      throw new Error(`Failed to capture transaction: ${error.message}`);
    }
  }

  async cancelTransaction(orderId: string): Promise<TransactionStatusResponse> {
    try {
      const response = await this.coreApi.transaction.cancel(orderId);
      return response as TransactionStatusResponse;
    } catch (error: any) {
      throw new Error(`Failed to cancel transaction: ${error.message}`);
    }
  }

  async approveTransaction(orderId: string): Promise<TransactionStatusResponse> {
    try {
      const response = await this.coreApi.transaction.approve(orderId);
      return response as TransactionStatusResponse;
    } catch (error: any) {
      throw new Error(`Failed to approve transaction: ${error.message}`);
    }
  }

  async denyTransaction(orderId: string): Promise<TransactionStatusResponse> {
    try {
      const response = await this.coreApi.transaction.deny(orderId);
      return response as TransactionStatusResponse;
    } catch (error: any) {
      throw new Error(`Failed to deny transaction: ${error.message}`);
    }
  }

  async refundTransaction(orderId: string, refundKey?: string, amount?: number, reason?: string): Promise<TransactionStatusResponse> {
    try {
      const payload: any = { refund_key: refundKey, reason };
      if (amount) payload.amount = amount;

      const response = await this.coreApi.transaction.refund(orderId, payload);
      return response as TransactionStatusResponse;
    } catch (error: any) {
      throw new Error(`Failed to refund transaction: ${error.message}`);
    }
  }

  verifyWebhookSignature(notification: MidtransWebhookNotification): boolean {
    try {
      const { order_id, status_code, gross_amount, signature_key } = notification;

      const input = order_id + status_code + gross_amount + this.config.serverKey;
      const hash = createHash("sha512").update(input).digest("hex");

      return hash === signature_key;
    } catch (error) {
      console.error("Failed to verify webhook signature:", error);
      return false;
    }
  }

  mapToInternalStatus(transactionStatus: string, fraudStatus?: string): "MENUNGGU" | "BERHASIL" | "GAGAL" {
    const { TRANSACTION_STATUS, FRAUD_STATUS } = MIDTRANS_CONSTANTS;

    if (fraudStatus === FRAUD_STATUS.DENY) {
      return "GAGAL";
    }

    switch (transactionStatus) {
      case TRANSACTION_STATUS.CAPTURE:
      case TRANSACTION_STATUS.SETTLEMENT:
        return fraudStatus === FRAUD_STATUS.ACCEPT ? "BERHASIL" : "MENUNGGU";

      case TRANSACTION_STATUS.PENDING:
      case TRANSACTION_STATUS.AUTHORIZE:
        return "MENUNGGU";

      case TRANSACTION_STATUS.DENY:
      case TRANSACTION_STATUS.CANCEL:
      case TRANSACTION_STATUS.EXPIRE:
      case TRANSACTION_STATUS.FAILURE:
        return "GAGAL";

      default:
        return "MENUNGGU";
    }
  }

  isTransactionFinal(transactionStatus: string): boolean {
    const { TRANSACTION_STATUS } = MIDTRANS_CONSTANTS;

    const finalStatuses = [TRANSACTION_STATUS.SETTLEMENT, TRANSACTION_STATUS.DENY, TRANSACTION_STATUS.CANCEL, TRANSACTION_STATUS.EXPIRE, TRANSACTION_STATUS.FAILURE, TRANSACTION_STATUS.REFUND, TRANSACTION_STATUS.PARTIAL_REFUND] as const;

    return finalStatuses.includes(transactionStatus as (typeof finalStatuses)[number]);
  }

  getClientConfig() {
    return {
      clientKey: this.config.clientKey,
      snapUrl: this.config.snapUrl,
      isProduction: this.config.isProduction,
    };
  }
}

export const midtransService = new MidtransService();
export default midtransService;
