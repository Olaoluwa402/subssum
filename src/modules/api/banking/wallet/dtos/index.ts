import {
    IsInt,
    IsNumberString,
    IsPositive,
    IsString,
    Length,
} from "class-validator";

export class VerifyIdentityDto {
    @IsNumberString()
    @Length(11, 11, {
        message: "Please input a valid BVN",
    })
    bvn: string;
}

export class CreateWalletDto extends VerifyIdentityDto {
    @IsNumberString()
    otp: string;

    @IsString()
    verificationId: string;
}

export class VerifyBankAccountDto {
    @IsNumberString({}, { message: "Please enter a valid account number" })
    @Length(10, 10, { message: "Please enter a valid account number" })
    accountNumber: string;

    @IsNumberString({}, { message: "Invalid bank code" })
    bankCode: string;
}

export class WalletToWalletTransferDto {
    @IsString()
    walletNumber: string;

    @IsPositive()
    @IsInt()
    amount: number;
}

export class addWalletBeneficiaryDto {
    @IsString()
    walletNumber: string;
}
