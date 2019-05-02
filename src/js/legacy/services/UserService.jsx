import axios from 'axios'
//import request from 'reqwest' // TODO: Use axios
//import when from 'when'

import CustomerConstants from '../constants/CustomerConstants.jsx'

import { BaseService } from './BaseService.jsx'

class UserService extends BaseService {
    processResponse(onSuccess, onError) {
        //customerModule.clearCustomer()
        if (response.status === 200 && response.data.success === true) {
            let payload = (response.data.hasOwnProperty('data')) ? response.data.data : {}
            // Get address from returned array of addresses by ID
            let addressId = (payload.hasOwnProperty('address_id')) ? payload.address_id : false
            let addresses = (payload.hasOwnProperty('addresses') && payload.addresses instanceof Array) ? payload.addresses : []
            
            if (addressId !== false && addresses.length > 0) {
                // Get the address
                let idx = 0
                let address = null
                for (idx = 0; idx < addresses.length; idx++) {
                    address = addresses[idx]
                    // Ensure proper type conversion (ids are returned as strings) and compare
                    if (parseInt(address['address_id']) === parseInt(addressId)) {
                        break
                    }
                }
                
                if (address !== null) {
                    // We have the address, set it to state
                    this.setState({
                        addresses: payload.addresses,
                        billingAddressId: addressId,
                        billingAddress: address
                    })
                }
            }
        }
    }
    
    setUser(data) {
        // Try using/fetching the customer's default address
        let addressId = null
        
        // If the customer object was returned from qcapi resource services, it will be provided as a property
        if (data.hasOwnProperty('address') && data.address.hasOwnProperty('address_id')) {
            addressId = data.address['address_id']
        // If the customer object was returned from default api services (legacy), it will be provided as an id
        } else if (data.hasOwnProperty('address_id')) {
            addressId = data['address_id']
        }
        
        if (!isNaN(addressId)) {
            // Fetch...
            axios({
                url: QC_RESOURCE_API + 'address/' + addressId,
                method: 'GET',
                //dataType: 'json',
                contentType: 'application/json'
            })
            .then(response => {
                let payload = response.data
                
                // Set the customer
                this.actions.user.setUser(data)
                
                this.setBillingAddress(addressId, payload.data)
                this.setShippingAddress(addressId, payload.data)
            }).catch(err => {
                // Do nothing, not a deal-breaker if we couldn't grab an address
                console.log(err)
                
                // TODO: Notify user
                this.actions.user.setUser(data)
            })
            
        } else {
            this.actions.user.setUser(data)
            // TODO: Clear addresses explicitly
        }
    }
	
	setBillingAddress(addressId, data) {
		// Resource API data is wrapped in a data object                
		this.actions.user.setBillingAddress({
			addresses: [data],
			billingAddressId: addressId,
			billingAddress: data
		})
	}
	
	setShippingAddress(addressId, data) {
		this.actions.user.setShippingAddress({
			addresses: [payload.data],
			shippingAddressId: addressId,
			shippingAddress: payload.data
		})
	}
	
	/**
	 * Retrieves a User.
	 */
    get(id, onSuccess, onError) {
        // Get the account
        axios({
            //url: QC_LEGACY_API + 'account/',
			url: QC_API + 'user/' + id,
            dataType: 'json',
            contentType: 'application/json',
			method: 'GET'
        }).then(response => {
            this.handleResponse(response, 
            // onSuccess
            ((payload) => {
                if (typeof onSuccess === 'function') {
                    onSuccess(payload)
                }
            }).bind(this), // Bind to current context
            // onError - fail silently
            (() => {
               //this.refetchAccount() 
            }).bind(this),
            // Use legacy API compatibility
            true)
        }).catch(err => {
            this.handleError('', onError, err)
        })
    }
	
	/**
	 * Retrieves a User and saves a local copy in UserStore.
	 */
	fetch(id, onSuccess, onError) {
        this.get(id, 
		// onSuccess
		((payload) => {
			let data = payload['user']
			
			this.actions.user.setUser(data)
			
			if (typeof onSuccess === 'function') {
				onSuccess(data)
			}
		}).bind(this),
		onError)
    }
    
    post(data, onSuccess, onError) {
        // Register user
        axios({
            url: QC_LEGACY_API + 'register',
            data: JSON.stringify(data),
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            async: false, // No async login
        }).then(response => {
            if (response.status === 200) {
                if (response.hasOwnProperty('data') && response.data.success) {
                    // OK the response isn't the same as the actual return when you fetch a customer after login
                    // Why? I have no idea, but i will fix it in *my* REST implementation - good job 3rd party devs
                    axios({
                        url: QC_LEGACY_API + 'account/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: 'application/json'
                    }).then(response => {
                        console.log('executing onSuccess callback')
                        if (typeof onSuccess === 'function') {
                            let fn = onSuccess
                            fn.call(this, response.data)
                        }
                    })
                } else {
                    console.log('executing onError callback')
                    if (typeof onError === 'function') {
                        let fn = onError
                        fn.call(this, response.data)
                    }
                }
            }           
        }).catch(err => {
            this.handleError('', onError, err)
        })
        
    }
	
    put(formData, onSuccess, onError) {
        /*let data = {
            userDetails: this.normalizePayload(formData, 'underscore', 'camelcase')
        }*/
		
		let data = JSON.stringify(formData)

		let id = this.stores.user.user['user_id'] || null
		if (typeof id === 'undefined' || isNaN(id)) {
            throw new Error('Invalid ID: supplied value must be an integer!')
        }
        
        if (id !== null) {
            axios({
                //url: QC_LEGACY_API + 'account',
                url: QC_API + 'user/' + id,
                //data: JSON.stringify(data), // Legacy
				data: data,
				dataType: 'json',
				contentType: 'application/json',
                //method: 'PUT'
                method: 'POST' // Yup the legacy API is kind of whack
                //headers: {
                //    'X-Oc-Session': this.services.auth.getToken()
                //}
            }).then(response => {
                this.handleResponse(response, onSuccess, onError)
            }).catch(err => {
                this.handleError('', onError, err)
            })
        }
    }
    
    patch(formData, onSuccess, onError) {
        /* Example converting payload to camelcase
        data = {
            detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
        }*/
		
        let id = this.stores.user.user['user_id'] || null
		if (typeof id === 'undefined' || isNaN(id)) {
			throw new Error('Invalid ID: supplied value must be an integer!')
		}
        
        if (id !== null) {
            axios({
                //url: QC_LEGACY_API + 'account',
                url: QC_API + 'user/' + id,
                data: data,
                method: 'PATCH',
                dataType: 'json',
                contentType: 'application/json'
            }).then(response => {
                this.handleResponse(response, onSuccess, onError)
            }).catch(err => {
                this.handleError('', onError, err)
            })
        }
    }
    
    delete(id, onSuccess, onError) {
        
    }
    
    // Use PATCH
    updatePassword() {
        let data, response, url
        
        // TODO: Validate or throw error
        /*if (passwordModel.get('password') !== passwordModel.get('confirm')) {
            //loader.setMessage('Sorry! The password did not match the confirmation').open()
            
            passwordModel.set('password', '')
            passwordModel.set('confirm', '')
                
            setTimeout(function () {
                //loader.close()
            }, 3000)
            
            return false
        }*/
        
        // Update user
        axios({
            url: QC_LEGACY_API + 'account/password',
            //data: JSON.stringify({ password: passwordModel.get('password'), confirm: passwordModel.get('confirm') }),
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            async: true // No async login
        }).then(response => {
            //passwordModel.set('password', '')
            //passwordModel.set('confirm', '')
        }).catch(err => {
            this.handleError('', onError, err)
        })
    }
    
    handleApiError(response) {
        // TODO: Fix checkuser route/action in OpenCart API -- this is pretty stupid
        // Having to base my action on text returned is weak
        if (response.data.error === 'User already is logged') {
            console.log('User logged in... fetch account')
            //that.doLogout() 
            //that.doLogin()
            
            //if (this.state.logged && this.state.displayName === '') {
                // We're logged in but account hasn't been set, so fetch user data from the server
                this.fetchAccount()
            //}
        } else {
            //loader.setMessage(response.responseJSON.error.warning).open()
            setTimeout(function () {
                //loader.close()
            }, 3000)
        }
    }
    
    /**
     * For use with Legacy API. In here just for backward compatibility. Delete from CustomerService.
     */
    fetchAccount(onSuccess, onError) {
        let that = this
        //userToken = that.checkToken(),
        //isLogged = (userToken !== false) ? true : false
        
        //if (!isLogged) {
            // Log in the user
            axios({
                url: QC_LEGACY_API + 'account/',
                method: 'GET'
            }).then(response => {
                this.handleResponse(response, 
                // onSuccess
                ((payload) => {
                    this.setUser(payload)
                }).bind(this), // Bind to current context
                // onError - fail silently
                (err) => {
                    this.handleError('', onError, err)
                },
                // Use legacy API compatibility
                true)
            }).catch(err => {
                this.handleError('', onError, err)
            })
        //}
        
        //return isLogged
    }

	/**
     * For use with Legacy API. In here just for backward compatibility. Delete from CustomerService.
     */
    refetchAccount(response) {
        // TODO: Fix checkuser route/action in OpenCart API -- this is pretty stupid
        // Having to base my action on text returned is weak
        if (response.data.error === 'User already is logged') {
            console.log('User logged in... fetch account')
            //that.doLogout() 
            //that.doLogin()
            
            //if (this.state.logged && this.state.displayName === '') {
                // We're logged in but account hasn't been set, so fetch user data from the server
                this.fetchAccount()
            //}
        } else {
            //loader.setMessage(response.responseJSON.error.warning).open()
            setTimeout(function () {
                //loader.close()
            }, 3000)
        }
    }
}

export default UserService