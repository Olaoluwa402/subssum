import { PermissionName } from "../../../src/modules/api/authorize/enums/role";
import { PermissionGroup, Prisma } from "@prisma/client";

export const permissions: Prisma.PermissionUncheckedCreateInput[] = [
    {
        group: PermissionGroup.USERS,
        name: PermissionName.CREATE_USERS,
        description: "create user permission",
    },
    {
        group: PermissionGroup.USERS,
        name: PermissionName.READ_USERS,
        description: "read user permission",
    },
    {
        group: PermissionGroup.USERS,
        name: PermissionName.UPDATE_USERS,
        description: "update user permission",
    },
    {
        group: PermissionGroup.USERS,
        name: PermissionName.DELETE_USERS,
        description: "delete user permission",
    },
    {
        group: PermissionGroup.PROVIDER,
        name: PermissionName.CREATE_PROVIDER,
        description: "create provider permission",
    },
    {
        group: PermissionGroup.PROVIDER,
        name: PermissionName.READ_PROVIDER,
        description: "read provider permission",
    },
    {
        group: PermissionGroup.PROVIDER,
        name: PermissionName.UPDATE_PROVIDER,
        description: "update provider permission",
    },
    {
        group: PermissionGroup.PROVIDER,
        name: PermissionName.DELETE_PROVIDER,
        description: "delete provider permission",
    },
    {
        group: PermissionGroup.TRANSACTION,
        name: PermissionName.CREATE_TRANSACTIONS,
        description: "create transaction permission",
    },
    {
        group: PermissionGroup.TRANSACTION,
        name: PermissionName.READ_TRANSACTIONS,
        description: "read transaction permission",
    },
    {
        group: PermissionGroup.TRANSACTION,
        name: PermissionName.UPDATE_TRANSACTIONS,
        description: "update transaction permission",
    },
    {
        group: PermissionGroup.TRANSACTION,
        name: PermissionName.DELETE_TRANSACTIONS,
        description: "delete transaction permission",
    },
];
