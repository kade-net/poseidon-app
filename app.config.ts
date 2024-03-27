import 'dotenv/config'
import { ConfigContext, ExpoConfig } from 'expo/config'
export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
    return {
        ...config,
        slug: 'poseidon',
        name: 'poseidon',
        scheme: 'poseidon',
        ios: {
            ...config.ios,
            bundleIdentifier: 'com.kadenet.poseidon',
        },
        android: {
            ...config.android,
            package: 'com.kadenet.poseidon',
            googleServicesFile: process.env.SERVICE_ACCOUNT_JSON,
        },
        extra: {
            ...config.extra,
            APP_SUPPORT_API: process.env.APP_SUPPORT_API,
            COMMUNITY_SUPPORT_API: process.env.COMMUNITY_SUPPORT_API,
            KADE_ACCOUNT_ADDRESS: process.env.KADE_ACCOUNT_ADDRESS,
            MODULE_ADDRESS: process.env.MODULE_ADDRESS,
            APTOS_NETWORK: process.env.APTOS_NETWORK ?? 'testnet',
            eas: {
                ...config.extra?.eas,
                projectId: process.env.EAS_PROJECT_ID,
            }
        }
    }
}