import { HttpException } from "@nestjs/common";

export class WalletException extends HttpException {
    name = "WalletException";
}

export class VirtualAccountNotFoundException extends HttpException {
    name = "VirtualAccountNotFoundException";
}

export class DuplicateWalletFundException extends HttpException {
    name = "DuplicateWalletFundException";
}

export class WalletNotFoundException extends HttpException {
    name = "WalletNotFoundException";
}

export class InsufficientWalletBalanceException extends HttpException {
    name = "InsufficientWalletBalanceException";
}

export class AlreadyABeneficiaryException extends HttpException {
    name = "AlreadyABeneficiaryException";
}

export class SelfTransferNotAllowedException extends HttpException {
    name = "SelfTransferNotAllowedException";
}
