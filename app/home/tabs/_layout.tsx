import {Tabs} from "expo-router";
import {useTheme} from "tamagui";
import {ShellBottomTabNavigator, useShellProvider} from "../../../screens/shell";


export default function _layout(){
    const theme = useTheme()
    const shellContext = useShellProvider()
    return (
        <Tabs screenListeners={{
            state(data){
                shellContext.setCurrentTabIndex(data.data.state.index)
            }
        }} screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            lazy: true
        }} sceneContainerStyle={[{
            backgroundColor: theme.background.val
        }]}
              tabBar={(props)=><ShellBottomTabNavigator {...props} />}
        >
            <Tabs.Screen
                name={"home"}
            />
            <Tabs.Screen name={"search"}/>
            <Tabs.Screen name={"messages"} />
            <Tabs.Screen name={"notifications"}/>
            <Tabs.Screen name={"[address]"} />
        </Tabs>
    )
}