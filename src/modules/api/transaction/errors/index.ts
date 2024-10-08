import { HttpException } from "@nestjs/common";

export class TransactionNotFoundException extends HttpException {
    name = "TransactionNotFoundException";
}

export class InvalidTransactionVerificationProvider extends HttpException {
    name = "InvalidTransactionVerificationProvider";
}

export class TransactionTypeException extends HttpException {
    name = "TransactionTypeException";
}

export class InvalidBillServiceException extends HttpException {
    name = "InvalidBillServiceException";
}
