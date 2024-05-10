import 'dotenv/config'
import { ConfigContext, ExpoConfig } from 'expo/config'
export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
    return {
        ...config,
        ios: {
            ...config.ios,
        },
        android: {
            ...config.android,
            googleServicesFile: process.env.SERVICE_ACCOUNT_JSON,
        }
    }
}