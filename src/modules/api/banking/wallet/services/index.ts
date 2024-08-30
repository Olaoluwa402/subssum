import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import * as dto from "../dtos";

import * as e from "../errors";

import * as t from "../types";
import { PrismaService } from "@/modules/core/prisma/services";
import { BankingInjectionToken } from "@/modules/factory/banking/types";
import { SafehavenService } from "@/modules/factory/banking/providers/safehaven/services";
import * as Utils from "@/utils";
import {
    PaymentChannel,
    PaymentStatus,
    TransactionFlow,
    TransactionStatus,
    TransactionType,
    User,
    VirtualAccountProvider,
    WalletSetupStatus,
} from "@prisma/client";
import * as UE from "@/modules/api/user/errors";

@Injectable()
export class WalletService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(BankingInjectionToken.SAFEHAVEN)
        private readonly safehavenService: SafehavenService
    ) {}

    private verifyUserNameExist(user: User) {
        if (!user.firstName || !user.lastName) {
            throw new UE.UserGenericException(
                "Kindly update your name before proceeding",
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async verifyIdentity(options: dto.VerifyIdentityDto, user: User) {
        if (user.isWalletCreated) {
            throw new e.WalletException(
                "BVN already verified",
                HttpStatus.BAD_REQUEST
            );
        }

        this.verifyUserNameExist(user);

        const resp = await this.safehavenService.initiateVerification({
            identityNumber: options.bvn,
            identityType: "BVN",
        });

        return Utils.buildResponse({
            message: "An OTP has been sent to the registered BVN Phone Number",
            data: {
                bvn: options.bvn,
                verificationId: resp.verificationId,
            },
        });
    }

    async createWallet(options: dto.CreateWalletDto, user: User) {
        if (user.isWalletCreated) {
            throw new e.WalletException(
                "Wallet already activated",
                HttpStatus.BAD_REQUEST
            );
        }

        this.verifyUserNameExist(user);

        const virtualAccount = await this.safehavenService.createSubAccount({
            emailAddress: user.email,
            identityNumber: options.bvn,
            identityType: "BVN",
            otp: options.otp,
            phoneNumber: user.phone,
            externalReference: Utils.generateId({ type: "reference" }),
            identityId: options.verificationId,
        });

        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: user.id },
                data: {
                    isWalletCreated: true,
                    walletSetupStatus: WalletSetupStatus.ACTIVE,
                },
            });

            await tx.virtualBankAccount.create({
                data: {
                    accountName: virtualAccount.accountName,
                    accountNumber: virtualAccount.accountNumber,
                    bankName: this.safehavenService.getBankName(),
                    provider: VirtualAccountProvider.SAFEHAVEN,
                    reference: virtualAccount.externalReference,
                    userId: user.id,
                },
            });

            await tx.wallet.create({
                data: {
                    userId: user.id,
                    walletNumber: Utils.generateId({ type: "walletNumber" }),
                },
            });
        });

        return Utils.buildResponse({
            message: "wallet successfully activated",
        });
    }

    /**
     * @description process wallet funding from bank deposit on virtual account
     * @param options
     */
    async walletBankDeposit(options: t.WalletBankDeposit) {
        const virtualAccount = await this.prisma.virtualBankAccount.findUnique({
            where: {
                accountNumber_provider: {
                    accountNumber: options.accountNumber,
                    provider: options.provider,
                },
            },
        });

        if (!virtualAccount) {
            throw new e.VirtualAccountNotFoundException(
                `Virtual Account with account number, ${options.accountNumber} and provider, ${options.provider} not found`,
                HttpStatus.NOT_FOUND
            );
        }

        const transaction = await this.prisma.transaction.findUnique({
            where: {
                paymentReference: options.reference,
            },
        });

        if (transaction) {
            throw new e.DuplicateWalletFundException(
                "Duplicate wallet funding",
                HttpStatus.CONFLICT
            );
        }

        await this.prisma.$transaction(async (tx) => {
            await tx.transaction.create({
                data: {
                    amount: options.amount,
                    flow: TransactionFlow.IN,
                    shortDescription: "Wallet Fund Deposit",
                    paymentChannel:
                        PaymentChannel.SAFEHAVEN_VIRTUAL_ACCOUNT_TRANSFER,
                    paymentReference: options.reference,
                    userId: virtualAccount.userId,
                    status: TransactionStatus.SUCCESS,
                    totalAmount: options.amount,
                    transactionId: Utils.generateId({
                        type: "transaction",
                    }),
                    type: TransactionType.WALLET_FUND,
                    description: options.narration,
                    paymentStatus: PaymentStatus.SUCCESS,
                },
            });

            await tx.wallet.update({
                where: {
                    userId: virtualAccount.userId,
                },
                data: {
                    availableBalance: {
                        increment: options.amount,
                    },
                    bookBalance: {
                        increment: options.amount,
                    },
                },
            });
        });
    }

    async getListOfBanks(): Promise<ApiResponse<t.GetBankListResData[]>> {
        const banks = await this.safehavenService.getBanks();
        return Utils.buildResponse({
            message: "banks successfully retrieved",
            data: banks,
        });
    }

    async verifyBankAccount(
        options: dto.VerifyBankAccountDto
    ): Promise<ApiResponse<t.VerifyAccountResData>> {
        const account = await this.safehavenService.nameEnquiry({
            accountNumber: options.accountNumber,
            bankCode: options.bankCode,
        });

        return Utils.buildResponse({
            message: "account successfully verified",
            data: {
                accountName: account.accountName,
                accountNumber: account.accountNumber,
                bankCode: account.bankCode,
            },
        });
    }

    async getWallet(user: User) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId: user.id },
        });

        if (!wallet) {
            throw new e.WalletNotFoundException(
                "Wallet does not exist. Kindly activate your wallet",
                HttpStatus.NOT_FOUND
            );
        }

        return Utils.buildResponse({
            message: "wallet retrieved",
            data: {
                availableBalance: wallet.availableBalance,
                bookBalance: wallet.bookBalance,
                walletNumber: wallet.walletNumber,
            },
        });
    }

    async getVirtualAccounts(user: User) {
        const virtualAccounts = await this.prisma.virtualBankAccount.findMany({
            where: { userId: user.id },
        });

        const result = virtualAccounts.map((v) => {
            return {
                bankName: v.bankName,
                accountName: v.accountName,
                accountNumber: v.accountNumber,
            };
        });

        return Utils.buildResponse({
            message: "virtual accounts retrieved",
            data: result,
        });
    }
}
