import { View, Text, YStack } from 'tamagui'
import React from 'react'
import Inboxes from './inboxes'
import delegateManager from '../../../../lib/delegate-manager'
import { InboxType } from '../../../../lib/hermes-client/__generated__/graphql'

const PendingDMs = () => {
    return (
        <YStack flex={1} pt={20} >
            <Inboxes
                variables={{
                    address: delegateManager.owner!,
                    active: false,
                    type: InboxType.Sent
                }}
            />
        </YStack>
    )
}

export default PendingDMs