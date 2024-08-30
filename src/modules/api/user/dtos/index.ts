import {
    IsBase64,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
} from "class-validator";

export class GetUserByIdentifierDto {
    @IsString()
    id: string;
}

export class UpdateProfilePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}

export class UpdateTransactionPinDto {
    @IsNumberString(
        {},
        { message: "Transaction pin must be four digits numeric characters" }
    )
    @Length(4, 4, {
        message: "Transaction pin must be four digits numeric characters",
    })
    transactionPin: string;

    @IsString()
    password: string;
}

export class VerifyTransactionPinDto {
    @IsNumberString({}, { message: "Invalid pin" })
    @IsNotEmpty({ message: "Pin must not be empty" })
    transactionPin: string;
}

export class VerifyEmailPinDto {
    @IsNumberString({}, { message: "Invalid pin" })
    @IsNotEmpty({ message: "Pin must not be empty" })
    pin: string;
}

export class CreateTransactionPinDto {
    @IsNumberString()
    @Length(4, 4)
    transactionPin: string;
}

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsPhoneNumber("NG")
    @Length(11, 11, {
        message: "Phone number must be valid containing 11 digits",
    })
    phone: string;

    @IsOptional()
    @IsNotEmpty()
    @IsBase64({
        message: "Photo must be a valid base64 plain text",
    })
    photo: string;

    @IsOptional()
    @IsString()
    referralCode: string;
}

export class BillServiceCommissionOptions {
    @IsString()
    billServiceSlug: string;

    @IsNumber({ maxDecimalPlaces: 1 })
    percentage: number;
}
