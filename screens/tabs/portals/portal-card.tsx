import { View } from 'react-native'
import React from 'react'
import { Portal } from '../../../lib/convergence-client/__generated__/graphql'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE, GET_PUBLICATION } from '../../../utils/queries'
import { Avatar, AvatarFallback, XStack, YStack, Text } from 'tamagui'
import BaseContentContainer from '../../../components/ui/feed/base-content-container'
import LinkResolver from '../../../components/ui/feed/link-resolver'
import { Utils } from '../../../utils'
import { MemoedMention } from '../../../components/ui/feed/highlight-mentions'

interface Props {
    portal: Portal
}

const PortalCard = (props: Props) => {
    const { portal } = props
    const profile = useQuery(GET_MY_PROFILE, {
        variables: {
            id: portal.user_kid
        }
    })
    const publication = useQuery(GET_PUBLICATION, {
        variables: {
            id: portal.post_id
        }
    })

    return (
        <YStack rowGap={10} backgroundColor={'$portalBackground'} pb={10} >
            <LinkResolver
                kid={portal.post_id}
                link={portal.url}
                publication_ref={publication?.data?.publication?.publication_ref ?? ''}

            />
            <YStack px={10} borderBottomStartRadius={10} borderBottomEndRadius={10} >
                <XStack w="100%" alignItems='center' columnGap={10} >
                    <Avatar size={'$2'} circular >
                        <Avatar.Image
                            src={Utils.parseAvatarImage(profile?.data?.account?.address!, profile?.data?.account?.profile?.pfp)}
                        />
                        <AvatarFallback>
                            <Text>
                                {profile?.data?.account?.profile?.display_name?.slice(0, 1)}
                            </Text>
                        </AvatarFallback>
                    </Avatar>
                    <Text>
                        Published by <MemoedMention
                            username={`@${profile?.data?.account?.username?.username}` ?? ''}
                            mentions={{
                                [profile?.data?.account?.username?.username ?? '']: profile?.data?.account?.address!
                            }}
                        />
                    </Text>
                </XStack>
            </YStack>

        </YStack>
    )
}

export default PortalCard