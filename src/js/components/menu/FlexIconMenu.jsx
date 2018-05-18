import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'

import { Row } from 'react-bootstrap'

import AuthenticatedComponent from '../AuthenticatedComponent.jsx'

@inject(deps => ({
  actions: deps.actions,
  authService: deps.authService
})) @observer
class FlexIconMenu extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (this.props.loggedIn) {
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
    }
  }

  render() {
    let className = this.props.className || ''

    return (
      <div className={className}>
        {this.props.children}
      </div>
    )
  }
}

export default AuthenticatedComponent(FlexIconMenu)
export { FlexIconMenu }
