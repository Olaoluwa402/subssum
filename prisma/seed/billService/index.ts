import { Prisma } from "@prisma/client";

const airtime: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "MTN Airtime",
        slug: "mtn-airtime",
        type: "AIRTIME",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/MTN.png",
    },
    {
        name: "Glo Airtime",
        slug: "glo-airtime",
        type: "AIRTIME",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/Glo.png",
    },
    {
        name: "9 Mobile Airtime",
        slug: "etisalat-airtime",
        type: "AIRTIME",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/9mobile.png",
    },
    {
        name: "Airtel Airtime",
        slug: "airtel-airtime",
        type: "AIRTIME",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/airtel.png",
    },
];

const data: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "MTN Data",
        slug: "mtn-data",
        type: "DATA",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/MTN.png",
    },
    {
        name: "Glo Data",
        slug: "glo-data",
        type: "DATA",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/Glo.png",
    },
    {
        name: "9 Mobile Data",
        slug: "etisalat-data",
        type: "DATA",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/9mobile.png",
    },
    {
        name: "Airtel Data",
        slug: "airtel-data",
        type: "DATA",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/airtel.png",
    },
];

const cableTv: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "DSTV",
        slug: "dstv",
        type: "CABLE_TV",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/dstv.png",
    },
    {
        name: "GOTV",
        slug: "gotv",
        type: "CABLE_TV",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/GOTV.png",
    },
    {
        name: "Startimes",
        slug: "startimes",
        type: "CABLE_TV",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/startimes.png",
    },
];

const electricity: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "Ikeja Electric",
        slug: "ikeja-electric",
        abbrev: "IKEDC",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/ikedc.png",
    },
    {
        name: "Eko Electricity",
        slug: "eko-electricity",
        abbrev: "EKEDC",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/EKEDC.png",
    },
    {
        name: "Kano Electricity",
        slug: "kano-electricity",
        abbrev: "KEDCO",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/KEDCO.png",
    },
    {
        name: "Port Harcourt Electric",
        slug: "port-harcourt-electric",
        abbrev: "PHED",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/ph.png",
    },
    {
        name: "Jos Electricity",
        slug: "jos-electricity",
        abbrev: "JEDC",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/JEDC.png",
    },
    {
        name: "Ibadan Electricity",
        slug: "ibadan-electricity",
        abbrev: "IBEDC",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/IBEDC.png",
    },
    {
        name: "Kaduna Electric",
        slug: "kaduna-electric",
        abbrev: "KAEDCO",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/kaduna.png",
    },
    {
        name: "Abuja Electric ",
        slug: "abuja-electric",
        abbrev: "AEDC",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/AEDC.png",
    },
    {
        name: "Enugu Electric",
        slug: "enugu-electric",
        abbrev: "EEDC",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/EEDS.png",
    },
    {
        name: "Benin Electric ",
        slug: "benin-electric",
        abbrev: "BEDC",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/BEDC.png",
    },
    {
        name: "Aba Power",
        slug: "aba-power",
        abbrev: "AP",
        type: "ELECTRICITY",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/aba.png",
    },
];

const internet: Prisma.BillServiceUncheckedCreateInput[] = [
    {
        name: "MTN Internet",
        slug: "mtn-internet",
        type: "INTERNET",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/MTN.png",
    },
    {
        name: "Glo Internet",
        slug: "glo-internet",
        type: "INTERNET",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/Glo.png",
    },
    {
        name: "9 Mobile Internet",
        slug: "etisalat-internet",
        type: "INTERNET",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/etisalat.png",
    },
    {
        name: "Airtel Internet",
        slug: "airtel-internet",
        type: "INTERNET",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/airtel.png",
    },
    {
        name: "Smile",
        slug: "smile-internet",
        type: "INTERNET",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/Smile.png",
    },
    {
        name: "Spectranet",
        slug: "spectranet-internet",
        type: "INTERNET",
        icon: "https://africabeta.nyc3.digitaloceanspaces.com/icons/Spectranet.png",
    },
];

export const billServiceData = [
    ...airtime,
    ...data,
    ...cableTv,
    ...electricity,
    ...internet,
];
