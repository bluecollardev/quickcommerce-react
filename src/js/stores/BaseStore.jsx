import { EventEmitter } from 'events'
import { Dispatcher } from 'flux'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'

import HashProxy from '../utils/HashProxy.js'

export default class BaseStore extends EventEmitter {
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

    emitChange() {
        this.emit('CHANGE')
    }

    addChangeListener(cb) {
        this.on('CHANGE', cb)
    }

    removeChangeListener(cb) {
        this.removeListener('CHANGE', cb)
    }
    
    normalizePayload(data, from, to) {
        return ObjectHelper.recursiveFormatKeys(data, from, to)
    }
    
    /**
     * TODO: I am a utility method move me out of here!
     */
    _isset(array, value) {
        return (typeof array[value] !== 'undefined' && array[value] !== null) ? true : false
    }
}

BaseStore.dispatchToken = null