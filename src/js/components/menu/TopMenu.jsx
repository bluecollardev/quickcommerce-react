import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'

import { Row } from 'react-bootstrap'

import AuthenticatedComponent from '../AuthenticatedComponent.jsx'

@inject(deps => ({
  actions: deps.actions,
  authService: deps.authService
  })) @observer
class TopMenu extends Component {
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
    return (
      <Row className='top-menu flex-icon-menu column mcb-column one column_divider column-margin-40px'>
        {this.props.children}
        {/*<hr className='no_line'/>*/}
        <div className='borderLine horzMenu' style={{
          'transformOrigin': '0% 100% 0px',
          'transform': 'matrix(1, 0, 0, 1, 0, 0)'
        }}></div>
      </Row>
    )
  }
}

export default AuthenticatedComponent(TopMenu)
export { TopMenu }
