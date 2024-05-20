import { z } from 'zod';

export const _postInputSchema = z.object({
    STOMACH_API_URL: z.string(),
    API_KEY: z.string(),
    shareGptLink: z.string(),
});

export type _PostInput = z.infer<typeof _postInputSchema>;