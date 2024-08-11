import React from "react"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"


const schema = z.object({
    email: z.string().email(),
    code: z.string().length(6).optional()
})

export type P = z.infer<typeof schema>

interface Context {
    form: UseFormReturn<P>
    codeSent: boolean,
    goBack: () => void
}

export const verificationFormContext = React.createContext<Context | undefined>(undefined)

export const useVerificationForm = () => {
    const context = React.useContext(verificationFormContext)

    return context as Context
}