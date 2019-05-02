import axios from 'axios'
import assign from 'object-assign'
import { normalize, denormalize, schema } from 'normalizr'

import { EventEmitter } from 'events'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'

import BrowserConstants from '../constants/BrowserConstants.jsx'

class BrowserStore extends EventEmitter {
    // BrowserStore constructor
    constructor(dispatcher) {
        super()
        
        this.stepForward = false
        this.config = null

        // Data 
        this.dispatcher = dispatcher
        
        this.items = {}
        this.availableTracks = [] // Just so we don't forget VEST
        this.availableDates = [] // VEST as well
        this.unavailableDates = [] // Bookings
        
       
        this.subscribe(() => this.registerToActions.bind(this))
    }
    
    subscribe(actionSubscribe) {
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
    
    registerToActions(action) {
        let payload = JSON.parse(JSON.stringify(action)) // Clone the action so we can modify it as necessary
        
        switch (action.actionType) {
            // onLoad actions
            case BrowserConstants.LOAD_CATEGORY:
                this.handleAction(payload)
                break
                
            case BrowserConstants.LOAD_PRODUCT:
                if (payload.category !== null && !Number.isNaN(payload.category)) {
                    this.category = payload.category // Store category id
                    // And adjust the endpoint accordingly...
                    // TODO: Use a template to do this part... 
                    payload.config.src.transport.read.url = payload.config.src.transport.read.url.replace('{id}', payload.category.toString())
                    this.handleAction(payload)
                }
                
                break
                
            case BrowserConstants.LOAD_OPTION:
                console.log('load option')
                // Option data is nested in the product, we don't need to fetch anything
                this.items['options'] = []
                
                
                // Using Object.keys lets us handle arrays and objects
                this.items['options'] = Object.keys(payload.options).map(key => {
                    let option = payload.options[key]
                    option['product'] = payload.product
                    
                    return option
                }) // Just set the key
                
                this.handleAction(payload)
                break
                
            case BrowserConstants.LOAD_QUANTITY:
                console.log('load quantity')
                this.handleAction(payload)
                break
                
            // onSelect actions
            case BrowserConstants.SELECT_CATEGORY:
                console.log('selected category')
                this.emitChange()
                break
                
            case BrowserConstants.SELECT_PRODUCT:
                console.log('selected product')
                this.emitChange()
                break
                
            case BrowserConstants.SELECT_OPTION:
                console.log('selected option')
                this.emitChange()
                break
                
            case BrowserConstants.SELECT_QUANTITY:
                console.log('selected quantity')
                this.emitChange()
                break
                
            default:
                break
        }
    }
    
    has(key) {
        let exists = false
        if (this.items.hasOwnProperty(key) && 
            typeof this.items[key] !== 'undefined') {
                exists = true
        }
            
        return exists
    }
	
	hasItems() {
		let config = this.config || null
		
		if (config !== null && this.config.hasOwnProperty('key')) {
			if (typeof this.config[key] === 'string') {
				return this.has(this.config[key])
			}
		}
		
		return false
    }
    
    handleAction(payload) {
        try {
            this.setConfig(payload.config)
            if (typeof payload.config.key !== 'string') {
                throw new Error('Invalid configuration! Payload data key was not provided.')
            }
            
            let isLoaded = false
            let dataLoaded = payload.loaded || false
            // Check to see if the data has been loaded
            if (this.has(payload.config.key) && dataLoaded) {
                isLoaded = true
            }
                
            if (!isLoaded) {
                // Fetch data and trigger the change
                this.fetchData(payload.config.key, () => this.emitChange())
            } else {
                // No need to fetch, just trigger the change
                this.emitChange()
            }
            
        } catch (err) {
            console.log(err)
        }
    }
    
    // Temporary function to refactor
    setConfig(config) {
        this.config = config
    }
    
    getConfig() {
        return this.config
    }
    
    getItems(sort) {
        let unsorted = this.items[this.config.key]
        
        let sorted = null
        if (typeof sort === 'string' && ['default', 'numeric', 'unsorted'].indexOf(sort) > -1) {
            switch (sort) {
                case 'default':
                    sorted = unsorted.sort((a, b) => {
                        // TODO: Use mappings!
                        return parseInt(a['sort_order']) > parseInt(b['sort_order'])
                    })
                    return sorted
                case 'numeric':
                    /* Griddle 0.x uses alphanum sort so if you have orders [1,2,...,11], 
                    it will end up being sorted [1,11,2,3,...], which is NOT what we want */
                    sorted = unsorted.sort((a, b) => {
                        // TODO: Use mappings!
                        return parseInt(a['sort_order']) - parseInt(b['sort_order'])
                    })
                    return sorted
                case 'unsorted':
                    return unsorted
                default:
                    return unsorted
            }
        }
        
        return unsorted
    }
    
	getItemAtIndex(idx) {
        return this.items[this.config.key][idx]
    }
	
    getItem(id) {
        return this.items[this.config.key]
    }
    
    getCategories() {
        return this.items['categories']
    }
    
    getOptions() {
        return this.items['options']
    }
    
    getProductOptions() {
        return this.getOptions()
    }
    
    getProductOptionValues(productOptionId) {
        let values = []
        
        let productOption = this.items['options'].filter(option => {
            return option['product_option_id'] === productOptionId
        })
        
        if (productOption.length === 1) {
            values = productOption[0]['product_option_values']
        }
        
        return values
    }
    
    getOption(productOptionId) {
        let productOption = this.items['options'].filter(option => {
            return option['product_option_id'] === productOptionId
        })
        
        if (productOption.length === 1) {
            return productOption.option
        }
    }
    
    buildDataStore() {
        if (this.config === null) {
            throw new Error('Invalid configuration! Cannot build datastore.')
        }
    }
    
    fetchData(key, onSuccess, onError) {      
        let that = this
        axios(this.config.src.transport.read)
        .then(response => {
            let payload = response.data
            let normalizedData = normalize(payload.data, that.config.schema)
            
            // Normalize our data and store the items
            if (typeof key === 'string' && key !== '') {
                this.items[key] = Object.keys(normalizedData.result).map(key => {
                    let item = normalizedData.result[key]
                    
                    // TODO: Maybe there's a better way to clean/decode item names
                    // Clean/decode name
                    let elem = document.createElement('textarea')
                    elem.innerHTML = item.name
                    item.name = elem.value
                    
                    return item
                })
            } else {
                // Set to root
                this.items = Object.keys(normalizedData.result).map(key => normalizedData.result[key])
            }
            
            if (typeof onSuccess === 'function') {
                onSuccess()
            }
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
            // Only if sample data is loaded...
            //let normalizedData = normalize(SampleItems.data, that.config.schema)
            //this.items = Object.keys(normalizedData.result).map(key => normalizedData.result[key])
        })
    }
}

// Static config and options
BrowserStore.stepForward = false
BrowserStore.config = null

// Data 
BrowserStore.items = {}
BrowserStore.availableTracks = [] // Just so we don't forget VEST
BrowserStore.availableDates = [] // VEST as well
BrowserStore.unavailableDates = [] // Bookings
BrowserStore.dispatchToken = null

export { BrowserStore }