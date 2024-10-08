import {Client} from "@kade-net/fgs-rn";
import delegateManagerImported, { DelegateManager } from "../delegate-manager";
import client from "../../data/apollo";

const INBOX_ADDRESS = delegateManagerImported.account?.address().toString()!;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class FGS {

    client?: Client

    constructor(client?: Client) {
        this.client = client;
    }

    static async initFGS(dManager?: DelegateManager) {
        const delegateManager = dManager ?? delegateManagerImported
        let INBOX_ADDRESS = delegateManager.account?.address().toString()!;

        console.log("INBOX ADDRESS: ", INBOX_ADDRESS);
        const AUTH_STRING = await Client.getAuthString(INBOX_ADDRESS)
        const signature = delegateManager.signer?.sign(Buffer.from(AUTH_STRING, 'utf-8')).toUint8Array().slice(0, 32)!
        const secret_signature = Buffer.from(signature).toString('hex')
        const client = await Client.init({
            inbox_address: INBOX_ADDRESS,
            secret_signature
        })
        console.log("client", client.conversationList, secret_signature)
        return new FGS(client)
    }

    setClient(client: Client) {
        this.client = client
    }
}


export default new FGS()
// TODO: initialize FGS client at earlier entry point