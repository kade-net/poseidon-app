import axios from "axios"
import delegateManager from "./delegate-manager"

const CONNECT_URL = "https://anchor-connect.vercel.app"

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