import { isEmpty } from "lodash";
import publications from "./publications";
import account from "./account";


export function getRemovedFromFeed() {
    const removed = publications.hiddenPublications

    return isEmpty(removed) ? undefined : removed
}


export function getMutedUsers() {
    const muted = account.mutedUsers

    return isEmpty(muted) ? undefined : muted
}