import {useGlobalSearchParams, useRouter} from "expo-router";
import ComposableWebView from "../screens/composable-web-view";
import {H4, Text, useTheme, XStack, YStack} from "tamagui";
import {SafeAreaView} from 'react-native-safe-area-context'
import {Platform, TouchableOpacity} from "react-native";
import {X} from "@tamagui/lucide-icons";
import {Utils} from "../utils";
import {useRoute} from "@react-navigation/native";
import {TPUBLICATION} from "../schema";


export default function ComposableEditorScreen() {
    const params = useGlobalSearchParams<{
        target_url: string,
        name: string,
        postContent?: string
    }>()
    console.log("Params::", params)
    const theme = useTheme()
    const router = useRouter()
    const NAME = params?.name ?? 'Composable Portal'
    const DOMAIN = Utils.extractDomain(params?.target_url ?? 'http://192.168.1.2:3000/create')
    const post = params?.postContent ? JSON.parse(Buffer.from(params.postContent, 'base64').toString()) as TPUBLICATION : null
    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: theme.background.val
            }}
            edges={Platform.select({
                ios: [ 'right', 'left', 'top'],
                android: undefined
            })}
        >
            <YStack
                flex={1}
                h={"100%"}
                w={"100%"}
                bg={"$background"}
            >
                <XStack w={"100%"} alignItems={'center'} justifyContent={'space-between'} p={20} >
                    <TouchableOpacity
                        onPress={()=>{
                            router.back()
                        }}
                    >
                        <XStack bg={"$border"} p={5} borderRadius={20} alignItems={'center'} justifyContent={'center'} >
                            <X/>
                        </XStack>
                    </TouchableOpacity>
                    <YStack alignItems={'center'} rowGap={5} >
                        <H4>
                            {NAME}
                        </H4>
                        <XStack backgroundColor={'$border'} borderRadius={100} alignItems={'center'} p={5} >
                            <Text>
                                {DOMAIN}
                            </Text>
                        </XStack>
                    </YStack>
                    <XStack></XStack>
                </XStack>
                <ComposableWebView
                    target_url={params?.target_url}
                    post={post}
                />
            </YStack>
        </SafeAreaView>
    )
}