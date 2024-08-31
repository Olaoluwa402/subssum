import { IsEnum, IsNumber, IsPositive, IsString } from "class-validator";
import { PurchaseBillDto } from ".";

export enum NetworkAirtimeProvider {
    MTN = "mtn-airtime",
    AIRTEL = "airtel-airtime",
    "9mobile" = "9mobile-airtime",
    GLO = "glo-airtime",
}

export class PurchaseAirtimeDto extends PurchaseBillDto {
    @IsString()
    vtuNumber: string;

    @IsPositive()
    @IsNumber()
    vtuAmount: number;

    @IsEnum(NetworkAirtimeProvider)
    billService: NetworkAirtimeProvider;
}
