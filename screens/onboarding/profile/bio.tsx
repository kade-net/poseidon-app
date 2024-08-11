import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SceneRendererProps } from 'react-native-tab-view'
import { useProfileForm } from './contex'
import { H4, Input, XStack, YStack } from 'tamagui'
import { Controller } from 'react-hook-form'
import BaseButton from '../../../components/ui/buttons/base-button'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { TPROFILE } from '../../../schema'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import account from '../../../contract/modules/account'
import * as Burnt from 'burnt'

interface Props {
    scene: SceneRendererProps
}

const Bio = (props: Props) => {
    const { scene } = props
    const { form } = useProfileForm()
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)

    const goToNext = () => {
        router.replace('/onboard/interests/topics')
    }

    const handleSubmit = async (values: TPROFILE) => {
        Haptics.selectionAsync()
        setSubmitting(true)


        try {
            await account.updateProfile({
                display_name: values.display_name,
                bio: values.bio,
                pfp: values.pfp
            })


        }
        catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

            Burnt.toast({
                title: 'Uh oh',
                message: `Something weent wrong, let's skip this for now`,
                preset: 'error',

            })
            console.log(`SOMETHING WENT WRONG:: ${e}`)
        }
        finally {
            goToNext()
            setSubmitting(false)
        }
    }

    const handleError = async () => {
        Burnt.toast({
            title: 'Uh oh',
            message: `Something went wrong, let's skip this for now`,
            preset: 'error'
        })
    }

    return (
        <KeyboardAvoidingView
            style={{
                width: '100%',
                height: '100%',
                flex: 1
            }}
            behavior={Platform.select({
                ios: 'padding',
                android: 'height'
            })}
            keyboardVerticalOffset={Platform.select({
                ios: 70,
                android: 0
            })}
            contentContainerStyle={{
                padding: 20
            }}
        >
            <TouchableOpacity onPress={() => {
                scene.jumpTo('image')
            }} style={{ width: '100%', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 20 }} >
                <ArrowLeft />
            </TouchableOpacity>
            <YStack flex={1} w="100%" h="100%" alignItems='center' justifyContent='center' rowGap={20} px={20} >
                <YStack w="100%" alignItems='center' >
                    <H4>
                        Let's set up your profile.
                    </H4>
                    <H4>
                        What's a good bio?
                    </H4>
                </YStack>
                <Controller
                    control={form.control}
                    name="bio"
                    render={({ field }) => {
                        return (
                            <Input
                                autoFocus
                                multiline
                                w="100%"
                                autoCapitalize='none'
                                placeholder='Bio'
                                onChangeText={field.onChange}
                                value={field.value}
                                maxLength={80}
                                borderRadius={100}
                                textAlign='center'
                                backgroundColor={'$colorTransparent'}
                                borderColor={'$border'}
                            />
                        )
                    }}
                />
            </YStack>
            <XStack p={20} w="100%" alignItems='center' >
                <BaseButton loading={submitting} onPress={() => {
                    form.handleSubmit(handleSubmit, handleError)()
                }} w="100%" borderRadius={100} >
                    <Text>
                        Continue
                    </Text>
                </BaseButton>
            </XStack>
        </KeyboardAvoidingView>
    )
}

export default Bio