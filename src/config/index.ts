import { config } from "dotenv";

import validate, {
    RequiredEnvironment,
    RequiredEnvironmentTypes,
} from "@boxpositron/vre";

import { TSafehaven } from "@/libs/safehaven";
import { ConfigOptions } from "cloudinary";
import { IShago } from "@/libs/shago";

export * from "./constants";

config();

const runtimeEnvironment: RequiredEnvironment[] = [
    {
        name: "PORT",
        type: RequiredEnvironmentTypes.Number,
    },
    {
        name: "BASEURL",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "DATABASE_URL",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "ALLOWED_DOMAINS",
        type: RequiredEnvironmentTypes.String,
    },

    //mail
    {
        name: "BREVO_API_KEY",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "MAIL_SENDER_NAME",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "MAIL_SENDER_EMAIL",
        type: RequiredEnvironmentTypes.String,
    },

    // secret
    {
        name: "JWT_SECRET",
        type: RequiredEnvironmentTypes.String,
    },

    //shago

    {
        name: "SHAGO_BASE_URL",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "SHAGO_KEY",
        type: RequiredEnvironmentTypes.String,
    },

    //
    {
        name: "ENCRYPT_SECRET",
        type: RequiredEnvironmentTypes.String,
    },

    //cloud bucket
    {
        name: "PROFILE_DIR",
        type: RequiredEnvironmentTypes.String,
    },

    //server environment
    {
        name: "ENVIRONMENT",
        type: RequiredEnvironmentTypes.String,
    },

    //google
    {
        name: "GOOGLE_CLIENT_ID",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "GOOGLE_CLIENT_SECRET",
        type: RequiredEnvironmentTypes.String,
    },

    //safehaven
    {
        name: "SAFEHAVEN_BASE_URL",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "SAFEHAVEN_CLIENT_ASSERTION",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "SAFEHAVEN_CLIENT_ID",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "SAFEHAVEN_COLLECTION_ACCOUNT_NUMBER",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "SAFEHAVEN_DEBIT_ACCOUNT_NUMBER",
        type: RequiredEnvironmentTypes.String,
    },

    //clodinary
    {
        name: "CLOUDINARY_CLOUD_NAME",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "CLOUDINARY_API_KEY",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "CLOUDINARY_API_SECRET",
        type: RequiredEnvironmentTypes.String,
    },
];

validate(runtimeEnvironment);

//app
export const allowedDomains =
    process.env.ALLOWED_DOMAINS && process.env.ALLOWED_DOMAINS.split(",");
export const isProduction: boolean = process.env.NODE_ENV === "production";
export const port: number = parseInt(process.env.PORT ?? "4000");

//jwt
export const jwtSecret: string = process.env.JWT_SECRET;

//encrypt
export const encryptSecret: string = process.env.ENCRYPT_SECRET;

export const appBaseUrl: string = process.env.BASEURL;

//email templates

export const mailConfig: EMailConfig = {
    apiKey: process.env.BREVO_API_KEY,
    senderName: process.env.MAIL_SENDER_NAME,
    senderEmail: process.env.MAIL_SENDER_EMAIL,
};

export interface EMailConfig {
    apiKey: string;
    senderName: string;
    senderEmail: string;
}

//prod deployment env
export const isProdEnvironment = process.env.ENVIRONMENT === "production";

export const shagoOptions: IShago.ShagoOptions = {
    baseUrl: process.env.SHAGO_BASE_URL,
    hashKey: process.env.SHAGO_KEY,
};

//redis
export interface GoogleConfig {
    clientId: string;
    clientSecret: string;
}

export const googleConfiguration: GoogleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

export const frontendDevOrigin = [/^http:\/\/localhost:\d+$/];

interface StorageDirConfig {
    profile: string;
}

export const storageDirConfig: StorageDirConfig = {
    profile: process.env.PROFILE_DIR,
};

export interface BankingConfig {
    safehavenConfig: TSafehaven.SafehavenOptions;
}

export const bankingConfig: BankingConfig = {
    safehavenConfig: {
        autoSweep: true,
        baseURL: process.env.SAFEHAVEN_BASE_URL,
        clientAssertion: process.env.SAFEHAVEN_CLIENT_ASSERTION,
        clientId: process.env.SAFEHAVEN_CLIENT_ID,
        collectionAccountNumber:
            process.env.SAFEHAVEN_COLLECTION_ACCOUNT_NUMBER,
        debitAccountNumber: process.env.SAFEHAVEN_DEBIT_ACCOUNT_NUMBER,
    },
};

//cloudinary

export const cloudinaryConfig: ConfigOptions = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
