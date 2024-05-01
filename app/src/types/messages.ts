import { z } from 'zod';

export const populateChatlogLinksMessageSchema = z.object({
    action: z.literal('populateChatlogLinks'),
    links: z.array(z.string()),
});

export type PopulateChatlogLinksMessage = z.infer<typeof populateChatlogLinksMessageSchema>;

export const dummyMessageSchema = z.object({
    action: z.literal('populateChatlogLinkssaaa'),
    good: z.array(z.string()),
});

export const messageSchema = z.union([populateChatlogLinksMessageSchema, dummyMessageSchema]);

export type Message = z.infer<typeof messageSchema>;