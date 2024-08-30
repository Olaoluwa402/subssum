import { Prisma } from "@prisma/client";

export const billProviders: Prisma.BillProviderUncheckedCreateInput[] = [
    {
        name: "BuyPower",
        isActive: true,
        slug: "buypower",
    },
];
