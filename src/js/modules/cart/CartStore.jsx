import { EventEmitter } from 'events'
import { Dispatcher } from 'flux'
import assign from 'object-assign'

import ArrayHelper from '../../helpers/Array.js'
import ObjectHelper from '../../helpers/Object.js'

let INSTANCE_COUNTER = 0
let CHANGE_EVENT_NAME = 'change'
let ITEM_ADDED_EVENT_NAME = 'item-added'
let ITEM_CHANGED_EVENT_NAME = 'item-changed'
let ITEM_OPTIONS_CHANGED_EVENT_NAME = 'product-options-changed'
let RESET_EVENT_NAME = 'cart-reset'
let CLEARED_EVENT_NAME = 'cart-cleared'

let itemKey = 'product' // TODO: Make this configurable using mappings?
let idKey = 'vin' // TODO: Make this configurable using mappings?
let optionIdKey = 'id' // TODO: Make this configurable using mappings?
let optionsKey = 'options' // TODO: Make this configurable using mappings?
let nextKey = 'nextKey' // TODO: Make this configurable using mappings?
let dataKey = 'data' // TODO: Make this configurable using mappings?
let quantityKey = 'quantity' // TODO: Make this configurable using mappings?

class CartStore extends EventEmitter {
  constructor(dispatcher) {
    super()

    this.INSTANCE_ID = INSTANCE_COUNTER++

    console.log('INITIALIZING CARTSTORE ' + this.INSTANCE_ID)

    /*dispatcher = dispatcher || null
     if (dispatcher instanceof Dispatcher) {
     this.dispatcher = dispatcher
     } else {
     this.dispatcher = new Dispatcher()  // TODO: Hmmm... maybe I shouldn't just create a random dispatcher that's attached to the base store
     // This is just in here until I decide how to handle the case where it isn't provided
     }*/

    this.subscribe(dispatcher, () => this.registerToActions.bind(this))

    this.items = {}
    this.selection = []
    this[nextKey] = 0
    this.dispatchToken = null
  }

  subscribe(dispatcher, actionSubscribe) {
    if (!(dispatcher instanceof Dispatcher)) {
      throw new Error('Failed to provide dispatcher to BaseStore, cannot register actions')
    }

    this.dispatchToken = dispatcher.register(actionSubscribe())
  }

  init(config) {
    this.items = config.items
    this.selection = []
    //this.total = total

    config.selection.forEach(item => {
      item[quantityKey] = Number(item[quantityKey])
      item._key = this[nextKey]++
      if (item[dataKey]) {
        this.items[item[idKey]] = item[dataKey]
      } else {
        item[dataKey] = this.items[item[idKey]]
      }
      if (!item[dataKey]) {
        throw 'Missing data for item \'' + item[idKey] + '\'.'
      }
      this.selection.push(item)
      this.items[item[idKey]]._initialQty = item[quantityKey]
    })

    this.reIndex()
  }

  registerToActions(action) {
    switch (action.actionType) {
      case 'cart-initialize':
        this.init(action.config)
        this.emit('ready')
        // Ready isn't triggering update!
        // We were previously using change;
        // I plan on updating this behavior
        // but not just yet...
        this.emit(CHANGE_EVENT_NAME)
        break
      case 'cart-revert':
        this.init(action.config)
        this.emit(CHANGE_EVENT_NAME)
        break
      case 'cart-add-item':
        this.addItem(action.key, action.quantity, action.item)
        break
      case 'cart-remove-item':
        this.removeItem(action.index)
        break
      case 'cart-update-item':
        this.updateQuantity(action.index, action.quantity)
        break
      case 'cart-add-option':
        this.addOption(action.key, action.quantity, action.option, action.item)
        break
      case ITEM_OPTIONS_CHANGED_EVENT_NAME:
        this.reset()
        break
      case 'cart-clear':
        this.clear()
        break
      default:
        break
    }
  }

  reIndex() {
    let idx = 0
    this.selection.forEach(item => {
      item._index = idx++
    })
  }

  getSelection() {
    return this.selection
  }

  getCount() {
    // TODO: This isn't working right yet
    let total = 0

    if (this.selection instanceof Array && this.selection.length > 0) {
      total = this.selection.reduce((total, selection) => {
        return total + parseInt(selection[quantityKey])
      }, total)
    }

    return total
  }

  isEmpty() {
    return !this.selection.length
  }

  getItem(index) {
    return this.selection[index]
  }

  addItem(key, quantity, item, silent) {
    console.log('ATTEMPTING TO ADD ITEM TO CARTSTORE ' + this.INSTANCE_ID)
    // Cart store addItem
    silent = silent || false
    let data = null
    let options = []

    if (this.items.hasOwnProperty(key)) {
      data = this.items[key]
    } else {
      data = item //(item.hasOwnProperty('data')) ? item.data : item

      this.items[key] = data
    }

    let exists = false
    for (let selectionKey in this.selection) {
      exists = false // Reset the variable just in case
      // Compare item keys to see if the item already exists in the selection array
      if (key === this.selection[selectionKey][idKey]) {
        // Now make sure the selected options are a match...
        // If it isn't an exact match, we're going to assume a different
        // configuration for the same product, so skip this and create a new item

        // Consider empty options property to be an empty array
        options = (item[optionsKey] instanceof Array) ? item[optionsKey] : options

        if (ArrayHelper.jsonSameMembers(options, this.selection[selectionKey][optionsKey])) {
          exists = true
        }
      }

      if (exists) {
        const oldQty = this.selection[selectionKey][quantityKey]
        this.selection[selectionKey][quantityKey] += Number(quantity)

        if (!silent) {
          this.emit(CHANGE_EVENT_NAME)
          this.emit(ITEM_CHANGED_EVENT_NAME, item, this.selection[selectionKey][quantityKey], oldQty)
        }

        return // Break out
      }
    }

    if (data) {
      let selectionItem = {
        [idKey]: key,
        [quantityKey]: Number(quantity),
        [dataKey]: data,
        [optionsKey]: [...options],
        _index: this.selection.length,
        _key: this[nextKey]++
      }

      this.selection.push(selectionItem)

      if (!silent) {
        this.emit(CHANGE_EVENT_NAME)
        this.emit(ITEM_ADDED_EVENT_NAME, key, Number(quantity), item)
      }
    }
  }

  updateItem(key, quantity, item, silent) {
    silent = silent || false
    let data = (item.hasOwnProperty([dataKey])) ? item[dataKey]: null

    if (this.items.hasOwnProperty(key)) {
      data = this.items[key]
    } else {
      this.items[key] = data
    }

    for (let selectionKey in this.selection) {
      if (key === this.selection[selectionKey][idKey]) {
        const oldQty = this.selection[selectionKey][quantityKey]
        this.selection[selectionKey][quantityKey] += Number(quantity)

        if (!silent) {
          this.emit(CHANGE_EVENT_NAME)
          this.emit(ITEM_CHANGED_EVENT_NAME, item, this.selection[selectionKey][quantityKey], oldQty)
        }

        return
      }
    }

    if (data) {
      let selectionItem = {
        [idKey]: key,
        [quantityKey]: Number(quantity),
        [dataKey]: data,
        [optionsKey]: [],
        _index: this.selection.length,
        _key: this[nextKey]++
      }

      this.selection.push(selectionItem)

      if (!silent) {
        this.emit(CHANGE_EVENT_NAME)
        this.emit(ITEM_ADDED_EVENT_NAME, key, Number(quantity), item)
      }
    }
  }

  /**
   * @param index
   */
  removeItem(index) {
    let key = this.selection[index][idKey]
    let item = this.selection.splice(index, 1)[0]

    this.reIndex()

    this.emit(CHANGE_EVENT_NAME)
    this.emit('item-removed', key, item)
  }

  /**
   The product options
   "options": [{
     "name": "Packages per Shipment",
     "type": "select",
     "option_value": [{
       "image": "",
       "price": false,
       "price_formated": false, // TODO: Typo!
       "price_prefix": "+",
       "product_option_value_id": "527",
       "option_value_id": "241",
       "name": "1",
       "quantity": 0
     }]
   }]

   Selected option value sample
   "option": { // The selected option value
     "image": "",
     "price": false,
     "price_formated": false, // TODO: Typo!
     "price_prefix": "+",
     "product_option_value_id": "525",
     "option_value_id": "238",
     "name": "250g",
     "quantity": 0,
     "option": { // The option itself
     "name": "Product Size",
     "type": "select",
     "required": "1",
     "product_option_id": "253",
     "option_id": "44"
   }

   The selection object
   "selection": [{
     data: {}, // Cart item product data
     id: "3382",
     options: [], // I think this is redundant / useless
     quantity: 2,
     _index: 0,
     _key: 0
   }]

   * @param key
   * @param quantity item quantity
   * @param option The data item option to be stored
   * @param item Optionally include the parent item in the product-options-changed event arguments
   */
  addOption(key, quantity, option, item) {
    // Loop over active items in cart (the current selection)
    // If the item being added isn't already in the cart, we
    // need to add it before processing the option
    let createItem = true
    for (let idx = 0; idx < this.selection.length; idx++) {
      let selection = this.selection[idx]
      if (item[idKey] === selection[idKey]) {
        createItem = false
      }
    }

    // Store item option if it doesn't exist
    if (createItem) {
      this.addItem(item[idKey], 1, item, true) // Silent add, don't trigger events
    }

    // Loop over active items in cart (the current selection)
    for (let idx = 0; idx < this.selection.length; idx++) {
      if (!(this.selection[idx][optionsKey] instanceof Array)) {
        this.selection[idx][optionsKey] = []
      }

      if (typeof this.selection[idx][nextKey] === 'undefined'
        || isNaN(this.selection[idx][nextKey])) {
        this.selection[idx][nextKey] = 0
      }

      let selection = this.selection[idx]

      // If the item being added is already in the cart
      if (item[idKey] === selection[idKey]) {
        // Add the order product option value to the cart
        let selectedOptions = selection[optionsKey]
        for (let optionIdx in selectedOptions) {
          // If the order product option value being added already exists for the item
          if (key === selectedOptions[optionIdx][optionIdKey]) {
            // Update item quantity, if it changed
            //const oldQty = selection[quantityKey]
            this.selection[idx][optionsKey][optionIdx][quantityKey] += Number(quantity)

            if (createItem) {
              this.emit(CHANGE_EVENT_NAME)
              this.emit(ITEM_ADDED_EVENT_NAME, selection[idKey], selection[quantityKey], selection[dataKey])
            } else {
              this.emit(CHANGE_EVENT_NAME)
            }

            return
            // What we do depends on the type
          } else {
            switch (option.option['type']) {
              case 'select':
              // If the order product option value being added is part of the same option [group] as an existing selection
                let selectedOptionId = Number(selectedOptions[optionIdx][dataKey].option['option_id'])
                if (Number(option.option['option_id']) === selectedOptionId) {
                // Go ahead and mutate the object, we don't need a new key or index
                  this.selection[idx][optionsKey][optionIdx] = assign(this.selection[idx][optionsKey][optionIdx], {
                    [optionIdKey]: option[optionIdKey],
                    [quantityKey]: Number(quantity),
                    [dataKey]: option
                  })

                  if (createItem) {
                    this.emit(CHANGE_EVENT_NAME)
                    this.emit(ITEM_ADDED_EVENT_NAME, selection[idKey], selection[quantityKey], selection[dataKey])
                  } else {
                    this.emit(CHANGE_EVENT_NAME)
                    this.emit(ITEM_OPTIONS_CHANGED_EVENT_NAME, option, Number(quantity), item)
                  }

                  return
                }

                break
            }
          }
        }

        if (option) {
          let selectionItemOption = {
            [optionIdKey]: option[optionIdKey],
            [quantityKey]: Number(quantity),
            [dataKey]: option
          }

          this.selection[idx][optionsKey].push(selectionItemOption)

          if (createItem) {
            this.emit(CHANGE_EVENT_NAME)
            this.emit(ITEM_ADDED_EVENT_NAME, selection[idKey], selection[quantityKey], selection[dataKey])
          } else {
            this.emit(CHANGE_EVENT_NAME)
            this.emit(ITEM_OPTIONS_CHANGED_EVENT_NAME, option, Number(quantity), item) // TODO: Provide OLD quantity as last emit param
          }
        }
      }
    }
  }

  updateQuantity(index, quantity) {
    let item = this.selection[index]
    const oldQty = item[quantityKey]
    item[quantityKey] = Number(quantity)
    this.emit(CHANGE_EVENT_NAME)
    this.emit(ITEM_CHANGED_EVENT_NAME, this.items[item[idKey]], quantity, oldQty)
  }

  getOptionPrice(itemData, selectedOption, optionValueId) {
    //let itemOptions = itemData['options']

    if (selectedOption['option_value'] instanceof Array) {
      let selectedOptionValues = selectedOption['option_value']
      let selectedValues = selectedOptionValues.filter(option => {
        return Number(option['product_option_value_id']) === optionValueId
      })

      if (selectedValues instanceof Array && selectedValues.length > 0) {
        let selectedValue = selectedValues[0] // Single selection for now

        if (selectedValue['price'] !== false && !isNaN(selectedValue['price'])) {
          return Number(selectedValue['price'])
        }
      }
    }
  }

  reset() {
    this.selection = []
    this.emit(CHANGE_EVENT_NAME)
    this.emit(RESET_EVENT_NAME)
  }

  clear() {
    this.selection = []
    this.emit(CHANGE_EVENT_NAME)
    this.emit(CLEARED_EVENT_NAME)
  }

  emitChange() {
    this.emit(CHANGE_EVENT_NAME)
  }

  addChangeListener(cb) {
    this.on(CHANGE_EVENT_NAME, cb)
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT_NAME, cb)
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

export default CartStore
export { CartStore }
