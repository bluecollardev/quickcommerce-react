import React, { Component } from 'react'

import { Row } from 'react-bootstrap'

import CustomerProfile from '../customer/CustomerProfile.jsx'

class EditAccountForm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Row>
        <CustomerProfile
          edit={true}
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

export default EditAccountForm

