import { Module } from "@nestjs/common";
import { SafehavenWebhookController } from "./controllers";
import { SafehavenWebhookService } from "./services";
import { SafehavenWebhookEvent } from "./events";
import { BankingFactoryModule } from "@/modules/factory/banking";

@Module({
    imports: [BankingFactoryModule],
    controllers: [SafehavenWebhookController],
    providers: [SafehavenWebhookService, SafehavenWebhookEvent],
})
export class SafehavenWebhookModule {}
