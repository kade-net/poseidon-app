import axios from "axios"
import delegateManager from "./delegate-manager"
import Constants from "expo-constants"
import { aptos } from "../contract"

const CONNECT_URL = Constants.expoConfig?.extra?.ANCHORS_URL!

class AppConnect {
    constructor() {

    }

    async linkSession(session_id: string) {

        const resp = await axios.post<{ success: boolean }>(`${CONNECT_URL}/api/connect/link-user`, {
            user_address: delegateManager?.owner,
            session_id
        })

        const data = resp.data

        if (data.success) {
            return true
        }
        else {
            throw new Error('Failed to link session')
        }


    }

}

export default new AppConnect()