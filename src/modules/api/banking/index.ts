import { Module } from "@nestjs/common";
import { CardModule } from "./card";
import { WalletModule } from "./wallet";
import { RouterModule } from "@nestjs/core";

@Module({
    imports: [
        CardModule,
        WalletModule,
        RouterModule.register([{ path: "banking", module: CardModule }]),
        RouterModule.register([{ path: "banking", module: WalletModule }]),
    ],
})
export class BankingModule {}
