import {Utils} from "../utils";


const PORTAL_WHITELIST = [
    "shacks.poseidon.ac",
    "swarms.poseidon.ac",
    "portals.poseidon.ac",
    "africanz.poseidon.ac",
    "192.168.1.2",
    "192.168.100.211"
] as const;

// http://192.168.1.2:3000


export function checkIsPortal(url: string){
    let domain = Utils.extractDomain(url.trim())

    const exists = PORTAL_WHITELIST.indexOf(domain as any);

    return exists !== -1
}