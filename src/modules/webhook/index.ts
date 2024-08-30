import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { SafehavenWebhookModule } from "./safehaven";

@Module({
    imports: [
        SafehavenWebhookModule,
        RouterModule.register([
            { path: "webhooks", module: SafehavenWebhookModule },
        ]),
    ],
})
export class WebhookModule {}
