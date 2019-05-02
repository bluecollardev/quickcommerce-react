/**
 * @providesModule makeConstant
 */
//import invariant from 'invariant'
import keyMirror from 'keymirror'
import utils from './utils'

let cache = {}

function makeConstant(factory, config, cacheId) {
    //invariant(factory && config && cacheId, 'format check')

    if (cache[cacheId]) {
        return cache[cacheId]
    }

    let dataSources = {}
    let setterMethods = {}

    Object.keys(config).forEach(function(keyName) {
        let key = String(keyName)

        //invariant(key.indexOf('_') !== 0, 'Data source key can not start with \'_\' (key: %s)', key)
        //invariant(key.indexOf('UPDATE') !== 0, 'Data source key can not start with \'UPDATE\' (key: %s)', key)

        dataSources[utils.getStoreFieldKey(key)] = null
        setterMethods[utils.getActionTypeKey(key)] = null
    })

    cache[cacheId] = {
        DataFields: keyMirror(dataSources),
        ActionTypes: keyMirror(setterMethods)
    }
    return cache[cacheId]
}

makeConstant.getInstance = function(cacheId) {
    return cache[cacheId]
}
makeConstant.destructor = function() {
    cache = {}
}

module.exports = makeConstant