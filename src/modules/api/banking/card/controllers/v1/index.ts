import { Controller } from "@nestjs/common";
import { CardService } from "../../services";

@Controller({
    path: "cards",
})
export class CardController {
    constructor(private readonly cardService: CardService) {}
}
