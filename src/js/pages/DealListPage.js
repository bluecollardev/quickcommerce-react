import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from '../components/AuthenticatedComponent.jsx'
import DealListComponent from '../components/DealListComponent.jsx'

export default AuthenticatedComponent(class DealListPage extends Component {
    render() {       
        return (
            <DealListComponent
				{...this.props}
				/>
        )
    }
})