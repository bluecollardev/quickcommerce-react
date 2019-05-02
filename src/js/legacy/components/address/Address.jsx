import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export default class Address extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <form>
                <FormGroup>
                    <ControlLabel>Use Default Address</ControlLabel>
                    <FormControl componentClass='textarea'>
                        Bob Johnson\\\n
                        123 Some Street\\\n
                        Edmonton, Alberta\\\n
                        Canada 16G 0X1
                    </FormControl>
                </FormGroup>
                
                <FormGroup>
                    <Button onClick={this.showBillingAddressModal}>Change</Button>
                </FormGroup>
            </form>
            
            <Modal
              show   = {!!this.state.billingAddress}
              onHide = {this.hideBillingAddressModal}>
                <Modal.Header>
                    <Modal.Title>
                        Edit billing address
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.billingAddress && (
                        <div>
                            <div>
                                <Alert bsStyle='warning'>
                                    Please enter your billing address. <i className='fa fa-smile-o' />
                                </Alert>
                            </div>
                            <div>
                                <form>
                                    <FormGroup>
                                        <ControlLabel>Country</ControlLabel>
                                        <FormControl componentClass='select'/>
                                    </FormGroup>
                                    
                                    <hr/>
                                    
                                    <FormGroup>
                                        <ControlLabel>Address Line 1</ControlLabel>
                                        <FormControl type='text'/>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Address Line 2</ControlLabel>
                                        <FormControl type='text'/>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Station</ControlLabel>
                                        <FormControl type='text'/>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>City</ControlLabel>
                                        <FormControl type='text'/>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Province / State</ControlLabel>
                                        <FormControl componentClass='select'/>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>Postal Code / ZIP</ControlLabel>
                                        <FormControl componentClass='select'/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button block onClick={this.hideBillingAddressModal}>Ok</Button>
                                    </FormGroup>
                                </form>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        )
    }   
}



