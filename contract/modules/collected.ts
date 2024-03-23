import { aptos } from "..";
import { GetAccountCollectionsWithOwnedTokenResponse, GetAccountOwnedTokensFromCollectionResponse, GetAccountOwnedTokensQueryResponse, GetCollectionDataResponse } from '@aptos-labs/ts-sdk'
import delegateManager from "../../lib/delegate-manager";
import { uniqBy } from "lodash";


class Collected {
    constructor() {
    }

    tokens: Map<string, Array<GetAccountOwnedTokensQueryResponse['0']>> = new Map()
    collections: Map<string, Array<Partial<GetCollectionDataResponse & { first_uri: string }>>> = new Map()

    async getTokens(collectionId: string, address: string) {
        const valid_tokens = (this.tokens.get(address) ?? []).filter(token => token.current_token_data?.current_collection?.collection_id === collectionId)

        return valid_tokens
    }

    async getCollection(collectionId: string, address: string) {
        const collections = this.collections.get(address) ?? []
        const collection = collections.find(collection => collection?.collection_id === collectionId)
        return collection
    }

    async getCollections(address: string) {
        const response = await aptos.getAccountTokensCount({
            accountAddress: address
        })

        const tokens: Array<GetAccountOwnedTokensQueryResponse['0']> = []

        const totalPages = Math.ceil(response / 20)

        for (let i = 0; i < totalPages; i++) {
            const response = await aptos.getAccountOwnedTokens({
                accountAddress: address,
                options: {
                    limit: 20,
                    offset: i * 20
                }
            })

            tokens.push(...response)
        }

        const _collections = tokens?.map(token => {
            return {
                ...(token.current_token_data?.current_collection ?? null),
                first_uri: token?.current_token_data?.token_uri
            }
        })
        const collections = uniqBy(_collections, (collection) => collection?.collection_id)

        this.tokens.set(address, tokens)
        this.collections.set(address, collections)
        return collections
    }
}

export default new Collected();