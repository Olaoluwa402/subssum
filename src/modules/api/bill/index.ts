import { Module, Provider } from "@nestjs/common";
import { AirtimeBillController } from "./controllers/v1/airtime";
import { AirtimeBillService } from "./services/airtime";
import { Shago } from "@/libs/shago";
import { shagoOptions } from "@/config";

export const ShagoProvider: Provider = {
    provide: "SHAGO",
    useFactory: () => {
        const shago = new Shago(shagoOptions);
        return shago;
    },
};

@Module({
    imports: [],
    controllers: [AirtimeBillController],
    providers: [AirtimeBillService, ShagoProvider],
})
export class BillModule {}
