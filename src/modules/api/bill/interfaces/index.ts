import {
    BillProvider,
    BillService,
    PaymentChannel,
    PaymentStatus,
    User,
    UserType,
    Wallet,
} from "@prisma/client";

export enum BillProviderSlugForPower {
    SHAGO = "shago",
}

export enum BillProviderSlug {
    SHAGO = "shago",
}

export enum BillType {
    POWER = "POWER",
    DATA = "DATA",
    CABLE_TV = "CABLE_TV",
    AIRTIME = "AIRTIME",
    AIRLINE = "AIRLINE",
}

export enum BillServiceSlug {
    MTN_AIRTIME = "mtn-airtime",
    GLO_AIRTIME = "glo-airtime",
    "9MOBILE_AIRTIME" = "9mobile-airtime",
    AIRTEL_AIRTIME = "airtel-airtime",
    MTN_DATA = "mtn-data",
    GLO_DATA = "glo-data",
    "9MOBILE__DATA" = "9mobile-data",
    AIRTEL_DATA = "airtel-data",
    DSTV = "dstv",
    GOTV = "gotv",
    STARTIMES = "startimes",
    IKEJA_ELECTRIC = "ikeja-electric",
    EKO_ELECTRICITY = "eko-electricity",
    KANO_ELECTRICITY = "kano-electricity",
    PORT_HARCOURT_ELECTRIC = "port-harcourt-electric",
    JOS_ELECTRICITY = "jos-electricity",
    IBADAN_ELECTRICITY = "ibadan-electricity",
    KADUNA_ELECTRIC = "kaduna-electric",
    ABUJA_ELECTRIC = "abuja-electric",
    ENUGU_ELECTRIC = "enugu-electric",
    BENIN_ELECTRIC = "benin-electric",
    ABA_POWER = "aba-power",
}

export interface PurchaseInitializationHandlerOutput {
    paymentReference: string;
    totalAmount: number;
}

export enum TransactionShortDescription {
    WALLET_FUNDED = "Wallet Funded",
    ELECTRICITY_PAYMENT = "Electricity Payment",
    DATA_PURCHASE = "Data Purchase",
    AIRTIME_PURCHASE = "Airtime Purchase",
    CABLE_TV_PAYMENT = "Cable TV Payment",
}

export interface BillPurchaseInitializationHandlerOptions<PurchaseOptions> {
    purchaseOptions: PurchaseOptions;
    user: User;
    billProvider: BillProvider;
    paymentChannel: PaymentChannel;
    wallet?: Wallet;
    billService?: BillService;
}

export interface CompleteBillPurchaseTransactionOptions {
    id: number;
    billProviderId: number;
    userId: number;
    amount: number;
    senderIdentifier: string; //customer receiver identifier
    billPaymentReference: string;
    paymentStatus: PaymentStatus;
    paymentChannel: PaymentChannel;
}
export interface CompleteBillPurchaseUserOptions {
    email: string;
    userType: UserType;
    phone?: string;
}

export interface CompleteBillPurchaseOptions<TransactionOptions> {
    user: CompleteBillPurchaseUserOptions;
    transaction: TransactionOptions;
    billProvider: BillProvider;
    isWalletPayment?: boolean;
}

export type VerifyPurchase<TBillData> = {
    status: string;
    paymentStatus: string;
    paymentReference: string;
    transactionId: string;
    amount: number;
    serviceCharge: number;
    paymentChannel: string;
    user: {
        firstName: string;
        lastName: string;
    };
    createdAt: Date;
    updatedAt: Date;
} & TBillData;
