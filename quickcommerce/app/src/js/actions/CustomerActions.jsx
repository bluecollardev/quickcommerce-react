import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import CustomerConstants from '../constants/CustomerConstants.jsx';

export default {
    clearCustomer: () => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.CLEAR_CUSTOMER
        })
    },
    setCustomer: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.SET_CUSTOMER,
            customer: data
        })
    },
    updateCustomer: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.UPDATE_CUSTOMER,
            customer: data
        })
    },
    updateBillingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.UPDATE_BILLING_ADDRESS,
            billingAddress: data
        })
    },
    setBillingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.SET_BILLING_ADDRESS,
            addresses: data.addresses,
            billingAddressId: data.billingAddressId,
            billingAddress: data.billingAddress
        })
    },
    updateShippingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.UPDATE_SHIPPING_ADDRESS,
            shippingAddress: data
        })
    },
    setShippingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.SET_SHIPPING_ADDRESS,
            addresses: data.addresses,
            shippingAddressId: data.shippingAddressId,
            shippingAddress: data.shippingAddress
        })
    },
    setPaymentMethod: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.SET_PAYMENT_METHOD,
            paymentMethod: data
        })
    },
    setPaymentType: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.SET_PAYMENT_TYPE,
            paymentType: data
        })
    },
    setShippingMethod: (data) => {
        AppDispatcher.dispatch({
            actionType: CustomerConstants.SET_SHIPPING_METHOD,
            shippingMethod: data
        })
    }
}