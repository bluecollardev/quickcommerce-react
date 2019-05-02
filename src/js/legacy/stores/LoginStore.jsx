import LoginConstants from '../constants/LoginConstants.jsx'

import BaseStore from './BaseStore.jsx'

class LoginStore extends BaseStore {   
    constructor(dispatcher) {
        super(dispatcher)
        
       
        this.subscribe(() => this.registerToActions.bind(this))
        this.isLoggedIn = this.isLoggedIn.bind(this)
    }

	/**
	 * @param action Plain JavaScript object passed in from ActionCreator (see actions)
	 */
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
			case LoginConstants.SET_CREDS:
                this.userCreds = action.userCreds
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
LoginStore.userCreds = null
LoginStore.isLogged = null

export { LoginStore }