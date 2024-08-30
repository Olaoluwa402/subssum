import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { EventEmitter } from "events";
import * as t from "../types";
import { SafehavenWebhookService } from "../services";

@Injectable()
export class SafehavenWebhookEvent extends EventEmitter {
    private readonly logger = new Logger(SafehavenWebhookEvent.name);
    constructor(
        @Inject(forwardRef(() => SafehavenWebhookService))
        private readonly webhookService: SafehavenWebhookService
    ) {
        super();
        this.on("sub_account_deposit", this.onProcessSubAccountDeposit);
    }

    emit<K extends keyof t.SafehavenWebhookEventMap>(
        eventName: K,
        payload: t.SafehavenWebhookEventMap[K]
    ): boolean {
        return super.emit(eventName, payload);
    }

    on<K extends keyof t.SafehavenWebhookEventMap>(
        eventName: K,
        listener: (payload: t.SafehavenWebhookEventMap[K]) => void
    ) {
        return super.on(eventName, listener);
    }

    async onProcessSubAccountDeposit(options: t.SubAccountDeposit) {
        try {
            await this.webhookService.processSubAccountDeposit(options);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
