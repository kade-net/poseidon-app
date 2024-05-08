import { router } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, Heading, Spinner, Text, View, YStack } from "tamagui"
import UnstyledButton from "../../../../components/ui/buttons/unstyled-button"
import { ChevronRight } from "@tamagui/lucide-icons"
import { Utils } from "../../../../utils"
import topics, { Topic } from "../../../../contract/modules/topics"
import { useQuery } from "react-query"
import { useState } from "react"
import { Pressable } from "react-native"
import Toast from 'react-native-toast-message'

const TopicsInterest = () => {
    const topicsQuery = useQuery({
        queryKey: ['topics'],
        queryFn: topics.getInterests
    })

    const [activeInterests, setActiveInterests] = useState<Array<string>>([])

    const [saving, setSaving] = useState<boolean>(false)

    const insets = useSafeAreaInsets()

    const goToNext = () => {
        router.push('/onboard/interests/communities/');
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
            await topics.createInterest(activeInterests)
        }
        catch (e) {
            Toast.show({
                text1: 'Error saving interests',
                text2: 'Please try again, or skip this step.',
                type: 'error',
            })
        }


        goToNext()
    }

    return(
        <View px={20} flex={1} backgroundColor={"$background"}>
            <YStack height={"100%"}>
                <View flexDirection='row' w="100%" justifyContent='space-between' alignItems='center'>
                    <Heading size={"$md"} color={"$text"} >
                        Topics
                    </Heading>
                    <UnstyledButton label='Skip' icon={<ChevronRight/>} after={true} callback={goToNext}/>
                </View>
                <Heading color={"$text"} size="$sm" my={10}>
                        What topics would you be interested in?
                </Heading>
                {
                    topicsQuery.isLoading ?
                        <View flexDirection="row" justifyContent="center">
                            <Spinner color={"$text"} size={"large"}/>
                        </View>
                    :
                        <View flexDirection="row" flexWrap="wrap">
                            {
                                topicsQuery?.data?.map((topic: Topic)=>{
                                    return (
                                        <Pressable key={topic.id} onPress={() => handleTopicActive(topic.id)}>
                                            <View 
                                                id={topic.id} 
                                                mx={2} 
                                                my={10} 
                                                px={12} 
                                                py={8} 
                                                borderColor={activeInterests.includes(topic.id)? "$button" : "$sideText"} 
                                                backgroundColor={activeInterests.includes(topic.id)? "$button" : "$colorTransparent"}
                                                borderWidth={1} 
                                                borderRadius={3}
                                            >
                                                <Text fontSize={"$sm"} color={activeInterests.includes(topic.id) ? "white" : "$text"}>
                                                    {topic.name}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    )
                                })
                            }
                        </View>
                }
                
                <Button 
                    disabled={activeInterests.length === 0} 
                    fontSize={"$sm"} 
                    backgroundColor={activeInterests.length > 0? "$button" : "$colourlessButton"} 
                    borderWidth={1} 
                    borderColor={"$button"} 
                    color={activeInterests.length === 0 ? "$text" : "$buttonText"} 
                    position="absolute" 
                    bottom={Utils.dynamicHeight(4)} 
                    width={"100%"}
                    onPress={handleSubmitInterests}
                >
                {saving ? "Saving interests" : "Done"} {saving ? <Spinner color={"$text"} /> : null}
                </Button>

            </YStack>
        </View>
    )
}

export default TopicsInterest