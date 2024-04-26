import axios from "axios";
import { COMMUNITY_SUPPORT_API } from "../contract";
import delegateManager from "./delegate-manager";
import storage from "./storage";
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";
import * as Device from 'expo-device'
import Constants from 'expo-constants'

// GET EXPO TOKEN


class PoseidonNotifications {

    async enableNotifications() {
        console.log('Enabling notifications')
        const token = await registerForPushNotificationsAsync()
        if (!token) throw new Error('Failed to get push token for push notification!')
        console.log("Token:: ", token)
        const response = await axios.post(`${COMMUNITY_SUPPORT_API}/api/notifications/register`, {
            user_address: delegateManager.owner!,
            token: token
        })

        await storage.save({
            key: 'notifications',
            id: delegateManager.owner!,
            data: {
                enabled: true,
                token
            }
        })
    }

    async disableNotifications() {
        console.log('Disabling notifications')
        const response = await axios.post(`${COMMUNITY_SUPPORT_API}/api/notifications/disable`, {
            user_address: delegateManager.owner!,
        })

        await storage.save({
            key: 'notifications',
            id: delegateManager.owner!,
            data: {
                enabled: false
            }
        })
    }



    async getNotificationStatus() {

        try {
            const response = await storage.load<{ enabled: boolean }>({
                key: 'notifications',
                id: delegateManager.owner!
            })

            return response
        }
        catch (e) {
            return null
        }
    }

    async nukeNotifications() {
        await storage.remove({
            key: 'notifications',
            id: delegateManager.owner!
        })
    }

}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas?.projectId })).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

export default new PoseidonNotifications();