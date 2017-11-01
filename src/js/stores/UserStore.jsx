import UserConstants from '../constants/UserConstants.jsx'

import BaseStore from './BaseStore.jsx'

let instance = null

class UserStore extends BaseStore {    
    constructor(dispatcher) {
        super(dispatcher)
        
        if (instance !== null) {
            return instance
        }
        
        // Just monkey patch the parent method
        this.subscribe(() => this.registerToActions.bind(this))
        
        window.UserStore = instance = this
    }

    registerToActions(action) {
        switch (action.actionType) {
            case UserConstants.SET_USER:
                this.user = action.user
                this.emitChange()
                break
            case UserConstants.CLEAR_USER:
                this.user = null
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

UserStore.user = null

export default new UserStore()
export { UserStore }
