import { INBOX, MESSAGE, ATTACHMENT, CONVERSATION_HEADER } from '@kade-net/fgs-rn'
import * as SecureStore from 'expo-secure-store'
import delegateManager from "../delegate-manager";
import storage from "../storage";

interface initializeConversationArgs {
    data: CONVERSATION_HEADER
}

interface saveMessageArgs {
    data: MESSAGE,
    conversationId: string
}

export class FGSStore{

    constructor(){}

    // Store Secret Key
    storeSecretKey(secretKey: string) {
        SecureStore.setItem(`fgs:identity:secretKey`, secretKey)
    }

    // Save Identity
    saveIdentity(identityData: INBOX) {
        SecureStore.setItem(`fgs:identity:inbox`, JSON.stringify(identityData))
    }

    // get secret key
    get secretKey() {
        try {
            return SecureStore.getItem(`fgs:identity:secretKey`)
        }
        catch (e)
        {
            console.log("Something went wrong", e)
            return null
        }
    }

    // get identity
    get identity(){
        try {
            let string_data = SecureStore.getItem(`fgs:identity:inbox`)
            const data: INBOX = JSON.parse(string_data ?? '{}')

            return string_data ? data : null
        }
        catch (e)
        {
            console.log("Something went wrong::",e)
            return null
        }
    }

    // initializeConversation
    async initializeConversation(args: initializeConversationArgs){
        await storage.save({
            key: 'conversations',
            id: args.data.conversation_id,
            data: args.data ?? [],
            expires: null
        })
    }

    // saveMessages
    async saveMessage(args: saveMessageArgs) {
        await storage.save({
            key: args.conversationId,
            id: args.data?.id,
            data:args.data,
            expires: null
        })
    }

    // getMessages
    async getMessages(conversationId: string) {
        try {
            return await storage.getAllDataForKey<MESSAGE>(conversationId)
        }
        catch (e)
        {
            console.log("Not Found::", e)
            return []
        }
    }

    // getConversations
    async getConversations(){
        try {
            return await storage.getAllDataForKey<CONVERSATION_HEADER>("conversations")
        }
        catch (e) {
            console.log("Something went wrong::",e)
            return []
        }
    }
}

// Main FGS store
export const fgsStorage = new FGSStore();

