import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from '../components/AuthenticatedComponent.jsx'
import AccountComponent from '../components/AccountComponent.jsx'

export default AuthenticatedComponent(class AccountPage extends Component {
    render() {       
        return (
            <AccountComponent
                {...this.props}
                />
        )
    }
})