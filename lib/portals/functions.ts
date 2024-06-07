import { BasePortal, PortalButton, PortalPacket, findHTMLMetaTags, generatePortalDefinition, parseMetaTags, signPortalPacket } from '@kade-net/portals-parser'
import { Effect, Either } from 'effect'
import { GeneratePortalDefinitionError, PortalDeserializerError, UnableToFetchNewPortalError } from './errors'
import delegateManager from '../delegate-manager'
import * as Linking from 'expo-linking'

interface loadAndParsePortalLinkArgs {
    url: string
}
export function loadAndParsePortalLink(args: loadAndParsePortalLinkArgs) {
    const { url } = args

    const task = parseMetaTags({
        url
    }).pipe(
        Effect.flatMap((metatags) => generatePortalDefinition({
            meta: metatags
        })),
        Effect.flatMap((definition) => {


            console.log("definition", definition)
            return Effect.try({
                try() {
                    const portal = BasePortal.deserialize(definition)
                    return portal
                },
                catch(error) {
                    return new PortalDeserializerError({
                        initialError: error
                    })
                },
            })
        })
    )

    return task

}

interface callbackArgs {
    portal: BasePortal | null
    button: PortalButton | null
}

interface onPortalButtonPressedArgs {
    post_kid: number,
    post_ref: string,
    button: PortalButton
    callback: (arg: callbackArgs, error?: any) => Promise<void>
    input?: string
    hash?: string
}
export async function onPortalButtonPressed(args: onPortalButtonPressedArgs) {
    const { button, callback, input, hash, post_kid, post_ref } = args

    const packet = {
        active_button: {
            index: button.index,
            target: button.target,
            title: button.title,
            type: button.type,
            module_arguments: button.module_arguments,
            module_function: button.module_function,
            post_url: button.post_url,
            type_arguments: button.type_arguments,
        },
        delegate_address: delegateManager.account?.address().toString(),
        input_text: input,
        timestamp: Date.now(),
        user_address: delegateManager.owner,
        post_kid: post_kid?.toString(),
        post_ref: post_ref,
    } as PortalPacket

    const signature = signPortalPacket({
        hex_string: delegateManager.signer?.privateKey.toString()!,
        packet
    })

    packet.portal_signature = signature

    const portalPacket = JSON.stringify(packet)

    switch (button.type) {
        case "link": {
            const canOpen = await Linking.canOpenURL(button.target)
            if (canOpen) {
                await Linking.openURL(button.target)
            } else {
                console.warn('Cannot open URL:', button.target)
            }
            callback({
                portal: null,
                button
            })
            break
        }
        case "mint": {
            const task = Effect.tryPromise({
                try: async () => {
                    const response = await fetch(button.target ?? button.post_url, {
                        method: 'POST',
                        body: portalPacket
                    })
                    const new_portal_url = response.url
                    if (!new_portal_url) {
                        throw new Error('No Location header')
                    }

                    return new_portal_url
                },
                catch(error) {
                    return new UnableToFetchNewPortalError({
                        initialError: error
                    })
                },
            }).pipe(
                Effect.flatMap((new_portal_url) => {
                    console.log("New Portal URL", new_portal_url)
                    return loadAndParsePortalLink({ url: new_portal_url })
                }
                ))

            const resultEither = await Effect.runPromise(Effect.either(task))

            Either.match(resultEither, {
                onLeft(left) {
                    console.log("Left", left)
                    callback({
                        portal: null,
                        button
                    }, left)
                },
                onRight(right) {
                    console.log("Right", right)
                    callback({
                        portal: right,
                        button: button
                    })
                },
            })
            break
        }
        case 'post': {
            const task = Effect.tryPromise({
                try: async () => {
                    const response = await fetch(button.target ?? button.post_url, {
                        method: 'POST',
                        body: portalPacket
                    })
                    const new_portal_url = response.url
                    if (!new_portal_url) {
                        throw new Error('No Location header')
                    }

                    return new_portal_url
                },
                catch(error) {
                    return new UnableToFetchNewPortalError({
                        initialError: error
                    })
                },
            }).pipe(
                Effect.flatMap((new_portal_url) => {
                    console.log("New Portal URL", new_portal_url)
                    return loadAndParsePortalLink({ url: new_portal_url })
                }
                ))

            const resultEither = await Effect.runPromise(Effect.either(task))

            Either.match(resultEither, {
                onLeft(left) {
                    console.log("Left", left)
                    callback({
                        portal: null,
                        button
                    }, left)
                },
                onRight(right) {
                    console.log("Right", right)
                    callback({
                        portal: right,
                        button: button
                    })
                },
            })
            break
        }
        case 'tx': {
            const task = Effect.tryPromise({
                try: async () => {
                    const response = await fetch(button.target ?? button.post_url, {
                        method: 'POST',
                        body: portalPacket
                    })
                    const new_portal_url = response.url
                    if (!new_portal_url) {
                        throw new Error('No Location header')
                    }

                    return new_portal_url
                },
                catch(error) {
                    return new UnableToFetchNewPortalError({
                        initialError: error
                    })
                },
            }).pipe(
                Effect.flatMap((new_portal_url) => {
                    console.log("New Portal URL", new_portal_url)
                    return loadAndParsePortalLink({ url: new_portal_url })
                }
                ))

            const resultEither = await Effect.runPromise(Effect.either(task))

            Either.match(resultEither, {
                onLeft(left) {
                    console.log("Left", left)
                    callback({
                        portal: null,
                        button
                    }, left)
                },
                onRight(right) {
                    console.log("Right", right)
                    callback({
                        portal: right,
                        button: button
                    })
                },
            })
            break
        }
    }
}