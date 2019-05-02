/**
 * @providesModule utils
 */
module.exports = {
    // SEARCH_TEXT -> SEARCH_TEXT  (Store letiable)
    getStoreFieldKey: function(configKey) {
        let str = hyphenate(configKey)
        str = str.toUpperCase()
        str = str.replace(/-/g, '_')
        return str
    },
    // SEARCH_TEXT -> UPDATE_SEARCH_TEXT  (Constant::ActionType)
    getActionTypeKey: function(configKey) {
        return 'UPDATE_' + this.getStoreFieldKey(configKey)
    },
    // SEARCH_TEXT -> updateSearchText (Action method, Store method)
    getSetterMethodName: function(configKey) {
        let name = this.getActionTypeKey(configKey)
        name = name.replace(/_/g, '-').toLowerCase()
        return camelize(name)
    },
    // SEARCH_TEXT -> getSearchText (Store method)
    getGetterMethodName: function(configKey) {
        let name = this.getSetterMethodName(configKey)
        return name.replace(/^update/, 'get')
    },
    /**
     * high order function composition
     */
    after: function(base, after) {
        let self = this
        return function() {
            let args = Array.prototype.slice.call(arguments)
            return base.apply(self, args), after.apply(self, args)
        }
    },
    before: function(base, before) {
        let self = this
        return function() {
            let args = Array.prototype.slice.call(arguments)
            return before.apply(self, args), base.apply(self, args)
        }
    },
    around: function(base, fn) {
        let self = this
        return function() {
            let args = Array.prototype.slice.call(arguments)
            return fn.apply(self, [base.apply(self, args)].concat(args))
        }
    },
    bindAll: function(obj) {
        Object.keys(obj).forEach(function(propName) {
            let prop = obj[propName]
            if (typeof prop === "function") {
                obj[propName] = prop.bind(obj)
            }
        })
    }
}

function hyphenate(string) {
    return string.replace(/([A-Z])/g, '-$1').toLowerCase()
}

function camelize(string) {
    return string.replace(/-(.)/g, function(_, character) {
        return character.toUpperCase()
    })
}