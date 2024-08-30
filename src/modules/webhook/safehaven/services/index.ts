import { WalletService } from "@/modules/api/banking/wallet/services";
import { SafehavenWebhookEvent } from "../events";
import * as t from "../types";
import { VirtualAccountProvider } from "@prisma/client";
import { Inject } from "@nestjs/common";
import { BankingInjectionToken } from "@/modules/factory/banking/types";
import { SafehavenService } from "@/modules/factory/banking/providers/safehaven/services";

export class SafehavenWebhookService {
    constructor(
        private readonly webhookEvent: SafehavenWebhookEvent,
        private readonly walletService: WalletService,
        @Inject(BankingInjectionToken.SAFEHAVEN)
        private readonly safehavenService: SafehavenService
    ) {}

    async processWebhook<T extends t.EventName>(
        options: t.SafehavenEvent<T>
    ): Promise<t.AcknowledgeResponse> {
        //verify webhook
        await this.safehavenService.transferStatus({
            sessionId: options.data.sessionId,
        });

        switch (options.type) {
            case "transfer": {
                this.webhookEvent.emit(
                    "sub_account_deposit",
                    options.data as t.SubAccountDeposit
                );
                break;
            }

            default:
                break;
        }

        return {
            responseCode: "00",
            statusCode: 200,
        };
    }
    async processSubAccountDeposit(options: t.SubAccountDeposit) {
        await this.walletService.walletBankDeposit({
            accountNumber: options.creditAccountNumber,
            amount: options.amount,
            provider: VirtualAccountProvider.SAFEHAVEN,
            reference: options.sessionId,
            narration: options.narration,
        });
    }
}
