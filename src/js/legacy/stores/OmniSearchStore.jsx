import assign from 'object-assign'

import axios from 'axios'
import { normalize, denormalize, schema } from 'normalizr'

import OmniSearchConstants from '../constants/OmniSearchConstants.jsx'
import FluxFactory from '../factory/Factory.jsx'
import BaseStore from './BaseStore.jsx'
//import jwt_decode from 'jwt-decode'

class OmniSearchStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher)

        this.config = null

        // Data
        this.items = {}

        this.fluxFactory = new FluxFactory()

       
        this.subscribe(() => {
            return this.registerToActions.bind(this)
        })
    }

    registerToActions(action) {
        let payload = JSON.parse(JSON.stringify(action)) // Clone the action so we can modify it as necessary

        switch (action.actionType) {
            // onLoad actions
            case OmniSearchConstants.SEARCH_GENERIC:
                console.log('search generic')
                this.handleAction(payload)
                break

            default:
                break
        }
    }

    has(key) {
        let exists = false
        if (this.items.hasOwnProperty(key) &&
            typeof this.items.key !== 'undefined') {
                exists = true
        }

        return exists
    }

    handleAction(payload) {
        try {
            this.setConfig(payload.config)
            if (typeof payload.config.key !== 'string') {
                throw new Error('Invalid configuration! Payload data key was not provided.')
            }

            let isLoaded = false
            // Check to see if the data has been loaded
            if (this.has(payload.config.key)) {
                let items = this.items[payload.config.key]
                if (items && items.length > 0) {
                    // Data's been loaded
                    isLoaded = true
                }
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

    getItems() {
        // Return an empty array by default if configuration hasn't been provided
        // Triggering an error somewhere just because this store has no items is stupid
        let items = []

        if (this.config !== null && this.config.hasOwnProperty('key')) {
            items = this.items[this.config.key]
        }

        return items
    }

    buildDataStore() {
        if (this.config === null) {
            throw new Error('Invalid configuration! Cannot build datastore.')
        }

        this.fluxFactory.make(this.config.key, this.config.schema)

        let Action = this.fluxFactory.useAction(this.config.key)
        // Generated store is observable, just use addChangeListener to attach listeners
        let Store = this.fluxFactory.useStore(this.config.key)
    }

    fetchData(key, onSuccess, onError) {
        this.buildDataStore()

        let that = this
        axios(this.config.src.transport.read)
        .then(response => {
            let payload = response.data
            // TODO: Allow for configurable key in constants, it's not always payload.data...
            //let normalizedData = normalize(payload.data, that.config.schema)
            let normalizedData = normalize(payload.content, that.config.schema)

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
OmniSearchStore.config = null

// Data
OmniSearchStore.items = {}

export default new OmniSearchStore()
export { OmniSearchStore }
