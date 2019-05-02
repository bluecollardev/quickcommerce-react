/**
 * @providesModule makeDispatcher
 */
import assign from 'object-assign'
//import invariant from 'invariant'
import keyMirror from 'keymirror'
import { Dispatcher } from 'flux'

import utils from './utils'

let cache = {}

function curryPayloadSource(source) {
    return function(action) {
        this.dispatch({
            source: source,
            action: action
        })
    }
}

function makeDispatcher(factory, config, cacheId) {
    //invariant(factory && config && cacheId, 'format check')

    if (cache[cacheId]) {
        return cache[cacheId]
    }
    
    //let Dispatcher = factory._deps.flux.Dispatcher

    cache[cacheId] = assign(new Dispatcher(), {
        handleServerAction: curryPayloadSource(makeDispatcher.PayloadSources.SERVER_ACTION),
        handleViewAction: curryPayloadSource(makeDispatcher.PayloadSources.VIEW_ACTION)
    })
    
    utils.bindAll(cache[cacheId])
    
    return cache[cacheId]
}

makeDispatcher.PayloadSources = keyMirror({
    VIEW_ACTION: null,
    SERVER_ACTION: null
})

makeDispatcher.getInstance = function(cacheId) {
    return cache[cacheId]
}
makeDispatcher.destructor = function() {
    cache = {}
}

module.exports = makeDispatcher