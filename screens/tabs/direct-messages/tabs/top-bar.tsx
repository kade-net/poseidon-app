import { SceneRendererProps } from "react-native-tab-view"
import { ScrollView, Text, XStack, YStack } from "tamagui"
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
                <SearchInput
                    placeholder="Search"
                />
                <Link
                    asChild
                    href={{
                        pathname: '/direct-messages/people'
                    }}
                >
                    <TouchableOpacity>
                        <YStack p={5} borderRadius={50} bg="$primary" alignItems="center" justifyContent="center" >
                            <Plus />
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
                        <Text>

                            Active
                        </Text>
                    </BaseButton>
                    <BaseButton
                        onPress={() => handleTabChange(1)}
                        size={'$2.5'} type={currentTab == 1 ? "primary" : "outlined"}>
                        <Text>

                            Incoming Requests
                        </Text>
                    </BaseButton>
                    <BaseButton
                        onPress={() => handleTabChange(2)}
                        size={'$2.5'} type={currentTab == 2 ? "primary" : "outlined"}>
                        <Text>

                            Pending Requests
                        </Text>
                    </BaseButton>
                </XStack>
            </ScrollView>
        </YStack>
    )
}

export default DirectMessageTopBar