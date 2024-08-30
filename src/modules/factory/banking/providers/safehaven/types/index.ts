import * as SH from "@/libs/safehaven";

export interface InitiateVerificationOptions {
    identityType: SH.TSafehaven.IdentityType;
    identityNumber: string;
}

export interface InitiateVerificationResponse {
    status: SH.TSafehaven.InitiateVerificationStatus;
    type: SH.TSafehaven.IdentityType;
    amount: number;
    vat: number;
    stampDuty: number;
    otpVerified: boolean;
    otpResendCount: number;
    debitSessionId: string;
    otpId: string;
    verificationId: string;
}

export interface CreateSubAccountOptions {
    phoneNumber: string;
    emailAddress: string;
    identityType: SH.TSafehaven.IdentityType;
    externalReference?: string;
    identityNumber: string;
    identityId: string;
    otp: string;
    companyRegistrationNumber?: string;
}

export interface CreateSubAccountResponse {
    accountName: string;
    accountNumber: string;
    externalReference: string;
    subAccountType: SH.TSafehaven.SubAccountType;
}

export interface NameEnquiryOptions {
    bankCode: string;
    accountNumber: string;
}

export interface NameEnquiryResponse {
    bankCode: string;
    accountNumber: string;
    accountName: string;
}

export interface GetBankListResponse {
    name: string;
    logoImage: null;
    bankCode: string;
    nubanCode?: string;
}

export interface TransferStatusOptions {
    sessionId: string;
}

export interface TransferStatusResponse {
    id: string;
    account: string;
    type: "Outwards";
    sessionId: string;
    paymentReference: string;
    creditAccountName: string;
    creditAccountNumber: string;
    debitAccountName: string;
    debitAccountNumber: string;
    narration: string;
    amount: number;
    fees: number;
    vat: number;
    stampDuty: number;
}
