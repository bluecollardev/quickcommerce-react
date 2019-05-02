import assign from 'object-assign'

import AbstractSettingAdapter from './abstract/AbstractSettingAdapter.jsx'
import QcUriDriver from './drivers/QcUriDriver.jsx'

import SettingStore from '../../stores/SettingStore.jsx'

export default class QcSettingAdapter extends AbstractSettingAdapter {
    constructor(fluxStore) {
        // Parent sets the store to use
        super(fluxStore)
        
        // Specify which settings driver to use
        this.driver = new QcUriDriver(this)
        
        this.stores = [{id: null, value: ''}]
        
        this.customerGroups = [{id: null, value: ''}]
        this.orderStatuses = [{id: null, value: ''}]
        this.countries = [{id: null, value: ''}]
        this.zones = [{id: null, value: ''}]
        this.geoZones = [{id: null, value: ''}]
        
        this.contactTypes = [{id: null, value: ''}] // Temp?
        this.currencyCodes = [{id: null, value: ''}] // Temp?
        this.salutations = [{id: null, value: ''}] // Temp?
    }
    
    getZones(countryId) {
        /*countryId = countryId || null
        let obj = this.settings.cartConfig.zones
        
        if (countryId !== null && !isNaN(countryId)) {
            return this.zones[countryId]
        }*/
        
        return [{id: null, value: ''}]
    }
    
    fetchSettings(onSuccess, onError) {
        this.driver.fetchSettings((payload) => {
            //let stores = this.driver.parseStores()
            // Prepend default store, which is never returned in the results
            //stores.unshift(assign({}, SettingStore.getDefaultStore()))
            //this.store.stores = stores
            
            this.store.countries = this.driver.parseCountries()
            this.store.zones = this.driver.parseZones()
            this.store.geoZones = this.driver.parseGeoZones()
            this.store.orderStatuses = this.driver.parseOrderStatuses()
            this.store.customerGroups = this.driver.parseCustomerGroups()
            
            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }
        }, onError)
    }
}