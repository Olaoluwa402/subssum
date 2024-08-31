import { Module } from "@nestjs/common";
import { AuthModule } from "./auth";
import { AuthorizeModule } from "./authorize";
import { UserModule } from "./user";
import { BankingModule } from "./banking";
import { BillModule } from "./bill";
import { TransactionModule } from "./transaction";
import { WebExtension } from "./webExtension";

@Module({
    imports: [
        WebExtension,
        UserModule,
        AuthModule,
        AuthorizeModule,
        BankingModule,
        BillModule,
        TransactionModule,
    ],
})
export class APIModule {}
