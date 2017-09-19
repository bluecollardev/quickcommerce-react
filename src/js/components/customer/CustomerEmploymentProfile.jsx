import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import CurrentAddress from '../address/CurrentAddress.jsx'
import ShippingAddress from '../address/ShippingAddress.jsx'
import CustomerInfo from '../customer/CustomerFullInfo.jsx'
import CustomerIdentity from '../customer/CustomerIdentity.jsx'
import CustomerIncome from '../customer/CustomerIncome.jsx'
import EmployerProfile from '../employer/EmployerProfile.jsx'

import Auth from '../../services/AuthService.jsx'
import AuthenticatedComponent from '../AuthenticatedComponent.jsx'

import CustomerActions from '../../actions/CustomerActions.jsx'
import CustomerService from '../../services/CustomerService.jsx'
import CustomerAddressService from '../../services/CustomerAddressService.jsx'

export default class CustomerEmploymentProfile extends Component {
	static defaultProps = {
		pk: 'customer_id',
		editAccount: false,
		newAccount: true,
		displayLogin: false,
		displayProfile: true,
		displayCurrentAddress: false,
		displayShippingAddress: false,
		currentAddress: {},
		billingAddress: {},
		shippingAddress: {},
		customer: {
			id: null,
			customer_id: null,
			address_id: null,
			addresses: [],
			firstname: '',
			middlename: '',
			lastname: '',
			company_name: '',
			email: '',
			telephone: '',
			fax: ''
		}
	}
	
	constructor(props) {
        super(props)
        
        if (this.props.hasOwnProperty('billingAddress') || this.props.hasOwnProperty('currentAddress')) {
            // currentAddress and billingAddress are aliases
            if (!this.props.hasOwnProperty('currentAddress') && this.props.hasOwnProperty('billingAddress')) {
                console.log('has billing no current address')
                this.props.currentAddress = this.props.billingAddress
            }
            
            if (!this.props.hasOwnProperty('billingAddress') && this.props.hasOwnProperty('currentAddress')) {
                console.log('has current no billing address')
                this.props.billingAddress = this.props.currentAddress
            }
        }
        
        this.showNewAccountForm = this.showNewAccountForm.bind(this)
        this.hideNewAccountForm = this.hideNewAccountForm.bind(this)
        this.showEditAccountForm = this.showEditAccountForm.bind(this)
        this.hideEditAccountForm = this.hideEditAccountForm.bind(this)
        this.showLoginForm = this.showLoginForm.bind(this)
        this.hideLoginForm = this.hideLoginForm.bind(this)
        this.getForm = this.getForm.bind(this)
        
        this.onCreate = this.onCreate.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onCreateSuccess = this.onCreateSuccess.bind(this)
        this.onSaveSuccess = this.onSaveSuccess.bind(this)
        this.onError = this.onError.bind(this)
        
        this.renderErrors = this.renderErrors.bind(this)
        
        this.state = {
            errors: {}
        }
    }
    
    componentWillReceiveProps(newProps) {
        if (this.props.hasOwnProperty('billingAddress') || this.props.hasOwnProperty('currentAddress')) {
            // currentAddress and billingAddress are aliases
            if (!this.props.hasOwnProperty('currentAddress') && this.props.hasOwnProperty('billingAddress')) {
                console.log('has billing no current address')
                this.props.currentAddress = this.props.billingAddress
            }
            
            if (!this.props.hasOwnProperty('billingAddress') && this.props.hasOwnProperty('currentAddress')) {
                console.log('has current no billing address')
                this.props.billingAddress = this.props.currentAddress
            }
        }
        
        //this.state = assign({}, this.props)
    }
    
    componentDidUpdate() {
        if (this.props.hasOwnProperty('billingAddress') || this.props.hasOwnProperty('currentAddress')) {
            // currentAddress and billingAddress are aliases
            if (!this.props.hasOwnProperty('currentAddress') && this.props.hasOwnProperty('billingAddress')) {
                console.log('has billing no current address')
                this.props.currentAddress = this.props.billingAddress
            }
            
            if (!this.props.hasOwnProperty('billingAddress') && this.props.hasOwnProperty('currentAddress')) {
                console.log('has current no billing address')
                this.props.billingAddress = this.props.currentAddress
            }
        }
    }
    
    showNewAccountForm() {
        this.hideLoginForm()
        this.setState({ createAccount: true })
    }
    
    hideNewAccountForm() {
        this.showLoginForm()
        this.setState({ createAccount: false })
    }
    
    showEditAccountForm() {
        this.hideLoginForm()
        this.setState({ editAccount: true })
    }
    
    hideEditAccountForm() {
        this.showLoginForm()
        this.setState({ editAccount: false })
    }
    
    showLoginForm() {
        this.setState({ showLogin: true })
    }
    
    hideLoginForm() {
        this.setState({ showLogin: false })
    }
    
    // TODO: Abstract out getForm and triggerAction
    getForm() {
        // Do something?
        //return formData
    }
    
    triggerAction(callback) {
        return callback(this.getForm())
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.triggerAction((formData) => {
            CustomerService.post(formData.profile, this.onCreateSuccess, this.onError)
        })
    }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.triggerAction((formData) => {
            CustomerService.put(formData.profile, this.onSaveSuccess, this.onError)
            
            for (let idx = 0; idx < formData.addresses.length; idx++) {
                let address = formData.addresses[idx]
                let addressId = address['address_id'] || null
                
                // Drop in firstname and lastname fields to satisfy OC/Legacy API
                // If user wants to override names, he/she can do it on the order
                // Account addresses names should be hardcoded to match account profile
                address = assign(address, {
                    firstname: formData.profile['firstname'],
                    lastname: formData.profile['lastname']
                })
                
                if (addressId === null) {
                    CustomerAddressService.post(address)
                } else if (!isNaN(addressId)) {
                    CustomerAddressService.put(address)
                }
            }
        })
    }
    
    onCancel(e) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('executing onCancel')
        if (typeof this.props.onCancel === 'function') {
            console.log('execute handler')
            let fn = this.props.onCancel
            fn(e)
        }
    }
    
    onCreateSuccess(response) {
        console.log('executing onCreateSuccess')
        if (typeof this.props.onCreateSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onCreateSuccess
            fn(response)
        }
    }
    
    onSaveSuccess(response) {
        console.log('executing onSaveSuccess')
        if (typeof this.props.onSaveSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onSaveSuccess
            fn(response)
        }
    }
    
    onError(response) {
        console.log('executing onError')
        if (typeof this.props.onError === 'function') {
            console.log('execute handler')
            let fn = this.props.onError
            fn(response)
        }
        
        this.setState({
            errors: response.error
        })
    }
    
    renderErrors() {
        let errors = []
        let count = Object.keys(this.state.errors).length
        let idx = 1
        
        if (typeof this.state.errors !== 'string' && count > 0) {
            for (let error in this.state.errors) {
                errors.push(<strong>{this.state.errors[error]}</strong>)
                if (idx < count) {
                    errors.push(<br/>)
                }
                
                idx++
            }
        } else if (typeof this.state.errors === 'string') {
            errors.push(<strong>{this.state.errors}</strong>)
        }
        
        return errors
    }

    render() {
        if (this.props.createAccount) {
            return (
                <Col xs={12} className='customer-profile'>
                    {Object.keys(this.state.errors).length > 0 && (
                    <Alert bsStyle='danger' style={{
                        width: '75%',
                        textAlign: 'center',
                        margin: '0 auto'
                    }}>
                        {this.renderErrors()}
                    </Alert>
                    )}
					
                    {[0,1].map(idx => (
                    <Row className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <EmployerProfile
                                    title = 'Current Employer'
                                    customer = {CheckoutStore.customer}
                                    billingAddress = {CheckoutStore.billingAddress}
                                    shippingAddress = {CheckoutStore.shippingAddress}
                                    createAccount = {this.state.profileCreate}
                                    editAccount = {this.state.profileEdit}
                                    displayProfile = {this.props.displayProfile}
                                    displayCurrentAddress = {this.props.displayCurrentAddress}
                                    displayBillingAddress = {this.props.displayBillingAddress}
                                    displayShippingAddress = {this.props.displayShippingAddress}>
                                </EmployerProfile>
                                
                                <div className='billing-address'>
                                    <CustomerIncome
                                        ref = {income => this[['income', idx].join('_')] = income}
                                        title = 'Income Details'
                                        onCancel = {this.onCancel}
                                        onSaveSuccess = {this.onSaveSuccess}
                                        //mode = 'create'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    <div className='customer-profile-block row full-width-inputs align-center'>
                        <FormGroup>
                            <Button bsStyle='success' onClick={this.onCreate}><h4><i className='fa fa-check' /> Create Account</h4></Button>&nbsp;
                            <Button onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>&nbsp;
                        </FormGroup>
                    </div>
                </Col>
            )
        } else if (this.props.editAccount) {
            return (
                <Col xs={12} className='customer-profile'>
                    {Object.keys(this.state.errors).length > 0 && (
                    <Alert bsStyle='danger' style={{
                        width: '75%',
                        textAlign: 'center',
                        margin: '0 auto'
                    }}>
                        {this.renderErrors()}
                    </Alert>
                    )}
                    
                    <div className='customer-profile-block row full-width-inputs'>
                        {/*<h3 style={{textAlign: 'center'}}>Employment History</h3>*/}
						<EmployerProfile
							title = 'Current Employer'
							customer = {CheckoutStore.customer}
							billingAddress = {CheckoutStore.billingAddress}
							shippingAddress = {CheckoutStore.shippingAddress}
							createAccount = {this.state.profileCreate}
							editAccount = {this.state.profileEdit}
							displayProfile = {this.props.displayProfile}
							displayCurrentAddress = {this.props.displayCurrentAddress}
							displayBillingAddress = {this.props.displayBillingAddress}
							displayShippingAddress = {this.props.displayShippingAddress}>
						</EmployerProfile>
					</div>
                    
					<div className='customer-profile-block row full-width-inputs'>
                        <div className='billing-address'>
							<Repeater
                                max={3}>
                                <CustomerIncome
                                    ref = {(income) => {this.income = income}}
                                    title = 'Income Details'
                                    onCancel = {this.onCancel}
                                    onSaveSuccess = {this.onSaveSuccess}
                                    //mode = 'create'
                                    />
                            </Repeater>
						</div>
                    </div>
                    
                    <div className='customer-profile-block row full-width-inputs align-center'>
                        <FormGroup>
                            <Button bsStyle='success' onClick={this.onUpdate}><h4><i className='fa fa-check' /> Update Account</h4></Button>&nbsp;
                            <Button onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>&nbsp;
                        </FormGroup>
                    </div>
                    
                    {/*
                    <div>
                        <EditAccountForm
                            data = {this.props.customer}
                            onSaveSuccess = {this.hideEditAccountForm}
                            onCancel = {this.hideEditAccountForm}
                            />
                    </div>
                    */}
                </Col>
            )
        }
    }
}