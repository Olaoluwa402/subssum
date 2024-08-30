import { SafehavenService } from "../providers/safehaven/services";

export type Provider = "safehaven";

export type BuildOptions<T extends Provider> = {
    provider: T;
};

export enum BankingInjectionToken {
    SAFEHAVEN = "SAFEHAVEN",
}

export interface IBankingFactory {
    build<T extends Provider>(options: BuildOptions<T>): SafehavenService;
}
