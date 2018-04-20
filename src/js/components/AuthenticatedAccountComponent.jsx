import React, { Component } from 'react'

import { TabPanes } from 'react-bootstrap'
import AccountComponent from './AccountComponent.jsx'
// Higher order component adds Auth functions
import AuthenticatedComponent from './AuthenticatedComponent.jsx'

class AuthenticatedAccountComponent extends Component {
  render() {
    return (
      <AccountComponent
        {...this.props}
      />
    )
  }
}

export default AuthenticatedComponent(AuthenticatedAccountComponent)
