import { View, Text, Avatar, Heading, ButtonIcon, useTheme, Separator, Sheet, Button, TextArea, ScrollView } from 'tamagui'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ImagePlus, MessageCirclePlus, Settings } from '@tamagui/lucide-icons'
import { Animated, FlatList, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
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


const Home = () => {
    const [currentPage, setCurrentPage] = useState(0)
    const { data, fetchMore, loading } = useQuery(GET_HOME_FEED, {
        variables: {
            page: 0,
            size: 20
        }
    })
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        },
        skip: !delegateManager.owner
    })


    const [isEditorOpen, setIsEditorOpen] = useState(false)

    const [images, setImages] = useState<Array<ImagePicker.ImagePickerAsset>>([])

    const theme = useTheme()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const scrollY = new Animated.Value(0)
    const diffClamp = Animated.diffClamp(scrollY, 0, 150)
    const translateY = diffClamp.interpolate({
        inputRange: [0, 82],
        outputRange: [0, -100]
    })

    const goToSettings = () => {
        router.push('/settings/')
    }

    const goToProfile = () => {
        router.push('/profiles/1/' as any) // TODO: update with a dynamic userid
    }

    const handleChooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // TODO: Add support for videos
            allowsEditing: true,
            quality: 1
        })

        if (!result.canceled) {
            const chosen = result.assets ?? []
            setImages((prev) => {
                return [...prev, ...chosen]
            })
        }
    }

    const handleFetchMore = async () => {
        if ((data?.publications?.length ?? 0) < 20) {
            console.log("No more publications")
            return
        }
        try {
            const results = await fetchMore({
                variables: {
                    page: currentPage + 1,
                    size: 20
                }
            })
            const totalPublications = data?.publications?.length ?? 0

            if (totalPublications <= (currentPage + 1) * 20) {
                console.log("No more publications")
                return
            }

            console.log("Fetched more")

            setCurrentPage((prev) => prev + 1)
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
                        paddingTop: 80
                    }}
                    onScroll={(e) => {
                        scrollY.setValue(e.nativeEvent.contentOffset.y)
                    }}
                    onStartReached={handleFetchTop}
                    onStartReachedThreshold={0.5}
                    onEndReached={handleFetchMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    data={data?.publications ?? []}
                    CellRendererComponent={({ children, index }) => {
                        return (
                            <View borderBottomWidth={1} borderColor={'$gray1'} >
                                {children}
                            </View>
                        )
                    }}

                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        return (
                            <BaseContentContainer
                                data={item as any}
                            />
                        )
                    }}
                />
                <View
                    position='absolute'
                    bottom={20}
                    right={20}
                    zIndex={2}
                >
                    {!isEditorOpen && <TouchableOpacity
                        onPress={() => {
                            setIsEditorOpen(true)
                        }}
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
            <CreatePublicationSheet
                onOpenChange={(value) => setIsEditorOpen(value)}
                open={isEditorOpen} 

            />
        </View>

    )
}

export default Home