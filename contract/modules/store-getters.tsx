import { isEmpty } from "lodash";
import selfModeration from '../../lib/self-moderation'


export function getRemovedFromFeed() {
    const removed = selfModeration.hiddenPublications

    return isEmpty(removed) ? undefined : removed
}


export function getMutedUsers() {
    const muted = selfModeration.mutedUsers

    return isEmpty(muted) ? undefined : muted
}