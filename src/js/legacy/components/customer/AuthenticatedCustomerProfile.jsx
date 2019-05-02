import assign from 'object-assign'

import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from '../AuthenticatedComponent.jsx'
import CustomerProfile from './CustomerProfile.jsx'

// TODO: Split out customers, add logic to another HoC
export default AuthenticatedComponent(class AuthenticatedCustomerProfile extends Component {
    render() {
        return (
            <CustomerProfile
                {...this.props}
                />
        )
    }
})