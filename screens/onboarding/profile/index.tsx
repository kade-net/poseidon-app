import { YStack } from 'tamagui'
import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler, NativeEventSubscription, TouchableOpacity } from 'react-native'
import { SceneRendererProps, TabView } from 'react-native-tab-view'
import DisplayName from './display-name'
import ProfileImage from './image'
import Bio from './bio'
import { ProfileProvider } from './contex'
import * as Burnt from 'burnt'

const Profile = () => {
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const [profileOnboardingSteps] = useState([
        {
            key: 'displayname',
            title: 'Display Name'
        },
        {
            key: 'image',
            title: 'image'
        },
        {
            key: 'bio',
            title: 'bio'
        }
    ])

    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            Burnt.toast({
                title: 'Please complete setup',
                message: 'Please complete your profile setup',
                preset: 'error'
            })

            return true
        })

        return () => {
            subscription.remove()
        }

    }, [])

    const renderScene = useCallback((props: SceneRendererProps & { route: { key: string, title: string } }) => {
        const { route, ...rest } = props

        switch (route.key) {
            case 'displayname': {
                return <DisplayName scene={rest} />
            };
            case 'image': {
                return <ProfileImage scene={rest} />
            };
            case 'bio': {
                return <Bio scene={rest} />
            };
            default: {
                return <></>
            }
        }

    }, [currentTabIndex])

    return (
        <ProfileProvider>
            <YStack flex={1} w="100%" h="100%" backgroundColor={'$background'} >
                <TabView
                    swipeEnabled={false}
                    navigationState={{
                        index: currentTabIndex,
                        routes: profileOnboardingSteps
                    }}
                    style={[
                        {
                            flex: 1,
                            width: '100%',
                            height: '100%'
                        }
                    ]}
                    sceneContainerStyle={{
                        width: '100%',
                        height: '100%',
                        flex: 1
                    }}
                    onIndexChange={setCurrentTabIndex}
                    renderScene={renderScene}
                    renderTabBar={() => null}
                />
            </YStack>
        </ProfileProvider>
    )
}

export default Profile