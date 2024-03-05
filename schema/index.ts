import { z } from "zod";

export const profileSchema = z.object({
    pfp: z.string().default(""),
    bio: z.string().default(""),
    display_name: z.string().default(""),
})

export type TPROFILE = z.infer<typeof profileSchema>

export const publicationSchema = z.object({
    content: z.string(),
    tags: z.array(z.string()).optional(),
    media: z.array(z.object({
        type: z.string(),
        url: z.string()
    })).optional()
})

export type TPUBLICATION = z.infer<typeof publicationSchema>