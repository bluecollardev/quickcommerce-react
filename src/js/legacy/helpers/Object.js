/**********************************************************
 * Namespace: QC.Helpers.Object
 **********************************************************/
import StringHelper from './String.js'

export default class ObjectHelper {
    /**
     * Method: App.Helpers.Object.isEmpty
     */
    static isEmpty = (obj) => {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop) && obj.prop !== null) return false
        }
        
        return true
    }
    
    static recursiveFormatKeys = (data, from, to) => {
        let clone = {}
        let modes = ['underscore', 'camelcase', 'hyphenate']
        if (!(modes.indexOf(from) > -1 || !modes.indexOf(to) > -1)) {
            throw new Error("Cannot normalize data: incorrect mode and currentMode supplied. Valid modes are 'underscore', 'camelcase' and 'hyphenate'.")
        }
        
        Object.keys(data).reduce((obj, prop) => {
            let val = data[prop]
            let newVal = (typeof val === 'object' && val !== null) ? ObjectHelper.recursiveFormatKeys(val, from, to) : val
            
            //console.log("Converting property '" + prop + "' from '" + from + " to " + to + ': ' + JSON.stringify(newVal))
            switch (to) {
                case 'underscore':
                    obj[StringHelper.underscore(prop)] = newVal
                    break
                case 'camelcase':
                    obj[StringHelper.camelize(prop)] = newVal
                    break
                case 'hyphenate':
                    obj[StringHelper.hyphenize(prop)] = newVal
                    break
            }
            return obj
        }, clone)
        
        return clone
    }
    
    /**
     * TODO: A handler like below preserves properties
     * if (old_key !== new_key) {
     *     Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key))
     *     delete o[old_key];
     * }
     */
    static recursiveRenameKeys = (data, mappings) => {
        let clone = {}
        /*let modes = ['underscore', 'camelcase', 'hyphenate']
        if (!(modes.indexOf(from) > -1 || !modes.indexOf(to) > -1)) {
            throw new Error("Cannot normalize data: incorrect mode and currentMode supplied. Valid modes are 'underscore', 'camelcase' and 'hyphenate'.")
        }*/
        
        Object.keys(data).reduce((obj, prop) => {
            let val = data[prop]
            let newVal = (typeof val === 'object' && val !== null) ? ObjectHelper.recursiveFormatKeys(val, mappings) : val
            
            //console.log("Converting property '" + prop + "' from '" + from + " to " + to + ': ' + JSON.stringify(newVal))
            switch (to) {
                case 'underscore':
                    obj[StringHelper.underscore(prop)] = newVal
                    break
                case 'camelcase':
                    obj[StringHelper.camelize(prop)] = newVal
                    break
                case 'hyphenate':
                    obj[StringHelper.hyphenize(prop)] = newVal
                    break
            }
            return obj
        }, clone)
        
        return clone
    }
}