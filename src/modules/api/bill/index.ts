import { Module } from "@nestjs/common";
import { AirtimeBillController } from "./controllers/v1/airtime";
import { AirtimeBillService } from "./services/airtime";

@Module({
    imports: [],
    providers: [AirtimeBillService],
    controllers: [AirtimeBillController],
    exports: [],
})
export class BillModule {}
