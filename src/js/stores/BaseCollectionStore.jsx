import { EventEmitter } from 'events'
import { Dispatcher } from 'flux'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'
import SpringDateHelper from '../helpers/SpringDate.js'

import HashProxy from '../utils/HashProxy.js'

import BaseStore from './BaseStore.jsx'

class BaseCollectionStore extends BaseStore {
  /**
   *
   * @constructor
   * @param dispatcher
   * @param stores
   */
  constructor(dispatcher, stores) {
    super(dispatcher, stores)
        
    this.length = 0
    this.items = {}
  }

  /**
   *
   * @param key
   * @returns {boolean}
   */
  hasItem(key) {
    return this.items.hasOwnProperty(key)
  }

  /**
   *
   * @param key
   * @returns {undefined}
   */
  getItem(key, resolveCodeTypes) {
    resolveCodeTypes = resolveCodeTypes || false

    if (this.hasItem(key)) {
      let item = this.items[key]

      if (resolveCodeTypes) {
        return BaseCollectionStore.resolveCodeTypes(item, BaseCollectionStore.CODETYPE_NAME) // Base method
      }

      return item
    }

    return undefined
  }

  /**
   *
   * @param key
   * @param value
   * @returns {*}
   */
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

  /**
   *
   * @param key
   * @returns {*}
   */
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

  /**
   *
   * @returns {boolean}
   */
  hasItems() {
    return (this.count() > 0)
  }

  /**
   *
   * @param resolveCodeTypes
   * @returns {any[]}
   */
  getItems(resolveCodeTypes) {
    resolveCodeTypes = resolveCodeTypes || false

    if (resolveCodeTypes) {
      console.log('resolving code types...')
      console.log(this.items)
      return Object.keys(this.items).map(key => {
        let item = this.items[key]
        return BaseCollectionStore.resolveCodeTypes(item, BaseCollectionStore.CODETYPE_NAME) // Base method
      })
    }

    return Object.keys(this.items).map(key => {
      return this.items[key]
    })
  }

  /**
   *
   * @param data
   * @param onSuccess
   * @param onError
   */
  setItems(data, onSuccess, onError) {
        // InventoryStore.setItems
    try {
      data = data || []

      this.items = {} // Explicitly clear items
      this.length = 0 // Explicitly reset hash length

      if (data instanceof Array) {
        let idx = 0
        let item = null
        let id = null

        for (idx; idx < data.length; idx++) {
          item = data[idx] || null

          if (item !== null && item.hasOwnProperty(BaseCollectionStore.PK)) {
            id = item[BaseCollectionStore.PK]
            this.items[id] = data[idx]
            this.length++
          }

          id = null // Clear variable for reuse
        }

        if (typeof onSuccess === 'function') {
          onSuccess(data)
        }
      }

      this.emitChange()
    } catch (err) {
      if (typeof onError === 'function') {
        onError(err)
      }
    }
  }

  /*has(key) {
      return this.hasItem(key)
  }*/

  /**
   * Alias for hasItem.
   * @param key
   * @returns {boolean}
   */
  has(key) {
    let exists = false
    if (this.items.hasOwnProperty(key) &&
            typeof this.items[key] !== 'undefined') {
      exists = true
    }

    return exists
  }

  /**
   * Alias for getItem.
   * @param key
   * @returns {*}
   */
  get(key) {
    return this.getItem(key)
  }

  /**
   * Chainable alias for setItem.
   * @param key
   * @param value
   * @returns {BaseCollectionStore}
   */
  set(key, value) {
    this.setItem(key, value)
    return this
  }

  /**
   * Chainable alias for removeItem.
   * @param key
   * @returns {*}
   */
  remove(key) {
    return (this.removeItem(key) !== undefined) ? this : false
  }

  /**
   *
   */
  clear() {
    this.items = {}
    this.length = 0
  }

  /**
   *
   * @returns {Array}
   */
  keys() {
    let keys = [], k

    for (k in this.items) {
      if (this.hasItem(k)) {
        keys.push(k)
      }
    }

    return keys
  }

  /**
   *
   * @returns {Array}
   */
  values() {
    let values = [], k

    for (k in this.items) {
      if (this.hasItem(k)) {
        values.push(this.items[k])
      }
    }

    return values
  }

  /**
   *
   * @param fn
   */
  each(fn) {
    let k

    for (k in this.items) {
      if (this.hasItem(k)) {
        fn(k, this.items[k])
      }
    }
  }

  /**
   *
   * @returns {number}
   */
  count() {
    return Object.keys(this.items).length
  }
}

export default BaseCollectionStore
