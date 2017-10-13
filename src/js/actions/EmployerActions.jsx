import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import EmployerConstants from '../constants/EmployerConstants.jsx';

export default {
    loginEmployer: (userToken) => {
            let savedToken = JSON.parse(localStorage.getItem('employerToken'))
        try {
            employerToken = (typeof userToken === 'string') ? JSON.parse(userToken) : userToken
            
            AppDispatcher.dispatch({
                actionType: EmployerConstants.LOGIN_EMPLOYER,
                employerToken: employerToken
            })
        
            if (savedToken !== employerToken) {
                localStorage.setItem('employerToken', JSON.stringify(employerToken))
            }
        } catch (err) {
            console.log(err)
        }        
    },
    logoutEmployer: () => {
        localStorage.removeItem('employerToken')
        localStorage.removeItem('employer')
        
        AppDispatcher.dispatch({
            actionType: EmployerConstants.LOGOUT_EMPLOYER
        })
    },
    setEmployer: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.SET_EMPLOYER,
            employer: data
        })
        
        /*this.setState({
            logged: true,
            displayName: (
                typeof data !== 'undefined' && 
                typeof data['display_name'] === 'string') ? data['display_name'] : '',
            fullName: [data['firstname'], data['middlename'], data['lastname']].join(' ')
        })*/
    },
    updateEmployer: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.UPDATE_EMPLOYER,
            employer: data
        })
        
        /*this.setState({
            logged: true,
            displayName: (
                typeof data !== 'undefined' && 
                typeof data['display_name'] === 'string') ? data['display_name'] : '',
            fullName: [data['firstname'], data['middlename'], data['lastname']].join(' ')
        })*/
    },
    updateBillingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.UPDATE_BILLING_ADDRESS,
            billingAddress: data
        })
    },
    setBillingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.SET_BILLING_ADDRESS,
            addresses: data.addresses,
            billingAddressId: data.billingAddressId,
            billingAddress: data.billingAddress
        })
    },
    updateShippingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.UPDATE_SHIPPING_ADDRESS,
            shippingAddress: data
        })
    },
    setShippingAddress: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.SET_SHIPPING_ADDRESS,
            addresses: data.addresses,
            shippingAddressId: data.shippingAddressId,
            shippingAddress: data.shippingAddress
        })
    },
    setPaymentMethod: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.SET_PAYMENT_METHOD,
            paymentMethod: data
        })
    },
    setPaymentType: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.SET_PAYMENT_TYPE,
            paymentType: data
        })
    },
    setShippingMethod: (data) => {
        AppDispatcher.dispatch({
            actionType: EmployerConstants.SET_SHIPPING_METHOD,
            shippingMethod: data
        })
    }
}