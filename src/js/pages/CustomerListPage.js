import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from '../components/AuthenticatedComponent.jsx'
import CustomerListComponent from '../components/CustomerListComponent.jsx'

export default AuthenticatedComponent(class CustomerListPage extends Component {
    render() {       
        return (
            <CustomerListComponent
				{...this.props}
				/>
        )
    }
})