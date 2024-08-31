import { PrismaService } from "@/modules/core/prisma/services";
import { buildResponse } from "@/utils/api-response-util";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TransactionHistoryWithFiltersDto } from "../dtos";
import {
    Prisma,
    TransactionType,
    User,
    WalletFundTransactionFlow,
} from "@prisma/client";
import { TransactionNotFoundException } from "../errors";
import { TransactionDetailResponse } from "../interfaces";

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {}

    async getTransactionByPaymentReference(reference: string) {
        return await this.prisma.transaction.findUnique({
            where: { paymentReference: reference },
        });
    }

    async transactionHistory(
        options: TransactionHistoryWithFiltersDto,
        user: User
    ) {
        const meta: Partial<PaginationMeta> = {};

        const queryOptions: Prisma.TransactionFindManyArgs = {
            orderBy: { createdAt: "desc" },
            where: {
                userId: user.id,
            },
            select: {
                id: true,
                amount: true,
                totalAmount: true,
                paymentChannel: true,
                shortDescription: true,
                status: true,
                transactionId: true,
                flow: true,
                type: true,
                user: {
                    select: { phone: true },
                },
                BillService: {
                    select: {
                        icon: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        };

        //filters
        let type: TransactionType[] = [];

        if (options.airtimeFilter) {
            type = [...type, TransactionType.AIRTIME_PURCHASE];
            queryOptions.where.type = {
                in: type,
            };
        }

        if (options.dataFilter) {
            type = [...type, TransactionType.DATA_PURCHASE];
            queryOptions.where.type = {
                in: type,
            };
        }

        if (options.cableTvFilter) {
            type = [...type, TransactionType.CABLETV_BILL];
            queryOptions.where.type = {
                in: type,
            };
        }

        if (options.powerFilter) {
            type = [...type, TransactionType.ELECTRICITY_BILL];
            queryOptions.where.type = {
                in: type,
            };
        }

        if (options.startDate && options.endDate) {
            queryOptions.where.createdAt = {
                gte: new Date(options.startDate),
                lte: new Date(options.endDate),
            };
        }

        //pagination
        if (options.pagination) {
            const page = +options.page || 1;
            const limit = +options.limit || 10;
            const offset = (page - 1) * limit;
            queryOptions.skip = offset;
            queryOptions.take = limit;
            const count = await this.prisma.transaction.count({
                where: queryOptions.where,
            });
            meta.totalCount = count;
            meta.page = page;
            meta.perPage = limit;
        }

        const transactions = await this.prisma.transaction.findMany(
            queryOptions
        );
        if (options.pagination) {
            meta.pageCount = transactions.length;
        }

        const result = {
            meta: meta,
            records: transactions.map((t) => {
                return {
                    id: t.id,
                    amount: t.amount,
                    totalAmount: t.totalAmount,
                    status: t.status,
                    paymentStatus: t.paymentStatus,
                    paymentMethod: t.paymentChannel,
                    transactionNo: t.transactionId,
                    date: t.createdAt,
                    description: t.shortDescription,
                    type: t.type,
                };
            }),
        };

        return buildResponse({
            message: "Transaction history successfully retrieved",
            data: result,
        });
    }

    async fetchTransactionDetails(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                id: id,
            },
            select: {
                transactionId: true,
                type: true,
                shortDescription: true,
                senderIdentifier: true,
                amount: true,
                billServiceSlug: true,
                paymentChannel: true,
                packageType: true,
                token: true,
                receiverIdentifier: true,
                destinationBankName: true,
                destinationBankAccountName: true,
                destinationBankAccountNumber: true,
                walletFundTransactionFlow: true,
                meterType: true,
                updatedAt: true,
                status: true,
                senderId: true,
                userId: true,
                user: {
                    select: {
                        email: true,
                        wallet: {
                            select: {
                                walletNumber: true,
                            },
                        },
                    },
                },
            },
        });

        if (!transaction) {
            throw new TransactionNotFoundException(
                "Transaction not found",
                HttpStatus.NOT_FOUND
            );
        }

        let response: TransactionDetailResponse;

        switch (transaction.type) {
            case TransactionType.AIRTIME_PURCHASE: {
                response = {
                    customerId: transaction.userId,
                    paymentMethod: transaction.paymentChannel,
                    transactionId: transaction.transactionId,
                    type: transaction.type,
                    amount: transaction.amount,
                    shortDescription: transaction.shortDescription,
                    beneficiary: transaction.senderIdentifier,
                    date: transaction.updatedAt,
                    status: transaction.status,
                };
                break;
            }
            case TransactionType.DATA_PURCHASE: {
                response = {
                    customerId: transaction.userId,
                    transactionId: transaction.transactionId,
                    paymentMethod: transaction.paymentChannel,
                    type: transaction.type,
                    shortDescription: transaction.shortDescription,
                    product: transaction.packageType,
                    beneficiary: transaction.senderIdentifier,
                    amount: transaction.amount,
                    date: transaction.updatedAt,
                    status: transaction.status,
                };
                break;
            }

            case TransactionType.ELECTRICITY_BILL: {
                response = {
                    customerId: transaction.userId,
                    transactionId: transaction.transactionId,
                    paymentMethod: transaction.paymentChannel,
                    type: transaction.type,
                    shortDescription: transaction.shortDescription,
                    beneficiary: transaction.senderIdentifier,
                    amount: transaction.amount,
                    token: transaction.token,
                    meterType: transaction.meterType as any,
                    date: transaction.updatedAt,
                    status: transaction.status,
                    product: transaction.packageType,
                };
                break;
            }
            case TransactionType.CABLETV_BILL: {
                response = {
                    customerId: transaction.userId,
                    transactionId: transaction.transactionId,
                    paymentMethod: transaction.paymentChannel,
                    type: transaction.type,
                    shortDescription: transaction.shortDescription,
                    amount: transaction.amount,
                    product: transaction.packageType,
                    beneficiary: transaction.senderIdentifier,
                    date: transaction.updatedAt,
                    status: transaction.status,
                };
                break;
            }

            case TransactionType.WALLET_FUND: {
                const walletToWalletTransfer = [
                    WalletFundTransactionFlow.BENEFACTOR_TO_BENEFICIARY,
                ] as any;
                if (
                    walletToWalletTransfer.includes(
                        transaction.walletFundTransactionFlow
                    )
                ) {
                    const sender = await this.prisma.user.findUnique({
                        where: { id: transaction.senderId },
                        select: {
                            email: true,
                        },
                    });
                    const receiver = await this.prisma.user.findUnique({
                        where: { id: transaction.senderId },
                        select: {
                            email: true,
                        },
                    });

                    response = {
                        customerId: transaction.userId,
                        transactionId: transaction.transactionId,
                        paymentMethod: transaction.paymentChannel,
                        amount: transaction.amount,
                        sender: sender ? sender.email : "N/A",
                        type: "WALLET_TRANSFER",
                        shortDescription: transaction.shortDescription,
                        date: transaction.updatedAt,
                        status: transaction.status,
                        beneficiary: receiver ? receiver.email : "N/A",
                    };
                }

                if (
                    transaction.walletFundTransactionFlow ==
                    WalletFundTransactionFlow.SELF_FUND
                ) {
                    response = {
                        customerId: transaction.userId,
                        transactionId: transaction.transactionId,
                        paymentMethod: transaction.paymentChannel,
                        type: "DEPOSIT",
                        shortDescription: transaction.shortDescription,
                        amount: transaction.amount,
                        date: transaction.updatedAt,
                        status: transaction.status,
                        beneficiary: transaction.user
                            ? transaction.user.email
                            : "N/A",
                    };
                }
            }
        }

        return buildResponse({
            message: "transaction details fetched successfully",
            data: response,
        });
    }
}
