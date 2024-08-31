export class ShagoError extends Error {
    readonly name: string = "ShagoError";
    status: number;
}
