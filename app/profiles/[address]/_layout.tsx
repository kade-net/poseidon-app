import { View, Text, Separator, Button, Heading, H4, Spinner, useTheme, YStack, XStack } from 'tamagui'
import React from 'react'
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import { TouchableOpacity, useColorScheme } from 'react-native'
import { ArrowLeft, Edit3, MoreVertical } from '@tamagui/lucide-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import BaseContentSheet from '../../../components/ui/action-sheets/base-content-sheet'
import useDisclosure from '../../../components/hooks/useDisclosure'
import delegateManager from '../../../lib/delegate-manager'
import { Utils } from '../../../utils'
import TopBarWithBack from '../../../components/ui/navigation/top-bar-with-back'

const _layout = () => {
    const params = useGlobalSearchParams()
    const colorScheme = useColorScheme()
    const tamaguiTheme = useTheme()

    const userAddress = params['address'] as string ?? null
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    const profileQuery = useQuery(GET_MY_PROFILE, {
        variables: {
            address: userAddress
        },
        skip: !userAddress
    })
    const router = useRouter()
    const goBack = () => {
        router.back()
    }

    const goToEditProfile = () => {
        onClose()
        router.navigate({
            pathname: '/profiles/[address]/edit',
            params: {
                address: userAddress
            }
        })
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: tamaguiTheme.background.val,
            }}
        >
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        header(props) {
                            if (profileQuery.loading) return null
                            return (
                                <View bg="$background" w="100%" >
                                    <View flexDirection='row' w="100%" alignItems='center' justifyContent='space-between' py={5} px={10} >
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                columnGap: 10,
                                                alignItems: 'center'
                                            }}
                                            onPress={goBack}
                                        >
                                            <ArrowLeft />
                                            {profileQuery.data?.account?.username?.username && <H4 textTransform='none' >
                                                @{
                                                    profileQuery.data?.account?.username?.username
                                                }
                                            </H4>}
                                        </TouchableOpacity>
                                        <View>
                                            <Button onPress={onOpen} variant='outlined' icon={<MoreVertical />} />
                                        </View>
                                    </View>
                                    <Separator />
                                </View>
                            )
                        }
                    }}
                />
                <Stack.Screen
                    name="edit"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="[collection]"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="followers"
                    options={{
                        header(props) {
                            return <TopBarWithBack
                                navigation={props.navigation}
                                title='Followers'
                            />
                        }
                    }}
                />
                <Stack.Screen
                    name="following"
                    options={{
                        header(props) {
                            return <TopBarWithBack
                                navigation={props.navigation}
                                title='Following'
                            />
                        }
                    }}
                />
            </Stack>
            <BaseContentSheet
                open={isOpen}
                onOpenChange={onToggle}
                snapPoints={[20]}
                showOverlay
            >
                <YStack w="100%" py={Utils.dynamicHeight(3)} rowGap={10} alignItems='flex-start' >
                    {userAddress == delegateManager.owner && <Button fontSize={"$md"} fontWeight={"$2"} onPress={goToEditProfile} variant='outlined' icon={<Edit3 />} >
                        Edit Profile
                    </Button>}
                </YStack>
            </BaseContentSheet>
        </SafeAreaView>
    )
}

export default _layout