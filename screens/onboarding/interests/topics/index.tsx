import { router } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, H3, Heading, Spinner, Text, View, XStack, YStack } from "tamagui"
import UnstyledButton from "../../../../components/ui/buttons/unstyled-button"
import { ChevronRight } from "@tamagui/lucide-icons"
import { Utils } from "../../../../utils"
import topics, { Topic } from "../../../../contract/modules/topics"
import { useQuery as uzQuery } from "react-query"
import { useEffect, useMemo, useState } from "react"
import { BackHandler, FlatList, NativeEventSubscription, Pressable, Touchable, TouchableOpacity } from "react-native"
import Toast from 'react-native-toast-message'
import posti from "../../../../lib/posti"
import BaseButton from "../../../../components/ui/buttons/base-button"
import { useMutation, useQuery } from "@apollo/client"
import { SET_TOPIC } from "../../../../lib/convergence-client/queries"
import { convergenceClient } from "../../../../data/apollo"
import delegateManager from "../../../../lib/delegate-manager"

const TOPICS: Array<Omit<Topic, 'parentTopic'>> = [
    {
        name: 'aptos',
        id: 'aptos'
    },
    {
        name: 'sci-fi',
        id: 'sci-fi'
    },
    {
        name: 'technology',
        id: 'technology'
    },
    {
        name: 'DeFi',
        id: 'DeFi'
    },
    {
        name: 'NFTs',
        id: 'NFTs'
    },
    {
        name: 'gaming',
        id: 'gaming'
    },
    {
        name: 'software',
        id: 'software'
    },
    {
        name: 'startups',
        id: 'startups'
    },
    {
        name: 'art',
        id: 'art'
    }
]



const TopicsInterest = () => {

    const [createMutation, createFeedback] = useMutation(SET_TOPIC, {
        client: convergenceClient
    })

    const [activeInterests, setActiveInterests] = useState<Array<string>>([])

    const [saving, setSaving] = useState<boolean>(false)

    const insets = useSafeAreaInsets()

    const goToNext = () => {
        router.push('/onboard/interests/users');
    }

    const handleTopicActive = (name: string) => {
        if(activeInterests.includes(name)){
            setActiveInterests(activeInterests.filter((item: string) => item !== name))
        } else {
            setActiveInterests((previous) => [...previous,name])
        }
    }

    const handleSubmitInterests = async () => {
        setSaving(true)


        try {

            await Promise.all(activeInterests.map(async (interest) => {
                return await createMutation({
                    variables: {
                        input: {
                            name: interest,
                            sender_address: delegateManager.owner!
                        }
                    }
                })
            }))
        }
        catch (e) {
            // silent fail
            posti.capture('add-topic-interests', {
                activeInterests,
            })
            // Toast.show({
            //     text1: 'Error saving interests',
            //     text2: 'Please try again, or skip this step.',
            //     type: 'error',
            // })
        }
        finally {
            setSaving(false)
        }


        goToNext()
    }

    const preventBackFlow = (): boolean => {
        Toast.show({
            type: 'info',
            text2: `Please complete profile creation`,
        })

        return true
    }

    const topicsInThrees = useMemo(() => {
        const rows = TOPICS.reduce((resultArray, item) => {
            if (resultArray.length === 0) {
                resultArray.push([item])
                return resultArray
            } else {
                const lastRow = resultArray[resultArray.length - 1]
                if (lastRow.length < 3) {
                    lastRow.push(item)
                } else {
                    resultArray.push([item])
                }
                return resultArray
            }
        }, [] as Array<Array<Omit<Topic, 'parentTopic'>>>)
        return rows
    }, [])

    useEffect(() => {

        const subscription: NativeEventSubscription = BackHandler.addEventListener('hardwareBackPress', preventBackFlow)


        return () => {
            
            subscription.remove()
        }

    },[])


    return(
        <View p={20} flex={1} backgroundColor={"$background"}>
            <YStack flex={1} alignItems="center" justifyContent="center" rowGap={20} >
                <H3>
                    What are you into 🤔?
                </H3>

                <YStack alignItems="center" rowGap={10} >
                    {
                        topicsInThrees?.map((interests, index) => {
                            return (
                                <XStack key={index} w="100%" columnGap={10} >
                                    {
                                        interests.map((interest) => {
                                            return (
                                                <TouchableOpacity
                                                    key={interest.id}
                                                    onPress={() => handleTopicActive(interest.id)}
                                                >
                                                    <View 
                                                        key={interest.id}
                                                        p={10}
                                                        borderColor={activeInterests.includes(interest.id) ? "$button" : "$sideText"}
                                                        backgroundColor={activeInterests.includes(interest.id) ? "$button" : "$colorTransparent"}
                                                        borderWidth={1} 
                                                        borderRadius={10}
                                                    >
                                                        <Text fontSize={"$sm"} color={activeInterests.includes(interest.id) ? "white" : "$text"}>
                                                            # {interest.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </XStack>
                            )
                        })
                    }
                </YStack>



            </YStack>
            <BaseButton
                onPress={handleSubmitInterests}
                loading={saving}
                borderRadius={100} w="100%" >
                Continue
            </BaseButton>
        </View>
    )
}

export default TopicsInterest