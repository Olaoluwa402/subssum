import { HttpException } from "@nestjs/common";

export class SafehavenException extends HttpException {
    name = "SafehavenException";
}
