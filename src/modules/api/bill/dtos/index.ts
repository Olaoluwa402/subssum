import { IsEnum, IsString } from "class-validator";
import { BillProviderSlug } from "../interfaces";

export enum PaymentProvider {
    WALLET = "WALLET",
}

export class PurchaseBillDto {
    @IsEnum(PaymentProvider)
    paymentProvider: PaymentProvider;

    @IsEnum(BillProviderSlug)
    billProvider: BillProviderSlug;
}

export class PaymentReferenceDto {
    @IsString()
    reference: string;
}
