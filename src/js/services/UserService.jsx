import axios from 'axios'
//import request from 'reqwest' // TODO: Use axios
//import when from 'when'

import CustomerConstants from '../constants/CustomerConstants.jsx'

import { BaseService } from './BaseService.jsx'

export default class UserService extends BaseService {
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
    
    get(data, onSuccess, onError) {
        /*if (sessionId) {
            customer = dataSources.get('customer.entity') || null
            if (customer instanceof kendo.data.Model) {
                if (customer.get('session') === sessionId) {
                    return customer
                }
            }
        } else {
            return false
        }*/
        
        // Get the account
        axios({
            url: QC_LEGACY_API + 'account',
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
            // Do something
            console.log(err)
        })
        
    }
    
    put(data, onSuccess, onError) {
        let filterData = false
        let filterKeys = ['_block', '_page', '$id', 'password', 'cart', 'wishlist', 'session'] // Also strip password and cart
        
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
        
        // Update user
        axios({
            url: QC_LEGACY_API + 'account',
            data: JSON.stringify(data),
            //method: 'PUT',
            method: 'POST', // Legacy API sucks and uses POST (3rd party OCAPI)
            //headers: {
            //    'X-Oc-Session': this.services.auth.getToken()
            //}
        }).then(response => {
            if (response.success) {
                if (response.hasOwnProperty('data')) {
                    // Do something
                }
            }
        }).catch(err => {
            // Do something
            console.log(err)
        })
    }
    
    patch(data, onSuccess, onError) {
        
    }
    
    delete(data, onSuccess, onError) {
        
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
        }).catch({
            // Do something
        })
    }
    
    setAddresses() {
        this.fetchBillingAddress()
        this.fetchShippingAddress()
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
     * Legacy API
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
     * Legacy API
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
     * Legacy API
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