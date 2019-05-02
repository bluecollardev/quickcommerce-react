import assign from 'object-assign'

import axios from 'axios'

import { BaseService } from './BaseService.jsx'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'

class CustomerService extends BaseService {    
    // TODO: Move to consuming project
    setCustomer(data) {
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
                this.actions.customer.setCustomer(data)
                
                // Resource API data is wrapped in a data object                
                this.actions.customer.setBillingAddress({
                    addresses: [payload.data],
                    billingAddressId: addressId,
                    billingAddress: payload.data
                })
                
                this.actions.customer.setShippingAddress({
                    addresses: [payload.data],
                    shippingAddressId: addressId,
                    shippingAddress: payload.data
                })
            }).catch(err => {
                // Do nothing, not a deal-breaker if we couldn't grab an address
                console.log(err)
                
                // TODO: Notify user
                
                this.actions.customer.setCustomer(data)
            })
            
        } else {
            this.actions.customer.setCustomer(data)
            // TODO: Clear addresses explicitly
        }
    }
    
	/**
	 * Retrieves a Customer.
	 */
    get(id, onSuccess, onError) {
        // Get the account
        axios({
            //url: QC_LEGACY_API + 'account/',
			url: QC_API + 'customer/' + id,
            dataType: 'json',
            contentType: 'application/json',
            async: false,
			method: 'GET',
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
	 * Retrieves a Customer and saves a local copy in CustomerStore.
	 */
	fetch(id, onSuccess, onError) {
        this.get(id, 
		// onSuccess
		((payload) => {
			let data = payload['customer']
                
			if (data.hasOwnProperty('user')) {
				data = assign({}, data, data.user)
				delete data.user
			}
			
			this.actions.customer.setCustomer(data)
			
			if (typeof onSuccess === 'function') {
				onSuccess(data)
			}
		}).bind(this),
		onError)
    }
    
    /**
     * Creates a new Customer.
	 * POST is used for searchList service, so we're
     * using PATCH / PUT for update operations.
     */
    post(formData, onSuccess, onError) {        
        let data = {
            customerDetails: this.normalizePayload(formData, 'underscore', 'camelcase')
        }
        
        axios({
            url: QC_API + 'customer/-1',
            data: data,
            dataType: 'json',
            method: 'PATCH',
            contentType: 'application/json'
            //headers: {
            //    'X-Oc-Session': this.services.auth.getToken()
            //} // Legacy API
        }).then(response => {
            this.handleResponse(response, onSuccess, onError)
        }).catch(err => {
            this.handleError('', onError, err)
        })
    }
    
    /**
     * POST is used for searchList service, so we're
     * using PATCH / PUT for create & update operations
     */
    put(formData, onSuccess, onError) {
        let data = {
            customerDetails: this.normalizePayload(formData, 'underscore', 'camelcase')
        }

		let id = this.stores.customer.customer['customer_id'] || null
		if (typeof id === 'undefined' || isNaN(id)) {
            throw new Error('Invalid ID: supplied value must be an integer!')
        }
        
        if (id !== null) {
            axios({
                //url: QC_LEGACY_API + 'account',
                url: QC_API + 'customer/' + id,
                //data: JSON.stringify(data), // Legacy
				data: data,
				dataType: 'json',
				contentType: 'application/json',
                method: 'PATCH'
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
    
    /**
     * POST is used for searchList service, so we're
     * using PATCH / PUT for create & update operations
     */
    patch(formData, onSuccess, onError) {
        let data = {
            customerDetails: this.normalizePayload(formData, 'underscore', 'camelcase')
        }

		let id = this.stores.customer.customer['customer_id'] || null
		if (typeof id === 'undefined' || isNaN(id)) {
			throw new Error('Invalid ID: supplied value must be an integer!')
		}
        
        if (id !== null) {
            axios({
                // Don't need to support legacy for this method anymore
                //url: QC_LEGACY_API + 'account',
                //data: JSON.stringify(data), // Legacy
                url: QC_API + 'customer/' + customerId,
                data: data,
                dataType: 'json',
                contentType: 'application/json',
				method: 'PATCH'
                //headers: {
                //   'X-Oc-Session': this.services.auth.getToken()
                //}
            }).then(response => {
                this.handleResponse(response, onSuccess, onError)
            }).catch(err => {
                this.handleError('', onError, err)
            })           
        }
    }
    
    delete(id, onSuccess, onError) {   
    }
    
    /**
     * For use with Legacy API. Replaced with post()
     */
    register(data, onSuccess, onError) {
        // Register user
        axios({
            //url: QC_LEGACY_API + 'register',
            url: QC_LEGACY_API + 'register',
            data: JSON.stringify(data),
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            async: false, // No async login
        }).then(response => {
            this.handleResponse(response, 
            // onSuccess
            ((payload) => {
                this.fetchAccount()
                
                if (typeof onSuccess === 'function') {
                    onSuccess(payload)
                }
            }).bind(this), // Bind to current context
            // onError - fail silently
            ((err) => {
               //this.fetchAccount()
            }).bind(this),
            // Use legacy API compatibility
            true)
        }).catch(err => {
            this.handleError('', onError, err)
        })
        
    }
    
    /**
     * For use with Legacy API.
     */
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
    
    /**
     * For use with Legacy API.
     */
    setAddresses() {
        this.fetchBillingAddress()
        this.fetchShippingAddress()
    }

	/**
     * For use with Legacy API.
     */
    getAccount(onSuccess, onError) {
        // Get the account
        axios({
            url: QC_LEGACY_API + 'account',
            //url: QC_API + 'customer',
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            async: false
        }).then(response => {
            this.handleResponse(response, 
            // onSuccess
            ((payload) => {
                console.log('set customer data - ' + new Date())
                this.setCustomer(payload)
            }).bind(this), // Bind to current context
            // onError - fail silently
            () => {
                
            },
            // Use legacy API compatibility
            true)
        }).catch(err => {
            this.handleError('', onError, err)
        })
    }
    
    /**
     * For use with Legacy API. In here just for backward compatibility. Move to UserService.
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
                    this.setCustomer(payload)
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
     * For use with Legacy API. In here just for backward compatibility. Move to UserService.
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

	/**
     * For use with Legacy API.
     */
    fetchBillingAddress(onSuccess) {
        axios({
            url: QC_LEGACY_API + 'paymentaddress',
            type: 'GET',
            //async: false,
            //dataType: 'json',
            //data: JSON.stringify({
            //    address_id: 1,
            //    payment_address: 'existing'
            //})
        }).then(response => {
            this.handleResponse(response, 
            // onSuccess
            ((payload) => {
                payload = payload || {}
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
                        this.actions.customer.setBillingAddress({
                            addresses: payload.addresses,
                            billingAddressId: addressId,
                            billingAddress: address
                        })
                    }
                }
                
                if (typeof onSuccess === 'function') {
                    onSuccess(payload)
                }
            }).bind(this), // Bind to current context
            // onError - fail silently
            ((err) => {
                this.handleError('', onError, err)
            }).bind(this),
            // Use legacy API compatibility
            true)
        }).catch(err => {
            this.handleError('', onError, err)
        })
    }
    
    /**
     * For use with Legacy API.
     */
    fetchShippingAddress(onSuccess) {
        axios({
            url: QC_LEGACY_API + 'shippingaddress',
            type: 'GET',
            //data: JSON.stringify({
            //    address_id: 1,
            //    payment_address: 'existing'
            //})
        }).then(response => {
            this.handleResponse(response, 
            // onSuccess
            ((payload) => {
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
                        this.actions.customer.setShippingAddress({
                            addresses: payload.addresses,
                            shippingAddressId: addressId,
                            shippingAddress: address
                        })
                    }
                }
                
                if (typeof onSuccess === 'function') {
                    onSuccess(payload)
                }
            }).bind(this), // Bind to current context
            // onError - fail silently
            ((err) => {
                this.handleError('', onError, err)
            }).bind(this),
            // Use legacy API compatibility
            true)
        }).catch(err => {
            this.handleError('', onError, err)
        })
    }
}

export default CustomerService