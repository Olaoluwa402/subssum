import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@/modules/api/auth/guard";
import { RoleGuard } from "../../guards/role.guard";
import AuthorizationService from "../../services/authorize.service";
import { UserType } from "@prisma/client";
import { UserTypes } from "../../decorator";

@Controller({
    path: "authz",
})
@UseGuards(AuthGuard, RoleGuard)
@UserTypes([UserType.ADMIN])
export default class AuthorizationController {
    constructor(private readonly authorizationService: AuthorizationService) {}

    @Get()
    async getAllPermissions() {
        return await this.authorizationService.fetchAllPermissions();
    }
}
