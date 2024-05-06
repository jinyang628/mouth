import { z } from 'zod';

export const _postInputSchema = z.object({
    shareGptLinks: z.array(z.string()),
    STOMACH_API_URL: z.string(),
    API_KEY: z.string(),
});

export type _PostInput = z.infer<typeof _postInputSchema>;