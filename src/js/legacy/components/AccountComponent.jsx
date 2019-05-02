import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

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

@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService,
    customerService: deps.customerService,
    loginStore: deps.loginStore,
    userStore: deps.userStore,
    customerStore: deps.customerStore
}))
@observer
class AccountComponent extends Component {
    constructor(props) {
        super(props)
        
        this.doLogin = this.doLogin.bind(this)
        this.doLogout = this.doLogout.bind(this)
        this.onLoginSuccess = this.onLoginSuccess.bind(this)
        this.onLoginError = this.onLoginError.bind(this)
        this.onCreateSuccess = this.onCreateSuccess.bind(this)
        this.getSignInMode = this.getSignInMode.bind(this)
        this.toggleRegistration = this.toggleRegistration.bind(this)
        
        this.state = {
            createAccount: false
        }
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
    
    getSignInMode() {
        const modes = ['overlay', 'fullpage', 'inline'] // No inline yet
        
        if (modes.indexOf(this.props.signInMode) > -1) {
            return this.props.signInMode
        }
        
        return AccountComponent.defaultProps.signInMode
    }
    
    toggleRegistration(e) {
        // TODO: Properly type-check
        if (typeof e !== 'undefined') {
            e.preventDefault()
            e.stopPropagation()
        }
        
        this.setState({
            createAccount: !this.state.createAccount
        })
    }
    
    doLogin(formData, onSuccess, onError) {        
        this.props.authService.login(
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
            this.props.authService.logout()
        } catch (err) {
            console.log('Error logging out', err)
        }
        
        window.location.hash = '/account/login'
    }
    
    // TODO: Can I move these next group of methods up a level to AuthenticatedComponent?
    onLoginSuccess(response) {
        let actions = this.props.actions
        
        // TODO: Check return - is it response or data object?
        if (response.success || response.status === 200) {
            if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {
                // TODO: This is still using legacy API
                let data = response.data.data
                // Account -> User role
                actions.user.setUser(data)
                // Account -> Customer role
                this.props.customerService.setCustomer(data) // TODO: Move me out! This is app / implementation specific
                
                window.location.hash = '/'
            }
        }
    }
    
    onLoginError() {
        window.location.hash = '/account/login'
    }
    
    onCreateSuccess(response) {
        /*this.props.authService.fetchAccount(data => {
            this.props.actions.login.loginUser(response.data)
            this.props.actions.user.setUser(response.data)
            CustomerService.setCustomer(response.data)
            
            this.onLoginSuccess()
        })*/
    }
    
    render() {       
        return (
            <div className='container-fluid'>
                {this.getSignInMode() === 'overlay' && !this.props.loginStore.isLoggedIn() && (
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
                </div>*/}
                
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
                        customer = {this.props.customerStore.customer}
                        billingAddress = {this.props.customerStore.billingAddress}
                        shippingAddress = {this.props.customerStore.shippingAddress}
                        editAccount = {false}
                        createAccount = {true}
                        displayActions = {true}
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
                        customer = {this.props.customerStore.customer}
                        billingAddress = {this.props.customerStore.billingAddress}
                        shippingAddress = {this.props.customerStore.shippingAddress}
                        editAccount = {true}
                        createAccount = {false}
                        displayActions = {true}
                        displayProfile = {true}
                        displayCurrentAddress = {true}
                        displayBillingAddress = {true}
                        displayShippingAddress = {true}
                        onCreateSuccess = {this.onCreateSuccess}
                        onCancel = {() => {window.location.hash = '/'}}>
                    </CustomerProfile>
                </Row>
                )}
            </div>
        )
    }
}

AccountComponent.propTypes = {
    //onItemClicked: React.PropTypes.func,
    //onFilterSelected: React.PropTypes.func,
    //onStepClicked: React.PropTypes.func
    signInMode: React.PropTypes.string
}

AccountComponent.defaultProps = {
    signInMode: 'overlay'
}

export default AccountComponent
export { AccountComponent }