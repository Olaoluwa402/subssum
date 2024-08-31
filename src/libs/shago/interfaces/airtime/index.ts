import { ServiceCode, VendType } from "..";

export enum VtuNetwork {
    MTN = "MTN",
    GLO = "GLO",
    AIRTEL = "AIRTEL",
    "9mobile" = "9mobile",
}

export interface VendAirtimeOptions {
    serviceCode: ServiceCode;
    phone: string;
    amount: number;
    vend_type: VendType;
    network: VtuNetwork;
    request_id: string;
}

export interface VendAirtimeResponseData {
    message: string;
    status: string;
    amount: number;
    transId: string;
    type: VendType;
    date: string;
    phone: string;
}

export interface VendAirtimeInputOptions {
    serviceCode: ServiceCode;
    phone: string;
    amount: number;
    vend_type: VendType;
    network: VtuNetwork;
    request_id: string;
}
