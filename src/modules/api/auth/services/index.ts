import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
    SignUpDto,
    SignInDto,
    SendVerificationCodeDto,
    PasswordResetRequestDto,
    UpdatePasswordDto,
    UserSigInDto,
} from "../dtos";
import {
    DuplicateUserException,
    UserNotFoundException,
} from "@/modules/api/user";
import * as bcrypt from "bcryptjs";
import { Prisma, Role, Status, UserType } from "@prisma/client";
import { customAlphabet } from "nanoid";
import {
    AuthGenericException,
    InvalidCredentialException,
    InvalidEmailVerificationCodeException,
    InvalidPasswordResetToken,
    PasswordResetCodeExpiredException,
    UserAccountDisabledException,
    VerificationCodeExpiredException,
} from "../errors";
import { ApiResponse, buildResponse } from "@/utils/api-response-util";
import { PrismaService } from "@/modules/core/prisma/services";
import { EmailService } from "@/modules/core/email/services/email.service";
import { encrypt, formatName, generateId } from "@/utils";
import {
    GoogleUserOptions,
    LoginMeta,
    LoginPlatform,
    LoginResponseData,
    SignInOptions,
    SignupResponseData,
    UserNameType,
    VerifyEmailParams,
} from "../interfaces";
import { VerifyEmailPinDto } from "../../user/dtos";
import { RoleNotFoundException } from "../../authorize/error";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private emailService: EmailService
    ) {}

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    validateAdminAccount(userType: UserType) {
        const adminUserTypes: UserType[] = [UserType.ADMIN];

        if (!adminUserTypes.includes(userType)) {
            throw new InvalidCredentialException(
                "Incorrect email or password",
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    validateUserAccount(userType: UserType) {
        const userTypes: UserType[] = [UserType.CUSTOMER, UserType.MERCHANT];

        if (!userTypes.includes(userType)) {
            throw new InvalidCredentialException(
                "Incorrect email or password",
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    async sendAccountVerificationEmail(
        options: SendVerificationCodeDto
    ): Promise<ApiResponse> {
        const verificationCode = customAlphabet("1234567890", 5)();
        const email = options.email.toLowerCase().trim();

        if (options.phone) {
            const phoneExist = await this.prisma.user.findFirst({
                where: { phone: options.phone },
                select: { id: true },
            });

            if (phoneExist) {
                throw new DuplicateUserException(
                    "An account with phone number already exist",
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        const emailExist = await this.prisma.user.findUnique({
            where: { email: email },
            select: { id: true },
        });
        if (emailExist) {
            throw new DuplicateUserException(
                "Account already verified. Kindly login",
                HttpStatus.BAD_REQUEST
            );
        }

        await this.prisma.accountVerificationRequest.upsert({
            where: {
                email: options.email,
            },
            create: {
                code: verificationCode,
                email: options.email,
            },
            update: {
                code: verificationCode,
            },
        });
        const phoneNumber = `234${options.phone.trim().substring(1)}`;
        await this.emailService.send<VerifyEmailParams>({
            mailOptions: {
                to: email,
            },
            template: "verify_email",
            params: {
                code: verificationCode,
            },
        });

        return buildResponse({
            message: `An email verification code has been sent to your email, ${options.email}`,
            data: {
                email: options.email,
                phone: phoneNumber,
            },
        });
    }

    async verifyEmailPin(options: VerifyEmailPinDto): Promise<ApiResponse> {
        const verificationData =
            await this.prisma.accountVerificationRequest.findUnique({
                where: { code: options.pin },
            });

        if (!verificationData) {
            throw new InvalidEmailVerificationCodeException(
                "Invalid verification code",
                HttpStatus.BAD_REQUEST
            );
        }

        //check verification expiration
        const timeDifference =
            Date.now() - verificationData.updatedAt.getTime();
        const timeDiffInMin = timeDifference / (1000 * 60);
        if (timeDiffInMin > 30) {
            throw new VerificationCodeExpiredException(
                "Your verification code has expired. Kindly request for a new one",
                HttpStatus.BAD_REQUEST
            );
        }
        return buildResponse({
            message: "Email verification pin verified",
        });
    }

    async signUp(
        options: SignUpDto,
        ip: string
    ): Promise<ApiResponse<SignupResponseData>> {
        const user = await this.prisma.user.findUnique({
            where: { email: options.email.trim() },
        });
        if (user) {
            throw new DuplicateUserException(
                "An account already exist with this email. Please login",
                HttpStatus.BAD_REQUEST
            );
        }

        const verificationData =
            await this.prisma.accountVerificationRequest.findUnique({
                where: { code: options.verificationCode },
            });

        if (!verificationData) {
            throw new InvalidEmailVerificationCodeException(
                "Invalid verification code",
                HttpStatus.BAD_REQUEST
            );
        }

        //check verification expiration
        const timeDifference =
            Date.now() - verificationData.updatedAt.getTime();
        const timeDiffInMin = timeDifference / (1000 * 60);
        if (timeDiffInMin > 30) {
            throw new VerificationCodeExpiredException(
                "Your verification code has expired. Kindly request for a new one",
                HttpStatus.BAD_REQUEST
            );
        }

        const hashedPassword = await this.hashPassword(options.password);
        const role: Role = await this.prisma.role.findUnique({
            where: {
                slug: "customer",
            },
        });

        if (!role) {
            throw new RoleNotFoundException(
                "Role not found",
                HttpStatus.NOT_FOUND
            );
        }

        const createUserOptions: Prisma.UserUncheckedCreateInput = {
            email: verificationData.email,
            phone: options.phone.trim(),
            userType: UserType.CUSTOMER,
            identifier: generateId({ type: "identifier" }),
            password: hashedPassword,
            ipAddress: ip,
            gender: options.gender,
            dateOfBirth: new Date(options.dateOfBirth),
            referralCode: generateId({ type: "custom_lower_case", length: 10 }),
            firstName: formatName(options.firstName),
            lastName: formatName(options.lastName),
            username: this.generateUsername({
                firstName: options.firstName,
                lastName: options.lastName,
            }),
            middleName: options.middleName && formatName(options.middleName),
            ...(options.transactionPin && {
                transactionPin: await this.hashPassword(options.transactionPin),
            }),
        };

        const createdUser = await this.prisma.$transaction(async (tx) => {
            const createdUser = await this.prisma.user.create({
                data: createUserOptions,
            });

            await tx.userRole.create({
                data: {
                    roleId: role.id,
                    userId: createdUser.id,
                },
            });

            return createdUser;
        });

        const accessToken = await this.jwtService.signAsync({
            sub: createdUser.identifier,
        });

        await this.prisma.accountVerificationRequest.delete({
            where: { email: options.email },
        });

        return buildResponse({
            message: "Account successfully created",
            data: { accessToken },
        });
    }

    async signIn(
        options: SignInOptions,
        loginPlatform: LoginPlatform
    ): Promise<ApiResponse<LoginResponseData>> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: options.email,
            },
            select: {
                identifier: true,
                password: true,
                kycStatus: true,
                isWalletCreated: true,
                userType: true,
                transactionPin: true,
                walletSetupStatus: true,
                status: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                                slug: true,
                                permissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new InvalidCredentialException(
                "Incorrect email or password",
                HttpStatus.UNAUTHORIZED
            );
        }

        if (user.status == Status.INACTIVE) {
            throw new UserAccountDisabledException(
                "Account is disabled. Kindly contact customer support",
                HttpStatus.BAD_REQUEST
            );
        }

        switch (loginPlatform) {
            case LoginPlatform.ADMIN: {
                this.validateAdminAccount(user.userType);
                break;
            }
            case LoginPlatform.USER: {
                this.validateUserAccount(user.userType);
                break;
            }

            default: {
                throw new AuthGenericException(
                    "Invalid login platform",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }

        const roles = user.roles.map((r) => {
            return {
                name: r.role.name,
                slug: r.role.slug,
                permissions: r.role.permissions.map((p) => p.permission.name),
            };
        });

        const isValidPassword = await this.comparePassword(
            options.password,
            user.password
        );

        if (!isValidPassword) {
            throw new InvalidCredentialException(
                "Incorrect email or password",
                HttpStatus.UNAUTHORIZED
            );
        }

        await this.prisma.user.update({
            where: {
                identifier: user.identifier,
            },
            data: {
                lastLogin: new Date(),
                loginCount: {
                    increment: 1,
                },
            },
        });

        const accessToken = await this.jwtService.signAsync({
            sub: user.identifier,
        });

        const loginMeta: LoginMeta = {
            kycStatus: user.kycStatus,
            isWalletCreated: user.isWalletCreated,
            userType: user.userType,
            transactionPin: user.transactionPin,
            walletSetupStatus: user.walletSetupStatus,
            roles: roles,
        };

        return buildResponse({
            message: "Login successful",
            data: {
                accessToken,
                meta: encrypt(loginMeta),
            },
        });
    }

    async userSignIn(
        options: UserSigInDto
    ): Promise<ApiResponse<LoginResponseData>> {
        return await this.signIn(options, LoginPlatform.USER);
    }

    async adminSignIn(
        options: SignInDto,
        ip: string
    ): Promise<ApiResponse<LoginResponseData>> {
        const u = await this.prisma.user.findUnique({
            where: { email: options.email },
        });
        if (u) {
            await this.prisma.user.update({
                where: {
                    email: options.email,
                },
                data: {
                    ipAddress: ip,
                },
            });
        }

        return await this.signIn(options, LoginPlatform.ADMIN);
    }

    async passwordResetRequest(options: PasswordResetRequestDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: options.email },
        });
        if (!user) {
            throw new UserNotFoundException(
                "There is no account registered with this email address. Please Sign Up",
                HttpStatus.NOT_FOUND
            );
        }

        if (user.status == Status.INACTIVE) {
            throw new UserAccountDisabledException(
                "Account is disabled. Kindly contact customer support",
                HttpStatus.BAD_REQUEST
            );
        }

        const resetCode = customAlphabet("1234567890", 4)();
        await this.prisma.passwordResetRequest.upsert({
            where: {
                userId: user.id,
            },
            create: {
                code: resetCode,
                userId: user.id,
            },
            update: {
                code: resetCode,
            },
        });

        await this.emailService.send<VerifyEmailParams>({
            mailOptions: {
                to: options.email,
            },
            template: "password_reset_email",
            params: {
                code: resetCode,
            },
        });

        return buildResponse({
            message: `Password reset code successfully sent to your email, ${options.email}`,
        });
    }

    async updatePassword(options: UpdatePasswordDto): Promise<ApiResponse> {
        const resetData = await this.prisma.passwordResetRequest.findUnique({
            where: { code: options.resetCode },
        });
        if (!resetData) {
            throw new InvalidPasswordResetToken(
                "Invalid password reset code. Kindly request for a new one",
                HttpStatus.BAD_REQUEST
            );
        }
        //check verification expiration
        const timeDifference = Date.now() - resetData.updatedAt.getTime();
        const timeDiffInMin = timeDifference / (1000 * 60);
        if (timeDiffInMin > 30) {
            throw new PasswordResetCodeExpiredException(
                "Your reset code has expired. Kindly request for new one",
                HttpStatus.BAD_REQUEST
            );
        }
        const user = await this.prisma.user.findUnique({
            where: { id: resetData.userId },
        });
        if (!user) {
            throw new UserNotFoundException(
                "Account not found",
                HttpStatus.NOT_FOUND
            );
        }
        const newHashedPassword = await this.hashPassword(options.newPassword);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: newHashedPassword },
        });
        await this.prisma.passwordResetRequest.delete({
            where: { code: resetData.code },
        });

        return buildResponse({
            message: `Password successfully updated. Kindly login`,
        });
    }

    async validateUserGoogleRoute(
        options: GoogleUserOptions
    ): Promise<ApiResponse> {
        const { email, firstName, lastName, picture } = options;
        let user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            const hashedPassword = await this.hashPassword("12345");
            const role: Role = await this.prisma.role.findUnique({
                where: {
                    slug: "customer",
                },
            });

            if (!role) {
                throw new RoleNotFoundException(
                    "Role not found",
                    HttpStatus.NOT_FOUND
                );
            }

            const createUserOptions: Prisma.UserUncheckedCreateInput = {
                email: email,
                userType: UserType.CUSTOMER,
                identifier: generateId({ type: "identifier" }),
                password: hashedPassword,
                photo: picture,
                firstName: formatName(firstName),
                lastName: formatName(lastName),
                username: this.generateUsername({
                    firstName: firstName,
                    lastName: lastName,
                }),
                referralCode: generateId({
                    type: "custom_lower_case",
                    length: 10,
                }),
            };

            await this.prisma.$transaction(async (tx) => {
                user = await tx.user.create({
                    data: createUserOptions,
                });

                await tx.userRole.create({
                    data: {
                        roleId: role.id,
                        userId: user.id,
                    },
                });
            });
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                identifier: true,
                password: true,
                kycStatus: true,
                isWalletCreated: true,
                userType: true,
                transactionPin: true,
                walletSetupStatus: true,
                status: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                                slug: true,
                                permissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (foundUser.status == Status.INACTIVE) {
            throw new UserAccountDisabledException(
                "Account is disabled. Kindly contact customer support",
                HttpStatus.BAD_REQUEST
            );
        }

        const roles = foundUser.roles.map((r) => {
            return {
                name: r.role.name,
                slug: r.role.slug,
                permissions: r.role.permissions.map((p) => p.permission.name),
            };
        });

        await this.prisma.user.update({
            where: {
                identifier: foundUser.identifier,
            },
            data: {
                lastLogin: new Date(),
                loginCount: {
                    increment: 1,
                },
            },
        });

        const accessToken = await this.jwtService.signAsync({
            sub: foundUser.identifier,
        });

        const loginMeta: LoginMeta = {
            kycStatus: user.kycStatus,
            isWalletCreated: user.isWalletCreated,
            userType: user.userType,
            transactionPin: user.transactionPin,
            walletSetupStatus: user.walletSetupStatus,
            roles: roles,
        };

        return buildResponse({
            message: "Login successful",
            data: {
                accessToken,
                meta: encrypt(loginMeta),
            },
        });
    }

    generateUsername(data: UserNameType) {
        const firstName = data.firstName.replace(/\s+/g, "").toLowerCase();
        const lastName = data.lastName.replace(/\s+/g, "").toLowerCase();

        let username = firstName + "." + lastName.slice(0, 3);

        const randomNumber = Math.floor(Math.random() * 1000);
        username += randomNumber;

        return username;
    }
}
