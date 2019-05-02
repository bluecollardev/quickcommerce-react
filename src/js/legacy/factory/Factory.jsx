import assign from 'object-assign'
//import invariant from 'invariant'

import makeAction from './makeAction'
import makeConstant from './makeConstant'
import makeDispatcher from './makeDispatcher'
import makeStore from './makeStore'

export default class Factory {
    constructor() {
        this.isImmutableLibIncluded = this.isImmutableLibIncluded.bind(this)
        this.make = this.make.bind(this)
        this.useAction = this.useAction.bind(this)
        this.useConstant = this.useConstant.bind(this)
        this.useDispatcher = this.useDispatcher.bind(this)
        this.useStore = this.useStore.bind(this)
        this.destructor = this.destructor.bind(this)
    }
    
    isImmutableLibIncluded() {
        return false
    }
    
    /**
     * set up
     */
    make(namespace, config) {
        let that = this
        //invariant(Factory._deps, 'Require to include dependencies firstly')
        //invariant(namespace, 'format check')
        if (typeof namespace === 'object') {
            Object.keys(namespace).forEach(function(ns) {
                that.make(ns, namespace[ns])
            })
            
            return
        }
        
        //invariant(typeof namespace === 'string', 'format check')
        //invariant(config && (typeof config === 'object'), 'format check')

        [makeAction, makeConstant, makeDispatcher, makeStore].forEach(function(className) {
            className(that, config, namespace)
        })
    }
    
    /**
     * shortcut to exposed generated action/constant/dispatcher/store object
     */
    useAction(namespace) {
        return makeAction.getInstance(namespace)
    }
    
    useConstant(namespace) {
        return makeConstant.getInstance(namespace)
    }
    
    useDispatcher(namespace) {
        return makeDispatcher.getInstance(namespace)
    }
    
    useStore(namespace) {
        return makeStore.getInstance(namespace)
    }
    /**
     * tear down
     */
    destructor() {
        if (typeof Factory._deps !== 'undefined') Factory._deps = null
        [makeAction, makeConstant, makeDispatcher, makeStore].forEach(function(className) {
            className.destructor()
        })
    }
}