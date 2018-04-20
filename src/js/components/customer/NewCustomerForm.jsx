import React, { Component } from 'react'

import { Col, Row } from 'react-bootstrap'
//import UserProfile from '../user/UserProfile.jsx'
import CustomerProfile from '../customer/CustomerProfile.jsx'

export default class NewAccountForm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Col sm={12}>
        <Row>
          <Col sm={12}>
            <Header direction='row'
              pad={{ horizontal: 'medium' }}>
              <Title>Create New Account - Customer Information</Title>
            </Header>
          </Col>
        </Row>

        <Row>
          <CustomerProfile
            edit={false}
            displayProfile={true}
            displayBillingAddress={false}
            displayShippingAddress={false}
            onSaveSuccess={this.props.onSaveSuccess}
            onCancel={this.props.onCancel}
          />
        </Row>
      </Col>
    )
  }
}

