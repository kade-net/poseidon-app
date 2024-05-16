import { Network } from "aptos"

const config = {
    APP_ENV: "production",
    APP_SUPPORT_API: "https://scrooge.poseidon.ac",
    COMMUNITY_SUPPORT_API: "https://anchors.poseidon.ac",
    KADE_ACCOUNT_ADDRESS: "0xf6391863cca7d50afc4c998374645c8306e92988c93c6eb4b56972dd571f8467",
    MODULE_ADDRESS: "0xf6391863cca7d50afc4c998374645c8306e92988c93c6eb4b56972dd571f8467",
    EAS_PROJECT_ID: "30159790-9cfe-44b4-bb58-30450db634ec",
    ANCHORS_URL: "https://anchors.poseidon.ac",
    COMMUNITY_MODULE_ADDRESS: "0xef7ac7945b950fe7e18be8961b550f52e43fbcb6785503d57900b05de70eb88f",
    POSTHOG_API_KEY: "phc_frFDznscSs075VkbICmavVMNuJ5NiPsTc003erxDFBW",
    APTOS_NETWORK: Network.MAINNET as Network, // or mainnet
    CONVERGENCE_URL: 'https://convergence.poseidon.ac',
    TRAWLER_API: "https://trawler.poseidon.ac",
    BARNICLE_API: "https://barnicle.poseidon.ac",
    HERMES_MODULE_ADDRESS: "0x16f82cf127ba58ade1c2b6bb19adfdde96054aae1febf0ce1b6e805b98d5a451",
    HERMES_API_URL: "https://hermes-api.poseidon.ac",
} as const

export default config