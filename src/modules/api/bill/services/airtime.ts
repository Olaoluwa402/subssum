import { PrismaService } from "@/modules/core/prisma/services";

import { buildResponse, generateId } from "@/utils";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import {
    PaymentChannel,
    PaymentStatus,
    Prisma,
    TransactionFlow,
    TransactionStatus,
    TransactionType,
    User,
} from "@prisma/client";

import {
    AirtimeToCashDto,
    NetworkAirtimeProvider,
    PurchaseAirtimeDto,
} from "../dtos/airtime";
import {
    CompleteAirtimePurchaseTransactionOptions,
    FormatAirtimeNetworkInput,
    FormatAirtimeNetworkOutput,
    VerifyAirtimePurchaseData,
} from "../interfaces/airtime";
import {
    AirtimePurchaseException,
    AirtimeToCashException,
    DuplicateAirtimePurchaseException,
    InvalidBillTypePaymentReference,
} from "../errors";
import {
    BillProviderSlug,
    BillPurchaseInitializationHandlerOptions,
    CompleteBillPurchaseOptions,
    PurchaseInitializationHandlerOutput,
    TransactionShortDescription,
    VerifyPurchase,
} from "../interfaces";
import { PaymentProvider, PaymentReferenceDto } from "../dtos";
import { WalletNotFoundException } from "../../banking/wallet/errors";
import { TransactionNotFoundException } from "../../transaction";
import { Shago } from "@/libs/shago";
import { VtuNetwork } from "@/libs/shago/interfaces/airtime";

@Injectable()
export class AirtimeBillService {
    constructor(
        private prisma: PrismaService,
        @Inject("SHAGO")
        private readonly shago: Shago
    ) {}

    async getAirtimeNetworks() {
        let networks = [];
        let billProvider = await this.prisma.billProvider.findFirst({
            where: {
                isActive: true,
                isDefault: true,
            },
        });

        if (!billProvider) {
            billProvider = await this.prisma.billProvider.findFirst({
                where: {
                    isActive: true,
                },
            });
        }
        if (billProvider) {
            const providerNetworks =
                await this.prisma.billProviderAirtimeNetwork.findMany({
                    where: {
                        billProviderSlug: billProvider.slug,
                    },
                    select: {
                        billProviderSlug: true,
                        billServiceSlug: true,
                        airtimeProvider: {
                            select: {
                                name: true,
                                icon: true,
                            },
                        },
                    },
                });
            networks = this.formatAirtimeNetwork(providerNetworks);
        }

        return buildResponse({
            message: "Airtime networks successfully retrieved",
            data: networks,
        });
    }

    formatAirtimeNetwork(
        networks: FormatAirtimeNetworkInput[]
    ): FormatAirtimeNetworkOutput[] {
        const formatted: FormatAirtimeNetworkOutput[] = networks.map(
            (network) => {
                return {
                    billProvider: network.billProviderSlug,
                    icon: network.airtimeProvider.icon,
                    name: network.airtimeProvider.name,
                    billService: network.billServiceSlug,
                };
            }
        );
        return formatted;
    }

    async initializeAirtimeToCash(
        airtimeToCashDto: AirtimeToCashDto,
        user: User
    ) {
        const billProvider = await this.prisma.billProvider.findUnique({
            where: {
                slug: airtimeToCashDto.billProvider,
            },
        });

        if (!billProvider) {
            throw new AirtimeToCashException(
                "Bill provider does not exist",
                HttpStatus.NOT_FOUND
            );
        }

        if (!billProvider.isActive) {
            throw new AirtimeToCashException(
                "Bill Provider not active",
                HttpStatus.BAD_REQUEST
            );
        }

        const providerNetwork =
            await this.prisma.billProviderAirtimeNetwork.findUnique({
                where: {
                    billServiceSlug_billProviderSlug: {
                        billProviderSlug: airtimeToCashDto.billProvider,
                        billServiceSlug: airtimeToCashDto.billService,
                    },
                },
            });

        if (!providerNetwork) {
            throw new AirtimeToCashException(
                "The network provider is not associated with the bill provider",
                HttpStatus.BAD_REQUEST
            );
        }

        const amountToReceive = airtimeToCashDto.vtuAmount * 0.8;

        const resp = await this.handleAirtimeToCashInitialization({
            billProvider: billProvider,
            paymentChannel: PaymentChannel.WALLET,
            purchaseOptions: airtimeToCashDto,
            user: user,
        });

        //todo: API to process Airtime to cash conversion

        return buildResponse({
            message: "Airtime to cash successfully initialized",
            data: {
                amountToConvert: airtimeToCashDto.vtuAmount,
                amountToReceive: amountToReceive,
                phone: airtimeToCashDto.vtuNumber,
                reference: resp.paymentReference,
            },
        });
    }

    async initializeAirtimePurchase(
        options: PurchaseAirtimeDto,
        user: User
    ): Promise<ApiResponse> {
        const billProvider = await this.prisma.billProvider.findUnique({
            where: {
                slug: options.billProvider,
            },
        });

        if (!billProvider) {
            throw new AirtimePurchaseException(
                "Bill provider does not exist",
                HttpStatus.NOT_FOUND
            );
        }

        if (!billProvider.isActive) {
            throw new AirtimePurchaseException(
                "Bill Provider not active",
                HttpStatus.BAD_REQUEST
            );
        }

        const providerNetwork =
            await this.prisma.billProviderAirtimeNetwork.findUnique({
                where: {
                    billServiceSlug_billProviderSlug: {
                        billProviderSlug: options.billProvider,
                        billServiceSlug: options.billService,
                    },
                },
            });

        if (!providerNetwork) {
            throw new AirtimePurchaseException(
                "The network provider is not associated with the bill provider",
                HttpStatus.BAD_REQUEST
            );
        }

        const response = (resp: PurchaseInitializationHandlerOutput) => {
            return buildResponse({
                message: "Airtime purchase payment successfully initialized",
                data: {
                    amount: resp.totalAmount,
                    email: user.email,
                    reference: resp.paymentReference,
                },
            });
        };

        switch (options.paymentProvider) {
            case PaymentProvider.WALLET: {
                const wallet = await this.prisma.wallet.findUnique({
                    where: {
                        userId: user.id,
                    },
                });

                // if (!wallet) {
                //     throw new WalletNotFoundException(
                //         "Wallet does not exist. Kindly setup your KYC",
                //         HttpStatus.NOT_FOUND
                //     );
                // }
                // if (wallet.availableBalance < options.vtuAmount) {
                //     throw new InsufficientWalletBalanceException(
                //         "Insufficient wallet balance",
                //         HttpStatus.BAD_REQUEST
                //     );
                // }
                const resp = await this.handleAirtimePurchaseInitialization({
                    billProvider: billProvider,
                    paymentChannel: PaymentChannel.WALLET,
                    purchaseOptions: options,
                    user: user,
                    wallet: wallet,
                });
                return response(resp);
            }

            default: {
                throw new AirtimePurchaseException(
                    `Payment provider must be one of: ${PaymentProvider.WALLET}`,
                    HttpStatus.BAD_REQUEST
                );
            }
        }
    }

    async handleAirtimeToCashInitialization(
        options: BillPurchaseInitializationHandlerOptions<AirtimeToCashDto>
    ): Promise<PurchaseInitializationHandlerOutput> {
        const paymentReference = generateId({ type: "reference" });
        const billPaymentReference = generateId({
            type: "irecharge_ref",
        });
        const { billProvider, paymentChannel, purchaseOptions, user } = options;

        //record transaction
        const transactionCreateOptions: Prisma.TransactionUncheckedCreateInput =
            {
                amount: purchaseOptions.vtuAmount,
                flow: TransactionFlow.IN,
                status: TransactionStatus.PENDING,
                totalAmount: purchaseOptions.vtuAmount * 0.8,
                serviceCharge: purchaseOptions.vtuAmount * 0.2,
                transactionId: generateId({ type: "transaction" }),
                type: TransactionType.AIRTIME_TO_CASH,
                airtimeSharePin: purchaseOptions.airtimeSharePin,
                userId: user.id,
                billPaymentReference: billPaymentReference,
                billProviderId: billProvider.id,
                paymentChannel: paymentChannel,
                paymentReference: paymentReference,
                network: purchaseOptions.billService.slice(
                    0,
                    purchaseOptions.billService.indexOf("-")
                ),
                paymentStatus: PaymentStatus.PENDING,
                shortDescription: TransactionShortDescription.AIRTIME_TO_CASH,
                senderIdentifier: purchaseOptions.vtuNumber,
                billServiceSlug: purchaseOptions.billService,
                provider: purchaseOptions.billProvider,
            };

        await this.prisma.transaction.create({
            data: transactionCreateOptions,
            select: {
                id: true,
            },
        });

        return {
            paymentReference: paymentReference,
            totalAmount: transactionCreateOptions.totalAmount,
        };
    }

    async handleAirtimePurchaseInitialization(
        options: BillPurchaseInitializationHandlerOptions<PurchaseAirtimeDto>
    ): Promise<PurchaseInitializationHandlerOutput> {
        const paymentReference = generateId({ type: "reference" });
        const billPaymentReference = generateId({
            type: "irecharge_ref",
        });
        const { billProvider, paymentChannel, purchaseOptions, user } = options;

        //record transaction
        const transactionCreateOptions: Prisma.TransactionUncheckedCreateInput =
            {
                amount: purchaseOptions.vtuAmount,
                flow: TransactionFlow.OUT,
                status: TransactionStatus.PENDING,
                totalAmount: purchaseOptions.vtuAmount,
                transactionId: generateId({ type: "transaction" }),
                type: TransactionType.AIRTIME_PURCHASE,
                userId: user.id,
                billPaymentReference: billPaymentReference,
                billProviderId: billProvider.id,
                paymentChannel: paymentChannel,
                paymentReference: paymentReference,
                vendType: "VTU",
                serviceCode: "QAB",
                network: purchaseOptions.billService.slice(
                    0,
                    purchaseOptions.billService.indexOf("-")
                ),
                paymentStatus: PaymentStatus.PENDING,
                shortDescription: TransactionShortDescription.AIRTIME_PURCHASE,
                senderIdentifier: purchaseOptions.vtuNumber,
                billServiceSlug: purchaseOptions.billService,
                provider: purchaseOptions.billProvider,
            };

        await this.prisma.transaction.create({
            data: transactionCreateOptions,
            select: {
                id: true,
            },
        });

        return {
            paymentReference: paymentReference,
            totalAmount: transactionCreateOptions.totalAmount,
        };
    }

    async walletPayment(options: PaymentReferenceDto, user: User) {
        const wallet = await this.prisma.wallet.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!wallet) {
            throw new WalletNotFoundException(
                "Wallet not created. Kindly setup your KYC",
                HttpStatus.NOT_FOUND
            );
        }

        const transaction = await this.prisma.transaction.findUnique({
            where: {
                paymentReference: options.reference,
            },
        });

        if (!transaction) {
            throw new TransactionNotFoundException(
                "Failed to complete wallet payment for airtime purchase. Payment reference not found",
                HttpStatus.NOT_FOUND
            );
        }
        if (transaction.userId != user.id) {
            throw new TransactionNotFoundException(
                "Failed to complete wallet payment for airtime purchase. Invalid user payment reference",
                HttpStatus.NOT_FOUND
            );
        }

        if (transaction.type != TransactionType.AIRTIME_PURCHASE) {
            throw new InvalidBillTypePaymentReference(
                "Invalid airtime purchase reference",
                HttpStatus.BAD_REQUEST
            );
        }

        if (transaction.paymentStatus == PaymentStatus.SUCCESS) {
            throw new DuplicateAirtimePurchaseException(
                "Duplicate airtime purchase payment",
                HttpStatus.BAD_REQUEST
            );
        }

        const billProvider = await this.prisma.billProvider.findUnique({
            where: {
                id: transaction.billProviderId,
            },
        });

        if (!billProvider) {
            throw new AirtimePurchaseException(
                "Failed to complete wallet payment for airtime purchase. Bill provider does not exist",
                HttpStatus.NOT_FOUND
            );
        }

        if (!billProvider.isActive) {
            throw new AirtimePurchaseException(
                "Failed to complete wallet payment for airtime purchase. Bill Provider not active",
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            //todo - charge wallet
            //update transaction
            const purchaseInfo = await this.completeAirtimePurchase({
                billProvider: billProvider,
                transaction: transaction as any,
                user: {
                    email: user.email,
                    userType: user.userType,
                },
                isWalletPayment: true,
            });

            return buildResponse({
                message: "Airtime purchase successful",
                data: {
                    reference: options.reference,
                    amount: transaction.amount,
                    phone: transaction.senderIdentifier,
                    network: {
                        reference: purchaseInfo.networkProviderReference,
                    },
                },
            });
        } catch (error) {
            switch (true) {
                default: {
                    throw error;
                }
            }
        }
    }

    async completeAirtimePurchase(
        options: CompleteBillPurchaseOptions<CompleteAirtimePurchaseTransactionOptions>
    ): Promise<any> {
        try {
            switch (options.billProvider.slug) {
                case BillProviderSlug.SHAGO: {
                    //todo: complete payment
                    // const resp = await this.shago.buyAirTime({
                    //     serviceCode: options.transaction.,
                    //     phone: options.transaction.senderIdentifier,
                    //     amount: options.transaction.amount,
                    //     vend_type: "VTU",
                    //     network: options.billProvider.name,
                    //     request_id: options.transaction.billPaymentReference,
                    // });
                }
            }
        } catch (error) {}
    }

    async verifyAirtimePurchase(options: PaymentReferenceDto, user: User) {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                paymentReference: options.reference,
            },
            select: {
                type: true,
                status: true,
                token: true,
                userId: true,
                paymentReference: true,
                amount: true,
                senderIdentifier: true,
                paymentChannel: true,
                paymentStatus: true,
                serviceCharge: true,
                createdAt: true,
                updatedAt: true,
                transactionId: true,
                BillService: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new TransactionNotFoundException(
                "Payment reference not found",
                HttpStatus.NOT_FOUND
            );
        }

        if (transaction.userId != user.id) {
            throw new TransactionNotFoundException(
                "Payment reference not found",
                HttpStatus.NOT_FOUND
            );
        }

        if (transaction.type != TransactionType.AIRTIME_PURCHASE) {
            throw new InvalidBillTypePaymentReference(
                "Invalid airtime purchase reference",
                HttpStatus.BAD_REQUEST
            );
        }

        const data: VerifyPurchase<VerifyAirtimePurchaseData> = {
            status: transaction.status,
            transactionId: transaction.transactionId,
            paymentReference: transaction.paymentReference,
            amount: transaction.amount,
            phone: transaction.senderIdentifier,
            networkReference: transaction.token,
            paymentChannel: transaction.paymentChannel,
            paymentStatus: transaction.paymentStatus,
            serviceCharge: transaction.serviceCharge,
            network: transaction.BillService?.name,
            user: {
                firstName: user?.firstName,
                lastName: user?.lastName,
            },
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };

        return buildResponse({
            message: "Airtime purchase successfully verified",
            data: data,
        });
    }
}
