import { HttpException } from "@nestjs/common";

//Airtime
export class DuplicateAirtimePurchaseException extends HttpException {
    name = "DuplicateAirtimePurchaseException";
}

export class AirtimePurchaseException extends HttpException {
    name = "AirtimePurchaseException";
}

export class UnavailableBillProviderAirtimeNetwork extends HttpException {
    name = "UnavailableBillProviderAirtimeNetwork";
}

export class InvalidBillTypePaymentReference extends HttpException {
    name = "InvalidBillTypePaymentReference";
}
