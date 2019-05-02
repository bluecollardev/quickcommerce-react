import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import CurrentAddress from '../address/CurrentAddress.jsx'
import ShippingAddress from '../address/ShippingAddress.jsx'
import CustomerInfo from '../customer/CustomerInfo.jsx'

import AuthenticatedComponent from '../AuthenticatedComponent'

@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService,
    customerService: deps.customerService,
    customerAddressService: deps.customerAddressService
}))
@observer
class CustomerProfile extends Component {
    static defaultProps = {
        pk: 'customer_id',
        editAccount: false,
        newAccount: true,
        displayLogin: false,
        displayProfile: true,
        displayCurrentAddress: false,
        displayBillingAddress: false,
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
        
        this.onBillingAddressUpdate = this.onBillingAddressUpdate.bind(this)
        this.onShippingAddressUpdate = this.onShippingAddressUpdate.bind(this)
        
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
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {        
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
        let formData = null
        
        console.log('grabbing form data from child form components')
        let profile = null
        let billingAddress = null
        
        if (typeof this.profile !== 'undefined') {
            profile = this.profile.getForm()
        }
        
        if (typeof this.billingAddress !== 'undefined') {
            billingAddress = this.billingAddress.getForm()
            // Temp workaround, provide both variants
            //billingAddress['address_1'] = billingAddress['address1']
            //billingAddress['address_2'] = billingAddress['address2']
        }
        
        if (billingAddress === null) {
            // Address form hasn't been activated, no updates to grab
            // Just pull the data from props
            billingAddress = this.props.billingAddress
        }
        
        if (profile !== null) {
            formData = {
                customer: assign({}, profile),
                addresses: (billingAddress !== null) ? [assign({}, billingAddress)] : []
            }
        }
        
        return formData
    }
    
    triggerAction(callback) {
        return callback(this.getForm())
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.triggerAction((formData) => {
            this.props.customerService.post(formData, this.onCreateSuccess, this.onError)
        })
    }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        // Use this if we're using an endpoint like customer/1/address
        /*this.triggerAction((formData) => {
            // No PUT available in API
            this.props.customerService.patch(formData, this.onSaveSuccess, this.onError)
            
            for (let idx = 0; idx < formData.addresses.length; idx++) {
                let address = formData.addresses[idx]
                let addressId = address['address_id'] || null
                
                // Drop in firstname and lastname fields to satisfy OC/Legacy API
                // If user wants to override names, he/she can do it on the order
                // Account addresses names should be hardcoded to match account profile
                address = assign(address, {
                    firstname: formData.customer['firstname'],
                    lastname: formData.customer['lastname']
                })
                
                if (addressId === null) {
                    this.props.customerAddressService.post(address)
                } else if (!isNaN(addressId)) {
                    this.props.customerAddressService.put(address)
                }
            }
        })*/
        
        // Use this if we're submitting the address along with the customer
        this.triggerAction((formData) => {
            // No PUT available in API
            this.props.customerService.patch(formData, this.onSaveSuccess, this.onError)
        })
    }
    
    onCancel(e) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('executing CustomerProfile onCancel')
        if (typeof this.props.onCancel === 'function') {
            console.log('execute handler')
            let fn = this.props.onCancel
            fn(e)
        }
    }
    
    onCreateSuccess(response) {
        console.log('executing CustomerProfile onCreateSuccess')
        if (typeof this.props.onCreateSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onCreateSuccess
            fn(response)
        }
        
        this.props.actions.customerList.loadCustomers()
    }
    
    onSaveSuccess(response) {
        console.log('executing CustomerProfile onSaveSuccess')
        if (typeof this.props.onSaveSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onSaveSuccess
            fn(response)
        }
        
        this.props.actions.customerList.loadCustomers()
    }
    
    onBillingAddressUpdate() {
        //let address = (typeof this.billingAddress !== 'undefined') ? this.billingAddress.getForm() : {}
    }
    
    onShippingAddressUpdate() {
        //let address = (typeof this.shippingAddress !== 'undefined') ? this.shippingAddress.getForm() : {}
    }
    
    onError(response) {
        response = response || null
        console.log('executing CustomerProfile onError')
        if (typeof this.props.onError === 'function') {
            console.log('execute handler')
            let fn = this.props.onError
            fn(response)
        }
        
        if (response !== null && response.hasOwnProperty('error')) {
            this.setState({
                errors: response.error
            })            
        }
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
                    
                    <div className='customer-profile-block row customer-info full-width-inputs'>
                        {this.props.children}
                    
                        {this.props.displayProfile && (
                        <CustomerInfo
                            ref = {(profile) => {this.profile = profile}}
                            onCancel = {this.onCancel}
                            onSaveSuccess = {this.onSaveSuccess}
                            mode = 'create'
                            />
                        )}
                    </div>                

                    {this.props.displayCurrentAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='billing-address'>
                            <CurrentAddress
                                ref = {(address) => {this.billingAddress = address}}
                                title = 'Primary Address'
                                modal = {this.props.modal}
                                displaySummary = {true}
                                displayActions = {true}
                                durationRequired = {this.props.durationRequired}
                                mode = 'create'
                                />
                        </div>
                    </div>
                    )}
                    
                    {/*this.props.displayShippingAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='shipping-address'>
                            <CurrentAddress
                                ref = {(address) => {this.shippingAddress = address}}
                                title = 'Shipping Address'
                                modal = {this.props.modal}
                                data = {this.props.shippingAddress}
                                displaySummary = {true}
                                mode = 'create'
                                />
                        </div>
                    </div>
                    )*/}
                    
                    <div className='customer-profile-block row full-width-inputs align-center'>
                        <Row>
                            <FormGroup className='col-xs-12 col-lg-6'>
                                <Button block bsStyle='success' onClick={this.onCreate}><h4><i className='fa fa-check' /> Create Account</h4></Button>
                            </FormGroup>
                            
                            <FormGroup className='col-xs-12 col-lg-6'>
                                <Button block onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                            </FormGroup>
                        </Row>
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
                    
                    <div className='customer-profile-block row customer-info full-width-inputs'>
                        {this.props.children}
                    
                        {this.props.displayProfile && (
                        <CustomerInfo
                            ref = {(profile) => {this.profile = profile}}
                            data = {this.props.customer}
                            onCancel = {this.props.onCancel}
                            onSaveSuccess = {this.props.onSaveSuccess}
                            mode = 'edit'
                            />
                        )}
                    </div>                

                    {this.props.displayCurrentAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='billing-address'>
                            <CurrentAddress
                                ref = {(address) => {this.billingAddress = address}}
                                title = 'Billing Address'
                                modal = {this.props.modal}
                                data = {this.props.billingAddress}
                                displaySummary = {true}
                                displayActions = {true}
                                durationRequired = {this.props.durationRequired}
                                isSubForm = {true}
                                onUpdate = {this.onBillingAddressUpdate}
                                mode = 'edit'
                                />
                        </div>
                    </div>
                    )}

                    {this.props.displayShippingAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='shipping-address'>
                            <CurrentAddress
                                ref = {(address) => {this.shippingAddress = address}}
                                title = 'Shipping Address'
                                modal = {this.props.modal}
                                data = {this.props.shippingAddress}
                                displaySummary = {true}
                                displayActions = {true}
                                durationRequired = {this.props.durationRequired}
                                isSubForm = {true}
                                onUpdate = {this.onShippingAddressUpdate}
                                mode = 'edit'
                                />
                        </div>
                    </div>
                    )}
                    
                    <div className='customer-profile-block row full-width-inputs align-center'>
                        <Row>
                            <FormGroup className='col-xs-12 col-lg-6'>
                                <Button block bsStyle='success' onClick={this.onUpdate}><h4><i className='fa fa-check' /> Update Account</h4></Button>
                            </FormGroup>
                            
                            <FormGroup className='col-xs-12 col-lg-6'>
                                <Button block onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                            </FormGroup>
                        </Row>
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
        
        // If we're not logged in don't render the component at all
        // This only works with React 15+
        return null
    }
}

export default CustomerProfile