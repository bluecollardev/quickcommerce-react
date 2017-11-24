import LoginConstants from '../constants/LoginConstants.jsx'

import BaseStore from './BaseStore.jsx'

class LoginStore extends BaseStore {   
    constructor(dispatcher) {
        super(dispatcher)
        
        // Just monkey patch the parent method
        this.subscribe(() => this.registerToActions.bind(this))
        this.isLoggedIn = this.isLoggedIn.bind(this)
    }

    registerToActions(action) {
        switch (action.actionType) {
            case LoginConstants.LOGIN_USER:
                this.userToken = action.userToken
                this.isLogged = true
                this.emitChange()
                break
            case LoginConstants.LOGOUT_USER:
                this.userToken = null
                this.isLogged = null
                this.emitChange()
                break
            default:
                break
        }
    }

    isLoggedIn() {
        return !!this.isLogged // TODO: Validate token instead
    }
}

LoginStore.PK = 'token'
LoginStore.userToken = null
LoginStore.isLogged = null

export { LoginStore }