import React from 'react'
import { profileSchema, TPROFILE } from '../../../schema'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface Context {
    form: UseFormReturn<TPROFILE>
}

const ProfileContext = React.createContext<Context>({} as Context)


export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const form = useForm<TPROFILE>({
        resolver: zodResolver(profileSchema)
    })

    return (
        <ProfileContext.Provider value={{ form }}>
            {children}
        </ProfileContext.Provider>
    )
}



export const useProfileForm = () => {
    const context = React.useContext(ProfileContext)

    return context
}