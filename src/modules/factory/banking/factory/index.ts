import * as t from "../types";
import { SafehavenService } from "../providers/safehaven/services";
import { Safehaven } from "@/libs/safehaven";
import { BankingConfig } from "@/config";

export class BankingFactory implements t.IBankingFactory {
    constructor(private readonly bankingConfig: BankingConfig) {}

    build<T extends t.Provider>(options: t.BuildOptions<T>): SafehavenService {
        switch (options.provider) {
            case "safehaven": {
                const safehavenConfig = this.bankingConfig.safehavenConfig;
                const safehaven = new Safehaven({
                    autoSweep: safehavenConfig.autoSweep,
                    baseURL: safehavenConfig.baseURL,
                    clientAssertion: safehavenConfig.clientAssertion,
                    clientId: safehavenConfig.clientId,
                    collectionAccountNumber:
                        safehavenConfig.collectionAccountNumber,
                    debitAccountNumber: safehavenConfig.debitAccountNumber,
                });

                return new SafehavenService(safehaven);
            }

            //add other providers
            default:
                break;
        }
    }
}
