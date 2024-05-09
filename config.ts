import { Network } from "aptos"

const config = {
    APP_ENV: "development",
    APP_SUPPORT_API: "https://scrooge.poseidon.ac",
    COMMUNITY_SUPPORT_API: "https://anchors.poseidon.ac",
    KADE_ACCOUNT_ADDRESS: "0x2f8e770084e3013d7cc36c102ae494706c7c3e5df367c8e5801698556f751dc5",
    MODULE_ADDRESS: "0x2f8e770084e3013d7cc36c102ae494706c7c3e5df367c8e5801698556f751dc5",
    EAS_PROJECT_ID: "30159790-9cfe-44b4-bb58-30450db634ec",
    ANCHORS_URL: "https://anchors.poseidon.ac",
    CONNECT_URL: "https://connect.poseidon.ac",
    COMMUNITY_MODULE_ADDRESS: "0xf5c9fb83e9cd3209135ebf87050dddd0dcd5939f74aca6ebb02ea7acbeec3081",
    POSTHOG_API_KEY: "phc_frFDznscSs075VkbICmavVMNuJ5NiPsTc003erxDFBW",
    USERNAMES_COLLECTION_ID: "0xea68be846c4a6612946f0ecb7775db8deb76c0cfbf53e8c9f44bb796814a7688",
    APTOS_NETWORK: Network.TESTNET as Network, // or mainnet
    CONVERGENCE_URL: 'https://convergence.poseidon.ac',
    TRAWLER_API: "https://trawler.poseidon.ac",
    BARNICLE_API: "https://barnicle.poseidon.ac",
    HERMES_MODULE_ADDRESS: "0xaf58b8a7f94ecf3666c008312c14bd04bb1cde3ea8f182bb9706be47f598f3b5",
    HERMES_API_URL: "https://hermes-api.poseidon.ac",
} as const

export default config