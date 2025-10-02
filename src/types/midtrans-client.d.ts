declare module "midtrans-client" {
  export interface MidtransOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  export class CoreApi {
    constructor(options: MidtransOptions);
    transaction: {
      status(orderId: string): Promise<any>;
      capture(orderId: string): Promise<any>;
      cancel(orderId: string): Promise<any>;
      approve(orderId: string): Promise<any>;
      deny(orderId: string): Promise<any>;
      refund(orderId: string, payload?: any): Promise<any>;
    };
  }

  export class Snap {
    constructor(options: MidtransOptions);
    createTransaction(payload: any): Promise<{ token: string; redirect_url: string }>;
  }
}
