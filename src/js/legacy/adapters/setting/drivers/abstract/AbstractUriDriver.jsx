import AbstractSettingDriver from './AbstractSettingDriver.jsx'

export default class AbstractUriDriver extends AbstractSettingDriver {
    fetchSettings(onSuccess, onError) {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
    
    fetchStores(onSuccess, onError) {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }

    fetchStore(id, onSuccess, onError) {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
    
    parseStores(data) {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
    
    parseCountries() {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
    
    parseZones() {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
    
    parseGeoZones() {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
    
    parseOrderStatuses() {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
    
    parseCustomerGroups() {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
}