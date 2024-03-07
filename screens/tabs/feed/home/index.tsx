import { View, Text, Avatar, Heading, ButtonIcon, useTheme, Separator, Sheet, Button, TextArea, ScrollView, Spinner } from 'tamagui'
import React, { useCallback, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ImagePlus, MessageCirclePlus, Settings } from '@tamagui/lucide-icons'
import { Animated, FlatList, KeyboardAvoidingView, ListRenderItem, TouchableOpacity } from 'react-native'
import { feed } from './data'
import BaseContentContainer from '../../../../components/ui/feed/base-content-container'
import { useRouter } from 'expo-router'
const IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
import * as ImagePicker from 'expo-image-picker'
import FeedImage from '../../../../components/ui/feed/image'
import { useQuery } from '@apollo/client'
import { GET_HOME_FEED, GET_MY_PROFILE } from '../../../../utils/queries'
import delegateManager from '../../../../lib/delegate-manager'
import CreatePublicationSheet from './create-publication-sheet'
import client from '../../../../data/apollo'
import { Publication } from '../../../../__generated__/graphql'
import BaseContentSheet from '../../../../components/ui/action-sheets/base-content-sheet'
import useDisclosure from '../../../../components/hooks/useDisclosure'
import PublicationEditor from '../../../../components/ui/editor/publication-editor'


const Home = () => {
    const [currentPage, setCurrentPage] = useState(0)
    const { data, fetchMore, loading } = useQuery(GET_HOME_FEED, {
        variables: {
            page: 0,
            size: 20,
            type: 1
        },
        fetchPolicy: 'cache-and-network'
    })

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
    const scrollY = new Animated.Value(0)
    const diffClamp = Animated.diffClamp(scrollY, 0, 150)
    const translateY = diffClamp.interpolate({
        inputRange: [0, 150],
        outputRange: [0, -70]
    })

    const goToSettings = () => {
        router.push('/settings/')
    }

    const goToProfile = () => {
        router.push('/profiles/1/' as any) // TODO: update with a dynamic userid
    }

    const handleFetchMore = async () => {
        try {
            const totalPublications = data?.publications?.length ?? 0
            const nextPage = Math.floor(totalPublications / 20) + 1
            console.log("Next page", nextPage)
            const results = await fetchMore({
                variables: {
                    page: nextPage,
                    size: 20
                }
            })


            setCurrentPage((prev) => nextPage)
        }
        catch (e) {
            console.log("Error fetching more", e)
        }
    }

    const handleFetchTop = async () => {
        console.log("Start reached")
        try {
            await fetchMore({
                variables: {
                    page: 0,
                    size: 20
                }
            })
            setCurrentPage(0)
        }
        catch (e) {
            console.log("Error fetching more", e)
        }
    }

    const handleRefetchOnPost = async () => {
        await handleFetchTop()
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
                backgroundColor: 'black',
                transform: [{ translateY }],
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                elevation: 4,
                width: '100%',
                paddingHorizontal: 20,
                borderBottomWidth: 2,
                borderBottomColor: theme.gray1.val
            }} >
                <TouchableOpacity onPress={goToProfile} >
                    <Avatar circular  >
                        <Avatar.Image
                            accessibilityLabel='Profile Picture'
                            src={profileQuery?.data?.account?.profile?.pfp as string}
                        />
                        <Avatar.Fallback
                            backgroundColor={'$pink10'}
                        />
                    </Avatar>
                </TouchableOpacity>
                <Heading size="$6" >
                    Home
                </Heading>
                <TouchableOpacity onPress={goToSettings} >
                    <Settings />
                </TouchableOpacity>
            </Animated.View>
            <View flex={1} position='relative' >
                <FlatList
                    contentContainerStyle={{
                        paddingTop: loading ? 0 : 80
                    }}
                    onScroll={(e) => {
                        scrollY.setValue(e.nativeEvent.contentOffset.y)
                    }}
                    refreshing={loading}

                    onRefresh={handleFetchTop}
                    onEndReached={handleFetchMore}
                    onEndReachedThreshold={1}
                    showsVerticalScrollIndicator={false}
                    data={data?.publications ?? []}
                    maxToRenderPerBatch={20}
                    initialNumToRender={20}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPublication}
                    ListFooterComponent={() => {
                        return <View w="100%" flexDirection='row' alignItems='center' justifyContent='center' columnGap={10} >
                            {loading && <>
                                <Text color="$gray9" >
                                    Loading...
                                </Text>
                                <Spinner />
                            </>}
                        </View>
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
                            backgroundColor={"$blue11"}
                            alignItems='center'
                            justifyContent='center'

                        >
                            <MessageCirclePlus />
                        </View>
                    </TouchableOpacity>}
                </View>
            </View>
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