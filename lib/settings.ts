import * as SecureStore from 'expo-secure-store'
interface Settings {
    preffered_wallet?: 'petra' | 'delegate'
}

class PoseidonSettings {
    constructor() {

    }

    get active(): Settings | null {
        try {
            const settings = SecureStore.getItem('poseidon_settings')
            if (!settings) return null
            return JSON.parse(settings)
        } catch (e) {
            return null
        }
    }

    async updateSettings(settings: Settings) {
        try {
            await SecureStore.setItemAsync('poseidon_settings', JSON.stringify(settings))
        } catch (e) {
            console.error(e)
        }
    }


    async RESTRICKTED__nuke() {
        try {

            await SecureStore.deleteItemAsync('poseidon_settings')
            console.log("Nuked settings")
        } catch (e) {
            console.error(e)
        }
    }
}

export default new PoseidonSettings()