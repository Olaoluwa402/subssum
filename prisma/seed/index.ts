import { Prisma, PrismaClient, UserType } from "@prisma/client";
const prisma = new PrismaClient();
import logger from "moment-logger";
import { billProviders } from "./billProvider";
import { billProviderAirtimeNetworks } from "./billProviderAirtimeNetwork";
import { billProviderCableTVNetworks } from "./billProviderCableTvNetwork";
import { billProviderDataBundleNetworks } from "./billProviderDataBundleNetwork";
import { billProviderElectricDiscos } from "./billProviderElectricDisco";

import { billServiceData } from "./billService";

import { roles } from "./role";

async function main() {
    // const createUserOptions: Prisma.UserUncheckedCreateInput = {
    //     email: "admin@gmail.com",
    //     phone: "09030000000",
    //     userType: UserType.ADMIN,
    //     identifier: "8jhPCbsdSKxKwfgi",
    //     referralCode: "8jhPCbsdSKxKwfgi",
    //     password:
    //         "$2a$10$UfGbRgLwH5vwWKAxwwnfGulodPFd54k/hoagd82MLxVJh21ZEM6na",
    //     firstName: "subssum-admin",
    //     lastName: "Admin",
    // };
    // await prisma.user.create({
    //     data: createUserOptions,
    // });
    // for (let role of roles) {
    //     await prisma.role.upsert({
    //         where: { slug: role.slug },
    //         update: {},
    //         create: role,
    //     });
    // }
    // for (let provider of billProviders) {
    //     await prisma.billProvider.upsert({
    //         where: { slug: provider.slug },
    //         update: {},
    //         create: provider,
    //     });
    // }
    // for (let billService of billServiceData) {
    //     await prisma.billService.upsert({
    //         where: { slug: billService.slug },
    //         update: {},
    //         create: billService as any,
    //     });
    // }
    // //Electric Discos
    // for (let billProviderElectricDisco of billProviderElectricDiscos) {
    //     await prisma.billProviderElectricDisco.upsert({
    //         where: {
    //             billServiceSlug_billProviderSlug: {
    //                 billProviderSlug:
    //                     billProviderElectricDisco.billProviderSlug,
    //                 billServiceSlug: billProviderElectricDisco.billServiceSlug,
    //             },
    //         },
    //         update: {},
    //         create: billProviderElectricDisco,
    //     });
    // }
    // //Airtime
    // for (let payload of billProviderAirtimeNetworks) {
    //     await prisma.billProviderAirtimeNetwork.upsert({
    //         where: {
    //             billServiceSlug_billProviderSlug: {
    //                 billProviderSlug: payload.billProviderSlug,
    //                 billServiceSlug: payload.billServiceSlug,
    //             },
    //         },
    //         update: {},
    //         create: payload,
    //     });
    // }
    // //Data
    // for (let payload of billProviderDataBundleNetworks) {
    //     await prisma.billProviderDataBundleNetwork.upsert({
    //         where: {
    //             billServiceSlug_billProviderSlug: {
    //                 billProviderSlug: payload.billProviderSlug,
    //                 billServiceSlug: payload.billServiceSlug,
    //             },
    //         },
    //         update: {},
    //         create: payload,
    //     });
    // }
    // //Cable TV
    // for (let payload of billProviderCableTVNetworks) {
    //     await prisma.billProviderCableTVNetwork.upsert({
    //         where: {
    //             billServiceSlug_billProviderSlug: {
    //                 billProviderSlug: payload.billProviderSlug,
    //                 billServiceSlug: payload.billServiceSlug,
    //             },
    //         },
    //         update: {},
    //         create: payload,
    //     });
    // }
    // await prisma.userRole.create({
    //     data: {
    //         roleId: "66d0d138c8e9a89691eee9b3",
    //         userId: "66d0d9b388c0139b29c94830",
    //     },
    // });
}

main()
    .then(() => {
        logger.info("Database seeding successful");
    })
    .catch((err) => {
        logger.error(`Database seeding failed ${err}`);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
