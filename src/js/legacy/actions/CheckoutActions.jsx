import CheckoutConstants from '../constants/CheckoutConstants.jsx'

export default (dispatcher) => {
    return {
        newOrder: (customer) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.NEW_ORDER,
                customer: customer
            })
        },
        setOrder: (order) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_ORDER,
                order: order
                
            })
        },
        setBuiltInCustomer: (customer) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_BUILTIN_CUSTOMER,
                customer: customer
            })
        },
        setCustomCustomer: (customer) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_CUSTOM_CUSTOMER,
                customer: customer
            })
        },
        setExistingCustomer: () => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_EXISTING_CUSTOMER,
                customer: customer
            })
        },
        setBillingAddress: (data) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_BILLING_ADDRESS,
                address: data
            })
        },
        setShippingAddress: (data) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_SHIPPING_ADDRESS,
                address: data
            })
        },
        setPaymentMethod: (code, method) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_PAYMENT_METHOD,
                code: code,
                method: method
            })
        },
        setShippingMethod: (code, method) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_SHIPPING_METHOD,
                code: code,
                method: method
            })
        },
        setPaymentType: (type) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_PAYMENT_TYPE,
                type: type
            })
        },
        setOrderStatus: (status) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_ORDER_STATUS,
                status: status
            })
        },
        setNotes: (notes) => {
            dispatcher.dispatch({
                actionType: CheckoutConstants.SET_NOTES,
                notes: notes
            })
        }
    }
}