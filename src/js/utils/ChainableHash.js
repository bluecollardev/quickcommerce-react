import HashTable from './HashTable.js'

/**
 * Object: App.Utilities.ChainableHash
 * Type: Hash
 *
 * Wrapper for App.Utilities.HashTable providing a cleaner interface and supporting method chaining
 */

export default class ChainableHash extends HashTable {
    has(key) {
        return this.hasItem(key)
    }
    
    get(key) {
        return this.getItem(key)
    }
    
    set(key, value) {
        this.setItem(key, value)
        return this
    }
    
    remove(key) {
        return (this.removeItem(key) !== undefined) ? this : false
    }
}