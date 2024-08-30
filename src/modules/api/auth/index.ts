import { Module } from "@nestjs/common";
import { AuthService } from "./services";
import { JwtModule } from "@nestjs/jwt";
import { GoogleStrategy } from "./strategy/google.strategy";
import { jwtSecret, TOKEN_EXPIRATION } from "@/config";
import { AuthController } from "./controllers/v1";
import { AuthGuard } from "./guard";
import { AdminAuthController } from "./controllers/v1/admin";
import { PassportModule } from "@nestjs/passport";
export * from "./interfaces";
export * from "./errors";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: jwtSecret,
            signOptions: { expiresIn: TOKEN_EXPIRATION },
        }),
        PassportModule.register({ defaultStrategy: "google" }),
    ],
    controllers: [AuthController, AdminAuthController],
    providers: [AuthService, AuthGuard, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule {}
