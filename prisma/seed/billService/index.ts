import { Prisma } from "@prisma/client";

const airtime: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "MTN Airtime",
        slug: "mtn-airtime",
        type: "AIRTIME",
        icon: "https://drive.google.com/file/d/1C55koB4I1aaqDxNT1r9YCiDjvxu9HysK/view?usp=sharing",
    },
    {
        name: "Glo Airtime",
        slug: "glo-airtime",
        type: "AIRTIME",
        icon: "https://drive.google.com/file/d/1IURbQ4P7Olxf1kMtjHv7DZFFtYfEtmvg/view?usp=sharing",
    },
    {
        name: "9 Mobile Airtime",
        slug: "9mobile-airtime",
        type: "AIRTIME",
        icon: "https://drive.google.com/file/d/1L0VHwY6xre61jIxD570mHTjlhElLxlV1/view?usp=sharing",
    },
    {
        name: "Airtel Airtime",
        slug: "airtel-airtime",
        type: "AIRTIME",
        icon: "https://drive.google.com/file/d/1G7U9SykH2oGhFYfEYSgKoQIdmIKTIDTp/view?usp=sharing",
    },
];

const data: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "MTN Data",
        slug: "mtn-data",
        type: "DATA",
        icon: "https://drive.google.com/file/d/1C55koB4I1aaqDxNT1r9YCiDjvxu9HysK/view?usp=sharing",
    },
    {
        name: "Glo Data",
        slug: "glo-data",
        type: "DATA",
        icon: "https://drive.google.com/file/d/1IURbQ4P7Olxf1kMtjHv7DZFFtYfEtmvg/view?usp=sharing",
    },
    {
        name: "9 Mobile Data",
        slug: "9mobile-data",
        type: "DATA",
        icon: "https://drive.google.com/file/d/1L0VHwY6xre61jIxD570mHTjlhElLxlV1/view?usp=sharing",
    },
    {
        name: "Airtel Data",
        slug: "airtel-data",
        type: "DATA",
        icon: "https://drive.google.com/file/d/1G7U9SykH2oGhFYfEYSgKoQIdmIKTIDTp/view?usp=sharing",
    },
];

const cableTv: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "DSTV",
        slug: "dstv",
        type: "CABLE_TV",
        icon: "https://drive.google.com/file/d/1IYtbgrrTA4hBpn3rdhdelU6HpnvCjMPw/view?usp=sharing",
    },
    {
        name: "GOTV",
        slug: "gotv",
        type: "CABLE_TV",
        icon: "https://drive.google.com/file/d/1qb9gBsaGJiway2KAHTdWFM4iHWrRRwrI/view?usp=sharing",
    },
    {
        name: "Startimes",
        slug: "startimes",
        type: "CABLE_TV",
        icon: "https://drive.google.com/file/d/1HEB33wKFEL3egSU1sAfh951JrJ3CDLMa/view?usp=sharing",
    },
];

const electricity: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "Ikeja Electric",
        slug: "ikeja-electric",
        abbrev: "IKEDC",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Eko Electricity",
        slug: "eko-electricity",
        abbrev: "EKEDC",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Kano Electricity",
        slug: "kano-electricity",
        abbrev: "KEDCO",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Port Harcourt Electric",
        slug: "port-harcourt-electric",
        abbrev: "PHED",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Jos Electricity",
        slug: "jos-electricity",
        abbrev: "JEDC",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Ibadan Electricity",
        slug: "ibadan-electricity",
        abbrev: "IBEDC",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Kaduna Electric",
        slug: "kaduna-electric",
        abbrev: "KAEDCO",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Abuja Electric ",
        slug: "abuja-electric",
        abbrev: "AEDC",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Enugu Electric",
        slug: "enugu-electric",
        abbrev: "EEDC",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Benin Electric ",
        slug: "benin-electric",
        abbrev: "BEDC",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
    {
        name: "Aba Power",
        slug: "aba-power",
        abbrev: "AP",
        type: "ELECTRICITY",
        icon: "https://drive.google.com/file/d/1a5GkOJ2eLXUMHAhs0rzwSBqWK3yBwPX1/view?usp=sharing",
    },
];

export const billServiceData = [
    ...airtime,
    ...data,
    ...cableTv,
    ...electricity,
];
