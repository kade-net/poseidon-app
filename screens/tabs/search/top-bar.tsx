import { View, Text, XStack, YStack, Avatar, Input } from 'tamagui'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SceneRendererProps } from 'react-native-tab-view'
import { Animated, TouchableOpacity } from 'react-native'
import { clone } from 'lodash'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import { Utils } from '../../../utils'
import { Link } from 'expo-router'
import { Search } from '@tamagui/lucide-icons'
import SearchInput from '../../../components/ui/search-input'
import searchContext from './context'

interface Props {
    routes: Array<{ key: string, title: string }>
    currentIndex: number

}

type P = Props & SceneRendererProps

const SearchTopBar = (props: P) => {
    const { search, setSearch } = useContext(searchContext)

    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: delegateManager.owner!
        }
    })

    const { currentIndex, routes } = props
    const [tabLayoutDetails, setTabLayoutDetails] = useState({} as { [key: string]: { width: number, x: number } })

    const TAB_SLIDER_X = useRef(new Animated.Value(0)).current

    const handleAnimate = (key: string) => {
        Animated.timing(TAB_SLIDER_X, {
            toValue: tabLayoutDetails[key]?.x,
            duration: 200,
            useNativeDriver: true
        }).start()
    }


    return (
        <YStack
            w="100%"
            rowGap={10}
        >

            <XStack w="100%" alignItems='center' justifyContent='flex-start' columnGap={10} px={20} pt={20} >

                <Link asChild href={{
                    pathname: '/profiles/[address]/',
                    params: {
                        address: delegateManager.owner!
                    }
                }} >

                    <TouchableOpacity
                    >
                        <Avatar circular size={"$2"} >
                            <Avatar.Image
                                accessibilityLabel='Profile Picture'
                                src={profileQuery?.data?.account?.profile?.pfp as string ?? Utils.diceImage(delegateManager.owner!)}
                            />
                            <Avatar.Fallback
                                backgroundColor={'$pink10'}
                            />
                        </Avatar>
                    </TouchableOpacity>
                </Link>
                <SearchInput value={search} onChangeText={setSearch} onBlur={() => {
                    setSearch('')
                }} />

            </XStack>

            <XStack w="100%" justifyContent='space-between' position='relative' >
                {
                    routes?.map((router, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={{ flex: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    props.jumpTo(router.key)
                                    handleAnimate(router.key)
                                }}
                                onLayout={(event) => {
                                    const layout = clone(event?.nativeEvent?.layout)
                                    setTabLayoutDetails((prev) => {
                                        return {
                                            ...prev,
                                            [router.key]: {
                                                width: layout?.width ?? 0,
                                                x: layout?.x ?? 0
                                            }
                                        }
                                    })

                                }}
                            >
                                <Text color={"$sideText"} fontWeight={"$5"} fontSize={"$xs"} numberOfLines={1} >
                                    {router.title}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                }
                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        height: 2,
                        backgroundColor: "white",
                        width: tabLayoutDetails[routes[currentIndex].key]?.width,
                        left: 0,
                        transform: [
                            {
                                translateX: TAB_SLIDER_X
                            }
                        ]
                    }}
                />
            </XStack>
        </YStack>
    )
}

export default SearchTopBar