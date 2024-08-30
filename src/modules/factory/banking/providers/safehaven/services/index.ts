import * as SH from "@/libs/safehaven";
import { HttpStatus, Logger } from "@nestjs/common";
import * as t from "../types";
import * as e from "../errors";

export class SafehavenService {
    private readonly logger = new Logger(SafehavenService.name);
    constructor(private readonly safehaven: SH.Safehaven) {}

    getBankName() {
        return this.safehaven.bankName;
    }

    async initiateVerification(
        options: t.InitiateVerificationOptions
    ): Promise<t.InitiateVerificationResponse> {
        try {
            const resp = await this.safehaven.initiateVerification({
                number: options.identityNumber,
                type: options.identityType,
            });

            if (!resp) {
                throw new e.SafehavenException(
                    `Unable to initiate ${options.identityType} verification`,
                    HttpStatus.BAD_REQUEST
                );
            }

            if (resp.status != "SUCCESS") {
                throw new e.SafehavenException(
                    `Unable to initiate ${options.identityType} verification`,
                    HttpStatus.BAD_REQUEST
                );
            }

            return {
                amount: resp.amount,
                type: resp.type,
                otpVerified: resp.otpVerified,
                status: resp.status,
                debitSessionId: resp.debitSessionId,
                otpId: resp.otpId,
                otpResendCount: resp.otpResendCount,
                stampDuty: resp.stampDuty,
                vat: resp.vat,
                verificationId: resp._id,
            };
        } catch (error) {
            this.logger.error(error);
            switch (true) {
                case error instanceof SH.SafehavenError: {
                    throw new e.SafehavenException(
                        error.message ??
                            "Failed to initiate verification. Please try again",
                        error.status ?? HttpStatus.BAD_REQUEST
                    );
                }
                case error instanceof e.SafehavenException: {
                    throw error;
                }

                default: {
                    throw new e.SafehavenException(
                        "Failed to initiate verification",
                        HttpStatus.NOT_IMPLEMENTED
                    );
                }
            }
        }
    }

    async createSubAccount(
        options: t.CreateSubAccountOptions
    ): Promise<t.CreateSubAccountResponse> {
        try {
            const resp = await this.safehaven.createSubAccount({
                emailAddress: options.emailAddress,
                identityId: options.identityId,
                identityNumber: options.identityNumber,
                identityType: options.identityType,
                otp: options.otp,
                phoneNumber: options.phoneNumber,
                externalReference: options.externalReference,
                companyRegistrationNumber: options.companyRegistrationNumber,
            });

            return {
                accountName: resp.accountName,
                accountNumber: resp.accountNumber,
                externalReference: resp.externalReference,
                subAccountType: resp.subAccountDetails.accountType,
            };
        } catch (error) {
            this.logger.error(error);
            switch (true) {
                case error instanceof SH.SafehavenError: {
                    throw new e.SafehavenException(
                        error.message ??
                            "Failed to create virtual account. Please try again",
                        error.status ?? HttpStatus.BAD_REQUEST
                    );
                }

                default: {
                    throw new e.SafehavenException(
                        error.message ??
                            "Failed to create virtual account. Please try again",
                        HttpStatus.NOT_IMPLEMENTED
                    );
                }
            }
        }
    }

    async nameEnquiry(
        options: t.NameEnquiryOptions
    ): Promise<t.NameEnquiryResponse> {
        try {
            const resp = await this.safehaven.nameEnquiry({
                accountNumber: options.accountNumber,
                bankCode: options.bankCode,
            });

            return {
                accountName: resp.accountName,
                accountNumber: resp.accountNumber,
                bankCode: resp.bankCode,
            };
        } catch (error) {
            this.logger.error(error);
            switch (true) {
                case error instanceof SH.SafehavenError: {
                    throw new e.SafehavenException(
                        error.message ?? "Unable to enquire account name",
                        error.status ?? HttpStatus.BAD_REQUEST
                    );
                }

                default: {
                    throw new e.SafehavenException(
                        error.message ??
                            "Unable to enquire account name. Please try again",
                        HttpStatus.NOT_IMPLEMENTED
                    );
                }
            }
        }
    }

    async getBanks(): Promise<t.GetBankListResponse[]> {
        try {
            const resp = await this.safehaven.getBanks();
            const data: t.GetBankListResponse[] = resp.map((b) => {
                return {
                    name: b.name,
                    logoImage: b.logoImage,
                    bankCode: b.bankCode,
                    nubanCode: b.nubanCode,
                };
            });

            return data;
        } catch (error) {
            this.logger.error(error);
            switch (true) {
                case error instanceof SH.SafehavenError: {
                    throw new e.SafehavenException(
                        error.message ?? "Unable to enquire account name",
                        error.status ?? HttpStatus.BAD_REQUEST
                    );
                }

                default: {
                    throw new e.SafehavenException(
                        error.message ??
                            "Unable to enquire account name. Please try again",
                        HttpStatus.NOT_IMPLEMENTED
                    );
                }
            }
        }
    }

    async transferStatus(
        options: t.TransferStatusOptions
    ): Promise<t.TransferStatusResponse> {
        try {
            const resp = await this.safehaven.transferStatus({
                sessionId: options.sessionId,
            });

            return {
                id: resp._id,
                amount: resp.amount,
                sessionId: resp.sessionId,
                account: resp.account,
                creditAccountName: resp.creditAccountName,
                creditAccountNumber: resp.creditAccountNumber,
                narration: resp.narration,
                debitAccountName: resp.debitAccountName,
                debitAccountNumber: resp.debitAccountNumber,
                fees: resp.fees,
                paymentReference: resp.paymentReference,
                vat: resp.vat,
                stampDuty: resp.stampDuty,
                type: resp.type,
            };
        } catch (error) {
            this.logger.error(error);
            switch (true) {
                case error instanceof SH.SafehavenError: {
                    throw new e.SafehavenException(
                        error.message ??
                            "Failed to retrieve transfer status. Please try again",
                        error.status ?? HttpStatus.BAD_REQUEST
                    );
                }

                default: {
                    throw new e.SafehavenException(
                        error.message ?? "Failed to retrieve transfer status",
                        HttpStatus.NOT_IMPLEMENTED
                    );
                }
            }
        }
    }
}
