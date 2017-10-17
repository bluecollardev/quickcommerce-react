import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import { Jumbotron } from 'react-bootstrap'

import Auth from '../services/AuthService.jsx'

// Higher order component adds Auth functions
import AuthenticatedComponent from './AuthenticatedComponent.jsx'

import SignInForm from './account/SignInForm.jsx'
//import CreditCardForm from './payment/CreditCardForm.jsx'
import CustomerProfile from './customer/CustomerFullProfile.jsx'

import LoginStore from '../stores/LoginStore.jsx'
import UserStore from '../stores/UserStore.jsx'
import CustomerStore from '../stores/CustomerStore.jsx'

export default AuthenticatedComponent(class CustomerComponent extends Component {
    constructor(props) {
        super(props)
        
        this.onCreateSuccess = this.onCreateSuccess.bind(this)
    }
    
    onCreateSuccess(response) {
    }

    render() {       
        return (
            <div className='container-fluid'>
                <div className='section_wrapper mcb-section-inner'>
                    <div className='wrap mcb-wrap one valign-top clearfix'>
                        <div className='mcb-wrap-inner'>
                            <div className='column mcb-column two-third column_column'
                                style = {{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    float: 'none'
                                }}>
                                
                                {this.props.location.pathname === '/customer/edit' && (
                                <div className='column_attr clearfix align_center'>
                                    <h2 className='title'>Edit Customer</h2>
                                </div>
                                )}
                                    
                                {this.props.location.pathname === '/customer/create' && (
                                <div className='column_attr clearfix align_center'>
                                    <h2 className='title'>Create a Customer</h2>
                                </div>
                                )}
							</div>
						</div>
					</div>
				</div>
                
                {this.props.location.pathname === '/customer/create' && (
                <Row>
                    <CustomerProfile
                        customer = {this.props.customer}
                        billingAddress = {this.props.billingAddress}
                        shippingAddress = {this.props.shippingAddress}
                        editAccount = {false}
                        createAccount = {true}
                        displayProfile = {true}
                        displayCurrentAddress = {true}
                        displayBillingAddress = {true}
                        displayShippingAddress = {false}
                        onCreateSuccess = {this.onCreateSuccess}
                        onCancel = {() => {window.location.hash = '/customers'}}>
                    </CustomerProfile>
                    
                </Row>
                )}
                
                {this.props.location.pathname === '/customer/edit' && (
                <Row>
                    <CustomerProfile
                        customer = {this.props.customer}
                        billingAddress = {this.props.billingAddress}
                        shippingAddress = {this.props.shippingAddress}
                        editAccount = {true}
                        createAccount = {false}
                        displayProfile = {true}
                        displayCurrentAddress = {true}
                        displayBillingAddress = {true}
                        displayShippingAddress = {false}
                        onCreateSuccess = {this.onCreateSuccess}
                        onCancel = {() => {window.location.hash = '/customers'}}>
                    </CustomerProfile>
                    
                </Row>
                )}
            </div>
        )
    }
})