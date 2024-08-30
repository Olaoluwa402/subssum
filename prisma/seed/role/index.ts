import { Prisma } from "@prisma/client";

export const roles: Prisma.RoleUncheckedCreateInput[] = [
    {
        name: "Customer",
        slug: "customer",
        isAdmin: false,
    },
    {
        name: "Merchant",
        slug: "Merchant",
        isAdmin: false,
    },
    //admins
    {
        name: "Super Admin",
        slug: "admin",
        isAdmin: true,
    },
];
