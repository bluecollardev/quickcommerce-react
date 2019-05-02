import axios from 'axios'

import { BaseService } from './BaseService.jsx'

export default class AuthService extends BaseService {
    login(email, password, onSuccess, onError) {
        if (AUTH_MODE === 'normal') {
            // Revert to legacy
            return this.handleAuth(axios({
                url: QC_LEGACY_API + 'login/',
                data: JSON.stringify({
                    email: email,
                    password: password
                }),
                method: 'POST'
            }), onSuccess, onError)
        } else if (AUTH_MODE === 'legacy') {
            // Revert to legacy
            return this.handleAuth(axios({
                url: QC_LEGACY_API + 'login/',
                data: JSON.stringify({
                    email: email,
                    password: password
                }),
                method: 'POST'
            }), onSuccess, onError)
        } else if (AUTH_MODE === 'mock') {
            // No auth mode provided, or using mock data
            // Fire away... get any user
            // TODO: This could be user service too depending on a to-be-added mode
            // How do I make this (and customer selection) easily configurable?
            
            // Store auth and current, authorized account
            this.actions.login.loginUser('DUMMYtoken12345') // Set token
            this.actions.user.setUser({}) // Set data
            
            if (typeof onSuccess === 'undefined') return
    
            /*console.log('executing onResponseReceived onSuccess callback')
            if (typeof onSuccess === 'function') {
                let fn = onSuccess
                fn({})
            }*/
            
            return this.handleAuth(Promise.resolve({ status: 200, data: { success: true, data: {} } }), onSuccess, onError)
        }
    }

    logout() {
        return axios({
            url: QC_LEGACY_API + 'logout/',
            method: 'POST',
            headers: {
                'X-Oc-Session': this.getToken()
            } 
        }).then(response => {
            if (response.status === 200) {
                // Clears token and user properties from AuthStore
                this.actions.login.logoutUser()
                // Clear user / customer data
                this.actions.user.clearUser()
                this.actions.customer.clearCustomer()
                
                return true
            }
        }).catch(err => {
            console.log(err)
        })
    }
    
    handleAuth(loginPromise, onSuccess, onError) {
        return loginPromise
            .then(response => {
                if (response.status === 200) {
                    // Triggers this.actions.login.loginUser
                    this.onResponseReceived(response, onSuccess, onError)
                    
                    return true
                }
            }).catch(err => {
                console.log(err)
                if (typeof onError === 'function') {
                    let fn = onError
                    fn(response.data)
                }
            })
        
        // ex. JWT
        /*return loginPromise
        
            .then(function(response) {
                var jwt = response.id_token
                this.actions.login.loginUser(jwt)
                return true
        })*/
    }
    
    
    fetchAccount(onSuccess) {
        //let userToken = this.checkToken()
        //let isLogged = (userToken !== false) ? true : false
        
        //if (!isLogged) {
            // Log in the user
            // Just fetch the account
            axios({
                //url: QC_LEGACY_API + 'login/',
                url: QC_LEGACY_API + 'account/',
                method: 'GET',
                headers: {
                    'X-Oc-Session': this.getToken()
                }
            })
            .then(response => {
                this.onResponseReceived(response, onSuccess)
            }).catch(err => {
                console.log(err)
            })
        //}
        
        //return isLogged
    }
    
    onResponseReceived(response, onSuccess, onError) {        
        if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {
            let data = response.data['data'] // TODO: This isn't a constant...
            this.getToken(token => {
                // Store auth and current, authorized account
                this.actions.login.loginUser(token) // Set token
                this.actions.user.setUser(data) // Set data
                
                if (typeof onSuccess === 'undefined') return
        
                console.log('executing onResponseReceived onSuccess callback')
                if (typeof onSuccess === 'function') {
                    let fn = onSuccess
                    fn(response)
                }
            })
        } else if (response.hasOwnProperty('data')) {
            // Check to see if user is already logged?
            if (response.data.success === false) {
                this.handleApiError(response, onError)
            }
        }
    }
    
    handleApiError(response, onError) {
        // Having to base my action on text returned is weak
        if (response.data.error === 'User already is logged') {
            console.log('Logging out current user')
            this.logout() // TODO: Auto-login?
        } else if (response.data.error === 'User is not logged') {
            
        }
        
        console.log('executing handleApiError onError callback')
        if (typeof onError === 'function') {
            let fn = onError
            fn(response.data)
        }
    }
    
    setToken(userToken) {
        if (typeof userToken === 'string') {
            // TODO: Validate string/JWT token and store
            sessionStorage.setItem('userToken', userToken)
        } else if (false) {
            // Handle JWT object
        }
    }
    
    getToken(onSuccess) {
        if (!(sessionStorage.hasOwnProperty('userToken'))) {
            axios({
                url: QC_LEGACY_API + 'session/',
                method: 'GET',
            }).then(response => {
                if (response.status === 200) {
                    if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {
                        let data = response.data['data']
                        this.setToken(data['session'])
                        
                        if (typeof onSuccess === 'function') {
                            let fn = onSuccess
                            fn(data['session'])
                        }
                    }
                }
            }).catch(err => {
                let msg = 'error fetching token'
                this.handleError(msg, onError, err)
            })
        } else if (typeof onSuccess === 'function') {
            let fn = onSuccess
            fn(sessionStorage.userToken)
        } else {
            // Try not to getToken in this manner, it's not reliable - use the onSuccess callback instead
            return sessionStorage.userToken
        }
    }
    
    clearToken() {
        if (sessionStorage.hasOwnProperty('userToken')) {
            sessionStorage.removeItem('userToken')
        }
    }
    
    checkToken() {
        // TODO: Password is being sent as plain text...
        let userToken = this.doLoginCheck()
        return (userToken) ? this.getToken() : false
    }
    
    doLoginCheck(displayMessage) {
        let isLogged = false
        
        displayMessage = displayMessage || false
        //console.log('Current customer has session id ' + this.getToken() + '. Verifying...')
        axios({
            url: QC_LEGACY_API + 'checkuser/',
            type: 'GET',
            headers: {
                'X-Oc-Session': this.getToken()
            }
        })
        
        return (isLogged) ? this.getToken() : isLogged
    }
}