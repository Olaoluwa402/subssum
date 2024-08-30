import { Global, Module } from "@nestjs/common";
import { WalletController } from "./controllers/v1";
import { WalletService } from "./services";
import { BankingFactoryModule } from "@/modules/factory/banking";

@Global()
@Module({
    imports: [BankingFactoryModule],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
