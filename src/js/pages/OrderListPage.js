import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from '../components/AuthenticatedComponent.jsx'
import OrderListComponent from '../components/OrderListComponent.jsx'

export default AuthenticatedComponent(class OrderListPage extends Component {
    render() {       
        return (
            <OrderListComponent
				{...this.props}
				/>
        )
    }
})