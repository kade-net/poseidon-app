import { View, Text, Avatar, Heading, ButtonIcon, useTheme, Separator, Sheet, Button, TextArea, ScrollView, Spinner, XStack } from 'tamagui'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ImagePlus, MessageCirclePlus, Settings } from '@tamagui/lucide-icons'
import { Animated, BackHandler, FlatList, KeyboardAvoidingView, ListRenderItem, Platform, TouchableOpacity } from 'react-native'
import { feed } from './data'
import BaseContentContainer from '../../../../components/ui/feed/base-content-container'
import { useFocusEffect, useRouter } from 'expo-router'
const IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
import * as ImagePicker from 'expo-image-picker'
import FeedImage from '../../../../components/ui/feed/image'
import { useQuery } from '@apollo/client'
import { GET_PUBLICATIONS, GET_MY_PROFILE } from '../../../../utils/queries'
import delegateManager from '../../../../lib/delegate-manager'
import CreatePublicationSheet from './create-publication-sheet'
import client from '../../../../data/apollo'
import { Publication } from '../../../../__generated__/graphql'
import BaseContentSheet from '../../../../components/ui/action-sheets/base-content-sheet'
import useDisclosure from '../../../../components/hooks/useDisclosure'
import PublicationEditor from '../../../../components/ui/editor/publication-editor'
import useSingleScrollManager from '../../../../components/hooks/useSingleScrollManager'
import { useColorScheme } from 'react-native'
import account from '../../../../contract/modules/account'
import publications from '../../../../contract/modules/publications'
import { isEmpty, set, uniqBy } from 'lodash'
import { getMutedUsers, getRemovedFromFeed } from '../../../../contract/modules/store-getters'
import { Utils } from '../../../../utils'
import Empty from '../../../../components/ui/feedback/empty'
import Loading from '../../../../components/ui/feedback/loading'
import * as Haptics from 'expo-haptics'
import { useScrollToTop } from '@react-navigation/native'
import PullDownButton from './pull-down-button'
import posti from '../../../../lib/posti'

const Home = () => {
    const flatlistRef = useRef<FlatList>(null)
    const [refetching, setRefetching] = useState(false)

    useScrollToTop(flatlistRef)

    const publicationsQuery = useQuery(GET_PUBLICATIONS, {
        variables: {
            page: 0,
            size: 20,
            types: [1, 2], // TODO: only show reposts if the user is following the original creator
            muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
            hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications
        },
        fetchPolicy: 'cache-and-network'
    })

    const tamaguiTheme = useTheme()

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {

                return true
            }

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

            return () => {
                subscription.remove()
            }
        }, [])
    )


    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        },
        skip: !delegateManager.owner
    })

    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()

    const theme = useTheme()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const { scrollY } = useSingleScrollManager()
    const diffClamp = Animated.diffClamp(scrollY, 0, 150)
    const translateY = diffClamp.interpolate({
        inputRange: [0, 150],
        outputRange: [0, -70]
    })

    const goToSettings = () => {
        router.push('/settings/')
    }

    const goToProfile = () => {
        router.push(`/profiles/${delegateManager.owner}` as any)
    }

    const handleFetchMore = async () => {
        if (publicationsQuery.error) {
            console.log("Error fetching more", publicationsQuery.error?.message)
            posti.capture('home fetching more error', {
                error: publicationsQuery.error,

            })
            return
        }
        if (publicationsQuery.loading || refetching || (publicationsQuery.data?.publications?.length ?? 0) < 20) {
            return
        }
        setRefetching(true)
        try {
            const totalPublications = publicationsQuery?.data?.publications?.length ?? 0 
            const nextPage = (Math.floor(totalPublications / 20) - 1) + 1

            await publicationsQuery?.fetchMore({
                variables: {
                    page: nextPage,
                    size: 20,
                    types: [1, 2],
                    muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
                    hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications
                }
            })
        }
        catch (e) {
            console.log("Error fetching more", e)
        }
        finally {
            setRefetching(false)
        }
    }

    const handleFetchTop = async () => {
        if (refetching || publicationsQuery.loading) {
            return
        }
        Haptics.selectionAsync()
        await publications.loadRemovedFromFeed()
        setRefetching(true)
        try {
            await publicationsQuery.fetchMore({
                variables: {
                    page: 0,
                    size: 20,
                    types: [1, 2],
                    muted: isEmpty(account.mutedUsers) ? undefined : account.mutedUsers,
                    hide: isEmpty(publications.hiddenPublications) ? undefined : publications.hiddenPublications
                },
            })
        }
        catch (e) {
            console.log("Error fetching more", e)
        }
        finally {
            setRefetching(false)
        }
    }

    const renderPublication = useCallback(({ item }: any) => {
        return (
            <BaseContentContainer
                data={item as any}
            />
        )

    }, [])

    return (
        <View flex={1} width={"100%"} height={"100%"} >
            <Animated.View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 80,
                backgroundColor: tamaguiTheme.background.val,
                transform: [{ translateY }],
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                elevation: 4,
                width: '100%',
                paddingHorizontal: 12,
                // borderBottomWidth: 2,
                // borderBottomColor: theme.gray1.val,
            }} >
                <TouchableOpacity onPress={goToProfile} >
                    <Avatar circular size={"$4"} >
                        <Avatar.Image
                            accessibilityLabel='Profile Picture'
                            src={
                                Utils.parseAvatarImage(
                                    delegateManager.owner!,
                                    profileQuery?.data?.account?.profile?.pfp as string
                                )
                            }
                        />
                        <Avatar.Fallback
                            backgroundColor={'$pink10'}
                        />
                    </Avatar>
                </TouchableOpacity>
                <Heading fontFamily={"$heading"} fontWeight={"$4"} >
                    Home
                </Heading>
                <TouchableOpacity onPress={goToSettings} >
                    <Settings />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{
                flex: 1,
                position: "relative",
                height: "100%",

            }} >
                <Animated.FlatList
                    ref={flatlistRef}
                    style={
                        [
                            {
                                backgroundColor: tamaguiTheme.background.val
                            }
                        ]
                    }
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    refreshing={false}
                    contentContainerStyle={Platform.select({
                        ios: {
                            flexGrow: 1,
                            paddingBottom: 40
                        },
                        android: {
                            flexGrow: 1,
                            paddingBottom: 40,
                            paddingTop: 80
                        },

                    })}
                    contentOffset={Platform.select({
                        ios: {
                            y: -80,
                            x: 0
                        }
                    })}
                    contentInset={Platform.select({
                        ios: {
                            top: 80
                        }
                    })}
                    onRefresh={handleFetchTop}
                    onEndReached={handleFetchMore}
                    onEndReachedThreshold={1}
                    showsVerticalScrollIndicator={false}
                    data={publicationsQuery?.data?.publications ?? []}
                    maxToRenderPerBatch={20}
                    initialNumToRender={20}
                    keyExtractor={(item, i) => item.publication_ref ?? item?.id?.toString() ?? i.toString()}
                    renderItem={renderPublication}
                    ListHeaderComponent={() => {
                        if ((publicationsQuery?.data?.publications?.length ?? 0) === 0) return null
                        return <XStack w="100%" alignItems='center' justifyContent='center' pl={56} pr={36} >
                            {refetching && <Spinner />}
                            {!refetching && <PullDownButton />}
                        </XStack>
                    }}
                    ListFooterComponent={() => {
                        if (publicationsQuery?.data?.publications?.length === 0) return null
                        if (!refetching) return null
                        return <View w="100%" flexDirection='row' alignItems='center' p={20} justifyContent='center' columnGap={10} >

                            <Spinner />
                                <Text color="$gray9" >
                                    Loading...
                                </Text>

                        </View>
                    }}
                    ListEmptyComponent={() => {
                        if (!publicationsQuery.loading) return <Empty
                            px={20}
                            rowGap={20}
                            emptyText='No new publications!'
                            onRefetch={handleFetchTop}
                        />
                        return <Loading />
                    }}

                />
                <View
                    position='absolute'
                    bottom={20}
                    right={20}
                    zIndex={2}
                >
                    {!isOpen && <TouchableOpacity
                        onPress={onOpen}
                    >
                        <View
                            p={10}
                            borderRadius={100}
                            backgroundColor={"$button"}
                            alignItems='center'
                            justifyContent='center'

                        >
                            <MessageCirclePlus color={"$buttonText"} borderColor={'$buttonText'}/>
                        </View>
                    </TouchableOpacity>}
                </View>
            </Animated.View>
            <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[100]}
            >
                <View
                    flex={1}
                    h="100%"
                    pt={insets.top}
                    pb={insets.bottom}
                    backgroundColor={'$background'}
                >
                    <PublicationEditor
                        publicationType={1}
                        onClose={onClose}
                    />
                </View>
            </BaseContentSheet>
        </View>

    )
}

export default Home