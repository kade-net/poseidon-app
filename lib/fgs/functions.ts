import {Client, generate_random_auth_string, INBOX, NODE_ENTRY_FUNCTIONS} from "@kade-net/fgs-rn";
import delegateManager from "../delegate-manager";
import {Buffer} from "buffer";
import {aptos} from "../../contract";

const INBOX_ADDRESS = delegateManager.account?.address().toString()!

export async function getClient(){
    try {
        const randAuthString =await Client.getAuthString(delegateManager.account!.address().toString()!)

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
        console.log("Something went wrong::", e)
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
