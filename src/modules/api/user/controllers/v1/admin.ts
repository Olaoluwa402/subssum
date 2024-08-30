import { Controller, UseGuards } from "@nestjs/common";

import { UserType } from "@prisma/client";
import { UserService } from "../../services";
import { AuthGuard, EnabledAccountGuard } from "@/modules/api/auth/guard";
import { RoleGuard } from "@/modules/api/authorize/guards/role.guard";
import { UserTypes } from "@/modules/api/authorize/decorator";

@UseGuards(AuthGuard, RoleGuard, EnabledAccountGuard)
@UserTypes([UserType.ADMIN])
@Controller({
    path: "admin/user",
})
export class AdminUserController {
    constructor(private readonly usersService: UserService) {}
}
