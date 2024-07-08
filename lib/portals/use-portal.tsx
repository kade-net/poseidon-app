import { BasePortal, PortalButton } from '@kade-net/portals-parser'
import { Effect, Either } from 'effect'
import React, { useCallback, useEffect, useState } from 'react'
import { loadAndParsePortalLink, onPortalButtonPressed } from './functions'

interface usePortalProps {
    initialUrl: string
}


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function usePortal(props: usePortalProps) {
    const [portal, setPortal] = useState<BasePortal | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const [currentURL, setCurrentURL] = useState<string>("")
    const { initialUrl } = props

    const handleButtonPress = async (args: { button: PortalButton, input?: string, hash?: string, kid: number, ref: string }) => {
        const { button, input, hash, kid, ref } = args
        setLoading(true)
        await onPortalButtonPressed({
            button,
            callback: async (arg, error) => {
                if (error) {
                    setError(error)
                }
                if (arg.portal) {

                    setPortal(arg.portal)
                }
                setCurrentURL(button.target)
                await sleep(1000)
                setLoading(false)
            },
            input,
            hash,
            post_kid: kid,
            post_ref: ref
        })
    }

    const loadData = useCallback(async (url: string) => {
        setLoading(true)
        const result = await Effect.runPromise(
            Effect.either(loadAndParsePortalLink({
                url: url
            }))
        )

        Either.match(result, {
            onLeft(left) {
                setError(left)
            },
            onRight(right) {
                console.log("Right::", right)
                setPortal(right)
            },
        })
        await sleep(1000)
        setLoading(false)
    }, [])

    useEffect(() => {
        const subscription = async () => {
            await loadData(initialUrl)
        }

        subscription()

        return () => {
            subscription()
        }
    }, [initialUrl])


    return {
        portal,
        loading,
        error,
        setPortal,
        handleButtonPress,
        currentURL
    }
}

export default usePortal