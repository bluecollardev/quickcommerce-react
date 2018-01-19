import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import CustomerProfile from '../customer/CustomerProfile.jsx'

export default class EditAccountForm extends Component {
  constructor(props) {
    super(props)
  }
    
  render() {
    return (
      <Col sm={12}>
        <Row>
          <Col sm={12}>
            <Header direction='row' 
              pad={{horizontal: 'medium'}}>
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



