import { View, Text, useTheme, Button, Spinner } from 'tamagui'
import React, { memo, useEffect, useMemo, useTransition } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Heart, MessageSquare, MessageSquarePlus, Repeat } from '@tamagui/lucide-icons'
import { Publication, PublicationStats } from '../../../__generated__/graphql'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE, GET_PUBLICATION_INTERACTIONS_BY_VIEWER, GET_PUBLICATION_STATS } from '../../../utils/queries'
import client from '../../../data/apollo'
import delegateManager from '../../../lib/delegate-manager'
import publications from '../../../contract/modules/publications'
import BaseContentSheet from '../action-sheets/base-content-sheet'
import useDisclosure from '../../hooks/useDisclosure'
import PublicationEditor from '../editor/publication-editor'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import BaseButton from '../buttons/base-button'
import { getReactionType } from '../../../contract/modules/hermes/utils'
import { useRouter } from 'expo-router'



interface Props {
    initialStats?: PublicationStats,
    publication_ref?: string
    showNumbers?: boolean
    publication?: Partial<Publication>
}

const PublicationReactions = (props: Props) => {
    const insets = useSafeAreaInsets()
    const { initialStats, publication_ref, showNumbers = true, publication } = props
    const [currentPublicationType, setCurrentPublicationType] = React.useState<1 | 2 | 3 | 4>(3)
    const [repostLoading, setRepostLoading] = React.useState(false)
    const [quoteLoading, setQuoteLoading] = React.useState(false)
    const theme = useTheme()
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const { isOpen: repostOpen, onOpen: openRepost, onClose: closeRepost, onToggle: onToggleRepost } = useDisclosure()
    const [isQuoting, setIsQuoting] = React.useState(false)
    const [_, transition] = useTransition()

    const CUSTOM_REACTION = useMemo(() => {
        if (publication?.content?.content) {
            const reaction = getReactionType(publication?.content?.content as string)
            return reaction
        }
        return null
    }, [publication?.content?.content])

    const router = useRouter()

    // if (publication?.id == 1769) {
    //     const HAS_GM = GM_SEARCH_REGEX.test((publication?.content?.content as string)?.toLowerCase() ?? '')
    //     console.log("Publication", publication)
    //     console.log("HAS GM", HAS_GM)
    // }



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
        fetchPolicy: 'cache-and-network',
        // pollInterval: 120000
    })

    const handleReact = async () => {
        Haptics.selectionAsync()
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
                // closeRepost()
                setQuoteLoading(false)
                closeRepost()
            }
            return
        }
        closeRepost()
        router.push(`/editor?type=2&publicationId=${publication?.id}&ref=${publication_ref}`)
    }


    return (
        <View flexDirection='row' alignItems='center' w="full" columnGap={20} >
            <TouchableOpacity onPress={() => {
                Haptics.selectionAsync()
                router.push(`/editor?type=3&publicationId=${publication?.id}&ref=${publication_ref}`)
            }} style={styles.action_container} >
                <MessageSquare strokeWidth={3} size={15} mr={10} color={userInteractions.data?.publicationInteractionsByViewer?.commented ? "$activeReaction" : "$reactionBorderColor"}
                    fill={
                        userInteractions.data?.publicationInteractionsByViewer?.commented ? theme.activeReaction.val : theme.background.val
                    }
                />
                {showNumbers && <Text fontSize={"$sm"}
                    color={
                        userInteractions.data?.publicationInteractionsByViewer?.commented ? '$activeReaction' : '$reactionTextColor'
                    }
                >
                    {publicationStatsQuery.data?.publicationStats?.comments == 0 ? "" :
                        publicationStatsQuery.data?.publicationStats?.comments ?? initialStats?.comments ?? 0
                    }
                </Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={openRepost} style={styles.action_container} >
                <Repeat strokeWidth={3} size={15} mr={10} color={(userInteractions.data?.publicationInteractionsByViewer?.reposted
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
                    {((publicationStatsQuery.data?.publicationStats?.reposts ?? 0) == 0 && publicationStatsQuery.data?.publicationStats?.quotes == 0) ? "" :
                        (publicationStatsQuery.data?.publicationStats?.reposts ?? initialStats?.reposts ?? 0) +
                        (publicationStatsQuery.data?.publicationStats?.quotes ?? initialStats?.quotes ?? 0)
                    }
                </Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReact} style={styles.action_container} >
                {
                    CUSTOM_REACTION ? <Text
                        fontWeight={'bold'}
                        color={
                            userInteractions.data?.publicationInteractionsByViewer?.reacted ? '$activeReaction' : '$reactionTextColor'
                        }
                    >
                        {CUSTOM_REACTION} {" "}
                    </Text> : 
                        <Heart strokeWidth={3} size={15} mr={10} color={userInteractions.data?.publicationInteractionsByViewer?.reacted ? "$activeReaction" : "$reactionBorderColor"} borderStyle='dotted'
                    fill={
                        userInteractions.data?.publicationInteractionsByViewer?.reacted ? theme.activeReaction.val : theme.background.val
                    }

                />
                }

                {showNumbers && <Text fontSize={"$sm"}
                    color={
                        userInteractions.data?.publicationInteractionsByViewer?.reacted ? '$activeReaction' : '$reactionTextColor'
                    }
                >
                    {(publicationStatsQuery.data?.publicationStats?.reactions ?? 0) == 0 ? "" :
                        publicationStatsQuery.data?.publicationStats?.reactions ?? initialStats?.reactions ?? 0
                    }
                </Text>}
            </TouchableOpacity>

            {/* Comment Sheet */}
            {(isOpen) && <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[100]}
                level={9}
            >
                <View
                    flex={1}
                    h="100%"
                    pt={insets.top}
                    pb={insets.bottom}
                    backgroundColor={"$background"}
                >
                    <PublicationEditor
                        parentPublicationRef={publication_ref!}
                        publicationType={
                            currentPublicationType
                        }
                        onClose={() => {
                            onClose()
                            if (repostOpen) {
                                closeRepost()
                            }
                        }}
                        publication={publication}
                    />
                </View>
            </BaseContentSheet>}
            {
                (repostOpen) && <BaseContentSheet
                    snapPoints={[25]}
                    open={repostOpen}
                    onOpenChange={onToggleRepost}
                    showOverlay={true}
                    dismissOnOverlayPress
                    animation='medium'
                    level={1}
                >
                    <View
                        py={20}
                        px={5}
                        rowGap={10}
                        backgroundColor={'$background'}
                    >
                        <BaseButton icon={<Repeat size={12} />} onPress={handleRepost} type="outlined" loading={repostLoading} >
                            <Text>
                                {
                                    userInteractions.data?.publicationInteractionsByViewer?.reposted ? "Remove Repost" : "Repost"
                                }
                            </Text>
                        </BaseButton>
                        <BaseButton variant='outlined' icon={<MessageSquarePlus size={12} />} onPress={handleQuote} type="outlined" loading={quoteLoading} >
                            <Text>
                                {
                                    userInteractions.data?.publicationInteractionsByViewer?.quoted ? "Remove Quote" : "Quote"
                                }
                            </Text>
                        </BaseButton>
                        <BaseButton
                            onPress={closeRepost}
                        >
                            <Text>
                                Cancel
                            </Text>
                        </BaseButton>
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