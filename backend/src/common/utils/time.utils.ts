import ms, { StringValue } from "ms";

export function parseToSeconds(exp: StringValue): number {
    return Math.floor(ms(exp) / 1000);
}