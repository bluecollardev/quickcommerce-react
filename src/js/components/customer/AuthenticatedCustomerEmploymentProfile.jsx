import assign from 'object-assign'

import React, { Component } from 'react';

// Higher order component adds Auth functions
import AuthenticatedComponent from '../AuthenticatedComponent.jsx'
import CustomerEmploymentProfile from './CustomerEmploymentProfile.jsx'

// TODO: Split out customers, add logic to another HoC
export default AuthenticatedComponent(class AuthenticatedCustomerEmploymentProfile extends Component {
    render() {
        return (
            <CustomerEmploymentProfile
                {...this.props}
                />
        )
    }
})