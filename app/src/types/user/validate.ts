import { z } from 'zod';

export const validateInputSchema = z.object({
    STOMACH_API_URL: z.string(),
    API_KEY: z.string(),
});

export type ValidateInput = z.infer<typeof validateInputSchema>;

export const validateResponseSchema = z.object({
    status: z.number(),
});

export type ValidateResponse = z.infer<typeof validateResponseSchema>;
