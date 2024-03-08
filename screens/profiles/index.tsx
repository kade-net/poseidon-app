import { View, Text, Spinner, XStack, Avatar, YStack, Button, H3, H4, H5, H6, useTheme } from 'tamagui'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ACCOUNT_VIEWER_STATS, GET_MY_PROFILE } from '../../utils/queries'
import delegateManager from '../../lib/delegate-manager'
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view'
import { Animated, Platform, TouchableOpacity, useWindowDimensions } from 'react-native'
import { clone } from 'lodash'
import { SceneProps } from './tabs/common'
import PostsTab from './tabs/posts'
import RepostsTab from './tabs/reposts'
import LikesTab from './tabs/likes'
import NftsTab from './tabs/nfts'
import { useMultiScrollManager } from '../../components/hooks/useMultiScrollManager'
import TabNavbar from './tab-navbar'

interface Props {
    address: string
}

const ProfileDetails = (props: Props) => {
    const { address } = props
    const theme = useTheme()
    const layout = useWindowDimensions()
    const [topSectionHeight, setTopSectionHeight] = useState(0)
    const TabOffset = useMemo(() => {
        return Platform.OS === 'ios' ? topSectionHeight : 0
    }, [topSectionHeight])
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const [tabRoutes] = useState([
        { key: 'posts', title: 'Posts' },
        { key: 'reposts', title: 'Reposts + Replies' },
        { key: 'likes', title: 'Likes' },
        { key: 'nfts', title: 'NFTs' },
    ])


    const scrollManager = useMultiScrollManager(tabRoutes, topSectionHeight)

    const handleCurrentTabIndexChange = (index: number) => {
        setCurrentTabIndex(index)
        scrollManager.setIndex(index)
    }

    const translateY = scrollManager.scrollY.interpolate({
        inputRange: [TabOffset, TabOffset + topSectionHeight],
        outputRange: [0, -topSectionHeight],
        extrapolateLeft: 'clamp'
    })




    const renderScene = useCallback((props: SceneProps) => {
        const { route } = props
        switch (route.key) {
            case 'posts':
                return <PostsTab topSectionHeight={topSectionHeight} manager={scrollManager} {...props} />
            case 'reposts':
                return <RepostsTab topSectionHeight={topSectionHeight} manager={scrollManager} {...props} />
            case 'likes':
                return <LikesTab topSectionHeight={topSectionHeight} manager={scrollManager} {...props} />
            case 'nfts':
                return <NftsTab topSectionHeight={topSectionHeight} manager={scrollManager} {...props} />
            default:
                return <></>
        }
    }, [currentTabIndex, scrollManager.scrollY, topSectionHeight])

    const renderTabBar = useCallback((props: SceneRendererProps & {
        navigationState: NavigationState<{
            key: string;
            title: string;
        }>;
    }) => {
        return <TabNavbar
            {...props}
            scrollManager={scrollManager}
            topSectionHeight={topSectionHeight}
            tabRoutes={tabRoutes}
            currentTabIndex={currentTabIndex}
        />
    }, [, topSectionHeight, scrollManager])

    const IS_SAME_ACCOUNT = delegateManager.owner === address
    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: address
        },
        skip: !address
    })


    const accountViewerStats = useQuery(GET_ACCOUNT_VIEWER_STATS, {
        variables: {
            accountAddress: address,
            viewerAddress: delegateManager.owner! // SAFE TO ASSUME
        },
        skip: !address || IS_SAME_ACCOUNT
    })





    if (profileQuery.loading) {
        return (
            <View
                flex={1}
                w="100%"
                h="100%"
            >
                <Spinner />
            </View>

        )
    }
    return (
        <View
            flex={1}
            w="100%"
            h="100%"
            pos="relative"
        >
            <Animated.View style={{
                width: '100%',
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                elevation: 4,
                transform: [
                    {
                        translateY
                    }
                ],
                backgroundColor: 'black'
            }} onLayout={(event) => {
                const layout = clone(event?.nativeEvent?.layout)
                setTopSectionHeight((layout?.height ?? 0)) // Add the tabbar height as well
            }} >
                <YStack
                    px={10}
                >
                    <XStack w="100%" py={10} columnGap={10} >
                        <Avatar circular size={50} >
                            <Avatar.Image source={{ uri: profileQuery.data?.account?.profile?.pfp ?? undefined }} />
                            <Avatar.Fallback
                                bg="lightgray"
                            />
                        </Avatar>
                        <YStack>
                            <Text fontWeight="bold" >
                                {
                                    profileQuery.data?.account?.profile?.display_name
                                }
                            </Text>
                            <Text color="gray" >
                                @{
                                    profileQuery.data?.account?.username?.username
                                }
                            </Text>
                        </YStack>
                    </XStack>
                    <XStack>
                        <Text>
                            {
                                profileQuery.data?.account?.profile?.bio
                            }
                        </Text>
                    </XStack>
                </YStack>
                <XStack px={10} w="100%" alignItems='center' columnGap={5} py={10} >
                    <XStack columnGap={5} >
                        <Text fontWeight={"bold"} >
                            {
                                profileQuery.data?.account?.stats?.following
                            }
                        </Text>
                        <Text color="gray" >
                            Following
                        </Text>
                    </XStack>
                    <XStack columnGap={5} >
                        <Text fontWeight={"bold"} >
                            {
                                profileQuery.data?.account?.stats?.followers
                            }
                        </Text>
                        <Text color="gray" >
                            Followers
                        </Text>
                    </XStack>
                </XStack>
                {!IS_SAME_ACCOUNT && <XStack px={10} w="100%" alignItems='center' columnGap={5} py={10} >
                    <Button w="100%" variant={
                        accountViewerStats?.data?.accountViewerStats?.followed ? "outlined" : undefined
                    } >
                        {
                            accountViewerStats?.data?.accountViewerStats?.followed ? "Following" : "Follow"
                        }
                    </Button>
                </XStack>}
            </Animated.View>

            <YStack flex={1} w="100%" h="100%" >
                <TabView
                    navigationState={{
                        index: currentTabIndex,
                        routes: tabRoutes
                    }}
                    onIndexChange={handleCurrentTabIndexChange}
                    renderScene={renderScene}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                />
            </YStack>
        </View>
    )
}

export default memo(ProfileDetails)