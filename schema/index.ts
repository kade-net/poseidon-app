import { z } from "zod";
import { Utils } from "../utils";

export const profileSchema = z.object({
    pfp: z.string().min(5).optional(),
    bio: z.string().max(100, {
        message: "Bio cannot be longer than 100 characters"
    }).optional(),
    display_name: z.string().max(50, {
        message: "Display name cannot be longer than 50 characters"
    }).optional(),
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

export const dmSchema = z.object({
    content: z.string().optional().default(''),
    media: z.array(z.object({
        type: z.enum(['image', 'video', 'audio', 'file', 'gif']),
        url: z.string()
    })).optional().default([]),
})

export type TDM = z.infer<typeof dmSchema>


export type UpdateCommunitySchema = z.infer<typeof updateSchema>