import AppDispatcher from '../dispatcher/AppDispatcher.jsx'

import CheckoutConstants from '../constants/CheckoutConstants.jsx'

export default {
    newOrder: () => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.NEW_ORDER
        })
    },
    setOrder: (order) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_ORDER,
            order: order
            
        })
    },
    setBuiltInCustomer: (customer) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_BUILTIN_CUSTOMER,
            customer: customer
        })
    },
    setCustomCustomer: (customer) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_CUSTOM_CUSTOMER,
            customer: customer
        })
    },
    setExistingCustomer: () => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_EXISTING_CUSTOMER
        })
    },
    setBillingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_BILLING_ADDRESS,
            address: data
        })
    },
    setShippingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_SHIPPING_ADDRESS,
            address: data
        })
    },
    setPaymentMethod: (code, method) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_PAYMENT_METHOD,
            code: code,
            method: method
        })
    },
    setShippingMethod: (code, method) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_SHIPPING_METHOD,
            code: code,
            method: method
        })
    },
    setPaymentType: (type) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_PAYMENT_TYPE,
            type: type
        })
    },
    setOrderStatus: (status) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_ORDER_STATUS,
            status: status
        })
    },
    setNotes: (notes) => {
        AppDispatcher.dispatch({
            actionType: CheckoutConstants.SET_NOTES,
            notes: notes
        })
    }
}