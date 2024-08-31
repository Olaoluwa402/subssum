import { AuthGuard, EnabledAccountGuard } from "@/modules/api/auth/guard";
import { User } from "@/modules/api/user";
import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { User as UserModel } from "@prisma/client";

import { TransactionService } from "../../services";
import { TransactionHistoryWithFiltersDto, TransactionIdDto } from "../../dtos";

@UseGuards(AuthGuard, EnabledAccountGuard)
@Controller({
    path: "transaction",
})
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get("history")
    async transactionHistory(
        @Query(ValidationPipe)
        transactionHistoryDto: TransactionHistoryWithFiltersDto,
        @User() user: UserModel
    ) {
        return await this.transactionService.transactionHistory(
            transactionHistoryDto,
            user
        );
    }

    @Get("details/:id")
    async fetchTransactionDetails(@Param() params: TransactionIdDto) {
        return await this.transactionService.fetchTransactionDetails(params.id);
    }
}
