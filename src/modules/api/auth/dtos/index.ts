import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
} from "class-validator";

enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    middleName: string;

    @IsEmail({}, { message: "Invalid email address" })
    email: string;

    @IsPhoneNumber("NG")
    @Length(11, 11, { message: "Phone number must be 11 digits" })
    phone: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    homeAddress: string;

    @IsNotEmpty()
    @IsString()
    streetName: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(6, 6)
    postalCode: string;

    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: string;

    @IsOptional()
    @IsNumberString()
    @Length(4, 4)
    transactionPin: string;

    @IsString()
    verificationCode: string;
}

export class SignInDto {
    @IsEmail({}, { message: "Invalid email address" })
    email: string;

    @IsString({ message: "Invalid password format" })
    password: string;
}

export enum UserSignInAppType {
    CUSTOMER = "CUSTOMER",
}
export class UserSigInDto extends SignInDto {
    @IsEnum(UserSignInAppType)
    appType: UserSignInAppType;
}

export class SendVerificationCodeDto {
    @IsEmail({}, { message: "Invalid email address" })
    email: string;

    @IsPhoneNumber("NG")
    @Length(11, 11, { message: "Phone number must be 11 digits" })
    phone: string;
}

export class PasswordResetRequestDto {
    @IsEmail({}, { message: "Invalid email address" })
    email: string;
}

export class UpdatePasswordDto {
    @IsString()
    newPassword: string;

    @IsString()
    resetCode: string;
}
