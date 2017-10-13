import EventEmitter        from 'events'
import React               from 'react'
import assign              from 'object-assign'
import { Dispatcher }      from 'flux'

import ArrayHelper from '../helpers/Array.js'

const CartStore = assign({}, EventEmitter.prototype, {
    items        : {},
    selection    : [],
    nextKey      : 0,

    init(config) {
        //this.total        = total
        this.items        = config.items
        this.selection    = []
        config.selection.forEach(item => {
            item.quantity = Number(item.quantity)
            item._key     = this.nextKey++
            if (item.data) {
                this.items[item.id] = item.data
            } else {
                item.data = this.items[item.id]
            }
            if (!item.data) {
                throw 'Missing data for item \'' + item.id + '\'.'
            }
            this.selection.push(item)
            this.items[item.id]._initialQty = item.quantity
        })
        this.reIndex()
    },

    reIndex() {
        let i = 0
        this.selection.forEach(item => {
            item._index = i++
        })
    },

    getSelection() {
        return this.selection
    },

    isEmpty() {
        return !this.selection.length
    },

    getItem(index) {
        return this.selection[index]
    },
    addItem(key, quantity, item, silent) {
        // Cart store addItem
        silent = silent || false
        let data = (item.hasOwnProperty('data')) ? item.data : null
        
        if (this.items.hasOwnProperty(key)) {
            data = this.items[key]
        } else {
            this.items[key] = data
        }

        let exists = false
        for (let selectionKey in this.selection) {
            exists = false // Reset the variable just in case
            // Compare item keys to see if the item already exists in the selection array
            if (key === this.selection[selectionKey].id) {
                // Now make sure the selected options are a match...
                // If it isn't an exact match, we're going to assume a different 
                // configuration for the same product, so skip this and create a new item
                if (ArrayHelper.jsonSameMembers(item.options, this.selection[selectionKey].options)) {
                    exists = true
                }
            }
            
            if (exists) {
                const oldQty = this.selection[selectionKey].quantity
                this.selection[selectionKey].quantity += Number(quantity)
                
                if (!silent) {
                    this.emit('change')
                    this.emit('item-changed', item, this.selection[selectionKey].quantity, oldQty)
                }
                
                return // Break out
            }
        }

        if (data) {
            this.selection.push({
                id       : key,
                quantity : Number(quantity),
                data     : data,
                options  : [...item.options],
                _index   : this.selection.length,
                _key     : this.nextKey++
            })
            
            if (!silent) {
                this.emit('change')
                this.emit('item-added', key, Number(quantity), item)
            }
        }
    },
    updateItem(key, quantity, item, silent) {
        silent = silent || false
        let data = (item.hasOwnProperty('data')) ? item.data : null
        
        if (this.items.hasOwnProperty(key)) {
            data = this.items[key]
        } else {
            this.items[key] = data
        }

        for (let selectionKey in this.selection) {
            if (key === this.selection[selectionKey].id) {
                const oldQty = this.selection[selectionKey].quantity
                this.selection[selectionKey].quantity += Number(quantity)
                
                if (!silent) {
                    this.emit('change')
                    this.emit('item-changed', item, this.selection[selectionKey].quantity, oldQty)
                }
                
                return
            }
        }

        if (data) {
            this.selection.push({
                id       : key,
                quantity : Number(quantity),
                data     : data,
                options  : [],
                _index   : this.selection.length,
                _key     : this.nextKey++
            })
            
            if (!silent) {
                this.emit('change')
                this.emit('item-added', key, Number(quantity), item)      
            }
        }
    },
    removeItem(index) {
        let id   = this.selection[index].id,
            item = this.selection.splice(index, 1)[0]
        this.reIndex()
        
        this.emit('change')
        this.emit('item-removed', this.items[id])
    },
    addOption(item, quantity, data, product) {
        // Product option sample
        /* "options": [
            { // The product option
                "name": "Packages per Shipment",
                "type": "select",
                "option_value": [
                    {
                        "image": "",
                        "price": false,
                        "price_formated": false,
                        "price_prefix": "+",
                        "product_option_value_id": "527",
                        "option_value_id": "241",
                        "name": "1",
                        "quantity": 0
                    },
                ]
            }
        ]*/
        
        // Selected option value sample
        /* "option": { // The selected option value
            "image": "",
            "price": false,
            "price_formated": false,
            "price_prefix": "+",
            "product_option_value_id": "525",
            "option_value_id": "238",
            "name": "250g",
            "quantity": 0,
            "option": { // The option itself
                "name": "Coffee Package Size",
                "type": "select",
                "required": "1",
                "product_option_id": "253",
                "option_id": "44"
            }
        }*/
        
        // The selection object itself
        /* "selection": [
            {
                data: {}, // Cart item product data
                id: "3382",
                options: [], // I think this is redundant / useless
                quantity: 2,
                _index: 0,
                _key: 0
            }
        ]*/
        
        // Loop over active items in cart (the current selection)
        // If the item being added isn't already in the cart, we 
        // need to add it before processing the option
        let createItem = true
        for (let idx in this.selection) {
            let selection = this.selection[idx]
            if (Number(data.product['id']) === Number(selection.id)) {
                createItem = false
            }
        }
        
        // Store item data if it doesn't exist
        if (createItem) {
            this.addItem(data.product['id'], 1, data.product, true) // Silent add, don't trigger events
        }
        
        // TODO: Update to use .map
        // Loop over active items in cart (the current selection)
        for (let idx in this.selection) {
            if (!(this.selection[idx].options instanceof Array)) {
                this.selection[idx]['options'] = []
            }
            
            if (isNaN(this.selection[idx]._optKey)) {
                this.selection[idx]['nextKey'] = 0
            }
            
            let selection = this.selection[idx]
            
            // If the item being added is already in the cart
            if (data.product['id'] === selection.id) {
                // Update item quantity, if it changed
                //const oldQty = selection.quantity
                //this.selection[idx].quantity += Number(quantity)
                
                // Add the order product option value to the cart
                let selectedOptions = selection.options
                for (let idxOpt in selectedOptions) { 
                    // If the order product option value being added already exists for the item
                    if (item === selectedOptions[idxOpt].id) {
                        // Update item quantity, if it changed
                        const oldQty = selection.quantity
                        this.selection[idx].options[idxOpt].quantity += Number(quantity)
                        
                        if (createItem) {
                            this.emit('change')
                            this.emit('item-added', selection.id, selection.quantity, selection.data)                                   
                        } else {
                            this.emit('change')
                            //this.emit('item-changed', data.product)                            
                        }
                        
                        return
                    // What we do depends on the type 
                    } else {
                        switch (data.option['type']) {
                            case 'select':                         
                                // If the order product option value being added is part of the same option [group] as an existing selection
                                let selectedOptionId = Number(selectedOptions[idxOpt].data.option['option_id'])
                                if (Number(data.option['option_id']) === selectedOptionId) {
                                    // Go ahead and mutate the object, we don't need a new key or index
                                    this.selection[idx].options[idxOpt] = assign(this.selection[idx].options[idxOpt], {
                                        id       : item,
                                        quantity : Number(quantity),
                                        data     : data
                                    })
                                    
                                    if (createItem) {
                                        this.emit('change')
                                        this.emit('item-added', selection.id, selection.quantity, selection.data)                                        
                                    } else {
                                        this.emit('change')
                                        this.emit('product-options-changed', data, Number(quantity), product)
                                    }
                                    
                                    return
                                }
                                
                                break
                        }
                    }
                }
                
                if (data) {
                    let nextKey = this.selection[idx].nextKey++
                    delete data.product
                    
                    this.selection[idx].options.push({
                        id       : item,
                        quantity : Number(quantity),
                        data     : data,
                        _index   : this.selection[idx].options.length,
                        _key     : nextKey
                    })
                    
                    if (createItem) {
                        this.emit('change')
                        this.emit('item-added', selection.id, selection.quantity, selection.data)
                    } else {
                        this.emit('change')
                        this.emit('product-options-changed', data, Number(quantity), product) // TODO: Provide OLD quantity as last emit param
                    }
                }
            }
        }
        
        /*if (this.items.hasOwnProperty(item)) {
            data = this.items[item]
        } else {
            this.items[item] = data
        }*/       
    },
    updateQuantity(index, quantity) {
        let item = this.selection[index]
        const oldQty = item.quantity
        item.quantity = Number(quantity)
        this.emit('change')
        this.emit('item-changed', this.items[item.id], quantity, oldQty)
    },
    reset() {
        this.selection = []
        this.emit('change')
        this.emit('cart-reset')
    },
    clear() {
        this.selection = []
        this.emit('change')
        this.emit('cart-cleared')
    }
    
})

module.exports = CartStore
