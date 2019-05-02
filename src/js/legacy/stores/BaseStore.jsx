import { EventEmitter } from 'events'
import { Dispatcher } from 'flux'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'

import HashProxy from '../utils/HashProxy.js'

class BaseStore extends EventEmitter {
    constructor(dispatcher, stores) {
        super()
        
        // HashProxy of flux stores (to waitFor)
        this._stores = stores || new HashProxy()
        
        dispatcher = dispatcher || null
        if (dispatcher instanceof Dispatcher) {
            this.dispatcher = dispatcher
        } else {
            this.dispatcher = new Dispatcher()  // TODO: Hmmm... maybe I shouldn't just create a random dispatcher that's attached to the base store
            // This is just in here until I decide how to handle the case where it isn't provided
        }
    }
    
    getDependentStore(key) {
        return this._stores[key]
    }

    subscribe(actionSubscribe) {
        if (!this.dispatcher instanceof Dispatcher) {
            throw new Error('Failed to provide dispatcher to BaseStore, cannot register actions')
        }
        
        this.dispatchToken = this.dispatcher.register(actionSubscribe())
    }

    // TODO: Standardize events with constants
	emitChange() {
        this.emit('CHANGE')
    }

    addChangeListener(cb) {
        this.on('CHANGE', cb)
    }

    removeChangeListener(cb) {
        this.removeListener('CHANGE', cb)
    }
    
    static normalizePayload = (data, from, to) => {
        return ObjectHelper.recursiveFormatKeys(data, from, to)
    }
	
	static resolveCodeTypes = (data, returnProp, ignoreValues) => {
		// TODO: Need a mechanism to configure how code types are parsed... callback? Override?
		returnProp = (typeof returnProp === 'string' && returnProp.length > 0) ? returnProp : BaseStore.CODETYPE_NAME
		
		for (let prop in data) {
			let value = data[prop]
			
			// Is value a code type?
			// Null check first - hasOwnProperty check on a null will throw a runtime error
			if (data[prop] !== null) {
				if (data[prop].hasOwnProperty('code') && 
					data[prop].hasOwnProperty('version') &&
					data[prop].hasOwnProperty('name') &&
					data[prop].hasOwnProperty(returnProp)) {
					value = data[prop][returnProp]
				}
			}
			
			data[prop] = value
		}
		
		return data
	}
    
    /**
     * TODO: I am a utility method move me out of here?
     */
	static isset = (array, value) => {
		return (typeof array[value] !== 'undefined' && array[value] !== null) ? true : false
	}
	
	_isset(array, value) {
        return BaseStore.isset(array, value)
    }
}

BaseStore.dispatchToken = null
BaseStore.CODETYPE_NAME = 'name'
BaseStore.CODETYPE_ID = 'id'
BaseStore.CODETYPE_CODE = 'code'

export default BaseStore