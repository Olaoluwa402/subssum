import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from "@nestjs/common";
import { WalletService } from "../../services";
import { User } from "@/modules/api/user/decorators";
import { User as UserModel } from "@prisma/client";
import * as dto from "../../dtos";
import { AuthGuard } from "@/modules/api/auth/guard";

@UseGuards(AuthGuard)
@Controller({
    path: "wallets",
})
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @HttpCode(HttpStatus.OK)
    @Post("identity/verify")
    async verifyIdentity(
        @User() user: UserModel,
        @Body() dto: dto.VerifyIdentityDto
    ) {
        return await this.walletService.verifyIdentity(dto, user);
    }

    @Post()
    async createWallet(
        @User() user: UserModel,
        @Body() dto: dto.CreateWalletDto
    ) {
        return await this.walletService.createWallet(dto, user);
    }

    @Get("banks")
    async getBankList() {
        return await this.walletService.getListOfBanks();
    }

    @HttpCode(HttpStatus.OK)
    @Post("banks/verify-account")
    async verifyBankAccount(@Body() dto: dto.VerifyBankAccountDto) {
        return await this.walletService.verifyBankAccount(dto);
    }

    @Get()
    async getWallet(@User() user: UserModel) {
        return await this.walletService.getWallet(user);
    }

    @Get("virtual-account")
    async getVirtualAccounts(@User() user: UserModel) {
        return await this.walletService.getVirtualAccounts(user);
    }
}
