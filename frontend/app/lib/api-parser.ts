import { z } from "zod";

export function parseApiResponse<S extends z.ZodTypeAny>(
    responseSchema: S,
    response: unknown,
): z.infer<S> {
    const parsed = responseSchema.safeParse(response);

    if (!parsed.success) {
        throw new Error("Invalid API response");
    }

    return parsed.data;
}