import { RequestWithUser } from "@/modules/api/auth";
import { AuthGuard, EnabledAccountGuard } from "@/modules/api/auth/guard";
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Req,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { User as UserModel } from "@prisma/client";
import { User } from "../../decorators";
import {
    CreateTransactionPinDto,
    UpdateProfileDto,
    UpdateProfilePasswordDto,
    UpdateTransactionPinDto,
    VerifyTransactionPinDto,
} from "../../dtos";
import { UserService } from "../../services";

@Controller({
    path: "user",
})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard, EnabledAccountGuard)
    @Get("profile")
    async getProfile(@Req() req: RequestWithUser) {
        return await this.userService.getProfile(req.user.identifier);
    }

    @UseGuards(AuthGuard, EnabledAccountGuard)
    @Get("profile/account-verification-status")
    async getAccountVerificationStatus(@Req() req: RequestWithUser) {
        return await this.userService.getAccountVerificationStatus(
            req.user.identifier
        );
    }

    @UseGuards(AuthGuard, EnabledAccountGuard)
    @Patch("profile/update-password")
    async updateProfilePassword(
        @Body(ValidationPipe)
        updateProfilePasswordDto: UpdateProfilePasswordDto,
        @Req() req: RequestWithUser
    ) {
        return await this.userService.updateProfilePassword(
            updateProfilePasswordDto,
            req.user
        );
    }

    @UseGuards(AuthGuard, EnabledAccountGuard)
    @HttpCode(HttpStatus.OK)
    @Post("profile/verify-transaction-pin")
    async verifyTransactionPin(
        @Body(ValidationPipe) verifyTransactionPinDto: VerifyTransactionPinDto,
        @User() user: UserModel
    ) {
        return await this.userService.verifyTransactionPin(
            verifyTransactionPinDto,
            user
        );
    }

    @UseGuards(AuthGuard, EnabledAccountGuard)
    @HttpCode(HttpStatus.OK)
    @Post("profile/transaction-pin")
    async createTransactionPin(
        @Body(ValidationPipe) createTransactionPinDto: CreateTransactionPinDto,
        @User() user: UserModel
    ) {
        return await this.userService.createTransactionPin(
            createTransactionPinDto,
            user
        );
    }

    @UseGuards(AuthGuard, EnabledAccountGuard)
    @Patch("profile/transaction-pin")
    async updateTransactionPin(
        @Body(ValidationPipe) updateTransactionPinDto: UpdateTransactionPinDto,
        @User() user: UserModel
    ) {
        return await this.userService.updateTransactionPin(
            updateTransactionPinDto,
            user
        );
    }

    @UseGuards(AuthGuard, EnabledAccountGuard)
    @Patch("profile")
    async updateProfile(
        @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
        @User() user: UserModel
    ) {
        return await this.userService.updateProfile(updateProfileDto, user);
    }
}
