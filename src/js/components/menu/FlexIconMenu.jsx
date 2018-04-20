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
    let classNames = 'flex-icon-menu column mcb-column one column_divider column-margin-40px'
    let className = [
      this.props.className,
      classNames
    ].join(' ')

    return (
      <Row className={className}>
        {this.props.children}
      </Row>
    )
  }
}

export default AuthenticatedComponent(FlexIconMenu)
export { FlexIconMenu }
