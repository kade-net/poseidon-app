import Portals from "../screens/tabs/portals";
import {useTheme} from "tamagui";
import {SafeAreaView} from "react-native-safe-area-context";
import {Platform} from "react-native";


export default function PortalsScreen(){
    const theme = useTheme()
    return <SafeAreaView style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: theme.background.val,
    }}
        edges={Platform.select({
            ios: ['top', 'left', 'right'],
            android: undefined
        })}
    >
        <Portals/>
    </SafeAreaView>
}