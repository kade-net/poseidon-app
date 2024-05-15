import { SceneRendererProps } from "react-native-tab-view"
import { Heading, ScrollView, Text, XStack, YStack } from "tamagui"
import BaseButton from "../../../../components/ui/buttons/base-button"
import SearchInput from "../../../../components/ui/search-input"
import { Plus } from "@tamagui/lucide-icons"
import { TouchableOpacity } from "react-native"
import { useState } from "react"
import { Link } from "expo-router"

interface Props {
    routes: Array<{ key: string, title: string }>
    currentIndex: number
}

type P = Props & SceneRendererProps


const DirectMessageTopBar = (props: P) => {
    const { currentIndex, routes } = props
    const [currentTab, setCurrentTab] = useState(currentIndex)

    const handleTabChange = (index: number) => {
        setCurrentTab(index)
        props.jumpTo(routes[index].key)
    }


    return (
        <YStack w="100%" rowGap={10} >
            <XStack
                w="100%"
                alignItems="center"
                justifyContent="space-between"
                columnGap={20}
                px={20}
            >
                {/* <SearchInput
                    placeholder="Search"
                /> */}
                <XStack alignItems="center" columnGap={10} >
                    <Heading>
                        Direct Messages
                    </Heading>
                    <XStack alignItems="center" px={5} borderWidth={1} borderColor={'$primary'} justifyContent="center" borderRadius={100} >
                        <Text>
                            Beta
                        </Text>
                    </XStack>
                </XStack>
                <Link
                    asChild
                    href={{
                        pathname: '/direct-messages/people'
                    }}
                >
                    <TouchableOpacity>
                        <YStack p={5} borderRadius={50} bg="$primary" alignItems="center" justifyContent="center" >
                            <Plus color={"white"}/>
                        </YStack>
                    </TouchableOpacity>
                </Link>
            </XStack>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20
                }}
                style={{
                    width: '100%'
                }}
            >
                <XStack
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                    columnGap={10}
                // px={20}
                >
                    <BaseButton
                        onPress={() => handleTabChange(0)}
                        size={'$2.5'} type={currentTab == 0 ? "primary" : "outlined"} >
                        <Text color={currentTab === 0 ?"white":"$text"}>

                            Active
                        </Text>
                    </BaseButton>
                    <BaseButton
                        onPress={() => handleTabChange(1)}
                        size={'$2.5'} type={currentTab == 1 ? "primary" : "outlined"}>
                        <Text color={currentTab === 1?"white":"$text"}>

                            Incoming Requests
                        </Text>
                    </BaseButton>
                    <BaseButton
                        onPress={() => handleTabChange(2)}
                        size={'$2.5'} type={currentTab == 2 ? "primary" : "outlined"}>
                        <Text color={currentTab === 2?"white":"$text"}>

                            Pending Requests
                        </Text>
                    </BaseButton>
                </XStack>
            </ScrollView>
        </YStack>
    )
}

export default DirectMessageTopBar