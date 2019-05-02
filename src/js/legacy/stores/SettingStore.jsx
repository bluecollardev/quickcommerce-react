import assign from 'object-assign'

import axios from 'axios'
import { normalize, denormalize, schema } from 'normalizr'

import SettingAdapter from '../adapters/setting/SettingAdapter.jsx'
import SettingConstants from '../constants/SettingConstants.jsx'
import BaseStore from './BaseStore.jsx'

import { FileSystem, File, FileTransfer } from '../helpers/Cordova.js'

class SettingStore extends BaseStore {
    static defaultStore = {
        id: 0,
        value: 'Default Store',
        data: {
            name: 'Default Store',
            ssl: '',
            store_id: 0,
            url: ''
        }
    }
    
    constructor(dispatcher, adapter) {
        super(dispatcher)
        
        this.adapter = adapter || null
        
        // TODO: This stuff has moved to QcSettingAdapter
        this.settings = {
            cartConfig: {
                countries: {}
            },
            posConfig: {}
        }
        
        this.posDefaults = {
            address: {
                id: null,
                address_id: null,
                firstname: '',
                lastname: '',
                company: '',
                address1: '',
                address2: '',
                suite: '',
                street: '',
                street_type: '',
                dir: '',
                box: '',
                stn: '',
                city: '',
                zone: '',
                zone_id: null,
                country: '',
                country_id: null,
                postcode: ''
            },
            shop_url: QC_BASE_URI,
            POS_a_country_id: 38,
            POS_a_zone_id: 602,
            POS_c_id: 0,
            POS_c_type: 1,
            POS_initial_status_id: 1,
            POS_initial_status: '',
            POS_complete_status_id: 1,
            POS_complete_status: '',
            config_country_id: 38, // Canada
            config_zone_id: 602, // Alberta
            config_customer_id: 0,
            config_customer_group_id: 1,
            config_customer_type: 1,
            config_currency: 'CAD',
            config_currency_id: 5, // CAD
            config_invoice_prefix: 'pos',
            config_shipping_method: 'instore',
            config_shipping_code: 'instore.instore',
            config_shipping_country: 'Canada',
            config_shipping_zone: 'Alberta',
            config_payment_method: 'In Store',
            config_payment_code: 'in_store',
            config_payment_country: 'Canada',
            config_payment_zone: 'Alberta',
            default_customer: '',
            default_customer_id: 0,
            default_customer_group: '',
            default_customer_group_id: 1,
            default_customer_firstname: 'In-Store',
            default_customer_lastname: 'Customer',
            default_customer_company: '',
            default_customer_email: 'info@acecoffeeroasters.com',
            default_customer_telephone: '780-414-1200',
            default_customer_fax: '',
            default_customer_address1: 'In-Store',
            default_customer_address2: '',
            default_customer_address_id: 0,
            default_customer_city: 'Edmonton',
            default_customer_country: 'Canada',
            default_customer_country_id: 38,
            default_customer_zone: 'Alberta',
            default_customer_zone_id: 602,
            default_customer_postcode: ''
        }
        
        this.posSettings = {
            POS_a_country_id: 38,
            POS_a_zone_id: 602,
            POS_c_id: 0,
            POS_initial_status_id: 1,
            POS_initial_status: '',
            POS_complete_status_id: 1,
            POS_complete_status: '',
            POS_c_type: 1,
            shop_url: QC_BASE_URI
        }
        
        this.unfreezeSettings()
        
        this.stores = [assign({}, SettingStore.defaultStore)]
        
        this.customerGroups = [{id: null, value: ''}]
        this.orderStatuses = [{id: null, value: ''}]
        this.countries = [{id: null, value: ''}]
        this.zones = [{id: null, value: ''}]
        this.geoZones = [{id: null, value: ''}]
        
        this.contactTypes = [{id: null, value: ''}] // Temp?
        this.currencyCodes = [{id: null, value: ''}] // Temp?
        this.salutations = [{id: null, value: ''}] // Temp?
        
        /*this.countries: [{
            version: 0,
            code: 'CA',
            name: 'Canada',
            description: null,
            system: false,
            id: 1,
            postalCodeName: 'Postal Code',
            disabled: false,
            expired: false,
            effective: true
        }, {
            version: 0,
            code: 'US',
            name: 'United States',
            description: null,
            system: false,
            id: 2,
            postalCodeName: 'Zip Code',
            disabled: false,
            expired: false,
            effective: true
        }]*/

       
        this.subscribe(() => this.registerToActions.bind(this))
        
        // Attach a setting adapter if it wasn't provided
        this.adapter = new SettingAdapter(this, adapter)
    }
    
    registerToActions(action) {
        switch (action.actionType) {
            case SettingConstants.FETCH_SETTINGS:
                this.fetchSettings()
                break
            case SettingConstants.SET_SETTINGS:
                this.setSettings(action.settings)
                break
            case SettingConstants.SET_CONFIG:
                this.setConfig(action.config)
                break
            case SettingConstants.FETCH_STORES:
                this.fetchStores()
                break
            case SettingConstants.FETCH_STORE:
                this.fetchStore(action.storeId)
                break
            default:
                break
        }
    }
    
    getSettings() {
        return assign({}, this.settings, {
            posDefaults: this.posDefaults,
            posSettings: assign({}, this.posDefaults, this.posSettings)
        })
    }
    
    setSettings(settings) {
        this.posSettings = assign({}, this.posDefaults, this.posSettings, settings)
        this.freezeSettings(this.posSettings)
    }
    
    /**
     * Saves default app (POS) settings to localStorage
     */
    freezeSettings(settings) {
        localStorage.setItem('POS_settings', JSON.stringify(settings))
    }
    
    /**
     * Retreives default app (POS) settings from localStorage
     */
    unfreezeSettings() {
        if (typeof localStorage.getItem('POS_settings') === 'string') {
            this.posSettings = JSON.parse(localStorage.getItem('POS_settings'))
        }
    }
    
    /**
     * The old way of doing things (formerly fetchSettings)
     */
    fetchOcSettings(onSuccess, onError) {
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
            
            this.parseCountries()
            this.parseZones()
            this.parseGeoZones()
            this.parseOrderStatuses()
            this.parseCustomerGroups()
            
            this.fetchCategories(() => {
                this.parseCategories()
            }, onError) // Should be done concurrently with fetchSettings 

            this.emit('settings-loaded', payload)
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
        })
    }
    
    fetchSettings() {
        try {            
            this.adapter.fetchSettings(
                (settings) => {
                    // On success
                    this.emit('settings-loaded', settings)
                },
                () => {
                    // On error
                    this.emit('settings-loaded-error')
                }
            )
        } catch (err) {
            console.log(err)
        }
    }
    
    getConfig() {
        return this.config
    }
    
    setConfig(config) {
        this.config = assign({}, this.config, config)
        //this.freezeConfig(this.config)
    }
    
    fetchCategories(onSuccess, onError) {
        axios({
            url: QC_LEGACY_API + 'categories/level/1',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            // Resource API nests payload data inside its own data property
            let payload = (response.data.hasOwnProperty('data')) ? response.data.data : response.data
            // TODO: Throw null data error? Not sure... I'll think about it
            this.rawCategories = payload
            
            console.log('saving categories')
            console.log(this.rawCategories)

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }
            
            //this.parseCategories()

            this.emit('categories-loaded', payload)
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
        })
    }
    
    /**
     * Legacy
     */
    setStoreId(model) {
        // Accepts session string or model
        let storeId = null
        
        model = model || false
        if (model && model instanceof kendo.data.Model) {
            storeId = model.get('storeId')
            if (typeof storeId === 'string') {
                localStorage.setItem('storeId', storeId)
            }
        } else if (model && (typeof model === 'string' || typeof model ===  'number')) {
            model = (typeof model === 'number') ? parseInt(model) : model
            storeId = model
            localStorage.setItem('storeId', storeId)
        }
    }
    
    /**
     * Legacy
     */
    getStoreId() {
        let that = this
        
        if (!(localStorage.hasOwnProperty('storeId'))) {
            return false
        }
        
        if (localStorage.hasOwnProperty('storeId')) {
            return localStorage.getItem('storeId')
        } else {
            return false
        }
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
    
    getDefaultStore() {
        return SettingStore.defaultStore
    }    

    getStoreData(storeId) {
        /*if (typeof this.stores[storeId] !== 'undefined') {
            return this.stores[storeId].data
        }*/
        
        let store = null
        storeId = storeId || 0
        
        for (let idx = 0; idx < this.stores.length; idx++) {
            if (this.stores[idx].id === Number(storeId)) {
                store = this.stores[idx]
                break
            }
        }
        
        return store.data
    }
    
    parseStores(data) {
        let obj = data
        let stores = Object.keys(obj).map(s => {
            return { id: obj[s]['store_id'], value: obj[s]['name'], data: obj[s] }
        })
        
        // Prepend default store, which is never returned in the results
        stores.unshift(assign({}, SettingStore.defaultStore))
        
        this.stores = stores
    }
    
    getCountryName(id) {
        return (!isNaN(id) && this.countries.hasOwnProperty(id)) ? this.countries[id].value : ''
    }
    
    getCountries() {
        return this.countries
    }
    
    parseCountries() {
        let obj = this.settings.cartConfig.countries
        this.countries = Object.keys(obj).map(c => {
            return { id: c, value: obj[c] }
        })
    }
    
    /**
     * TODO: I need to be refactored cartConfig is specific to the upcoming OC setting adapter
     */
    getZones(countryId) {
        countryId = countryId || null
        let obj = this.settings.cartConfig.zones
        
        if (countryId !== null && !isNaN(countryId)) {
            return this.zones[countryId]
        } else if (Object.keys(this.zones).length === 1) {
            // Default country
            let zones = this.zones[Object.keys(this.zones)[0]] 
            // TODO: This works, but if countryId isn't supplied and zones haven't loaded 
            // it returns an object instead of an array (which is expected); we addressed this
            // in the return but yeah, this needs to be rewritten
            return (zones instanceof Array) ? zones : [{id: null, value: ''}]
        }
        
        return [{id: null, value: ''}]
    }
    
    parseZones() {
        let obj = this.settings.cartConfig.zones
        let results = {}
        
        // Keys are country IDs
        let keys = Object.keys(obj)
        if (keys && keys.length > 0) {        
            for (let idx = 0; idx < keys.length; idx++) {
                results[keys[idx]] = Object.keys(obj[keys[idx]]).map(z => {
                    return { id: z, value: obj[keys[idx]][z] }
                })
            }   
        }
        
        this.zones = results
    }
    
    parseGeoZones() {
        let obj = this.settings.cartConfig.geoZones
        this.geoZones = Object.keys(obj).map(g => {
            return { id: g, value: obj[g] }
        })
    }
    
    parseOrderStatuses() {
        let obj = this.settings.cartConfig.orderStatuses
        this.orderStatuses = Object.keys(obj).map(s => {
            return { id: s, value: obj[s] }
        })
    }
    
    parseCustomerGroups() {
        let obj = this.settings.cartConfig.customerGroups
        this.customerGroups = Object.keys(obj).map(g => {
            return { id: g, value: obj[g] }
        })
    }
    
    parseCategories() {
        let obj = this.rawCategories
        this.categories = Object.keys(obj).map(c => { // TODO: Sort array
            return { id: obj[c]['category_id'], value: obj[c]['name'], data: obj[c] } // Uses legacy API for now
        })
    }
    
    /**
     * Everything below has been pulled from legacy QuickCommerce POS app and needs to be refactored
     * Note: File API functions such as resolveLocalFileSystemURL will only work when using Chrome's V8 JS Engine
     * Cordova/PhoneGap, Chrome and NWJS all use the V8 engine internally
     */
    loadConfig() {
        let that = this,
            configFileDir,
            configFileName = 'config.ini'
        
        
        if (typeof cordova !== 'undefined') {
            configFileDir = cordova.file.externalDataDirectory
        
            console.log('----------- LOADING CONFIG -----------')
            console.log('loading config from ' + configFileDir + configFileName)
            
            window.resolveLocalFileSystemURL(configFileDir, function (directoryEntry) {
                File.directoryGetFile(directoryEntry, configFileName, function (file) {
                    let reader = new FileReader()
                    reader.onloadend = function (evt) {
                        console.log('on load end')
                        that.parseConfigFile(reader, function (context, dataDir, fileName) {
                            console.log(dataDir)
                            console.log(fileName)
                        })
                    }
                    reader.readAsText(file)
                }, { create: false, exclusive: true })
            }, function (error) {
                console.log('Error - ', error)
                console.log(cordova.file.externalDataDirectory + 'data')
            })
        }
    }
    
    parseConfigFile(reader, isFileCallback) {
        let that = this,
            page = that.getPage(),
            lineRegex = /[\r\n]+/g,
            configRegex = /([\w]+)\s?\=\s?([\w]+)/,
            isDataDir = false,
            dataDir = false,
            fileName,
            matches
        
        let lines = reader.result.split(lineRegex) // tolerate both Windows and Unix linebreaks
        let pairs,
            idx = 0,
            key, value

        for (idx; idx < lines.length; idx++) {
            pairs = lines[idx].match(configRegex)

            if (pairs.length === 3) {
                key = pairs[1]
                value = pairs[2]

                switch (key) {
                    case 'store_id':
                        that.setStoreId(value)
                        break
                    case 'control_file':
                        that.setControlFilePrefix(value)
                        break
                }
            }
        }
    }
    
    setControlFilePrefix(model) {
        // Accepts local string or model
        let filePrefix = null
        
        model = model || false
        if (model && model instanceof kendo.data.Model) {
            filePrefix = model.get('controlFilePrefix')
            if (typeof filePrefix === 'string') {
                localStorage.setItem('controlFilePrefix', filePrefix)
            }
        } else if (model && (typeof model === 'string' || typeof model ===  'number')) {
            model = (typeof model === 'number') ? parseInt(model) : model
            filePrefix = model
            localStorage.setItem('controlFilePrefix', filePrefix)
        }
    }
    
    getControlFilePrefix() {
        let that = this
        
        if (!(localStorage.hasOwnProperty('controlFilePrefix'))) {
            return 'control'
        }
        
        if (localStorage.hasOwnProperty('controlFilePrefix')) {
            return localStorage.getItem('controlFilePrefix')
        } else {
            return  'control'
        }
    }
    
    setConfigFileName(model) {
        // Accepts session string or model
        let configFileName = null
        
        model = model || false
        if (model && model instanceof kendo.data.Model) {
            configFileName = model.get('configFileName')
            if (typeof configFileName === 'string') {
                localStorage.setItem('configFileName', configFileName)
            }
        } else if (model && (typeof model === 'string' || typeof model ===  'number')) {
            model = (typeof model === 'number') ? parseInt(model) : model
            configFileName = model
            localStorage.setItem('configFileName', configFileName)
        }
    }
    
    getConfigFileName() {
        if (!(localStorage.hasOwnProperty('configFileName'))) {
            return false
        }
        
        if (localStorage.hasOwnProperty('configFileName')) {
            return localStorage.getItem('configFileName')
        } else {
            return false
        }
    }
}

export default new SettingStore()
export { SettingStore }