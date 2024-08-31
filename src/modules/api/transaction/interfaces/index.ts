import {
    PaymentChannel,
    Prisma,
    TransactionStatus,
    TransactionType,
} from "@prisma/client";

export enum TransactionShortDescription {
    WALLET_FUNDED = "Wallet Funded",
    ELECTRICITY_PAYMENT = "Electricity Payment",
    DATA_PURCHASE = "Data Purchase",
    AIRTIME_PURCHASE = "Airtime Purchase",
    CABLE_TV_PAYMENT = "Cable TV Payment",
    PAYOUT = "Payout",
    BILL_PAYMENT_REFUND = "Failed Bill Payment Refund",
}

export type TransactionDetailResponse = {
    type: TransactionType | "WALLET_TRANSFER" | "COMMISSION" | "DEPOSIT";
    product?: string;
    amount: number;
    sender?: string;
    beneficiary: string;
    meterType?: string;
    shortDescription: string;
    status: TransactionStatus;
    date: Date;
    token?: string;
    beneficiaryBank?: string;
    beneficiaryBankAccountNumber?: string;
    customerId: string;
    transactionId: string;
    paymentMethod: PaymentChannel;
};

export type TransactionWithSelect = Prisma.TransactionGetPayload<{
    select: {
        id: true;
        amount: true;
        shortDescription: true;
        status: true;
        transactionId: true;
        flow: true;
        type: true;
        user: {
            select: { phone: true };
        };
        BillService: {
            select: {
                icon: true;
            };
        };
        createdAt: true;
        updatedAt: true;
    };
}>;
