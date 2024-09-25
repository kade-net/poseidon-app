import { Network } from "aptos"

const config = {
    APP_ENV: "production",
    APP_SUPPORT_API: "",
    COMMUNITY_SUPPORT_API: "",
    KADE_ACCOUNT_ADDRESS: "",
    MODULE_ADDRESS: "",
    EAS_PROJECT_ID: "",
    ANCHORS_URL: "",
    COMMUNITY_MODULE_ADDRESS: "",
    POSTHOG_API_KEY: "",
    APTOS_NETWORK: Network.MAINNET as Network, // or mainnet
    CONVERGENCE_URL: '',
    TRAWLER_API: "",
    BARNICLE_API: "",
    HERMES_MODULE_ADDRESS: "",
    HERMES_API_URL: "",
} as const

export default config