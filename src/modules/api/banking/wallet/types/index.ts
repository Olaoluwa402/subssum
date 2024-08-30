import { VirtualAccountProvider } from "@prisma/client";

export interface WalletBankDeposit {
    reference: string;
    amount: number;
    provider: VirtualAccountProvider;
    accountNumber: string;
    narration?: string;
}

export interface VerifyAccountResData {
    accountName: string;
    accountNumber: string;
    bankCode: string;
}

export interface GetBankListResData {
    name: string;
    logoImage: null;
    bankCode: string;
    nubanCode?: string;
}
