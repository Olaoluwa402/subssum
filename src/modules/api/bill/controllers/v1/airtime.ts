import { AuthGuard, EnabledAccountGuard } from "@/modules/api/auth/guard";
import { User } from "@/modules/api/user";
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { User as UserModel } from "@prisma/client";

import { AirtimeToCashDto, PurchaseAirtimeDto } from "../../dtos/airtime";
import { AirtimeBillService } from "../../services/airtime";

@UseGuards(AuthGuard, EnabledAccountGuard)
@Controller({
    path: "bill/airtime",
})
export class AirtimeBillController {
    constructor(private readonly airtimeBillService: AirtimeBillService) {}

    @Get("network")
    async getAirtimeNetworks() {
        return await this.airtimeBillService.getAirtimeNetworks();
    }

    @HttpCode(HttpStatus.OK)
    @Post("initialize-airtime-to-cash")
    async initializeAirtimeToCash(
        @Body(ValidationPipe)
        dto: AirtimeToCashDto,
        @User() user: UserModel
    ) {
        return await this.airtimeBillService.initializeAirtimeToCash(dto, user);
    }

    @HttpCode(HttpStatus.OK)
    @Post("initialize-airtime-purchase")
    async initializeAirtimePurchase(
        @Body(ValidationPipe)
        purchaseAirtimeDto: PurchaseAirtimeDto,
        @User() user: UserModel
    ) {
        return await this.airtimeBillService.initializeAirtimePurchase(
            purchaseAirtimeDto,
            user
        );
    }

    @HttpCode(HttpStatus.OK)
    @Post("wallet-payment")
    async walletPayment(
        @Body(ValidationPipe)
        walletAirtimePaymentDto: any,
        @User() user: UserModel
    ) {
        return await this.airtimeBillService.walletPayment(
            walletAirtimePaymentDto,
            user
        );
    }

    @Get("verify/:reference")
    async getAirtimePurchaseStatus(
        @Param(ValidationPipe)
        getAirtimePurchaseStatusDto: any,
        @User() user: UserModel
    ) {
        return await this.airtimeBillService.verifyAirtimePurchase(
            getAirtimePurchaseStatusDto,
            user
        );
    }
}
