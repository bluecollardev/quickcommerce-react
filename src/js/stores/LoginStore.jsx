import LoginConstants from '../constants/LoginConstants.jsx'

import BaseStore from './BaseStore.jsx'
//import jwt_decode from 'jwt-decode'
let instance = null

class LoginStore extends BaseStore {   
    constructor(dispatcher) {
        // LoginStore
        super(dispatcher)
        
        if (instance !== null) {
            return instance
        }
        
        // Just monkey patch the parent method
        this.subscribe(() => this.registerToActions.bind(this))
        this.isLoggedIn = this.isLoggedIn.bind(this)
        
        window.LoginStore = instance = this
    }

    registerToActions(action) {
        switch (action.actionType) {
            case LoginConstants.LOGIN_USER:
                this.userToken = action.userToken
                this.emitChange()
                break
            case LoginConstants.LOGOUT_USER:
                this.userToken = null
                this.user = null
                this.emitChange()
                break
            case LoginConstants.SET_USER:
                this.user = action.user
                this.emitChange()
                break
            default:
                break
        }
    }

    isLoggedIn() {
        return !!this.user
    }
}

LoginStore.userToken = null
LoginStore.user = null

export { LoginStore }
