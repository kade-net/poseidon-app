import { View, Text, YStack } from 'tamagui'
import React from 'react'
import { useQuery } from '@apollo/client'
import { getInboxes } from '../../../../lib/hermes-client/queries'
import delegateManager from '../../../../lib/delegate-manager'
import { InboxType } from '../../../../lib/hermes-client/__generated__/graphql'
import Inboxes from './inboxes'

const ActiveDMs = () => {

    return (
        <YStack flex={1} pt={20} >
            <Inboxes
                variables={{
                    address: delegateManager.owner!,
                    active: true,
                }}
            />
        </YStack>
    )
}

export default ActiveDMs