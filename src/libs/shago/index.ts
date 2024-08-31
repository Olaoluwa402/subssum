import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ShagoError } from "./errors";
import {
    ShagoOptions,
    ShagoResponse,
    ReQueryOptions,
    ReQueryResponseData,
} from "./interfaces";
import { Airtime } from "./interfaces";
import * as rax from "retry-axios";

import {
    VendAirtimeInputOptions,
    VendAirtimeOptions,
} from "./interfaces/airtime";

import { setTimeout } from "timers/promises";

export * as IShago from "./interfaces";

export class Shago {
    private axios: AxiosInstance = Axios.create({
        baseURL: this.instanceOptions.baseUrl,
        headers: {
            hashKey: `${this.instanceOptions.hashKey}`,
        },
    });
    constructor(protected instanceOptions: ShagoOptions) {
        this.setAxiosRetry();
    }

    private setAxiosRetry() {
        rax.attach(this.axios);
    }

    private reQueryStatuses: number[] = [202, 502];

    private handleError(error: any) {
        if (!Axios.isAxiosError(error)) {
            throw error;
        }
        const err = new ShagoError(
            error.response?.data?.message ?? "Something wrong happened"
        );
        err.status = error.response?.status ?? 500;
        throw err;
    }

    async buyAirTime(
        options: VendAirtimeInputOptions
    ): Promise<ShagoResponse<Airtime.VendAirtimeResponseData>> {
        try {
            // Define a type that represents a JSON string
            type JSONString<T> = string & { __type: T };

            // Override AxiosRequestConfig to enforce JSONString in data
            interface JSONRequestConfig<T>
                extends Omit<AxiosRequestConfig, "data"> {
                data?: JSONString<T>;
            }

            const requestOptions: JSONRequestConfig<VendAirtimeOptions> = {
                url: "/",
                method: "POST",
                data: JSON.stringify({
                    serviceCode: options.serviceCode,
                    phone: options.phone,
                    amount: options.amount,
                    vend_type: options.vend_type,
                    network: options.network,
                    request_id: options.request_id,
                }) as JSONString<VendAirtimeOptions>,
            };

            const response = await this.axios(requestOptions);

            if (!response.data.data) {
                const error = new ShagoError("unable to vend airtime");
                error.status = 500;
                throw error;
            }

            return response.data;
        } catch (err) {
            this.handleError(err);
        }
    }

    async reQuery<R = ReQueryResponseData>(
        options: ReQueryOptions
    ): Promise<ShagoResponse<R>> {
        const retryCount = Array.isArray(options.delay)
            ? options.delay.length
            : 2;
        const delay: number = Array.isArray(options.delay)
            ? options.delay[0] * 1000
            : 120 * 1000;
        // const delay = 5 * 1000;
        const code202 = 202;
        const code502 = 502;
        try {
            const handleReQuery = async (retry: number) => {
                await setTimeout(delay);
                const requestOptions: AxiosRequestConfig = {
                    url: `/transaction/${options.orderId}`,
                    method: "GET",
                    raxConfig: {
                        retry: retry,
                        retryDelay: delay,
                        statusCodesToRetry: [[code502, code502]],
                        backoffType: "static",
                        instance: this.axios,
                    },
                };

                return await this.axios(requestOptions);
            };

            let response = await handleReQuery(retryCount);

            //handle re-query for status code 202
            if (response.status == code202) {
                const retry = retryCount - 1;
                for (let i = 0; i < retry; i++) {
                    response = await handleReQuery(retry);
                    if (response.status == 200) {
                        break;
                    }
                }
            }

            switch (response.status) {
                case code202: {
                    const error = new ShagoError("Transaction in progress");
                    error.status = code202;
                    throw error;
                }
                case 200: {
                    return {
                        status: true,
                        responseCode: response.status,
                        data: response.data.result?.data as R,
                    };
                }
            }
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                throw error;
            }

            switch (true) {
                case error.response?.status == code502: {
                    const err = new ShagoError("Transaction in progress");
                    err.status = code502;
                    throw err;
                }

                default: {
                    const err = new ShagoError(
                        error.response?.data?.message ?? "No response message"
                    );
                    error.status = error.response?.status ?? 500;
                    throw err;
                }
            }
        }
    }
}
