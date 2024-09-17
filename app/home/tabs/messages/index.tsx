import {YStack} from "tamagui";
import Messaging from "../../../../screens/messaging";
import {Stack} from "expo-router";
import {useEffect, useState} from "react";
import fgs, {FGS} from "../../../../lib/fgs";
import Loading from "../../../../components/ui/feedback/loading";


export default function MessagingScreen(){
    const [settingUp, setSettingUp] = useState(false);
    useEffect(()=>{
        ;(async ()=>{
            setSettingUp(true);
            try {
                if(!fgs.client){
                    fgs.client = (await FGS.initFGS()).client
                }
            }
            catch (e)
            {
                console.log("Unable to initialize client::", e)
            }
            finally {
                setSettingUp(false);
            }
        })();
    }, [])

    if(settingUp){
        return (
            <Loading flex={1} w={"100%"} h={"100%"} bg={'$background'} />
        )
    }
    return (
        <YStack flex={1} w={"100%"} h={"100%"} pos={'relative'} >
            <Stack.Screen/>
            <Messaging/>
        </YStack>
    )
}