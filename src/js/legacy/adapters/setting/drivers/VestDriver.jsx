import TextDriver from './TextDriver.jsx'

export default class VestDriver extends TextDriver {
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
}