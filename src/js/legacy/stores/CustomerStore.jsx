import CustomerConstants from '../constants/CustomerConstants.jsx'

import BaseStore from './BaseStore.jsx'
//import jwt_decode from 'jwt-decode'

class CustomerStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher)
        
       
        this.subscribe(() => this.registerToActions.bind(this))
    }

    registerToActions(action) {
        switch (action.actionType) {
            case CustomerConstants.CREATE_CUSTOMER:
                this.emitChange()
                break
            case CustomerConstants.GET_CUSTOMER:
                this.emitChange()
                break
            case CustomerConstants.UPDATE_CUSTOMER:
                this.customer = action.customer
                this.emitChange()
                break
            case CustomerConstants.DELETE_CUSTOMER:
                this.emitChange()
                break
            case CustomerConstants.SET_CUSTOMER:
                this.customer = action.customer
                this.emitChange()
                break
            case CustomerConstants.CLEAR_CUSTOMER:
                this.clearCustomer()
                this.emitChange()
                break
            case CustomerConstants.SET_BILLING_ADDRESS:
                this.billingAddress = action.billingAddress
                this.billingAddressString = this.getAddressString(this.billingAddress)
                this.emitChange()
                break
            case CustomerConstants.UPDATE_BILLING_ADDRESS:
                this.billingAddress = action.billingAddress
                this.billingAddressString = this.getAddressString(this.billingAddress)
                this.emitChange()
                break
            case CustomerConstants.SET_SHIPPING_ADDRESS:
                this.shippingAddress = action.shippingAddress
                this.shippingAddressString = this.getAddressString(this.shippingAddress)
                this.emitChange()
                break
            case CustomerConstants.UPDATE_SHIPPING_ADDRESS:
                this.shippingAddress = action.shippingAddress
                this.shippingAddressString = this.getAddressString(this.shippingAddress)
                this.emitChange()
                break
            default:
                break
        }
    }
    
    getAddressString(data) {
        data = data || null
        let formatted = ""
        
        let filterValue = function (value) {
            return (typeof value === 'string' && value !== null && value !== '') ? true : false
        }
        
        if (data !== null && data.hasOwnProperty('address_id')) {
            formatted = [
                [data.firstname, data.lastname].join(' '),
                [data.company].filter(function(value, idx) {
                    return filterValue(value)
                }).join(''),
                [data.address1, data.address2].filter(function(value, idx) {
                    return filterValue(value)
                }).join("\n"),
                [data.city, data.zone].join(', '),
                [data.country, data.postcode].join(' ')
            ]
            
            formatted = formatted.filter(function (value, idx) {
                return filterValue(value)
            })
            
            formatted = formatted.join("\n") 
        }
        
        return formatted
    }

    isLoggedIn() {
        return !!this.customer
    }
    
    getCustomer() {
        return {
            customer: this.customer,
            billingAddress: this.billingAddress,
            billingAddressString: this.billingAddressString,
            shippingAddress: this.shippingAddress,
            shippingAddressString: this.shippingAddressString
        }
    }
    
    clearCustomer() {
        this.customer = null
        this.billingAddressString = ''
        this.billingAddress = {
            firstname: '',
            lastname: '',
            company: '',
            address1: '',
            address2: '',
            address_id: '',
            city: '',
            country: null,
            country_id: null,
            zone: null,
            zone_id: null,
            postcode: ''
        }
        this.shippingAddressString = ''
        this.shippingAddress = {
            firstname: '',
            lastname: '',
            company: '',
            address1: '',
            address2: '',
            address_id: '',
            city: '',
            country: null,
            country_id: null,
            zone: null,
            zone_id: null,
            postcode: ''
        }
    }
}

CustomerStore.customer = {
    customer_id: null,
    firstname: '',
    middlename: '',
    lastname: '',
    company_name: '',
    display_name: '',
    email: '',
    telephone: '',
    fax: '',
    address_id: null
    // TODO: Append full model
}
CustomerStore.billingAddressString = ''
CustomerStore.billingAddress = {
    firstname: '',
    lastname: '',
    company: '',
    address1: '',
    address2: '',
    address_id: '',
    city: '',
    country: null,
    country_id: null,
    zone: null,
    zone_id: null,
    postcode: ''
}
CustomerStore.shippingAddressString = ''
CustomerStore.shippingAddress = {
    firstname: '',
    lastname: '',
    company: '',
    address1: '',
    address2: '',
    address_id: '',
    city: '',
    country: null,
    country_id: null,
    zone: null,
    zone_id: null,
    postcode: ''
}

export default new CustomerStore()
export { CustomerStore }
