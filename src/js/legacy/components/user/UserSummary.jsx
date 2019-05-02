import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import BillingAddress from '../address/BillingAddress.jsx'
import ShippingAddress from '../address/ShippingAddress.jsx'

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
                            <FormControl name='fullname' type='text' />
                        </FormGroup>
                        
                        <FormGroup>
                            <ControlLabel>Email</ControlLabel>
                            <FormControl name='email' type='email' />
                        </FormGroup>
                    </form>
                </div>
                
                <BillingAddress />
            </Col>
        )
    }   
}



