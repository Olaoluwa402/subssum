import { Prisma } from "@prisma/client";

export const billProviders: Prisma.BillProviderUncheckedCreateInput[] = [
    {
        name: "Shago",
        isActive: true,
        slug: "shago",
    },
];
