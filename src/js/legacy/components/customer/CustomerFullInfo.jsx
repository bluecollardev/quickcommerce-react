import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import FormComponent from '../FormComponent.jsx'

import fieldNames from '../../forms/CustomerInfoFields.jsx'

@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService,
    customerService: deps.customerService,
    customerStore: deps.customerStore
}))
@observer
class CustomerFullInfo extends Component {
    static defaultProps = {        
        data: {
            id: null, // WTF this shouldn't be nested in here!
            address_id: null, // WTF this shouldn't be nested in here!
            addresses: [], // WTF this shouldn't be nested in here!
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
        
        this.onCreate = this.onCreate.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onSaveSuccess = this.onSaveSuccess.bind(this)
        this.onError = this.onError.bind(this)
        this.onChange = this.onChange.bind(this)
        
        this.state = {
            data: assign({}, props.customerStore.customer)
        }
    }
    
    componentWillMount() {
        this.props.customerStore.addChangeListener(this.onChange)
    }
    
    componentWillUnmount() {
        if (typeof this.onChange === 'function') {
            this.props.customerStore.removeChangeListener(this.onChange)
            
            delete this.onChange
        }
    }
    
    /*componentWillReceiveProps(newProps) {
        this.setState({
            data: newProps.customerStore.customer
        })
    }*/
    
    onChange() {
        console.log('change triggered')
        this.setState({
            data: assign({}, this.props.customerStore.customer)
        })
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
    
        this.props.triggerAction((formData) => {
            alert('invoke POST on customerService')
            confirm(JSON.stringify(formData))
            this.props.customerService.post(formData, this.onSaveSuccess, this.onError)
        })
        
        this.onSaveSuccess()
    }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.props.triggerAction((formData) => {
            alert('invoke PUT on customerService')
            confirm(JSON.stringify(formData))
            this.props.customerService.put(formData, this.onSaveSuccess, this.onError)
        })
        
        this.onSaveSuccess()
    }
    
    // TODO: Move to FormComponent (hint this is in more than a few places)
    onCancel(e) {
        e.preventDefault()
        e.stopPropagation()
        
        if (typeof this.props.onCancel === 'function') {
            console.log('executing onCancel handler')
            let fn = this.props.onCancel
            fn(e)
        }
    }
    
    // TODO: Move to FormComponent (hint this is in more than a few places)
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
    
    render() {
        const mappings = this.props.mappings || fieldNames
        
        if (this.state === null) {
            console.log('CurrentAddress component is unable to render - component state is null')
            console.log('dumping props and state to console')
            console.log(JSON.stringify(this.props))
            return null // Don't render
        }
        
        let data = this.state.data || null
        
        if (data === null) {
            console.log('CurrentAddress component is unable to render - no data was provided')
            console.log('dumping props and state to console')
            console.log(JSON.stringify(this.props))
            console.log(JSON.stringify(this.state))
            return null // Don't render
        }
        
        return (
            <div className='customer-full-info'>
                <form>
                    <Col sm={12} md={6} lg={4}>
                        {/* Only display if purchaser is a company */}
                        <FormGroup style={{ display: 'none' }}>
                            <ControlLabel>Company</ControlLabel>
                            <FormControl name={mappings.COMPANY_NAME} type='text' {...this.props.fields(mappings.COMPANY_NAME, this.props.getMappedValue(mappings.COMPANY_NAME, data))} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 col-md-1 col-lg-1'>
                            <ControlLabel>Title</ControlLabel>
                            <FormControl name={mappings.TITLE} componentClass='select' {...this.props.fields(mappings.TITLE, this.props.getMappedValue(mappings.TITLE, data))} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-8 col-md-3 col-lg-3'>
                            <ControlLabel>First Name*</ControlLabel>
                            <FormControl 
                                name={mappings.FIRST_NAME} 
                                type='text' 
                                {...this.props.fields(mappings.FIRST_NAME, this.props.getMappedValue(mappings.FIRST_NAME, data), 'isAlpha')}
                                required 
                                />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-1 col-md-1 col-lg-1'>
                            <ControlLabel>Initial</ControlLabel>
                            <FormControl name='initial' type={mappings.INITIAL} {...this.props.fields(mappings.INITIAL, this.props.getMappedValue(mappings.INITIAL, data))} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-9 col-md-3 col-lg-3'>
                            <ControlLabel>Last Name*</ControlLabel>
                            <FormControl 
                                name={mappings.LAST_NAME} 
                                type='text' 
                                {...this.props.fields(mappings.LAST_NAME, this.props.getMappedValue(mappings.LAST_NAME, data), 'isAlpha')} 
                                required 
                                />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 col-md-1 col-lg-1'>
                            <ControlLabel>Suffix</ControlLabel>
                            <FormControl name={mappings.SUFFIX} componentClass='select' {...this.props.fields(mappings.SUFFIX, this.props.getMappedValue(mappings.SUFFIX, data))} />
                        </FormGroup>
                        
                        {this.props.displayDob && (
                        <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                            <ControlLabel>M</ControlLabel>
                            <FormControl name={mappings.DOB_MONTH} type='text' {...this.props.fields(mappings.DOB_MONTH, this.props.getMappedValue(mappings.DOB_MONTH, data))} />
                        </FormGroup>
                        )}
                        
                        {this.props.displayDob && (
                        <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                            <ControlLabel>D</ControlLabel>
                            <FormControl name={mappings.DOB_DAY} type='text' {...this.props.fields(mappings.DOB_DAY, this.props.getMappedValue(mappings.DOB_DAY, data))} />
                        </FormGroup>
                        )}
                        
                        {this.props.displayDob && (
                        <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                            <ControlLabel>Y</ControlLabel>
                            <FormControl name={mappings.DOB_YEAR} type='text' {...this.props.fields(mappings.DOB_YEAR, this.props.getMappedValue(mappings.DOB_YEAR, data))} />
                        </FormGroup>
                        )}
                    </Col>
                    
                    <Col sm={12} md={6} lg={4}>
                        {this.props.displaySIN && (
                        <FormGroup className='col-sm-4 col-md-4 col-lg-4'>
                            <ControlLabel>SIN</ControlLabel>
                            <FormControl name={mappings.SIN} type='text' {...this.props.fields(mappings.SIN, this.props.getMappedValue(mappings.SIN, data))} />
                        </FormGroup>
                        )}
                        
                        {this.props.displayGender && (
                        <FormGroup className='col-sm-4 col-md-4 col-lg-2'>
                            <ControlLabel>Gender</ControlLabel>
                            <FormControl name={mappings.GENDER} componentClass='select' {...this.props.fields(mappings.GENDER, this.props.getMappedValue(mappings.GENDER, data))} />
                        </FormGroup>
                        )}
                        
                        {this.props.displayMarital && (
                        <FormGroup className='col-sm-4 col-md-4 col-lg-2'>
                            <ControlLabel>Marital</ControlLabel>
                            <FormControl name={mappings.MARITAL} componentClass='select' {...this.props.fields(mappings.MARITAL, this.props.getMappedValue(mappings.MARITAL, data))} />
                        </FormGroup>
                        )}
                        
                        {this.props.displayMarital && (
                        <FormGroup className='col-sm-4 col-md-5 col-lg-4'>
                            <ControlLabel>Language</ControlLabel>
                            <FormControl name={mappings.LANGUAGE} type='text' {...this.props.fields(mappings.LANGUAGE, this.props.getMappedValue(mappings.LANGUAGE, data))} />
                        </FormGroup>
                        )}
                    </Col>
                    
                    <Col sm={12} md={6} lg={4}>
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Telephone*</ControlLabel>
                            <FormControl 
                                name={mappings.TELEPHONE} 
                                type='tel' 
                                {...this.props.fields(mappings.TELEPHONE, this.props.getMappedValue(mappings.TELEPHONE, data), 'isNumeric')} 
                                required 
                                />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Mobile</ControlLabel>
                            <FormControl 
                                name={mappings.MOBILE} 
                                type='tel' 
                                {...this.props.fields(mappings.MOBILE, this.props.getMappedValue(mappings.MOBILE, data), 'isNumeric')} 
                                />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Email*</ControlLabel>
                            <FormControl 
                                name={mappings.EMAIL} 
                                type='email' 
                                {...this.props.fields(mappings.EMAIL, this.props.getMappedValue(mappings.EMAIL, data), 'isEmail')}
                                required
                                />
                        </FormGroup>
                    </Col>
                    {this.props.displayPassword && (
                    <Col sm={12}>
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Password*</ControlLabel>
                            <FormControl 
                                name={mappings.PASSWORD} 
                                type='password' 
                                {...this.props.fields(mappings.PASSWORD, this.props.getMappedValue(mappings.PASSWORD, data))} 
                                />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Confirm Password*</ControlLabel>
                            <FormControl 
                                name={mappings.CONFIRM} 
                                type='password' 
                                {...this.props.fields(mappings.CONFIRM, this.props.getMappedValue(mappings.PASSWORD, data), 'equalsField:confirm')} 
                                />
                        </FormGroup>
                        
                        <input type='hidden' name={mappings.AGREE} {...this.props.fields(mappings.AGREE, 1)} />
                    </Col>
                    )}
                    
                    {this.props.displayActions && this.props.hasOwnProperty('mode') && this.props.mode === 'create' && (
                        <FormGroup>
                            <Button bsStyle='success' onClick={this.onCreate}>Create Account</Button>&nbsp;
                            <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
                        </FormGroup>
                    )}
                    
                    {this.props.displayActions && this.props.hasOwnProperty('mode') && this.props.mode === 'edit' && (
                    <FormGroup>
                        <Button bsStyle='success' onClick={this.onUpdate}>Update Info</Button>&nbsp;
                        <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
                    </FormGroup>
                    )}
                </form>
            </div>
        )
    }   
}

export default FormComponent(CustomerFullInfo)
export { CustomerFullInfo }