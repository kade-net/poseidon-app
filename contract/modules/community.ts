import axios from "axios";
import { COMMUNITY } from "../../schema";
import { COMMUNITY_SUPPORT_API } from "..";
import client from "../../data/apollo";
import { GET_MY_PROFILE } from "../../utils/queries";
import delegateManager from "../../lib/delegate-manager";
import localStore from "../../lib/local-store";

interface Community {
    id: string;
    name: string;
    description: string;
    creator_address: string;
    image: string
}

interface Membership {
    id: string;
    user_address: string;
    type: 0 | 1 | 2;
    community_id: string;
    community: Community
    owns_community: boolean
}

class CommunityModule {
    constructor() { }

    async createCommunity(data: COMMUNITY) {

        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })


        if (!profile) {
            throw new Error("Profile not found")
        }

        const response = await axios.post<{
            community_id: string,
            membership_id: string
        }>(`${COMMUNITY_SUPPORT_API}/api/community/create`, {
            ...data,
            creator_address: delegateManager.owner!,
            username: profile?.account?.username?.username!,
            topic_ids: [] // TODO: Add topics later
        })


        return response.data ?? null
    }

    async follow(communityName: string) {
        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        if (!profile) {
            throw new Error("Profile not found")
        }

        localStore.addMembership(communityName)

        try {

            await axios.post(`${COMMUNITY_SUPPORT_API}/api/community/join`, {
                community_name: communityName,
                user_address: delegateManager.owner!,
                username: profile.account?.username?.username
            })
        }
        catch (e) {
            console.log("Error: ", e)
            localStore.removeMembership(communityName)
            throw e
        }

    }


    async unFollow(communityName: string) {
        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        if (!profile) {
            throw new Error("Profile not found")
        }

        localStore.removeMembership(communityName)

        try {
            await axios.post(`${COMMUNITY_SUPPORT_API}/api/community/delete-membership`, {
                community_name: communityName,
                user_address: delegateManager.owner!,
                username: profile.account?.username?.username
            })

        }
        catch (e) {
            console.log("Error: ", e)

            localStore.addMembership(communityName)
            throw e
        }
    }


    async getCommunities() {
        const response = await axios.get<{ memberships: Membership[] }>(`${COMMUNITY_SUPPORT_API}/api/community/memberships`, {
            params: {
                user_address: delegateManager.owner!
            }
        })
        const data = response.data?.memberships?.map((membership) => {
            console.log("Membership ::", membership.community.creator_address, " Current::", delegateManager.owner)
            return {
                ...membership,
                owns_community: membership.community.creator_address === delegateManager.owner,
                community: membership.community
            }
        }) ?? []

        return data
    }
}

export default new CommunityModule()