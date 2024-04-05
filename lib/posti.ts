import PostHog from 'posthog-react-native'
import Constants from 'expo-constants'
const API_KEY = Constants.expoConfig?.extra?.POSTHOG_API_KEY!
const posti = new PostHog(API_KEY, {
    disabled: __DEV__
})


export default posti
