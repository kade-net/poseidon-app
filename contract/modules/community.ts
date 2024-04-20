import axios from "axios";
import { COMMUNITY } from "../../schema";
import { COMMUNITY_SUPPORT_API } from "..";
import client from "../../data/apollo";
import { COMMUNITY_QUERY, GET_MY_PROFILE } from "../../utils/queries";
import delegateManager from "../../lib/delegate-manager";
import localStore from "../../lib/local-store";
import { z } from "zod";
import posti from "../../lib/posti";
import { Utils } from "../../utils";

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

const updateSchema = z.object({
    community: z.string(),
    description: z.string().optional(),
    display_name: z.string().optional(),
    image: z.string().optional()
})


type USchema = z.infer<typeof updateSchema>

const changeMembership = z.object({
    community_name: z.string(),
    member_address: z.string(),
    member_username: z.string()
})

type CMembership = z.infer<typeof changeMembership>

class CommunityModule {
    constructor() { }

    locked: boolean = false

    lock() {
        this.locked = true
    }

    unlock() {
        this.locked = false
    }

    waitForUnlock(): Promise<boolean> {
        return new Promise<boolean>(async (res, rej) => {
            if (this.locked) {
                console.log("Waiting for unlock")
                await Utils.sleep(2000)
                return res(this.waitForUnlock())
            } else {
                console.log("Resolved unlock")
                res(true)
            }
        })
    }

    async createCommunity(data: COMMUNITY) {

        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })


        if (!profile) {
            posti.capture('create-community-failed', {
                error: "Profile does not exist",
                delegate: delegateManager.account?.address().toString(),
                user: delegateManager.owner!
            })
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

        await localStore.createCommunity(data.name, data.description, data.image)

        return response.data ?? null
    }

    async follow(communityName: string, storeUpdated?: boolean) {

        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        if (!profile) {
            throw new Error("Profile not found")
        }

        if (!storeUpdated) {
            localStore.addMembership(communityName)
        }

        if (this.locked) {
            await this.waitForUnlock()
            await this.follow(communityName, true)
            return
        } else {
            this.lock()
        }
        try {

            await axios.post(`${COMMUNITY_SUPPORT_API}/api/community/join`, {
                community_name: communityName,
                user_address: delegateManager.owner!,
                username: profile.account?.username?.username
            })
            this.unlock()
        }
        catch (e) {
            posti.capture('follow failed', {
                error: 'Unable to follow account',
                user: delegateManager.owner!,
                delegate: delegateManager.account?.address().toString()
            })
            console.log("Error: ", e)
            localStore.removeMembership(communityName)
            this.unlock()
            throw e
        }

    }


    async unFollow(communityName: string, storeUpdated?: boolean) {
        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        if (!profile) {
            throw new Error("Profile not found")
        }

        if (!storeUpdated) {
            localStore.removeMembership(communityName)
        }

        if (this.locked) {
            await this.waitForUnlock()
            await this.unFollow(communityName, true)
            return
        }
        else {
            this.lock()
        }
        try {
            await axios.post(`${COMMUNITY_SUPPORT_API}/api/community/delete-membership`, {
                community_name: communityName,
                user_address: delegateManager.owner!,
                username: profile.account?.username?.username
            })

            this.unlock()
        }
        catch (e) {
            console.log("Error: ", e)
            posti.capture('unfollow-community-fail', {
                user: delegateManager.owner!,
                delegate: delegateManager.account?.address().toString(),
                communityName
            })
            localStore.addMembership(communityName)
            this.unlock()
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
            return {
                ...membership,
                owns_community: membership.community.creator_address === delegateManager.owner,
                community: membership.community
            }
        }) ?? []

        return data
    }

    async updateCommunity(data: USchema) {
        if (!delegateManager.owner) {
            throw new Error("Owner not found")
        }

        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        if (!profile?.account?.username?.username) {
            throw new Error("Profile not found")
        }

        if (!data.community) {
            throw new Error("Community not found")
        }

        const community = client.readQuery({
            query: COMMUNITY_QUERY,
            variables: {
                name: data.community
            }
        })

        if (!community?.community) {
            throw new Error("Community not found")
        }


        const submissionData = {
            username: profile?.account?.username?.username,
            user_address: delegateManager.owner,
            community: data.community,
            description: data.description ?? community?.community.description,
            display_name: data.display_name ?? community?.community.display_name,
            image: data.image ?? community?.community.image
        }

        try {
            const response = await axios.post(`${COMMUNITY_SUPPORT_API}/api/community/update`, submissionData)
            await localStore.updateCommunity(data)
        }
        catch (e) {
            posti.capture('update-community-fail', {
                user: delegateManager.owner!,
                delegate: delegateManager.account?.address().toString(),
                error: e,
                description: 'Unable to update community'
            })
            console.log(`Something went wrong: ${e}`)
            throw e
        }


    }

    async addHost(data: CMembership) {

        if (!delegateManager.owner) {
            throw new Error("Owner not found")
        }

        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        if (!profile?.account?.username?.username) {
            throw new Error("Profile not found")
        }

        const parsed = changeMembership.safeParse(data)

        if (!parsed.success) {
            throw new Error("Invalid data")
        }

        const submissionData = {
            ...parsed.data,
            host_address: delegateManager.owner,
            host_username: profile?.account?.username?.username
        }

        try {
            localStore.changeMembershipType(data.community_name, data.member_address, 1)
            await axios.post(`${COMMUNITY_SUPPORT_API}/api/community/add-host`, submissionData)
        }
        catch (e) {
            localStore.changeMembershipType(data.community_name, data.member_address, 2)
            console.log(`Something went wrong: ${e}`)
            throw e
        }

    }

    async removeHost(data: CMembership) {

        if (!delegateManager.owner) {
            throw new Error("Owner not found")
        }

        const profile = client.readQuery({
            query: GET_MY_PROFILE,
            variables: {
                address: delegateManager.owner!
            }
        })

        if (!profile?.account?.username?.username) {
            throw new Error("Profile not found")
        }

        const parsed = changeMembership.safeParse(data)

        if (!parsed.success) {
            throw new Error("Invalid data")
        }

        const submissionData = {
            ...parsed.data,
            host_address: delegateManager.owner,
            host_username: profile?.account?.username?.username
        }

        try {
            localStore.changeMembershipType(data.community_name, data.member_address, 2)
            await axios.post(`${COMMUNITY_SUPPORT_API}/api/community/remove-host`, submissionData)
        }
        catch (e) {
            localStore.changeMembershipType(data.community_name, data.member_address, 1)
            console.log(`Something went wrong: ${e}`)
            throw e
        }
    }
}

export default new CommunityModule()