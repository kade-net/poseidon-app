import { InMemoryCache, ApolloClient } from "@apollo/client"
import { Publication, PublicationRefference } from "../__generated__/graphql"
import { cloneDeep, uniqBy } from "lodash"

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                publications: {
                    keyArgs: false,
                    merge: (_existing: PublicationRefference[] = [], incoming: PublicationRefference[] = [], options) => {
                        console.log("OPtion args", options.args)
                        const { page = 0, size = 20 } = options?.args?.pagination as { page: number, size: number } ?? {}
                        console.log("Page::", page, "Size::", size)
                        const currentState = cloneDeep(_existing)
                        const offset = page * size
                        console.log("Offset::", offset)
                        for (let i = 0; i < incoming.length; i++) {
                            const toBeAdded = incoming.at(i)
                            const indexToReplace = offset + i
                            if (toBeAdded) {
                                if (currentState[indexToReplace]) {
                                    console.log("Replacing", indexToReplace)
                                    currentState[indexToReplace] = toBeAdded
                                }
                                else {
                                    console.log("Pushing", indexToReplace)
                                    currentState.push(toBeAdded)
                                }

                            }
                        }

                        return uniqBy(currentState, '__ref')
                    },
                    read(existing, options) {
                        console.log("Reading", existing)
                        return existing
                    }
                }
            }
        }
    }
})


const client = new ApolloClient({
    cache,
    uri: "https://cloudy-smash-production.up.railway.app"
})

export default client