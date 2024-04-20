

class EphemeralCache {
    cache = new Map<string, any>()
    constructor() {

    }

    set(key: string, value: any) {
        this.cache.set(key, value)
    }

    get(key: string) {
        return this.cache.get(key)
    }
}

const ephemeralCache = new EphemeralCache()

export default ephemeralCache