import { z } from 'zod';
import { TaskSchema } from '../tasks';

export const _postInputSchema = z.object({
    STOMACH_API_URL: z.string(),
    API_KEY: z.string(),
    shareGptLinks: z.array(z.string()),
    tasks: z.array(TaskSchema)
});

export type _PostInput = z.infer<typeof _postInputSchema>;