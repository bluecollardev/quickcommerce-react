import assign from 'object-assign'

import React, { Component } from 'react';

import LoginStore from '../stores/LoginStore.jsx'
import UserStore from '../stores/UserStore.jsx'
import CustomerStore from '../stores/CustomerStore.jsx'

import Auth from '../services/AuthService.jsx'
import CustomerService from '../services/CustomerService.jsx'

// TODO: Split out customers, add logic to another HoC
export default (ComposedComponent) => {
    return class AuthenticatedComponent extends Component {
        static willTransitionTo(transition) {
            if (!LoginStore.isLoggedIn()) {
                //transition.redirect('/login', {}, {'nextPath' : transition.path})
            }
        }

        constructor(props) {
            super(props)
            
            this.state = assign({},
                this.getLoginState(),
                this.getUserState(),
                this.getCustomerState())
        }

        getLoginState() {
            return {
                loggedIn: LoginStore.isLoggedIn(),
                user: LoginStore.user,
                userToken: LoginStore.userToken
            }
        }
        
        getUserState() {
            return {
                loggedIn: LoginStore.isLoggedIn(),
                user: UserStore.user,
                billingAddress: UserStore.billingAddress,
                shippingAddress: UserStore.shippingAddress,
                userToken: LoginStore.userToken
            }
        }
        
        getCustomerState() {
            return {
                loggedIn: LoginStore.isLoggedIn(),
                customer: CustomerStore.customer,
                billingAddress: CustomerStore.billingAddress,
                billingAddressString: CustomerStore.billingAddressString,
                shippingAddress: CustomerStore.shippingAddress,
                shippingAddressString: CustomerStore.shippingAddressString,
                customerToken: CustomerStore.customerToken
            }
        }
        
        onChange() {
            this.setState(
                assign({},
                    this.getLoginState(),
                    this.getUserState(),
                    this.getCustomerState())
            )
        }

        componentDidMount() {
            this.changeListener = this.onChange.bind(this)
            LoginStore.addChangeListener(this.changeListener)
            UserStore.addChangeListener(this.changeListener)
            CustomerStore.addChangeListener(this.changeListener)
        }
        
        componentWillUnmount() {
            if (typeof this.changeListener === 'function') {
                LoginStore.removeChangeListener(this.changeListener)
                UserStore.removeChangeListener(this.changeListener)
                CustomerStore.removeChangeListener(this.changeListener)
                
                delete this.changeListener
            }
        }

        render() {
            return (
                <ComposedComponent
                    {...this.props}
                    user = {this.state.user}
                    customer = {this.state.customer}
                    billingAddressString = {this.state.billingAddressString}
                    billingAddress = {this.state.billingAddress}
                    shippingAddressString = {this.state.shippingAddressString}
                    shippingAddress = {this.state.shippingAddress}
                    userToken = {this.state.userToken}
                    loggedIn = {this.state.loggedIn} />
            )
        }
    }
}