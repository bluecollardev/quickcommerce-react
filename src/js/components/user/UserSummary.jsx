import React, { Component } from 'react'

import { Col, ControlLabel, FormControl, FormGroup } from 'react-bootstrap'

export default class UserSummary extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Col sm={12}>
        <div>
          <form>
            <FormGroup>
              <ControlLabel>Full Name</ControlLabel>
              <FormControl name='fullname' type='text'/>
            </FormGroup>

            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl name='email' type='email'/>
            </FormGroup>
          </form>
        </div>
      </Col>
    )
  }
}

