import * as t from "./types";
import * as e from "./errors";
import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
export * as TSafehaven from "./types";
export * from "./errors";

export class Safehaven {
    private axios: AxiosInstance = Axios.create({
        baseURL: this.instanceOptions.baseURL,
    });
    private accessToken: string;
    private ibsClientId: string;
    private readonly expiredTokenStatus = 403;
    private readonly successResponseStatus = 200;
    readonly bankName = "Safe Haven Microfinance Bank";
    constructor(protected instanceOptions: t.SafehavenOptions) {
        this.buildAuthCredentials();
    }

    private async getAccessToken(): Promise<t.GetAccessTokenResponse> {
        try {
            const requestOptions: AxiosRequestConfig<t.GetAccessTokenOptions> =
                {
                    url: "/oauth2/token",
                    method: "POST",
                    data: {
                        client_id: this.instanceOptions.clientId,
                        client_assertion: this.instanceOptions.clientAssertion,
                        grant_type: "client_credentials",
                        client_assertion_type:
                            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                    },
                };

            const { data } = await this.axios<t.GetAccessTokenResponse>(
                requestOptions
            );
            return data;
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                throw error;
            }
            const err = new e.SafehavenError(
                error.response?.data?.message ?? "Failed to authenticate"
            );
            err.status = error.status ?? error.response.status;
            throw err;
        }
    }

    private async buildAuthCredentials() {
        try {
            const tokenCredentials = await this.getAccessToken();
            this.accessToken = tokenCredentials.access_token;
            this.ibsClientId = tokenCredentials.ibs_client_id;
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                throw error;
            }
            if (error instanceof e.SafehavenError) {
                throw error;
            }
            const err = new e.SafehavenError(
                "Failed to build auth credentials"
            );
            err.status = 500;
            throw err;
        }
    }

    private async buildAuthHeader(): Promise<t.BuildAuthHeader> {
        if (!this.accessToken) {
            await this.buildAuthCredentials();
        }

        return {
            Authorization: `Bearer ${this.accessToken}`,
            ClientID: this.ibsClientId,
        };
    }

    async initiateVerification(
        options: Omit<t.InitiateVerificationOptions, "debitAccountNumber">
    ): Promise<t.InitiateVerificationResponse> {
        try {
            const headers = await this.buildAuthHeader();
            const requestOptions: AxiosRequestConfig<t.InitiateVerificationOptions> =
                {
                    url: "/identity/v2",
                    method: "POST",
                    headers: { ...headers },
                    data: {
                        debitAccountNumber:
                            this.instanceOptions.debitAccountNumber,
                        number: options.number,
                        type: options.type,
                        async: options.async,
                        provider: options.provider,
                    },
                };

            const { data } = await this.axios<
                t.BaseResponse<t.InitiateVerificationResponse>
            >(requestOptions);

            if (data.statusCode !== this.successResponseStatus) {
                const error = new e.SafehavenError(
                    data.message ??
                        `Failed to initiate ${options.type} verification`
                );
                error.status = data.statusCode ?? 500;
                throw error;
            }
            return data.data;
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                throw error;
            }

            if (error.status === this.expiredTokenStatus) {
                await this.buildAuthCredentials();
                return await this.initiateVerification(options);
            }
            const err = new e.SafehavenError(
                error.response?.data?.message ??
                    `Failed to initiate ${options.type} verification`
            );
            err.status = error.status ?? error.response.status;
            throw err;
        }
    }

    async createSubAccount(
        options: Omit<
            t.CreateSubAccountOptions,
            "autoSweepDetails" | "autoSweep"
        >
    ): Promise<t.CreateSubAccountResponse> {
        try {
            const headers = await this.buildAuthHeader();
            const requestOptions: AxiosRequestConfig<t.CreateSubAccountOptions> =
                {
                    url: "/accounts/v2/subaccount",
                    method: "POST",
                    headers: { ...headers },
                    data: {
                        emailAddress: options.emailAddress,
                        identityId: options.identityId,
                        identityNumber: options.identityNumber,
                        identityType: options.identityType,
                        otp: options.otp,
                        phoneNumber: options.phoneNumber,
                        externalReference: options.externalReference,
                        autoSweep: this.instanceOptions.autoSweep,
                        ...(this.instanceOptions.autoSweep && {
                            autoSweepDetails: {
                                accountNumber:
                                    this.instanceOptions
                                        .collectionAccountNumber,
                                schedule: "Instant",
                            },
                        }),
                    },
                };
            const { data } = await this.axios<
                t.BaseResponse<t.CreateSubAccountResponse>
            >(requestOptions);

            if (data.statusCode !== this.successResponseStatus) {
                const error = new e.SafehavenError(
                    data.message ?? "Failed to create sub account"
                );
                error.status = data.statusCode ?? 500;
                throw error;
            }

            return data.data;
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                throw error;
            }

            if (error.status === this.expiredTokenStatus) {
                await this.buildAuthCredentials();
                return await this.createSubAccount(options);
            }
            const err = new e.SafehavenError(
                error.response?.data?.message ?? `Failed to create sub account`
            );
            err.status = error.status ?? error.response.status;
            throw err;
        }
    }

    async nameEnquiry(
        options: t.NameEnquiryOptions
    ): Promise<t.NameEnquiryResponse> {
        try {
            const headers = await this.buildAuthHeader();
            const requestOptions: AxiosRequestConfig<t.NameEnquiryOptions> = {
                url: "/transfers/name-enquiry",
                method: "POST",
                headers: { ...headers },
                data: {
                    accountNumber: options.accountNumber,
                    bankCode: options.bankCode,
                },
            };

            const { data } = await this.axios<
                t.BaseResponse<t.NameEnquiryResponse>
            >(requestOptions);

            if (data.statusCode !== this.successResponseStatus) {
                const error = new e.SafehavenError(
                    data.message ?? "Failed to enquire name"
                );
                error.status = data.statusCode ?? 500;
                throw error;
            }

            return data.data;
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                throw error;
            }

            if (error.status === this.expiredTokenStatus) {
                await this.buildAuthCredentials();
                return await this.nameEnquiry(options);
            }
            const err = new e.SafehavenError(
                error.response?.data?.message ?? `Failed to enquire name`
            );
            err.status = error.status ?? error.response.status;
            throw err;
        }
    }

    async getBanks(): Promise<t.GetBankListResponse[]> {
        try {
            const headers = await this.buildAuthHeader();
            const requestOptions: AxiosRequestConfig = {
                url: "/transfers/banks",
                headers: { ...headers },
            };

            const { data } = await this.axios<
                t.BaseResponse<t.GetBankListResponse[]>
            >(requestOptions);

            if (data.statusCode !== this.successResponseStatus) {
                const error = new e.SafehavenError(
                    data.message ?? "Failed to fetch banks"
                );
                error.status = data.statusCode ?? 500;
                throw error;
            }

            return data.data;
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                throw error;
            }

            if (error.status === this.expiredTokenStatus) {
                await this.buildAuthCredentials();
                return await this.getBanks();
            }
            const err = new e.SafehavenError(
                error.response?.data?.message ?? `Failed to fetch banks`
            );
            err.status = error.status ?? error.response.status;
            throw err;
        }
    }

    async transferStatus(
        options: t.TransferStatusOptions
    ): Promise<t.TransferStatusResponse> {
        try {
            const headers = await this.buildAuthHeader();
            const requestOptions: AxiosRequestConfig<t.TransferStatusOptions> =
                {
                    url: "/transfers/status",
                    method: "POST",
                    headers: { ...headers },
                    data: {
                        sessionId: options.sessionId,
                    },
                };

            const { data } = await this.axios<
                t.BaseResponse<t.TransferStatusResponse>
            >(requestOptions);

            if (data.statusCode !== this.successResponseStatus) {
                const error = new e.SafehavenError(
                    data.message ?? "Failed to verify transfer"
                );
                error.status = data.statusCode ?? 500;
                throw error;
            }

            return data.data;
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                throw error;
            }

            if (error.status === this.expiredTokenStatus) {
                await this.buildAuthCredentials();
                return await this.transferStatus(options);
            }
            const err = new e.SafehavenError(
                error.response?.data?.message ?? `Failed to verify transfer`
            );
            err.status = error.status ?? error.response.status;
            throw err;
        }
    }
}
