import { VtuNetwork } from "./airtime";

export * as Airtime from "./airtime";

export interface ShagoOptions {
    baseUrl: string;
    hashKey: string;
}

export interface ShagoResponse<
    D extends Record<string, any> = Record<string, any>
> {
    status: boolean;
    responseCode: number;
    data: D;
}

export type Optional<T, Key extends keyof T> = Omit<T, Key> & Partial<T>;
export type PaymentType = "ONLINE" | "USSD";

export interface ReQueryOptions {
    orderId: string;
    delay?: number[];
}

export interface GetPackagePriceListResponseData {
    price: number;
    code: string;
    desc: string;
}

export interface WalletBalanceResponseData {
    balance: number;
}

export interface ReQueryResponseData {
    id: number;
    amountGenerated: string;
    disco: VtuNetwork;
    debtAmount: string;
    debtRemaining: string;
    orderId: string;
    receiptNo: string;
    tax: string;
    vendTime: string;
    token: string;
    totalAmountPaid: number;
    units: string;
    vendAmount: string;
    vendRef: string;
}

export type VendType = "VTU";
export type ServiceCode = "QAB";
