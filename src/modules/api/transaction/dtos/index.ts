import { TransactionType } from "@prisma/client";
import {
    IsBooleanString,
    IsDateString,
    IsEnum,
    IsNumberString,
    IsOptional,
    IsString,
} from "class-validator";

export enum UpdatePayoutStatus {
    APPROVED = "APPROVED",
    DECLINED = "DECLINED",
}

export enum PayoutStatus {
    APPROVED = "APPROVED",
    PENDING = "PENDING",
}

export enum BillPayment {
    AIRTIME_TO_CASH = "AIRTIME_TO_CASH",
    DATA_PURCHASE = "DATA_PURCHASE",
    ELECTRICITY_BILL = "ELECTRICITY_BILL",
    INTERNET_BILL = "INTERNET_BILL",
    CABLETV_BILL = "CABLETV_BILL",
    AIRTIME_PURCHASE = "AIRTIME_PURCHASE",
}

export enum TransactionReportType {
    AIRTIME_PURCHASE = "AIRTIME_PURCHASE",
    ELECTRICITY_BILL = "ELECTRICITY_BILL",
    DATA_PURCHASE = "DATA_PURCHASE",
    CABLETV_BILL = "CABLETV_BILL",
    PAYOUT = "PAYOUT",
    COMMISSION = "COMMISSION",
    WALLET_FUND = "WALLET_FUND",
    TRANSFER_FUND = "TRANSFER_FUND",
}

export class TransactionHistoryDto {
    @IsOptional()
    @IsBooleanString()
    pagination: string;

    @IsOptional()
    @IsNumberString()
    page: string;

    @IsOptional()
    @IsNumberString()
    limit: string;

    @IsOptional()
    @IsEnum(TransactionType)
    type: TransactionType;
}

export class TransactionHistoryWithFiltersDto {
    @IsOptional()
    @IsString()
    searchName: string;

    @IsOptional()
    @IsBooleanString()
    pagination: string;

    @IsOptional()
    @IsNumberString()
    page: string;

    @IsOptional()
    @IsNumberString()
    limit: string;

    @IsOptional()
    @IsEnum(TransactionReportType)
    type: TransactionReportType;

    @IsOptional()
    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate: string;

    @IsOptional()
    @IsBooleanString()
    airtimeFilter: string;

    @IsOptional()
    @IsBooleanString()
    dataFilter: string;

    @IsOptional()
    @IsBooleanString()
    internetFilter: string;

    @IsOptional()
    @IsBooleanString()
    powerFilter: string;

    @IsOptional()
    @IsBooleanString()
    cableTvFilter: string;

    @IsOptional()
    @IsBooleanString()
    walletFundFilter: string;

    @IsOptional()
    @IsBooleanString()
    bankTransfer: string;

    @IsOptional()
    @IsBooleanString()
    payoutFilter: string;
}

export class TransactionIdDto {
    @IsString()
    id: string;
}
