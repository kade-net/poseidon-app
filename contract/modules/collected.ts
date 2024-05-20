import { COMMUNITY_SUPPORT_API, aptos } from "..";
import { GetAccountCollectionsWithOwnedTokenResponse, GetAccountOwnedTokensFromCollectionResponse, GetAccountOwnedTokensQueryResponse, GetCollectionDataResponse } from '@aptos-labs/ts-sdk'
import delegateManager from "../../lib/delegate-manager";
import { uniqBy } from "lodash";
import axios from "axios";

type VARIANT = {
    timestamp: Date | null;
    id: string;
    name: string | null;
    description: string | null;
    image: string | null;
    collection_name: string | null;
}

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
                first_uri: token?.current_token_data?.token_uri,
                is_internal: false,
                is_locked: false,
                anchor_amount: 0
            }
        })
        const collections = uniqBy(_collections, (collection) => collection?.collection_id)

        if (address == delegateManager.owner) {

            const _response = await axios.get<{
                collections: {
                    name: string,
                    address: string
                    description: string,
                    image: string
                    max_supply: number,
                    anchor_amount: number
                }[]
            }>(`${COMMUNITY_SUPPORT_API}/api/collections`, {
                params: {
                    user_address: delegateManager.owner
                }
            })

            const data = _response.data?.collections ?? []

            for (const collection of data) {

                collections.push({
                    first_uri: collection.image?.startsWith("ipfs://") ? '' : collection?.image,
                    collection_name: collection.name,
                    description: collection.description,
                    collection_id: collection.address,
                    uri: collection.image,
                    max_supply: collection.max_supply,
                    is_internal: true,
                    anchor_amount: collection.anchor_amount ?? 0,
                    is_locked: collection.anchor_amount > 0 ? true : false,

                })
            }
        }

        this.tokens.set(address, tokens)
        this.collections.set(address, collections)
        if (address == delegateManager.owner) {
            // const hasFoundation = collections.filter((collection)=> collection.)
        }
        return collections
    }

    async getVariants(collection_name: string) {
        console.log("Collection Name::", collection_name)
        const response = await axios.get<{
            collection: {
                name: string;
                max_supply: number | null;
                description: string | null;
                timestamp: Date | null;
                address: string | null;
                image: string | null;
                anchor_amount: number | null;
                variants: VARIANT[]
            },
            minted: number
        }>(`${COMMUNITY_SUPPORT_API}/api/collections/${collection_name}`)

        const data = response.data

        return data
    }

    async getVariant(collection_name: string, variant_name: string) {
        const variants = await this.getVariants(collection_name)
        const variant = variants?.collection?.variants?.find((value) => value.name == variant_name)

        return variant ?? null
    }

    async mintFromCollection(collection_name: string, variant_name: string) {
        await axios.post(`${COMMUNITY_SUPPORT_API}/api/collections/mint`, {
            collection_name,
            variant_name,
            user_address: delegateManager.owner!
        })


    }

}

export default new Collected();