import axios from 'axios'
import delegateManager from "./delegate-manager";
import * as SecureStorage from 'expo-secure-store'
import Constants from 'expo-constants'
import posti from './posti';
import config from '../config';


const CONNECT_URL = config.CONNECT_URL

class SessionManager {
    session: string | null = null;

    constructor() {

    }

    async startSession(session_id: string) {
        this.session = session_id
        SecureStorage.setItem('session', session_id)
    }

    async sendDelegateAddress() {
        let address = delegateManager.account?.address()?.toString()
        if (!address) {
            throw new Error('No address found')
        }

        // TODO: update connector url
        try {

            const response = await axios.post<{ delegate_linked: boolean, username: string, owner: string } | null>(`${CONNECT_URL}/api/add-delegate`, {
                delegate_address: address
            },
                {
                    headers: {
                        'Authorization': `Bearer ${this.session}`,
                    }
                })

            return response.data
        }
        catch (e) {
            posti.capture('send-delegate-address-error', {
                delegate: address,
                error: `Something went wrong ${e}`
            })
            console.log(`SOMETHING WENT WRONG:: ${e}`)
        }

    }

    async checkSessionStatus() {
        if (!this.session) {
            const stored = await SecureStorage.getItemAsync('session')
            if (stored) {
                this.session = stored
                return
            }

            throw new Error('No session found')
        }

        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    const response = await axios.get<{ delegate_linked: boolean, account_linked: boolean, address: string, owner: string }>(`${CONNECT_URL}/api/add-delegate?delegate_address=${delegateManager.account?.address()?.toString()}`, {
                        headers: {
                            'Authorization': `Bearer ${this.session}`,
                        }
                    })

                    let data = response.data

                    if (data.delegate_linked) {
                        delegateManager.setOwner(data.owner)
                        console.log("Linked")
                        clearInterval(interval)
                        resolve(data)
                    }
                }
                catch (e) {
                    posti.capture('check-session-status-error', {
                        delegate: delegateManager.account?.address().toString(),
                        user: delegateManager.owner,
                        error: 'Unable to check session status'
                    })
                    clearInterval(interval)
                    reject(e)
                }
            }, 5000)
        })
    }



}

export default new SessionManager()