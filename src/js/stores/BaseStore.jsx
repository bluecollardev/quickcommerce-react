import { EventEmitter } from 'events'
import AppDispatcher from '../dispatcher/AppDispatcher.jsx'
import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'

export default class BaseStore extends EventEmitter {
    constructor() {
        super()
    }

    subscribe(actionSubscribe) {
        this.dispatchToken = AppDispatcher.register(actionSubscribe())
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