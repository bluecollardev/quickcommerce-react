import UserConstants from '../constants/UserConstants.jsx'

import BaseStore from './BaseStore.jsx'

class UserStore extends BaseStore {    
    constructor(dispatcher) {
        super(dispatcher)
        
       
        this.subscribe(() => this.registerToActions.bind(this))
		this.isLoggedIn = this.isLoggedIn.bind(this)
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

UserStore.PK = 'user_id'
UserStore.user = null

export { UserStore }