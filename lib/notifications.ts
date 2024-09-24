import axios from "axios";
import { COMMUNITY_SUPPORT_API } from "../contract";
import delegateManager from "./delegate-manager";
import storage from "./storage";
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import config from "../config";
import * as SecureStore from 'expo-secure-store';
import { convergenceClient } from "../data/apollo";
import { ADD_TOKEN } from "./convergence-client/queries";

// GET EXPO TOKEN


class PoseidonNotifications {

    async enableNotifications() {
        const token = await registerForPushNotificationsAsync()
        if (!token) throw new Error('Failed to get push token for push notification!')

        await convergenceClient.mutate({
            mutation: ADD_TOKEN,
            variables: {
                input: {
                    sender_address: delegateManager.owner!,
                    token: token
                }
            }
        })

        await SecureStore.setItemAsync('expo-push-token', token)
    }

    async disableNotifications() {
        // TODO: Implement this

        await SecureStore.deleteItemAsync('expo-push-token')
    }



    async getNotificationStatus() {

        try {
            const token = await SecureStore.getItemAsync('expo-push-token')

            return token
        }
        catch (e) {
            return null
        }
    }

    async nukeNotifications() {
        await SecureStore.deleteItemAsync('expo-push-token')
    }

    async updateLastRead(notification_type: 'posts' | 'dms'){
        try {
            const currentData = await this.getNotificationCounter(notification_type)
            if(!currentData) {
                return storage.save({
                    key: `notification-${notification_type}`,
                    id: 'counter',
                    data: {
                        type: notification_type,
                        count: 0,
                        lastRead: Date.now()
                    },
                    expires: null
                })
            }

            currentData.lastRead = Date.now()

            return storage.save({
                key: `notification-${notification_type}`,
                id: 'counter',
                data: currentData,
                expires: null
            })
        }
        catch (e) {
            console.log("Unable to updated last read")
        }
    }

    async getNotificationCounter(type: 'posts' | 'dms'){
        try {
            const notification = await storage.load<{type: 'post' | 'dms', count: number, lastRead: number}>({
                key: `notification-${type}`,
                id: 'counter',

            })

            return notification
        }
        catch (e) {
            console.log("not found")
            return null
        }
    }

}

export async function registerForPushNotificationsAsync() {
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
        token = (await Notifications.getExpoPushTokenAsync({ projectId: config.EAS_PROJECT_ID })).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

export default new PoseidonNotifications();