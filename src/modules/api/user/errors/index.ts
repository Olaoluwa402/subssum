import { HttpException } from "@nestjs/common";

export class DuplicateUserException extends HttpException {
    name = "DuplicateUserException";
}

export class UserNotFoundException extends HttpException {
    name = "UserNotFoundException";
}

export class IncorrectPasswordException extends HttpException {
    name = "IncorrectPasswordException";
}

export class TransactionPinException extends HttpException {
    name = "TransactionPinException";
}

export class UserKycException extends HttpException {
    name = "UserKycException";
}

export class InvalidUserException extends HttpException {
    name = "InvalidUserException";
}

export class AccountDeletedException extends HttpException {
    name = "AccountDeletedException";
}

export class AccountActivateAndDeactivateException extends HttpException {
    name = "AccountActivateAndDeactivateException";
}

export class UserWithRoleNotPermittedException extends HttpException {
    name = "UserWithRoleNotPermittedException";
}

export class UserNameAlreadyTakenException extends HttpException {
    name = "UserNameAlreadyTakenException";
}

export class EmailAlreadyExistException extends HttpException {
    name = "EmailAlreadyExistException";
}

export class AdminAlreadyMarkedDeletedException extends HttpException {
    name = "AdminAlreadyMarkedDeletedException";
}

export class UserGenericException extends HttpException {
    name = "UserGenericException";
}

export class DuplicateReferralCodeException extends HttpException {
    name = "DuplicateReferralCodeException";
}
