import { HttpException } from "@nestjs/common";

//Airtime
export class DuplicateAirtimePurchaseException extends HttpException {
    name = "DuplicateAirtimePurchaseException";
}

export class AirtimePurchaseException extends HttpException {
    name = "AirtimePurchaseException";
}

export class DuplicateAirtimeToCashException extends HttpException {
    name = "DuplicateAirtimeToCashException";
}

export class AirtimeToCashException extends HttpException {
    name = "AirtimeToCashException";
}

export class UnavailableBillProviderAirtimeNetwork extends HttpException {
    name = "UnavailableBillProviderAirtimeNetwork";
}

export class InvalidBillTypePaymentReference extends HttpException {
    name = "InvalidBillTypePaymentReference";
}
