import assign from 'object-assign'
import axios from 'axios'

import { Dispatcher } from 'flux'

import HashTable from '../utils/HashTable.js'
import ChainableHash from '../utils/ChainableHash.js'

//import ArrayHelper from 'quickcommerce-react/helpers/Array.js'
//import ObjectHelper from 'quickcommerce-react/helpers/Object.js'
//import StringHelper from 'quickcommerce-react/helpers/String.js'

export class BaseService {
	constructor(deps) {
        deps = deps || null
        
        this.actions = {} // null
        this.dispatcher = {} // null
        
        if (deps !== null) {
            if (deps.hasOwnProperty('actions') && deps.actions !== null && Object.keys(deps.actions).length > 0) {
                this.actions = deps.actions //this.actions = new ChainableHash(actions)
            }
            
            if (deps.hasOwnProperty('services') && deps.services !== null && Object.keys(deps.services).length > 0) {
                this.services = deps.services //this.services = new ChainableHash(services)
            }
            
            if (deps.hasOwnProperty('dispatcher') && deps.dispatcher instanceof Dispatcher) {
                this.dispatcher = deps.dispatcher
            }
        }   
    }
    
    getDispatcher() {
        let dispatcher = this.dispatcher || null
        
        if (dispatcher instanceof Dispatcher) {
            return this.dispatcher
        }
        
        return null
    }
}