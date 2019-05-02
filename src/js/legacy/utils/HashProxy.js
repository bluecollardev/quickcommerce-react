import HashTable from './HashTable.js'

/**
 * Object: App.Utilities.HashProxy
 * Type: Hash
 *
 * Proxy wrapper for App.Utilities.HashTable providing a cleaner interface.
 * Uses ES6 Proxy to auto-magically map getters / setters.
 */

export default function HashProxy(obj) {
    return new Proxy(new HashTable(obj), {
        get: (hash, key) => {
            // Ignore non-strings
            if (typeof key !== 'string') {
                return undefined
            }
            
            return hash.getItem(key)
        },
        set: (hash, key, value) => {
            hash.setItem(key, value)
            return true
        }
    })
}