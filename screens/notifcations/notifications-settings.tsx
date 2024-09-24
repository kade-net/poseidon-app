import {Switch, Text, XStack, YStack} from "tamagui";
import * as SecureStore from 'expo-secure-store'
import {useState} from "react";
import notifications from "../../lib/notifications";


export function NotificationsSettings() {

    const [token, setToken] = useState(SecureStore.getItem('expo-push-token'))

    return (
        <YStack w={'100%'} alignItems={'center'} p={10} >
            <XStack w={'100%'} alignItems={'center'} justifyContent={'space-between'} borderWidth={1} borderRadius={10} p={20} borderColor={'$border'} >
                <Text fontWeight={'600'} fontSize={'$lg'} color={'$sideText'} >
                    Enable Push Notifications
                </Text>

                <Switch
                    checked={!!token}
                    onCheckedChange={async (v)=>{
                        if(token){
                            setToken(null)

                        }else {
                            try {
                                await notifications.enableNotifications()
                                const token = SecureStore.getItem('expo-push-token')
                                setToken(token)
                            }catch(error){
                                console.log("Something went wrong::", error)
                            }
                        }
                    }}
                >
                    <Switch.Thumb backgroundColor={'$primary'} />
                </Switch>
            </XStack>
        </YStack>
    )
}