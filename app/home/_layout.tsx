import {useTheme} from "tamagui";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import {Drawer} from "expo-router/drawer";
import DrawerContent from "../../screens/shell/drawer-content";
import {ShellProvider} from "../../screens/shell";


export default function _layout(){
    const theme = useTheme()
    return (
        <ShellProvider>
            <GestureHandlerRootView style={{flex: 1, width: '100%', height: '100%'}} >
                <SafeAreaView
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        backgroundColor: theme.background.val
                    }}
                >
                    <Drawer screenOptions={{headerShown: false}} drawerContent={(props)=> <DrawerContent {...props} />} >
                        <Drawer.Screen name={"tabs"} />
                    </Drawer>
                </SafeAreaView>
            </GestureHandlerRootView>
        </ShellProvider>
    )
}