import { z } from "zod";

export const profileSchema = z.object({
    pfp: z.string().default(""),
    bio: z.string().default(""),
    display_name: z.string().default(""),
})

export type TPROFILE = z.infer<typeof profileSchema>