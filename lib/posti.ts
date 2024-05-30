import PostHog from 'posthog-react-native'
import Constants from 'expo-constants'
import config from '../config'
const API_KEY = config.POSTHOG_API_KEY
const posti = new PostHog(API_KEY, {
    disabled: __DEV__
})


export default posti
