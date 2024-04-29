import 'react-native-get-random-values'
import nacl from 'tweetnacl'
import * as Linking from 'expo-linking'
import { isNull } from 'lodash'
const PETRA_APP_LINK = "https://petra.app/api/v1"
import { Buffer } from 'buffer'

interface PetraRequestedInfo {
    appInfo: {
        domain: string
    },
    redirectLink: string,
    dappEncryptionPublicKey: string
}

interface PetraConnectionResponse {
    data: string
    response: 'approved' | 'rejected'
}

class PetraWallet {
    latestKeyPair: nacl.BoxKeyPair | null = null
    sharedSecret: Uint8Array | null = null
    constructor() {

    }

    async getKeys() {
        try {
            const keys = nacl.box.keyPair()
            this.latestKeyPair = keys
        }
        catch (e) {
            console.log("SOmething went wrong", e)
        }
    }

    async generateSharedSecret(publicKey: string) {
        if (isNull(this.latestKeyPair?.secretKey)) {
            throw new Error("No Private Key Found")
        }
        const shared = nacl.box.before(Buffer.from(publicKey, 'hex'), this.latestKeyPair.secretKey)
        this.sharedSecret = shared
        console.log("Shared secret is::", shared)
        return shared
        // TODO: Persist the shared secret for later transactions
    }

    async decryptMessage(encryptedMessage: string) {
        if (isNull(this.sharedSecret)) {
            throw new Error("No shared secret found")
        }
        const decoded = Buffer.from(encryptedMessage, 'base64')
        // const decrypted = 

    }


    async connect() {

        if (!this.latestKeyPair) {

            await this.getKeys()
        }

        if (isNull(this.latestKeyPair)) {
            throw new Error("Failed to generate key pair")
        }

        console.log("KEYPAIR::", this.latestKeyPair)

        const payload: PetraRequestedInfo = {
            appInfo: {
                domain: "host.exp.exponent" // TODO: change with the app's bundle id later
            },
            redirectLink: `${Linking.createURL("/settings/petra")}`,
            dappEncryptionPublicKey: Buffer.from(this.latestKeyPair.publicKey).toString('hex')
        }

        console.log("PAYLOAD::", payload)

        const encoded = Buffer.from(JSON.stringify(payload)).toString('base64')

        console.log("ENCODED::", encoded)

        const url = `${PETRA_APP_LINK}/connect?data=${encoded}`

        console.log("URL::", url)


        const r = await Linking.openURL(url)
    }

    async disconnect() {

    }

    async signAndSumbitTransaction() {

    }

}

const petra = new PetraWallet() // Singleton

export default petra