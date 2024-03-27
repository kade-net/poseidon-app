import axios, { AxiosResponse } from "axios"
import { COMMUNITY_SUPPORT_API } from ".."
import delegateManager from "../../lib/delegate-manager"

export interface Topic {
    id: string
    parentTopic: string
    name: string
}

class TopicsModule {
    constructor()  {}

    async getInterests(): Promise<Topic[]> {
        let response: Topic[] = []
        try {
            const apiResponse: AxiosResponse<Topic[]> = await axios.get<Array<Topic>>(`${COMMUNITY_SUPPORT_API}/api/topics`)

            response = apiResponse.data

        } catch (error) {
            console.log("Error fetching interests", error)
        }

        return response;
    }

    async createInterest(topicIds: string[]) {
        try {
            axios.post(`${COMMUNITY_SUPPORT_API}/api/topics`, {
                userAddress: delegateManager.owner!, 
                topicId: topicIds
            })
            
        } catch (error) {
            console.log("Error saving interests", error)
            
        }
        
    }
}

export default new TopicsModule()