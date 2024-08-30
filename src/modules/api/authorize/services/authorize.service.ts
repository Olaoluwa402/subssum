import { PrismaService } from "@/modules/core/prisma/services";
import { Injectable, UseGuards } from "@nestjs/common";
import { Permission, UserType } from "@prisma/client";

import { ApiResponse, buildResponse } from "@/utils/api-response-util";
import { AuthGuard } from "../../auth/guard";
import { RoleGuard } from "../guards/role.guard";

import { UserTypes } from "../decorator";

@Injectable()
@UseGuards(AuthGuard, RoleGuard)
@UserTypes([UserType.ADMIN])
export default class AuthorizationService {
    constructor(private readonly prismaService: PrismaService) {}

    async fetchAllPermissions(): Promise<ApiResponse> {
        const permisions: Permission[] = [];
        return buildResponse({
            message: "Permissions fetched successfully",
            data: permisions,
        });
    }
}
