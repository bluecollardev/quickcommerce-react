import React, { Component } from 'react'

import { Row } from 'react-bootstrap'

import CustomerProfile from '../customer/CustomerProfile.jsx'

export default class NewAccountForm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
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
    )
  }
}

