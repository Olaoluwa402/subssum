import { Module } from "@nestjs/common";
import { BankingFactoryModule } from "./banking";

@Module({
    imports: [BankingFactoryModule],
})
export class FactoryModule {}
