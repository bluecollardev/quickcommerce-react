import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import AuthenticatedComponent from '../AuthenticatedComponent.jsx'
import FormComponent from '../FormComponent.jsx'

import CustomerInfo from './CustomerFullInfo.jsx'
// TODO: These need to be moved to inheriting class
import CustomerContact from './CustomerContact.jsx'
import CustomerIdentity from './CustomerIdentity.jsx'
import CustomerIncome from './CustomerIncome.jsx'

import CurrentAddress from '../address/CurrentAddress.jsx'
import ShippingAddress from '../address/ShippingAddress.jsx'

import customerFieldNames from '../../forms/CustomerInfoFields.jsx'
import addressFieldNames from '../../forms/AddressFields.jsx'

@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService,
    customerService: deps.customerService,
    customerAddressService: deps.customerAddressService,
    customerStore: deps.customerStore,
    settingStore: deps.settingStore
}))
@observer
class CustomerFullProfile extends Component {
    // TODO: Redo default props, there are a couple items like this flagged in my comments
    static defaultProps = {
        pk: 'customer_id',
        editAccount: false,
        newAccount: true,
        displayLogin: false,
        displayProfile: true,
        displayPassword: true,
        displayCurrentAddress: false,
        displayShippingAddress: false,
        multipleAddresses: false,
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
        this.onShipToBillingAddressChange = this.onShipToBillingAddressChange.bind(this)
        
        this.renderErrors = this.renderErrors.bind(this)
        
        this.state = {
            errors: {},
            shipToBillingAddress: true
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
    
    // TODO: Abstract out getForm, triggerAction, dispatch, freezeState, unfreezeState etc.
    
    /**
     * Grab all subforms and assembles their data into a single object.
     */
    getForm() {
        console.log('grabbing form data from child form components')        
        // Always use getSubform to get sub-form data
        let formData = {
            profile: assign({}, this.getSubform('profile')),
            addresses: [
                assign({}, this.getSubform('billingAddress'))
            ],
            billingAddress: assign({}, this.getSubform('billingAddress'))
        }
        
        // Do something?
        return formData
    }
    
    /** 
     * Type check - we don't want to be calling getForm on a sub-form component that isn't a FormComponent.
     * There's no guarantee that markup in an inheriting component will contain the same references / subs.
     */
    getSubform(refProperty) {
        let prop = this[refProperty] || null
        // I'm not using a typing lib (it's on my bucket list) so duck type. It'll work just fine for this :)
        let subFormComponent = (prop !== null && prop.__proto__.hasOwnProperty('getForm')) ? prop : null
        // 1) Just call, getForm should NEVER accept any parameters!
        // 2) Don't use call or apply, there's no need to override 'this'
        // 3) Return an empty object, this method shouldn't try to break stuff
        return (subFormComponent !== null) ? subFormComponent.getForm() : {} 
    }
    
    triggerAction(callback) {
        return callback(this.getForm())
    }
    
    onShipToBillingAddressChange(e) {
        let shipToBilling = false
        
        if (e.target.value === 'billing') {
            shipToBilling = true
        } else if (e.target.value === 'shipping') {
            shipToBilling = false
        }
        
        this.setState({
            shipToBillingAddress: shipToBilling
        }, () => {
            console.log('changed shiptobillingaddress: shipToBillingAddress = ' + this.state.shipToBillingAddress)
        })
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.triggerAction((formData) => {
            alert('invoke POST on customerService')
            confirm(JSON.stringify(formData))
            this.props.customerService.post(formData.profile, this.onCreateSuccess, this.onError)
        })
    }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.triggerAction((formData) => {
            alert('invoke PUT on customerService')
            confirm(JSON.stringify(formData))
            
            this.props.customerService.put(formData.profile, this.onSaveSuccess, this.onError)
            
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
                    alert('POST to customerService')
                    confirm(JSON.stringify(formData))
                    this.props.customerAddressService.post(address)
                } else if (!isNaN(addressId)) {
                    alert('invoke PUT on customerService')
                    confirm(JSON.stringify(formData))
                    this.props.customerAddressService.put(address)
                }
            }
        })
    }
    
    // TODO: Move to FormComponent? Or another base class... (hint this is in more than a few places)
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
    
    // TODO: Move to FormComponent? Or another base class... (hint this is in more than a few places)
    onCreateSuccess(response) {
        console.log('executing onCreateSuccess')
        if (typeof this.props.onCreateSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onCreateSuccess
            fn(response)
        }
    }
    
    // TODO: Move to FormComponent? Or another base class... (hint this is in more than a few places)
    onSaveSuccess(response) {
        alert('response indicates success')
        confirm(JSON.stringify(response))
        if (typeof this.props.onSaveSuccess === 'function') {
            console.log('execute onSaveSuccess handler')
            let fn = this.props.onSaveSuccess
            fn(response)
        }
    }
    
    // TODO: Move to FormComponent (hint this is in more than a few places)
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
        const mappings = this.props.mappings || {
            customer: customerFieldNames,
            address: addressFieldNames
        }

        if (this.props.createAccount) {
            return (
                <Col sm={12} className='customer-profile display-block'>
                    {Object.keys(this.state.errors).length > 0 && (
                    <Alert bsStyle='danger' style={{
                        width: '75%',
                        textAlign: 'center',
                        margin: '0 auto'
                    }}>
                        {this.renderErrors()}
                    </Alert>
                    )}
                    
                    {/*
                    <div>
                        <NewAccountForm
                            onSaveSuccess = {this.hideNewAccountForm}
                            onCancel = {this.hideNewAccountForm}
                            />
                    </div>
                    */}
                    
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Information 
                                {/* TODO: What did we call it in CurrentAddress? */}
                                {['modal', 'custom'].indexOf(this.props.editMode) > -1 && (
                                <Button className='repeater-button'><h5><i className='fa fa-pencil' /> Edit</h5></Button>
                                )}
                                
                                {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
                                {!this.props.editMode || ['modal', 'custom'].indexOf(this.props.editMode) === -1 && (
                                <Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
                                )}
                            </h4>
                        </Col>
                    </Row>
                    
                    <div className='customer-profile-block row customer-info full-width-inputs'>
                        {this.props.children}
                        
                        {this.props.displayProfile && (
                        <CustomerInfo
                            mappings = {mappings.customer}
                            ref = {(profile) => {this.profile = profile}}
                            onCancel = {this.onCancel}
                            onSaveSuccess = {this.onSaveSuccess}
                            displayPassword = {this.props.displayPassword}
                            displayDateOfBirth = {this.props.displayDateOfBirth}
                            displaySIN = {this.props.displaySIN}
                            displayGender = {this.props.displayGender}
                            displayMarital = {this.props.displayMarital}
                            displayLanguage = {this.props.displayLanguage}
                            mode = 'create'
                            />
                        )}
                    </div>
                    
                    {/* Customer Contacts */}
                    {this.props.displayContacts && (
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Contacts
                                <Button className='repeater-button'><h5><i className='fa fa-plus-circle' /> Add Contact</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    )}
                    
                    {this.props.displayContacts && this.props.contacts && this.props.contacts.email && this.props.contacts.email.map((contact, idx) => (
                    <Row key={idx} className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerContact
                                        type = 'email'
                                        mappings = {mappings.contact}
                                        ref = {(contact) => {this.contact = contact}}
                                        data = {contact}
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
                    
                    {this.props.displayContacts && this.props.contacts && this.props.contacts.phone && this.props.contacts.phone.map((contact, idx) => (
                    <Row key={idx} className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerContact
                                        mappings = {mappings.contact}
                                        ref = {(contact) => {this.contact = contact}}
                                        data = {contact}
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
                    
                    {/* Customer Identification */}
                    {this.props.displayIdentification && (
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Identification
                                <Button className='repeater-button' onClick={() => { this.props.customerStore.addIdentification() }}><h5><i className='fa fa-plus-circle' /> Add Identification</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    )}
                    
                    {this.props.displayIdentification && this.props.identities && this.props.identities.map((identity, idx) => (
                    <Row key={idx} className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerIdentity
                                        mappings = {mappings.identity}
                                        ref = {(identity) => {this.identity = identity}}
                                        data = {identity}
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
                    
                    {/* Customer Addresses */}
                    {['multiple'].indexOf(this.props.displayAddresses) > -1 && (
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Addresses
                                {this.props.displayAddresses === 'multiple' && (
                                <Button className='repeater-button' onClick={() => { this.props.customerStore.addAddress() }}><h5><i className='fa fa-plus-circle' /> Add Address</h5></Button>
                                )}
                                
                                {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
                                {!this.props.displayAddresses === 'multiple' && (
                                <Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
                                )}
                            </h4>
                        </Col>
                    </Row>
                    )}
                    
                    {this.props.displayAddresses === 'multiple' && this.props.addresses && this.props.addresses.map((address, idx) => (
                    <Row key={idx} className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CurrentAddress
                                        mappings = {mappings.address}
                                        ref = {(address) => {this.billingAddress = address}}
                                        modal = {this.props.modal}
                                        data = {address}
                                        durationRequired = {this.props.durationRequired}
                                        nameRequired = {false}
                                        mode = 'create'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}

                    {/* If single / shipping / billing address */}
                    {[true, 'single'].indexOf(this.props.displayAddresses) > -1 && this.props.displayCurrentAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='billing-address'>
                            <CurrentAddress
                                mappings = {mappings.address}
                                ref = {(address) => {this.billingAddress = address}}
                                title = 'Current Address'
                                modal = {this.props.modal}
                                data = {this.props.billingAddress}
                                durationRequired = {this.props.durationRequired}
                                nameRequired = {false}
                                mode = 'create'
                                />
                            <hr />
                            <div className='form-group'>
                                <label className='radio radio-inline'>
                                    <input type='radio' name='co_shipping' checked={this.state.shipToBillingAddress === true} value='billing' onClick={this.onShipToBillingAddressChange} /> Ship to this address
                                </label>
                                <label className='radio radio-inline'>
                                    <input type='radio' name='co_shipping' checked={this.state.shipToBillingAddress === false} value='shipping' onClick={this.onShipToBillingAddressChange} /> Ship to different address
                                </label>
                            </div>
                        </div>
                    </div>
                    )}
                    
                    {/* If single / shipping / billing address */}
                    {[true, 'single'].indexOf(this.props.displayAddresses) > -1 && this.props.displayShippingAddress && this.state.shipToBillingAddress === false && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='shipping-address'>
                            <CurrentAddress
                                mappings = {mappings.address}
                                ref = {(address) => {this.shippingAddress = address}}
                                title = 'Shipping Address'
                                modal = {this.props.modal}
                                data = {this.props.shippingAddress}
                                durationRequired = {this.props.durationRequired}
                                nameRequired = {false}
                                mode = 'create'
                                />
                        </div>
                    </div>
                    )}
                    
                    {this.props.displayActions && (
                    <div className='customer-profile-block row full-width-inputs align-center'>
                        <FormGroup>
                            <Button className='waves-effect waves-light' bsStyle='primary' onClick={this.onCreate}><span><i className='fa fa-check' /> Create Account</span></Button>&nbsp;
                            <Button className='waves-effect waves-light' bsStyle='ghost' onClick={this.onCancel}><span><i className='fa fa-ban' /> Cancel</span></Button>&nbsp;
                        </FormGroup>
                    </div>
                    )}
                </Col>
            )
        } else if (this.props.editAccount) {
            return (
                <Col sm={12} className='customer-profile display-block'>
                    {Object.keys(this.state.errors).length > 0 && (
                    <Alert bsStyle='danger' style={{
                        width: '75%',
                        textAlign: 'center',
                        margin: '0 auto'
                    }}>
                        {this.renderErrors()}
                    </Alert>
                    )}
                    
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Information 
                                {/* TODO: What did we call it in CurrentAddress? */}
                                {['modal', 'custom'].indexOf(this.props.editMode) > -1 && (
                                <Button className='repeater-button' onClick={this.props.onEditClicked}><h5><i className='fa fa-pencil' /> Edit</h5></Button>
                                )}
                                
                                {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
                                {!this.props.editMode || ['modal', 'custom'].indexOf(this.props.editMode) === -1 && (
                                <Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
                                )}
                            </h4>
                        </Col>
                    </Row>
                    
                    <div className='customer-profile-block row customer-info full-width-inputs'>
                        {this.props.children}
                        
                        {this.props.displayProfile && (
                        <CustomerInfo
                            mappings = {mappings.customer}
                            ref = {(profile) => {this.profile = profile}}
                            data = {this.props.customer}
                            onCancel = {this.props.onCancel}
                            onSaveSuccess = {this.props.onSaveSuccess}
                            displayPassword = {this.props.displayPassword}
                            displayDateOfBirth = {this.props.displayDateOfBirth}
                            displaySIN = {this.props.displaySIN}
                            displayGender = {this.props.displayGender}
                            displayMarital = {this.props.displayMarital}
                            displayLanguage = {this.props.displayLanguage}
                            mode = 'edit'
                            />
                        )}
                    </div>
                    
                    {/* Customer Contacts */}
                    {this.props.displayContacts && (
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Contacts
                                <Button className='repeater-button'><h5><i className='fa fa-plus-circle' /> Add Contact</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    )}
                    
                    {this.props.displayContacts && this.props.contacts && this.props.contacts.email && this.props.contacts.email.map((contact, idx) => (
                    <Row key={idx} className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerContact
                                        type = 'email'
                                        mappings = {mappings.contact}
                                        ref = {(contact) => {this.contact = contact}}
                                        data = {contact}
                                        onCancel = {this.onCancel}
                                        onSaveSuccess = {this.onSaveSuccess}
                                        //mode = 'edit'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    {this.props.displayContacts && this.props.contacts && this.props.contacts.phone && this.props.contacts.phone.map((contact, idx) => (
                    <Row key={idx} className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerContact
                                        type = 'phone'
                                        mappings = {mappings.contact}
                                        ref = {(contact) => {this.contact = contact}}
                                        data = {contact}
                                        onCancel = {this.onCancel}
                                        onSaveSuccess = {this.onSaveSuccess}
                                        //mode = 'edit'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    {/* Customer Identification */}
                    {this.props.displayIdentification && (
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Identification
                                <Button className='repeater-button' onClick={() => { this.props.customerStore.addIdentification() }}><h5><i className='fa fa-plus-circle' /> Add Identification</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    )}
                    
                    {this.props.displayIdentification && this.props.identities && this.props.identities.map((identity, idx) => (
                    <Row key={idx} className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerIdentity
                                        mappings = {mappings.identity}
                                        ref = {(identity) => {this.identity = identity}}
                                        data = {identity}
                                        onCancel = {this.onCancel}
                                        onSaveSuccess = {this.onSaveSuccess}
                                        //mode = 'edit'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    {/* Customer Addresses */}
                    {['multiple'].indexOf(this.props.displayAddresses) > -1 && (
                    <h4 className='section-heading' style={{textAlign: 'center'}}>
                        Customer Addresses
                        {this.props.displayAddresses === 'multiple' && (
                        <Button className='repeater-button' onClick={() => { this.props.customerStore.addAddress() }}><h5><i className='fa fa-plus-circle' /> Add Address</h5></Button>
                        )}
                        
                        {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
                        {!this.props.displayAddresses === 'multiple' && (
                        <Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
                        )}
                    </h4>
                    )}
                    
                    {this.props.displayAddresses === 'multiple' && this.props.addresses && this.props.addresses.map((address, idx) => (
                    <Row key={idx} className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CurrentAddress
                                        mappings = {mappings.address}
                                        ref = {(address) => {this.billingAddress = address}}
                                        modal = {this.props.modal}
                                        data = {address}
                                        durationRequired = {this.props.durationRequired}
                                        nameRequired = {false}
                                        mode = 'edit'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    {/* If single / shipping / billing address */}
                    {[true, 'single'].indexOf(this.props.displayAddresses) > -1 && this.props.displayCurrentAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='billing-address'>
                            <CurrentAddress
                                mappings = {mappings.address}
                                ref = {(address) => {this.billingAddress = address}}
                                title = 'Billing Address'
                                modal = {this.props.modal}
                                data = {this.props.billingAddress}
                                durationRequired = {this.props.durationRequired}
                                nameRequired = {false}
                                mode = 'edit'
                                />
                            <hr />
                            <div className='form-group'>
                                <label className='radio radio-inline'>
                                    <input type='radio' name='co_shipping' checked={this.state.shipToBillingAddress === true} value='billing' onClick={this.onShipToBillingAddressChange} /> Ship to this address
                                </label>
                                <label className='radio radio-inline'>
                                    <input type='radio' name='co_shipping' checked={this.state.shipToBillingAddress === false} value='shipping' onClick={this.onShipToBillingAddressChange} /> Ship to different address
                                </label>
                            </div>
                        </div>
                    </div>
                    )}
                    
                    {/* If single / shipping / billing address */}
                    {[true, 'single'].indexOf(this.props.displayAddresses) > -1 && this.props.displayShippingAddress && this.state.shipToBillingAddress === false && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='shipping-address'>
                            <CurrentAddress
                                mappings = {mappings.address}
                                ref = {(address) => {this.shippingAddress = address}}
                                title = 'Shipping Address'
                                modal = {this.props.modal}
                                data = {this.props.shippingAddress}
                                durationRequired = {this.props.durationRequired}
                                mode = 'edit'
                                />
                        </div>
                    </div>
                    )}
                    
                    {this.props.displayActions && (
                    <div className='customer-profile-block row full-width-inputs align-center'>
                        <FormGroup>
                            <Button className='waves-effect waves-light' bsStyle='primary' onClick={this.onUpdate}><span><i className='fa fa-check' /> Update Account</span></Button>&nbsp;
                            <Button className='waves-effect waves-light' bsStyle='ghost' onClick={this.onCancel}><span><i className='fa fa-ban' /> Cancel</span></Button>&nbsp;
                        </FormGroup>
                    </div>
                    )}
                    
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

export default CustomerFullProfile