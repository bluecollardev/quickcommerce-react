import CustomerConstants from '../constants/CustomerConstants.jsx'

export default (dispatcher) => {
    return {
        clearCustomer: () => {
            dispatcher.dispatch({
                actionType: CustomerConstants.CLEAR_CUSTOMER
            })
        },
        setCustomer: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.SET_CUSTOMER,
                customer: data
            })
        },
        updateCustomer: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.UPDATE_CUSTOMER,
                customer: data
            })
        },
        updateBillingAddress: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.UPDATE_BILLING_ADDRESS,
                billingAddress: data
            })
        },
        setBillingAddress: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.SET_BILLING_ADDRESS,
                addresses: data.addresses,
                billingAddressId: data.billingAddressId,
                billingAddress: data.billingAddress
            })
        },
        updateShippingAddress: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.UPDATE_SHIPPING_ADDRESS,
                shippingAddress: data
            })
        },
        setShippingAddress: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.SET_SHIPPING_ADDRESS,
                addresses: data.addresses,
                shippingAddressId: data.shippingAddressId,
                shippingAddress: data.shippingAddress
            })
        },
        setPaymentMethod: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.SET_PAYMENT_METHOD,
                paymentMethod: data
            })
        },
        setPaymentType: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.SET_PAYMENT_TYPE,
                paymentType: data
            })
        },
        setShippingMethod: (data) => {
            dispatcher.dispatch({
                actionType: CustomerConstants.SET_SHIPPING_METHOD,
                shippingMethod: data
            })
        }
    }
}