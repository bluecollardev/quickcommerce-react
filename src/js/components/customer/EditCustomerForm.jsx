import React, { Component } from 'react'

import { Col, Row } from 'react-bootstrap'
import CustomerProfile from '../customer/CustomerProfile.jsx'

class EditAccountForm extends Component {
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
              <Title>Edit Account - Customer Information</Title>
            </Header>
          </Col>
        </Row>

        <Row>
          <CustomerProfile
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

export default EditAccountForm
