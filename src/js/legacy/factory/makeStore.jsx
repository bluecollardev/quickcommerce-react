/**
 * @providesModule makeStore
 */
import assign from 'object-assign'
//import invariant from 'invariant'
import EventEmitter from 'events'

import makeConstant from './makeConstant'
import makeDispatcher from './makeDispatcher'
import utils from './utils'

let CHANGE_EVENT = 'change'

let cache = {}
let emptyFunc = function() {}
let dispatcherTokens = {}

function makeStore(factory, config, cacheId) {
    //invariant(factory && config && cacheId, 'format check')

    let Immutable = null //factory._deps.immutable

    if (cache[cacheId]) {
        return cache[cacheId]
    }

    let Store = assign({}, EventEmitter.prototype, {
        emitChange: function(field, memo) {
            this.emit(CHANGE_EVENT, memo)
        },
        addChangeListener: function(listener) {
            this.on(CHANGE_EVENT, listener)
        },
        removeChangeListener: function(listener) {
            this.removeListener(CHANGE_EVENT, listener)
        }
    })

    let constantAssociated = makeConstant(factory, config, cacheId)
    let dispatcherAssociated = makeDispatcher(factory, config, cacheId)

    Store._dataFields = {}

    Object.keys(config).forEach(function(_key) {
        Store._dataFields[_key] = factory.isImmutableLibIncluded() ? Immutable.fromJS({}) :{}
        let setterMethodName = utils.getSetterMethodName(_key)
        Store[setterMethodName] = setterFuncFactory(_key)
        let getterMethodName = utils.getGetterMethodName(_key)
        Store[getterMethodName] = getterFuncFactory(_key)
    })

    function getterFuncFactory(field) {
        return function() {
            let data = Store._dataFields[field]
            factory.isImmutableLibIncluded() && (data = data.toJSON())
            return assign({}, data)
        }
    }
    function setterFuncFactory(field) {
        return function(data) {
            // mode 1: w/o immutable
            if (!factory.isImmutableLibIncluded()) {
                Store._dataFields[field] = data
                Store.emitChange(field, data)
                return
            }
            // mode 2: with immutable
            let current = Store._dataFields[field]
            let next = current.mergeDeep(Immutable.fromJS(data, function (key, value) {
                let isIndexed = Immutable.Iterable.isIndexed(value)
                return isIndexed ? value.toList() : value.toOrderedMap()
            }))
            let isDirty = (next !== current)
            if (isDirty) {
                Store._dataFields[field] = next
                Store.emitChange(field, data)
            }
        }
    }

    let onDispatcherPayload = function(payload) {
        return payload.action
    }
    Object.keys(config).forEach(function(_key) {
        let setterMethodName = utils.getSetterMethodName(_key)
        let actionType = utils.getActionTypeKey(_key)
        // though it's key-mirrored, but by logic, we should use the
        // value instead of key
        actionType = constantAssociated.ActionTypes[actionType]
        // tail recursion
        onDispatcherPayload = utils.after(onDispatcherPayload, function(expectedType, payload) {
            let action = payload.action
            if (action.type === expectedType) {
                let actionCloned = assign({}, action)
                delete(actionCloned.type)
                Store[setterMethodName](actionCloned)
            }
            return payload.action
        }.bind(Store, actionType))
    })
    // give user a chance to touch inside this dispatcher handler
    Store.onDispatcherPayload = emptyFunc
    onDispatcherPayload = utils.after(onDispatcherPayload, function(a, b, c) {
        Store.onDispatcherPayload(a, b, c)
    })

    Store.dispatchToken = dispatcherAssociated.register(onDispatcherPayload)
    dispatcherTokens[cacheId] = Store.dispatchToken

    utils.bindAll(Store)

    cache[cacheId] = Store
    return cache[cacheId]
}

makeStore.getInstance = function(cacheId) {
    return cache[cacheId]
}
makeStore.destructor = function() {
    Object.keys(dispatcherTokens).forEach(function(cacheId) {
        let Store = makeStore.getInstance(cacheId)
        let Dispatcher = makeDispatcher.getInstance(cacheId)
        if (!Store || !Dispatcher) return
        if (Dispatcher && (typeof Dispatcher.unregister === 'function')) {
            Dispatcher.unregister(dispatcherTokens[cacheId])
        }
    })
    cache = {}
}

module.exports = makeStore