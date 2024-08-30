import { Module, Provider } from "@nestjs/common";
import { BankingFactory } from "./factory";
import { BankingInjectionToken } from "./types";
import { bankingConfig } from "@/config";

const safehavenService: Provider = {
    provide: BankingInjectionToken.SAFEHAVEN,
    useFactory() {
        const bankingFactory = new BankingFactory(bankingConfig);
        return bankingFactory.build({ provider: "safehaven" });
    },
};

@Module({
    providers: [safehavenService],
    exports: [safehavenService],
})
export class BankingFactoryModule {}
