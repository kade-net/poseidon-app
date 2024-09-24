import {
    Client,
    CONVERSATION_HEADER,
    generate_random_auth_string,
    getInbox,
    INBOX,
    NODE_ENTRY_FUNCTIONS
} from "@kade-net/fgs-rn";
import delegateManager from "../delegate-manager";
import {Buffer} from "buffer";
import {ACCOUNT_VIEW_FUNCTIONS, aptos} from "../../contract";
import client from "../../data/apollo";
import {GET_MY_PROFILE} from "../../utils/queries";

const INBOX_ADDRESS = delegateManager.account?.address().toString()!

export async function getClient(){
    try {

        const INBOX_ADDRESS = delegateManager.account?.address().toString()!
        console.log("INBOX ADDRESS: ", INBOX_ADDRESS);
        const randAuthString =await Client.getAuthString(INBOX_ADDRESS)

        console.log("Rand Auth string ::", randAuthString);
        const signature = delegateManager.signer!.sign(Buffer.from(randAuthString, 'utf-8').toString('hex'))

        const hexSignature =  Buffer.from(signature.toUint8Array().slice(0,32)).toString('hex')
        console.log("Hex Signature::", hexSignature)
        const client = await Client.init({
            secret_signature: hexSignature,
            inbox_address: delegateManager.account!.address().toString(),
        })

        return client
    }
    catch(e)
    {
        console.log("Something went wrong eee::", e)
        return null
    }
}

export async function updateInboxDetails(inbox: Omit<INBOX,'timestamp'>){
    try {
        const transaction = await aptos.transaction.build.simple({
            sender: delegateManager.account!.address().toString(),
            data: {
                function: NODE_ENTRY_FUNCTIONS.updateInbox.path,
                functionArguments: NODE_ENTRY_FUNCTIONS.updateInbox.parseArgs({
                    newRandAuthString: inbox.rand_auth_string,
                    newSignerPublicKey: inbox.sign_public_key,
                    newEncryptionPublicKey: inbox.encrypt_public_key,
                    newEncryptedPrivateKeySet: inbox.encrypted_private_key_set
                })
            }
        })

        const commitedTxn = await aptos.transaction.signAndSubmitTransaction({
            signer: delegateManager.signer!,
            transaction
        })

        console.log("commited txn ::", commitedTxn.hash)
    }
    catch(e)
    {
        console.log("Something went wrong::", e)
    }
}

export async function createInbox(){
    try{
        const rand_auth_string = generate_random_auth_string({
            inbox_owner: INBOX_ADDRESS
        })

        const signature = delegateManager.signer?.sign(Buffer.from(rand_auth_string, 'utf-8')).toUint8Array().slice(0,32)!
        const secret_signature = Buffer.from(signature).toString('hex')

        const new_inbox = await Client.getNewAccountInbox({
            address: INBOX_ADDRESS,
            node: 'poseidon',
            secret_signature,
            random_auth_string: rand_auth_string
        })

        const transaction = await aptos.transaction.build.simple({
            sender: INBOX_ADDRESS,
            data: {
                function: NODE_ENTRY_FUNCTIONS.registerInbox.path,
                functionArguments: NODE_ENTRY_FUNCTIONS.updateInbox.parseArgs({
                    newRandAuthString: rand_auth_string,
                    newEncryptedPrivateKeySet: new_inbox.encrypted_private_key_set,
                    newEncryptionPublicKey: new_inbox.encrypt_public_key,
                    newSignerPublicKey: new_inbox.sign_public_key
                })
            }
        })

        const commitedTxn = await aptos.transaction.signAndSubmitTransaction({
            signer: delegateManager.signer!,
            transaction
        })

        const status = await aptos.transaction.waitForTransaction({
            transactionHash: commitedTxn.hash
        })
        console.log("commited txn ::", commitedTxn.hash)

        if(!status.success){
            throw new Error("Unable to submit transaction")
        }

    }
    catch (e)
    {
        console.log("Something went wrong::", e)
    }
}

export async function getRegisteredDelegates(user_address: string){
    const userInbox = await getInbox(user_address)

    const account = await client.query({
        query: GET_MY_PROFILE,
        variables: {
            address: user_address
        }
    })
    const registeredDelegates = (await Promise.all((account?.data?.account?.delegates ?? [])?.map(async (delegate)=>{
        const inbox = await getInbox(delegate.address)
        if(inbox) return delegate.address
        return undefined;
    })))?.filter(a => a !== undefined)

    if(userInbox){
        return [user_address, ...(registeredDelegates as Array<string>)]
    }


    return (registeredDelegates as Array<string>) ?? []
}


export async function getOtherParticipants(conversationHeader: CONVERSATION_HEADER) {
    let participants = conversationHeader.participants
    if(!participants.find(p => p === conversationHeader.originator)){
        participants = participants.concat(conversationHeader.originator)
    }
    const owners: Array<string> = (await Promise.all(participants.map(async(participantAddress)=> {
        try {
            const dOwner = await aptos.view({
                payload: {
                    function: ACCOUNT_VIEW_FUNCTIONS.delegate_get_owner,
                    functionArguments: [participantAddress],
                    typeArguments: []
                }
            })

            const [user_kid, delegate_owner_address] = dOwner as [string, string]

            if(user_kid == '0') return participantAddress // Working assumption will be this is an actual user and not a delegate

            return delegate_owner_address
        }
        catch(e)
        {
            return null
        }
    }))).filter(p => p !== null && p !== delegateManager.owner && p !== delegateManager.owner) as Array<string>

    return owners
}
