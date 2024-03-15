import { View, Text, Separator, Button, Heading, H4, Spinner, useTheme } from 'tamagui'
import React from 'react'
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from '../../../utils/queries'
import { TouchableOpacity, useColorScheme } from 'react-native'
import { ArrowLeft, MoreVertical } from '@tamagui/lucide-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const _layout = () => {
    const params = useGlobalSearchParams()
    const colorScheme = useColorScheme()
    const tamaguiTheme = useTheme()

    const userAddress = params['address'] as string ?? null

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
                                            <Button variant='outlined' icon={<MoreVertical />} />
                                        </View>
                                    </View>
                                    <Separator />
                                </View>
                            )
                        }
                    }}
                />
            </Stack>
        </SafeAreaView>
    )
}

export default _layout