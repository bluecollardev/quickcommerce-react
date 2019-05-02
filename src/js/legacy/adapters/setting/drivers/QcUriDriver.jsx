import axios from 'axios'

import AbstractUriDriver from './abstract/AbstractUriDriver.jsx'

export default class QcUriDriver extends AbstractUriDriver {    
    constructor(adapter) {
        super(adapter)
        
        this.settings = {}
    }
    
    fetchSettings(onSuccess, onError) {
        axios({
            url: QC_API + 'referenceData',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            // Resource API nests payload data inside its own data property
            let payload = (response.data.hasOwnProperty('data')) ? response.data.data : response.data
            // TODO: Throw null data error? Not sure... I'll think about it
            this.settings = payload

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
        })
    }
    
    fetchStores(onSuccess, onError) {
        axios({
            url: QC_RESOURCE_API + 'store',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            // Resource API nests payload data inside its own data property
            let payload = (response.data.hasOwnProperty('data')) ? response.data.data : null
            // TODO: Throw null data error? Not sure... I'll think about it
            this.parseStores(payload)

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }
            
            this.emit('stores-loaded', this.stores)
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
        })
    }

    fetchStore(id, onSuccess, onError) {
        axios({
            url: QC_RESOURCE_API + 'store/' + id,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            // Resource API nests payload data inside its own data property
            let payload = (response.data.hasOwnProperty('data')) ? response.data.data : null
            // TODO: Throw null data error? Not sure... I'll think about it
            this.stores[id] = payload

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }

            this.emit('store-info-loaded', id, payload)
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
        })
    }
    
    parseStores(data) {
        let obj = data
        return Object.keys(obj).map(s => {
            return { id: obj[s]['store_id'], value: obj[s]['name'], data: obj[s] }
        })
    }
    
    parseCountries() {
        let obj = this.settings.cartConfig.countries
        return Object.keys(obj).map(c => {
            return { id: c, value: obj[c] }
        })
    }
    
    parseZones() {
        let obj = this.settings.cartConfig.zones
        let zones = {}
        
        // Keys are country IDs
        let keys = Object.keys(obj)
        if (keys && keys.length > 0) {        
            for (let idx = 0; idx < keys.length; idx++) {
                zones[keys[idx]] = Object.keys(obj[keys[idx]]).map(z => {
                    return { id: z, value: obj[keys[idx]][z] }
                })
            }   
        }
        
        return zones
    }
    
    parseGeoZones() {
        let obj = this.settings.cartConfig.geoZones
        return Object.keys(obj).map(g => {
            return { id: g, value: obj[g] }
        })
    }
    
    parseOrderStatuses() {
        let obj = this.settings.cartConfig.orderStatuses
        return Object.keys(obj).map(s => {
            return { id: s, value: obj[s] }
        })
    }
    
    parseCustomerGroups() {
        let obj = this.settings.cartConfig.customerGroups
        return Object.keys(obj).map(g => {
            return { id: g, value: obj[g] }
        })
    }
}