/**
 * @providesModule makeAction
 */
//import invariant from 'invariant'
import { Dispatcher } from 'flux'

import makeConstant from './makeConstant'
import makeDispatcher from './makeDispatcher'
import utils from './utils'

let cache = {}

function makeSetterMethod(factory, dispatcher, actionType, payloadProps) {
    //let Dispatcher = factory._deps.flux.Dispatcher

    //invariant(dispatcher instanceof Dispatcher, 'format check')
    //invariant(actionType, 'format check')
    //invariant(Array.isArray(payloadProps), 'format check')

    let payload = {type: actionType}

    return function(a, b, c, d, e, _) {
        //invariant(_ === undefined, 'Too many arguments')
        let argLen = arguments.length
        // invariant(argLen === payloadProps.length)
        for (let i = 0; i < argLen; i++) {
            payload[payloadProps[i]] = arguments[i]
        }

        dispatcher.handleViewAction(payload)
    }
}

function makeAction(factory, config, cacheId) {
    //invariant(factory && config && cacheId, 'format check')

    if (cache[cacheId]) {
        return cache[cacheId]
    }

    let actionMethods = {}
    let constantAssociated = makeConstant(factory, config, cacheId)
    let dispatcherAssociated = makeDispatcher(factory, config, cacheId)

    Object.keys(config).forEach(function(_key) {
        let name = utils.getSetterMethodName(_key)
        let actionType = utils.getActionTypeKey(_key)
        // though it's key-mirrored, but by logic, we should use the
        // value instead of key
        actionType = constantAssociated.ActionTypes[actionType]

        let actionMethodParams = config[_key]
        actionMethods[name] = makeSetterMethod(factory, dispatcherAssociated, actionType, actionMethodParams)
    })

    cache[cacheId] = actionMethods
    return cache[cacheId]
}

makeAction.getInstance = function(cacheId) {
    return cache[cacheId]
}
makeAction.destructor = function() {
    cache = {}
}

module.exports = makeAction