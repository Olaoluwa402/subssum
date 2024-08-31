import { IsEnum, IsNumber, IsPositive, IsString } from "class-validator";
import { PurchaseBillDto } from ".";

export enum NetworkAirtimeProvider {
    MTN = "mtn-airtime",
    AIRTEL = "airtel-airtime",
    ETISALAT = "etisalat-airtime",
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
