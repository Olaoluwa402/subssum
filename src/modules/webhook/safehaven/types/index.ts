export type EventName = "virtualAccount.transfer" | "transfer";

export interface SafehavenEvent<T extends EventName> {
    type: T;
    data: T extends keyof EventDataMap ? EventDataMap[T] : never;
}

export interface EventDataMap {
    transfer: SubAccountDeposit;
    "virtualAccount.transfer": Record<string, any>;
}

export interface SubAccountDeposit {
    _id: string;
    sessionId: string;
    paymentReference: string;
    amount: number;
    creditAccountName: string;
    creditAccountNumber: string;
    fees: number;
    vat: number;
    stampDuty: number;
    responseCode: "00";
    narration: string;
}

export interface SafehavenWebhookEventMap {
    sub_account_deposit: SubAccountDeposit;
}

export interface AcknowledgeResponse {
    statusCode: number;
    responseCode: string;
}
