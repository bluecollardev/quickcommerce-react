import { EventEmitter } from 'events'
import { Dispatcher } from 'flux'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'
import SpringDateHelper from '../helpers/SpringDate.js'

import HashProxy from '../utils/HashProxy.js'

import BaseStore from './BaseStore.jsx'

class BaseCollectionStore extends BaseStore {
    constructor(dispatcher, stores) {
        super(dispatcher, stores)
        
		this.length = 0
        this.items = {}
    }
    
    setItem(key, value) {
        let previous
        
        if (this.hasItem(key)) {
            previous = this.items[key]
        } else {
            this.length++
        }
        
        this.items[key] = value
		
		this.emitChange()
		
        return previous
    }
    
    getItem(key) {
        return this.hasItem(key) ? this.items[key] : undefined
    }
    
    hasItem(key) {
        return this.items.hasOwnProperty(key)
    }
    
    removeItem(key) {
        let previous
        
        if (this.hasItem(key)) {
            previous = this.items[key]
            this.length--
            delete this.items[key]
            return previous
        }
		
		this.emitChange()
        
        return undefined
    }
    
    keys() {
        let keys = [], k
            
        for (k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k)
            }
        }
        
        return keys
    }
    
    values() {
        let values = [], k
            
        for (k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k])
            }
        }
        
        return values
    }
    
    each(fn) {
        let k
        
        for (k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k])
            }
        }
    }
    
    clear() {
        this.items = {}
        this.length = 0
    }
    
    // Alias for hasItem
    has(key) {
        return this.hasItem(key)
    }
    
    // Alias for getItem
    get(key) {
        return this.getItem(key)
    }
    
    // Chainable alias for setItem
    set(key, value) {
        this.setItem(key, value)
        return this
    }
    
    // Chainable alias for removeItem
    remove(key) {
        return (this.removeItem(key) !== undefined) ? this : false
    }
	
	count() {
		return Object.keys(this.items).length
	}
}

export default BaseCollectionStore