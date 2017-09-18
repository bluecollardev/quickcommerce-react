import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from '../components/AuthenticatedComponent.jsx'
import SettingComponent from '../components/SettingComponent.jsx'

export default AuthenticatedComponent(class SettingPage extends Component {
    render() {       
        return (
            <SettingComponent
                {...this.props}
                />
        )
    }
})