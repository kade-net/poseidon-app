import { z } from "zod";
import { Utils } from "../utils";

export const profileSchema = z.object({
    pfp: z.string().min(5).optional(),
    bio: z.string().min(1).optional(),
    display_name: z.string().min(1).max(50).optional(),
})

export type TPROFILE = z.infer<typeof profileSchema>

export const publicationSchema = z.object({
    content: z.string(),
    tags: z.array(z.string()).optional(),
    mentions: z.record(z.string()).optional(),
    media: z.array(z.object({
        type: z.string(),
        url: z.string()
    })).optional(),
    community: z.string().optional()
})

export type TPUBLICATION = z.infer<typeof publicationSchema>


export const communitySchema = z.object({
    name: z.string().regex(Utils.USERNAME_REGEX).min(2),
    description: z.string().min(2),
    image: z.string()
})

export type COMMUNITY = z.infer<typeof communitySchema>

export const updateSchema = z.object({
    community: z.string(),
    description: z.string().optional(),
    display_name: z.string().optional(),
    image: z.string().optional()
})


export type UpdateCommunitySchema = z.infer<typeof updateSchema>