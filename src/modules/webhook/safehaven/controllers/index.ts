import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    VERSION_NEUTRAL,
} from "@nestjs/common";
import { SafehavenWebhookService } from "../services";
import * as t from "../types";

@Controller({
    path: "safehaven",
    version: VERSION_NEUTRAL,
})
export class SafehavenWebhookController {
    constructor(
        private readonly safehavenWebhookService: SafehavenWebhookService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post()
    async processWebhook<E extends t.EventName>(
        @Body() body: t.SafehavenEvent<E>
    ) {
        return this.safehavenWebhookService.processWebhook(body);
    }
}
