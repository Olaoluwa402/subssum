export interface SafehavenOptions {
    clientId: string;
    clientAssertion: string;
    baseURL: string;
    debitAccountNumber: string;
    collectionAccountNumber?: string;
    /**
     *This should be set when creating a virtual account. It determines if auto sweep should be enabled or disabled.
     */
    autoSweep: boolean;
}

export interface BaseResponse<D extends Record<string, any>> {
    message: string;
    statusCode: number;
    data: D;
}

export interface GetAccessTokenOptions {
    client_id: string;
    client_assertion: string;
    grant_type: "client_credentials";
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
}

export interface GetAccessTokenResponse {
    access_token: string;
    client_id: string;
    token_type: "Bearer";
    expires_in: number;
    refresh_token: string;
    ibs_client_id: string;
    ibs_user_id: string;
}

export type IdentityType = "BVN" | "NIN" | "vID";
export type CurrencyCode = "NGN";
export type AccountType = "Current";
export type SubAccountType = "Individual" | "Corporate";

export interface InitiateVerificationOptions {
    type: IdentityType;
    number: string;
    debitAccountNumber: string;
    async?: boolean;
    provider?: "creditRegistry" | "firstCentral";
}

export type InitiateVerificationStatus = "SUCCESS" | "FAILED";
export interface InitiateVerificationResponse {
    _id: string;
    status: InitiateVerificationStatus;
    type: IdentityType;
    amount: number;
    vat: number;
    stampDuty: number;
    otpVerified: boolean;
    otpResendCount: number;
    debitSessionId: string;
    otpId: string;
}

export interface BuildAuthHeader {
    Authorization: string;
    ClientID: string;
}

export interface CreateSubAccountOptions {
    phoneNumber: string;
    emailAddress: string;
    identityType: IdentityType;
    autoSweep?: boolean;
    autoSweepDetails?: {
        schedule: "Instant";
        accountNumber: string;
    };
    externalReference?: string;
    identityNumber: string;
    identityId: string;
    otp: string;
    companyRegistrationNumber?: string;
}

export interface CreateSubAccountResponse {
    accountNumber: string;
    accountName: string;
    accountType: AccountType;
    currencyCode: CurrencyCode;
    bvn: string;
    accountBalance: number;
    bookBalance: number;
    subAccountDetails: {
        _id: string;
        firstName: string;
        lastName: string;
        emailAddress: string;
        bvn: string;
        nin: string;
        accountType: SubAccountType;
    };
    externalReference: string;
    autoSweepDetails: {
        _id: string;
        schedule: "Instant";
        accountNumber: string;
        bankCode: string;
    };
    nin: string;
}

export interface NameEnquiryOptions {
    bankCode: string;
    accountNumber: string;
}

export interface NameEnquiryResponse {
    bankCode: string;
    accountNumber: string;
    accountName: string;
    bvn: string;
}

export interface GetBankListResponse {
    name: string;
    alias: string[];
    routingKey: string;
    logoImage: null;
    bankCode: string;
    categoryId: string;
    nubanCode?: string;
}

export interface TransferStatusOptions {
    sessionId: string;
}

export interface TransferStatusResponse {
    _id: string;
    client: string;
    account: string;
    type: "Outwards";
    sessionId: string;
    nameEnquiryReference: string;
    paymentReference: string;
    mandateReference: string | null;
    isReversed: boolean;
    reversalReference: string | null;
    provider: "BANK";
    providerChannel: "TRANSFER";
    providerChannelCode: "IBS";
    destinationInstitutionCode: string;
    creditAccountName: string;
    creditAccountNumber: string;
    creditBankVerificationNumber: string | null;
    creditKYCLevel: string;
    debitAccountName: string;
    debitAccountNumber: string;
    debitBankVerificationNumber: string | null;
    debitKYCLevel: string;
    transactionLocation: string;
    narration: string;
    amount: number;
    fees: number;
    vat: number;
    stampDuty: number;
    responseCode: string;
    responseMessage: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    approvedAt: string;
    approvedBy: string;
}
