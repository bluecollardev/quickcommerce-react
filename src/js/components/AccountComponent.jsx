import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import { Jumbotron } from 'react-bootstrap'

// Higher order component adds Auth functions
import AuthenticatedComponent from './AuthenticatedComponent.jsx'

import SignInForm from './account/SignInForm.jsx'
import CustomerProfile from './customer/AuthenticatedCustomerFullProfile.jsx'

import LoginStore from '../stores/LoginStore.jsx'
import UserStore from '../stores/UserStore.jsx'
import CustomerStore from '../stores/CustomerStore.jsx'

import Auth from '../services/AuthService.jsx'

export default class AccountComponent extends Component {
    constructor(props) {
        super(props)
        
        this.doLogin = this.doLogin.bind(this)
        this.doLogout = this.doLogout.bind(this)
        this.onLoginSuccess = this.onLoginSuccess.bind(this)
        this.onLoginError = this.onLoginError.bind(this)
        this.onCreateSuccess = this.onCreateSuccess.bind(this)
    }
    
    componentWillMount() {
        if (this.props.location.pathname === '/account/edit' && !this.props.loggedIn) {
            window.location.hash = '/account/login'
        }
        
        if (this.props.location.pathname === '/account/register' && this.props.loggedIn) {
            window.location.hash = '/account/edit'
        }
    }
    
    componentWillUpdate() {
        if (this.props.location.pathname === '/account/edit' && !this.props.loggedIn) {
            window.location.hash = '/account/login'
        }
        
        if (this.props.location.pathname === '/account/register' && this.props.loggedIn) {
            window.location.hash = '/account/edit'
        }
    }
	
	doLogin(formData, onSuccess, onError) {		
		Auth.login(
			formData['account'], 
			formData['password'], 
			onSuccess,
			onError
		).catch(function(err) {
			console.log('Error logging in', err)
		})
	}
	
	doLogout() {
		try {
            Auth.logout()
        } catch (err) {
            console.log('Error logging out', err)
        }
        
        window.location.hash = '/account/login'
	}
    
    // TODO: Can I move these next group of methods up a level to AuthenticatedComponent?
    onLoginSuccess() {
        window.location.hash = '/'
    }
    
    onLoginError() {
        window.location.hash = '/account/login'
    }
    
    onCreateSuccess(response) {
        /*Auth.fetchAccount(data => {
            LoginActions.loginUser(response.data)
            UserActions.setUser(response.data)
            CustomerService.setCustomer(response.data)
            
            this.onLoginSuccess()
        })*/
    }
    
    render() {       
        return (
            <div className='container-fluid'>
				{!this.props.loggedIn && (
                <Modal
                    show = {true}>
                    {!this.props.loggedIn && this.props.location.pathname === '/account/login' && false && (
					<Modal.Header>
                        <Modal.Title>
                            <div className='column_attr clearfix align_center'>
                                <h2 className='heading-with-border' style={{textAlign: 'center'}}>Sign Into Your Account</h2>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
					)}
                    <Modal.Body>
                        {this.props.children} 
						<SignInForm 
                            onSubmit = {this.doLogin}
                            onLoginSuccess = {this.onLoginSuccess}
                            onLogout = {this.doLogout}
                            onCreate = {() => {window.location.hash = '/account/register'}}
                            />
                            
                        {/*this.props.loggedIn && (
                        <SignInForm 
                            user = {this.props.customer}
                            onLoginSuccess = {this.onLoginSuccess}
                            onCreate = {() => {window.location.hash = '/account/register'}}
                            />
                        )*/}
                    </Modal.Body>
                </Modal>
                )}
                
                {/*<div className='section_wrapper mcb-section-inner'>
                    <div className='wrap mcb-wrap one valign-top clearfix'>
                        <div className='mcb-wrap-inner'>
                            <div className='column mcb-column two-third column_column'
                                style = {{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    float: 'none'
                                }}>
                                
                                {this.props.loggedIn && this.props.location.pathname === '/account/edit' && (
                                <div className='column_attr clearfix align_center'>
                                    <h2 className='heading-with-border'>Update Your Account</h2>
                                    <h4>Having trouble with your account? Call us at 780.244.0ACE and we'll be happy to help you out.</h4>
                                </div>
                                )}
                                
                                {!this.props.loggedIn && this.props.location.pathname === '/account/login' && (
                                <div className='column_attr clearfix align_center'>
                                    <h2 className='heading-with-border'>Sign Into Your Account</h2>
                                </div>
                                )}
                                
                                {!this.props.loggedIn && this.props.location.pathname === '/account/register' && (
                                <div className='column_attr clearfix align_center'>
                                    <h2 className='heading-with-border'>Create an Account</h2>
                                    <h4>Having trouble getting started? Call us at 780.244.0ACE and we'll be happy to help you out.</h4>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {this.props.location.pathname === '/account/login' && (
                <div className='section_wrapper mcb-section-inner full-width-inputs'>
                    <div className='wrap mcb-wrap one valign-top clearfix'>
                        <div className='mcb-wrap-inner'>
                            <div className='column mcb-column one-fourth column_column'
                                style = {{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    marginTop: '3rem',
                                    marginBottom: '2.5rem',
                                    float: 'none'
                                }}>
                                <div className='column_attr clearfix align_center'>
                                    {!this.props.loggedIn && (
                                    <SignInForm 
                                        onLoginSuccess = {this.onLoginSuccess}
                                        onCreate = {() => {window.location.hash = '/account/register'}}
                                        />
                                    )}
                                    
                                    {this.props.loggedIn && (
                                    <SignInForm 
                                        user = {this.props.customer}
                                        onLoginSuccess = {this.onLoginSuccess}
                                        onCreate = {() => {window.location.hash = '/account/register'}}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}
                
                {!this.props.loggedIn && this.props.location.pathname === '/account/register' && (
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
                        displayShippingAddress = {true}
                        onCreateSuccess = {this.onCreateSuccess}
                        onCancel = {() => {window.location.hash = '/account/login'}}>
                    </CustomerProfile>
                </Row>
                )}
                
                {this.props.loggedIn && this.props.location.pathname === '/account/edit' && (
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
                        displayShippingAddress = {true}
                        onCreateSuccess = {this.onCreateSuccess}
                        onCancel = {() => {window.location.hash = '/'}}>
                    </CustomerProfile>
                </Row>
                )}
                */}
            </div>
        )
    }
}