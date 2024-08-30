import { Module } from "@nestjs/common";
import { CardController } from "./controllers/v1";
import { CardService } from "./services";

@Module({
    controllers: [CardController],
    providers: [CardService],
})
export class CardModule {}
