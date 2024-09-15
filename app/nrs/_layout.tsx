import {useTheme, YStack} from "tamagui";
import {Stack} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {Drawer} from "expo-router/drawer";
import DrawerContent from "../../screens/shell/drawer-content";

export default function _layout(){
    const theme = useTheme()
    return (
        <GestureHandlerRootView
            style={{flex: 1, width: '100%', height: '100%'}}
        >
            <SafeAreaView
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.background.val
                }}
            >
                <Drawer drawerContent={(props) => <DrawerContent {...props} />} screenOptions={{headerShown: false }} >
                    <Drawer.Screen
                        name={"shell"}
                    />
                </Drawer>
            </SafeAreaView>
            {/*<SafeAreaView*/}
            {/*    style={{*/}
            {/*        flex: 1,*/}
            {/*        width: '100%',*/}
            {/*        height: '100%',*/}
            {/*        backgroundColor: theme.background.val*/}
            {/*    }}*/}

            {/*>*/}
            {/*    <YStack flex={1} w={"100%"} >*/}
            {/*        <Stack screenOptions={{*/}
            {/*            headerShown: false,*/}
            {/*        }} >*/}
            {/*            <Stack.Screen name={"shell"} />*/}
            {/*        </Stack>*/}
            {/*    </YStack>*/}
            {/*</SafeAreaView>*/}
        </GestureHandlerRootView>
    )
}