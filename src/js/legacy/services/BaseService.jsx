import assign from 'object-assign'
import axios from 'axios'

import { Dispatcher } from 'flux'

//import HashTable from '../utils/HashTable.js'
//import HashProxy from '../utils/HashProxy.js'

//import ArrayHelper from 'quickcommerce-react/helpers/Array.js'
//import ObjectHelper from 'quickcommerce-react/helpers/Object.js'
//import StringHelper from 'quickcommerce-react/helpers/String.js'

export class BaseService {
	// BaseService constructor
    constructor(deps) {
        deps = deps || null
        
        this.actions = {} // Private? (TODO: Symbols)
        this.dispatcher = {} // Private? (TODO: Symbols)
        
		// TODO: Ensure actions are a HashProxy?
        if (deps !== null) {
            if (deps.hasOwnProperty('dispatcher') && deps.dispatcher instanceof Dispatcher) {
                this.dispatcher = deps.dispatcher
            }
            
            if (deps.hasOwnProperty('actions') && deps.actions !== null && Object.keys(deps.actions).length > 0) {
                this.actions = deps.actions
            }
            
            if (deps.hasOwnProperty('services') && deps.services !== null && Object.keys(deps.services).length > 0) {
                this.services = deps.services
            }
            
            if (deps.hasOwnProperty('stores') && deps.stores !== null && Object.keys(deps.stores).length > 0) {
                this.stores = deps.stores
            }
        }   
    }
    
    handleResponse(response, onSuccess, onError, legacy = false) {
        if (legacy) {
            this.handleLegacyResponse(response, onSuccess, onError)
            return
        }
		
		// 200 OK, 201 Created
        if (response.success || response.status === 200 || response.status === 201) {
            if (response.hasOwnProperty('data')) {
                if (typeof onSuccess === 'function') {
                    onSuccess(response.data)
                }
            } else {
                if (typeof onSuccess === 'function') {
                    onSuccess()
                }
            }
        } else {
            this.handleApiError(response, onError)
        }
    }
    
    handleLegacyResponse(response, onSuccess, onError) {
        if (response.success || response.status === 200 || response.status === 201) {
            if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {
                if (typeof onSuccess === 'function') {
                    onSuccess(response.data.data)
                }
            } else if (response.hasOwnProperty('data')) {
                if (typeof onSuccess === 'function') {
                    onSuccess(response.data)
                }
            } else {
                if (typeof onSuccess === 'function') {
                    onSuccess()
                }
            }
            
        } else {
            this.handleApiError(response, onError)
        }
    }
    
    handleError(message, onError, data) {
        console.log('handle ERROR!')
        //console.log(message)
        //console.log(data)
        if (typeof onError === 'function') {
            onError(message, data) // TODO: Type check
        } else {
            // Catch and re-throw
            throw new Error(message)
        }
    }
    
    // Override me on an as needed basis in inheriting classes
    handleApiError(response, onError) {
        if (typeof onError === 'function') {
            onError(data) // TODO: Type check
        }
    }
	
	normalizePayload(data, from, to) {
        return ObjectHelper.recursiveFormatKeys(data, from, to)
    }

	filterKeys(data) {
		let filterData = false
        let filterKeys = ['_block', '_page', '$id', 'password', 'cart', 'wishlist', 'session'] // Also strip password and cart
        
		// TODO: Let's change the var names... prop/key same thing in JS
        data.forEach(function (prop, key) {
            // Fry internal references from the view-model
            if (filterKeys.indexOf(key) > -1) {
                delete data[key]
            }
        })

		return data
	}
    
    /*get dispatcher() {
        let dispatcher = this._dispatcher || null
        
        if (dispatcher instanceof Dispatcher) {
            return this._dispatcher
        }
        
        return null
    }*/
}