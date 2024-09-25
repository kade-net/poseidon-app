import { FGS_NODE, INBOX } from "@kade-net/fgs-rn"


export interface StoredFGSData {
    encryptionSecret: string
    signSecret: string
    secret_signature: string
}