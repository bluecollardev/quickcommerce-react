import { Dispatcher } from 'flux'
import NumberHelper from '../helpers/Number.js'
//import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'

//import HashTable from '../utils/HashTable.js'
//import HashProxy from '../utils/HashProxy.js'

//import StringHelper from '../helpers/String.js'

/**
 * Although we could have implemented things differently (without inheritance), doing so doesn't add any value as this base
 * service solely exists to cut down on the boilerplate needed when generating an api client using codegen templates.
 * There's no concern regarding code-coupling in inheriting classes, as generated classes should be treated as "Final".
 */
class BaseService {
  // BaseService constructor
  constructor(deps) {
    deps = deps || null

    this.dispatcher = {} // Private? (TODO: Symbols)
    this.headers = {} // Private? (TODO: Symbols)
    this.actions = {} // Private? (TODO: Symbols)
    this.services = {} // Private? (TODO: Symbols)
    this.stores = {} // Private? (TODO: Symbols)
    this.agent = undefined // Private? (TODO: Symbols)

    // TODO: Ensure actions are a HashProxy?
    if (deps !== null) {
      if (deps.hasOwnProperty('dispatcher') && deps.dispatcher instanceof Dispatcher) {
        this.dispatcher = deps.dispatcher
      }
      
      if (deps.hasOwnProperty('headers') && deps.headers !== null && Object.keys(deps.headers).length > 0) {
        this.headers = deps.headers
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

      // In order to keep things loose, we delegate authentication
      // to an authentication agent of type AuthenticationAgent.
      const agent = deps.agent || undefined
      if (agent !== undefined) {
        // TODO: Actually type-check...
        if (typeof agent.init === 'function') {
          this.agent = agent
        }
      }
    }
  }

  // TODO: Not all params are mapped, just leaving in full params list so I don't have to regenerate JS code
  callApi(url, method, pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, onSuccess, onError) {
    authNames = (authNames instanceof Array) ? authNames : []
    contentTypes = ['application/json']
    accepts = ['*/*']

    // TODO: Check to see if apiClient was specified by inheriting class
    return this.apiClient.callApi(
      url, method,
      pathParams, queryParams, headerParams, formParams, postBody,
      authNames, contentTypes, accepts, returnType, onSuccess, onError
    )
  }

  normalizePayload(data, from, to) {
    return ObjectHelper.recursiveFormatKeys(data, from, to)
  }

  filterKeys(data) {
    //let filterData = false
    let filterKeys = [
      '_block',
      '_page',
      '$id',
      'password',
      'cart',
      'wishlist',
      'session'
    ] // Also strip password and cart

    // TODO: Let's change the var names... prop/key same thing in JS
    data.forEach(function (prop, key) {
      // Fry internal references from the view-model
      if (filterKeys.indexOf(key) > -1) {
        delete data[key]
      }
    })

    return data
  }

  validateId(id) {
    id = (NumberHelper.isInteger(id)) ? id : NaN

    if (isNaN(id)) {
      throw new Error('Invalid ID: supplied value must be an integer!')
    }

    return true
  }

  validatePayload(id, key, payload) {
    // This check is redundant if validateId is invoked outside of the context of this method
    this.validateId(id) // But, like mama says, better safe than sorry!

    if (typeof payload === 'undefined' || payload === null) {
      throw new Error('Cannot validate payload: no input was provided.')
    }

    if (typeof key === 'string' && payload.hasOwnProperty(key)) {
      if (!this.validateId(payload[key])) {
        // Cast before comparing values
        throw new Error('Cannot validate payload: invalid comparison key provided.')
      }

      if (Number(payload[key]) !== Number(id)) {
        throw new Error('Invalid payload: provided ID does not match payload ID property value!')
      }
    } else {
      throw new Error('Cannot validate payload: a comparison key was provided.')
    }

    return true
  }

  /*get dispatcher() {
   let dispatcher = this._dispatcher || null

   if (dispatcher instanceof Dispatcher) {
   return this._dispatcher
   }

   return null
   }*/
}

export default BaseService
export { BaseService }
