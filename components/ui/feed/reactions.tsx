import { View, Text, useTheme, Button, Spinner } from 'tamagui'
import React, { memo, useTransition } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Heart, MessageSquare, MessageSquarePlus, Repeat } from '@tamagui/lucide-icons'
import { PublicationStats } from '../../../__generated__/graphql'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE, GET_PUBLICATION_INTERACTIONS_BY_VIEWER, GET_PUBLICATION_STATS } from '../../../utils/queries'
import client from '../../../data/apollo'
import delegateManager from '../../../lib/delegate-manager'
import publications from '../../../contract/modules/publications'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import useDisclosure from '../../hooks/useDisclosure'
import PublicationEditor from '../editor/publication-editor'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
    initialStats?: PublicationStats,
    publication_ref?: string
    showNumbers?: boolean
}

const PublicationReactions = (props: Props) => {
    const insets = useSafeAreaInsets()
    const { initialStats, publication_ref, showNumbers = true } = props
    const [currentPublicationType, setCurrentPublicationType] = React.useState<1 | 2 | 3 | 4>(3)
    const [repostLoading, setRepostLoading] = React.useState(false)
    const [quoteLoading, setQuoteLoading] = React.useState(false)
    const theme = useTheme()
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const { isOpen: repostOpen, onOpen: openRepost, onClose: closeRepost, onToggle: onToggleRepost } = useDisclosure()
    const [isQuoting, setIsQuoting] = React.useState(false)
    const [_, transition] = useTransition()
    const publicationStatsQuery = useQuery(GET_PUBLICATION_STATS, {
        variables: {
            publication_ref: publication_ref!
        },
        skip: !publication_ref,
        fetchPolicy: 'cache-and-network'
    })

    const userInteractions = useQuery(GET_PUBLICATION_INTERACTIONS_BY_VIEWER, {
        variables: {
            address: delegateManager.owner!,
            ref: publication_ref!
        },
        skip: !publication_ref || !delegateManager.owner,
        fetchPolicy: 'cache-and-network'
    })

    const handleReact = async () => {
        const currentState = userInteractions.data?.publicationInteractionsByViewer?.reacted
        try {
            if (currentState) {
                await publications.removeReactionWithRef(publication_ref!)
                return
            }
            await publications.createReactionWithRef(1, publication_ref!)
            console.log("Reacted")
        }
        catch (e) {
            console.log("Something went wrong", e)
        }
    }

    const handleRepost = async () => {
        closeRepost()
        const currentState = userInteractions.data?.publicationInteractionsByViewer
        setRepostLoading(true)
        try {
            const ref = currentState?.repost_refs?.at(0) // THERE SHOULD ALWAYS BE ONLY ONE REPOST
            if (currentState && ref) {
                await publications.removePublicationWithRef(ref, 4, publication_ref!)
                console.log("Removed repost")
                setRepostLoading(false)
                return
            }
            await publications.createPublicationWithRef(null, 4, publication_ref!)
            console.log("Reposted")
        }
        catch (e) {
            console.log("Something went wrong", e)
        }
        finally {
            setRepostLoading(false)
        }
    }

    const handleQuote = () => {
        const currentState = userInteractions.data?.publicationInteractionsByViewer
        if (currentState?.quoted) {
            setQuoteLoading(true)
            try {
                publications.removePublicationWithRef(currentState?.quote_refs?.at(0)!, 2, publication_ref!)

            }
            catch (e) {
                console.log("Something went wrong", e)
            }
            finally {
                closeRepost()
                setQuoteLoading(false)
            }
            return
        }
        closeRepost()
        setCurrentPublicationType(2)
        onOpen()
    }



    return (
        <View flexDirection='row' alignItems='center' w="full" columnGap={50} >
            <TouchableOpacity onPress={() => {
                setCurrentPublicationType(3)
                onOpen()
            }} style={styles.action_container} >
                <MessageSquare size={15} mr={10} color={userInteractions.data?.publicationInteractionsByViewer?.commented ? "$activeReaction" : "$reactionBorderColor"}
                    fill={
                        userInteractions.data?.publicationInteractionsByViewer?.commented ? theme.activeReaction.val : theme.background.val
                    }
                />
                {showNumbers && <Text fontSize={"$sm"}
                    color={
                        userInteractions.data?.publicationInteractionsByViewer?.commented ? '$activeReaction' : '$reactionTextColor'
                    }
                >
                    {
                        publicationStatsQuery.data?.publicationStats?.comments ?? initialStats?.comments ?? 0
                    }
                </Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={openRepost} style={styles.action_container} >
                <Repeat size={15} mr={10} color={(userInteractions.data?.publicationInteractionsByViewer?.reposted
                            || userInteractions.data?.publicationInteractionsByViewer?.quoted
                        )?"$activeReaction":"$reactionBorderColor"}
                    fill={
                        (userInteractions.data?.publicationInteractionsByViewer?.reposted
                            || userInteractions.data?.publicationInteractionsByViewer?.quoted
                        ) ? theme.activeReaction.val : theme.background.val
                    }
                />
                {showNumbers && <Text fontSize={"$sm"}
                    color={
                        (userInteractions.data?.publicationInteractionsByViewer?.reposted
                            || userInteractions.data?.publicationInteractionsByViewer?.quoted
                        ) ? '$activeReaction' : '$reactionTextColor'
                    }
                >
                    {
                        (publicationStatsQuery.data?.publicationStats?.reposts ?? initialStats?.reposts ?? 0) +
                        (publicationStatsQuery.data?.publicationStats?.quotes ?? initialStats?.quotes ?? 0)
                    }
                </Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReact} style={styles.action_container} >
                <Heart size={15} mr={10} color={userInteractions.data?.publicationInteractionsByViewer?.reacted ? "$activeReaction" : "$reactionBorderColor"} borderStyle='dotted'
                    fill={
                        userInteractions.data?.publicationInteractionsByViewer?.reacted ? theme.activeReaction.val : theme.background.val
                    }

                />
                {showNumbers && <Text fontSize={"$sm"}
                    color={
                        userInteractions.data?.publicationInteractionsByViewer?.reacted ? '$activeReaction' : '$reactionTextColor'
                    }
                >
                    {
                        publicationStatsQuery.data?.publicationStats?.reactions ?? initialStats?.reactions ?? 0
                    }
                </Text>}
            </TouchableOpacity>

            {/* Comment Sheet */}
            {isOpen && <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[100]}
            >
                <View
                    flex={1}
                    h="100%"
                    pt={insets.top}
                    pb={insets.bottom}
                >
                    <PublicationEditor
                        parentPublicationRef={publication_ref!}
                        publicationType={
                            currentPublicationType
                        }
                        onClose={onClose}
                    />
                </View>
            </BaseContentSheet>}
            {
                repostOpen && <BaseContentSheet
                    snapPoints={[20]}
                    open={repostOpen}
                    onOpenChange={onToggleRepost}
                    showOverlay={false}
                    animation='medium'
                >
                    <View
                        py={5}
                        px={5}
                        rowGap={10}
                    >
                        <Button
                            variant='outlined'
                            icon={<Repeat />}
                            onPress={handleRepost}
                        >
                            {
                                repostLoading ? <Spinner /> :
                                    <Text>
                                        {
                                            userInteractions.data?.publicationInteractionsByViewer?.reposted ? "Remove Repost" : "Repost"
                                        }
                                    </Text>
                            }
                        </Button>
                        <Button
                            variant='outlined'
                            icon={<MessageSquarePlus />}
                            onPress={handleQuote}
                        >
                            {
                                quoteLoading ? <Spinner /> :
                                    <Text>

                                        {
                                            userInteractions.data?.publicationInteractionsByViewer?.quoted ? "Remove Quote" : "Quote"
                                        }
                                    </Text>
                            }
                        </Button>
                    </View>
                </BaseContentSheet>
            }
        </View>
    )
}

export default memo(PublicationReactions)

const styles = StyleSheet.create({
    action_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})