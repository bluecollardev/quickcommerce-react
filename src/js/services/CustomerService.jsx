import assign from 'object-assign'

import axios from 'axios'

import { BaseService } from './BaseService.jsx'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'

export default class CustomerService extends BaseService {
    /**
     * This looks like a legacy handler.
     */
    onSuccess(response) {        
        if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {
            let data = response.data['data']
            this.actions.customer.setCustomer(data)
        } else if (response.hasOwnProperty('data')) {
            // Check to see if user is already logged?
            if (response.data.success === false) {
                this.handleApiError(response)
            }
        }
    }
    
    
    /**
     * For use with Legacy API.
     */
    get(data, onSuccess, onError) {
        // Get the account
        axios({
            url: QC_LEGACY_API + 'account',
            //url: QC_API + 'customer',
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            async: false
        }).then(response => {
            if (response.status === 200) {
                if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {
                    console.log('set customer data - ' + new Date())
                    //that.setCustomer(model)
                }
            }
        }).catch(err => {
            // Do something
            console.log(err)
        })
    }
    
    /*get(id, onSuccess, onError) {
        // Get the account
        axios({
            //url: INDIGO_BASE_URI + COMMON_CUSTOMERS + id,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            async: false
        }).then(response => {
            if (response.success || response.status === 200) {
                if (response.hasOwnProperty('data')) {
                    let customer = response.data['customer']
                    let data = customer
                    
                    if (data.hasOwnProperty('user')) {
                        data = assign({}, data, data['user'])
                        delete data.user
                    }
                    
                    if (typeof onSuccess === 'function') {
                        onSuccess(data) // TODO: Use mappings!
                    }
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess(data)
                    }
                }
            } else {
                if (typeof onError === 'function') {
                    onError(response)
                }
            }
        }).catch(err => {
            if (typeof onError === 'function') {
                onError(err)
            }
        })
    }*/
    
    fetch(customerId, onSuccess, onError) {
        axios({
            //url: QC_LEGACY_API + 'account/',
            url: INDIGO_BASE_URI + COMMON_CUSTOMERS + customerId,
            method: 'GET'
        }).then(response => {
            // Indigo
            if (response.status === 200) {
                if (response.hasOwnProperty('data')) {
                    let customer = response.data['customer']
                    let data = customer
                    
                    if (data.hasOwnProperty('user')) {
                        data = assign({}, data, data.user)
                        delete data.user
                    }
                    
                    this.actions.customer.setCustomer(data)
                    
                    if (typeof onSuccess === 'function') {
                        onSuccess(data)
                    }
                } else {
                    this.handleApiError(response)
                }
            }
            
            // QC API and legacy
            /*if (response.status === 200) {
                if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {
                    let data = response.data['data']
                    this.actions.customer.setCustomer(data)
                } else {
                    this.handleApiError(response)
                }
            }*/
        }).catch(err => {
            console.log(err)
        })
        
        //return isLogged
    }
    
    /**
     * POST is used for searchList service, so we're
     * using PATCH / PUT for update operations.
     */
    post(data, onSuccess, onError) {        
        let filterData = false
        let filterKeys = ['_block', '_page', '$id', 'password', 'cart', 'wishlist', 'session'] // Also strip password and cart
        
        console.log('converting payload to camelcase')
        data = {
            customerDetails: this.normalizePayload(data, 'underscore', 'camelcase')
        }
        
        // Create user
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
            if (response.success || response.status === 200) {
                if (response.hasOwnProperty('data')) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data)
                    }
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data)
                    }
                }
            } else {
                if (typeof onError === 'function') {
                    onError(response)
                }
            }
        }).catch(err => {
            if (typeof onSuccess === 'function') {
                onError()
            }
        })
    }
    
    /**
     * POST is used for searchList service, so we're
     * using PATCH / PUT for create & update operations
     */
    put(data, onSuccess, onError) {
        let filterData = false
        let filterKeys = ['_block', '_page', '$id', 'password', 'cart', 'wishlist', 'session'] // Also strip password and cart
        
        let customerId = this.stores.customer.customer['customer_id'] || null
        
        /*// TODO: Let's change the var names... prop/key same thing in JS
        data.forEach(function (prop, key) {
            // Fry internal references from the view-model
            if (filterKeys.indexOf(key) > -1) {
                delete data[key]
            }
            
            // Fry any kendo.data.DataSource objects attached to the view-model
            if (prop instanceof kendo.data.DataSource) {
                delete data[key]
            }
        })*/
        
        console.log('converting payload to camelcase')
        data = {
            customerDetails: this.normalizePayload(data, 'underscore', 'camelcase')
        }
        
        if (customerId !== null) {
            // Update user
            axios({
                //url: QC_LEGACY_API + 'account',
                //data: JSON.stringify(data), // Legacy
                url: QC_API + 'customer/' + customerId,
                data: data,
                method: 'PATCH',
                dataType: 'json',
                contentType: 'application/json',
                //headers: {
                //    'X-Oc-Session': this.services.auth.getToken()
                //}
            }).then(response => {
                // TODO: Patch is not returning a success / fail
                if (response.success || response.status === 200) {
                    if (response.hasOwnProperty('data')) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(response.data)
                        }
                    } else {
                        if (typeof onSuccess === 'function') {
                            onSuccess(response.data)
                        }
                    }
                } else {
                    if (typeof onError === 'function') {
                        onError(response)
                    }
                }
            }).catch(err => {
                if (typeof onSuccess === 'function') {
                    onError()
                }
            })
        }
    }
    
    /**
     * POST is used for searchList service, so we're
     * using PATCH / PUT for create & update operations
     */
    patch(data, onSuccess, onError) {
        let filterData = false
        let filterKeys = ['_block', '_page', '$id', 'password', 'cart', 'wishlist', 'session'] // Also strip password and cart
        
        let customerId = this.stores.customer.customer['customer_id'] || null
		
        /*// TODO: Let's change the var names... prop/key same thing in JS
        data.forEach(function (prop, key) {
            // Fry internal references from the view-model
            if (filterKeys.indexOf(key) > -1) {
                delete data[key]
            }
            
            // Fry any kendo.data.DataSource objects attached to the view-model
            if (prop instanceof kendo.data.DataSource) {
                delete data[key]
            }
        })*/
        
        console.log('converting payload to camelcase')
        data = {
            customerDetails: this.normalizePayload(data, 'underscore', 'camelcase')
        }
        
        if (customerId !== null) {
            // Update user
            axios({
                //url: QC_LEGACY_API + 'account',
                //data: JSON.stringify(data), // Legacy
                url: QC_API + 'customer/' + customerId,
                data: data,
                method: 'PATCH',
                dataType: 'json',
                contentType: 'application/json',
                //headers: {
                //   'X-Oc-Session': this.services.auth.getToken()
                //}
            }).then(response => {
                // TODO: Is patch still not returning a success / fail?
                if (response.success || response.status === 200) {
                    if (response.hasOwnProperty('data')) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(response.data)
                        }
                    } else {
                        if (typeof onSuccess === 'function') {
                            onSuccess(response.data)
                        }
                    }
                } else {
                    if (typeof onError === 'function') {
                        onError(response)
                    }
                }
            }).catch(err => {
                if (typeof onSuccess === 'function') {
                    onError()
                }
            })           
        }
    }
    
    delete(data, onSuccess, onError) {
        
    }
    
    normalizePayload(data, from, to) {
        return ObjectHelper.recursiveFormatKeys(data, from, to)
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
            if (response.status === 200) {
                if (response.hasOwnProperty('data') && response.data.success) {
                    axios({
                        url: QC_LEGACY_API + 'account',
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
            // Do something
            console.log(err)
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
        }).catch({
            // Do something
        })
    }
    
    /**
     * For use with Legacy API.
     */
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
     * For use with Legacy API.
     */
    setAddresses() {
        this.fetchBillingAddress()
        this.fetchShippingAddress()
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
        })
        .then(response => {
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
                        this.actions.customer.setBillingAddress({
                            addresses: payload.addresses,
                            billingAddressId: addressId,
                            billingAddress: address
                        })
                    }
                }
            }
        }).catch(err => {
            console.log(err)
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
        })
        .then(response => {
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
                        this.actions.customer.setShippingAddress({
                            addresses: payload.addresses,
                            shippingAddressId: addressId,
                            shippingAddress: address
                        })
                    }
                }
            }
        }).catch(err => {
            console.log(err)
        })
    }
    
    /**
     * For use with Legacy API.
     */
    fetchAccount(onSuccess, onError) {
        var that = this
            //userToken = that.checkToken(),
            //isLogged = (userToken !== false) ? true : false
        
        //if (!isLogged) {
            // Log in the user
            axios({
                url: QC_LEGACY_API + 'account/',
                method: 'GET'
            })
            .then(response => {
                if (response.status === 200) {
                    if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {
                        let data = response.data['data']
                        this.actions.customer.setCustomer(data)
                    } else {
                        that.handleApiError(response)
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        //}
        
        //return isLogged
    }
}