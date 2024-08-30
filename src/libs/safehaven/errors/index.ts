export class SafehavenError extends Error {
    readonly name: string = "SafehavenError";
    status: number;
}
