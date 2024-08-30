import { ApiResponse } from "@/utils/api-response-util";
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
import { Request } from "express";
import {
    PasswordResetRequestDto,
    SendVerificationCodeDto,
    SignUpDto,
    UpdatePasswordDto,
    UserSigInDto,
} from "../../dtos";
import { AuthService } from "../../services";
import { VerifyEmailPinDto } from "@/modules/api/user/dtos";
import { AuthGuard } from "@nestjs/passport";

@Controller({
    path: "auth",
})
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signup")
    async signUp(
        @Body(ValidationPipe) signUpDto: SignUpDto,
        @Req() req: Request
    ): Promise<ApiResponse> {
        return await this.authService.signUp(signUpDto, req.ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async signIn(
        @Body(ValidationPipe) signInDto: UserSigInDto
    ): Promise<ApiResponse> {
        return await this.authService.userSignIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("initiate-email-verification")
    async sendAccountVerificationEmail(
        @Body(ValidationPipe) sendVerificationCodeDto: SendVerificationCodeDto
    ) {
        return await this.authService.sendAccountVerificationEmail(
            sendVerificationCodeDto
        );
    }

    @HttpCode(HttpStatus.OK)
    @Post("/verify-email-otp")
    async verifyEmailOtp(
        @Body(ValidationPipe) verifyEmailPinDto: VerifyEmailPinDto
    ) {
        return await this.authService.verifyEmailPin(verifyEmailPinDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("password-reset-request")
    async passwordResetRequest(
        @Body(ValidationPipe) passwordResetRequestDto: PasswordResetRequestDto
    ) {
        return await this.authService.passwordResetRequest(
            passwordResetRequestDto
        );
    }

    @Patch("update-password")
    async updatePassword(
        @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto
    ) {
        return await this.authService.updatePassword(updatePasswordDto);
    }

    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth(@Req() req) {
        // Google login request handler
    }

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    googleAuthRedirect(@Req() req) {
        return {
            message: "User information from Google",
            user: req.user,
        };
    }
}
