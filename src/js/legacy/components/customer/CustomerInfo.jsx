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
    customerService: deps.customerService
}))
@observer
class CustomerInfo extends Component {
    static defaultProps = {}
    
    constructor(props) {
        super(props)
        
        this.onCreate = this.onCreate.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onSaveSuccess = this.onSaveSuccess.bind(this)
        this.onError = this.onError.bind(this)
        
        this.state = {
            data: assign({}, props.data)
        }
    }
    
    componentWillReceiveProps(newProps) {
        this.setState({
            data: assign({}, newProps.data)
        })
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.props.triggerAction((formData) => {
            this.props.customerService.post(formData, this.onSaveSuccess, this.onError)
        })
        
        this.onSaveSuccess()
    }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.props.triggerAction((formData) => {
            this.props.customerService.put(formData, this.onSaveSuccess, this.onError)
        })
        
        this.onSaveSuccess()
    }
    
    onCancel(e) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('executing onCancel')
        if (typeof this.props.onCancel === 'function') {
            console.log('execute handler')
            var fn = this.props.onCancel
            fn.call(this, e)
        }
    }
    
    onSaveSuccess(response) {
        console.log('executing onSaveSuccess')
        if (typeof this.props.onSaveSuccess === 'function') {
            console.log('execute handler')
            var fn = this.props.onSaveSuccess
            fn.call(this, response)
        }
    }
    
    onError(response) {
        console.log('executing onError')
        if (typeof this.props.onError === 'function') {
            console.log('execute handler')
            var fn = this.props.onError
            fn.call(this, response)
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
            <Row className='full-width-inputs'>
                <form>
                    {/* Only display if purchaser is a company */}
                    <FormGroup className='col-xs-12 col-sm-12'>
                        <ControlLabel>Company</ControlLabel>
                        <FormControl name={mappings.COMPANY_NAME} type='text' {...this.props.fields(mappings.COMPANY_NAME, this.props.getMappedValue(mappings.COMPANY_NAME, data))} />
                    </FormGroup>
                    
                    <FormGroup className='col-xs-4 col-sm-3'>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl name={mappings.TITLE} componentClass='select' {...this.props.fields(mappings.TITLE, this.props.getMappedValue(mappings.TITLE, data))} />
                    </FormGroup>
                    
                    <FormGroup className='col-xs-8 col-sm-9'>
                        <ControlLabel>First Name*</ControlLabel>
                        <FormControl name={mappings.FIRST_NAME} type='text' {...this.props.fields(mappings.FIRST_NAME, this.props.getMappedValue(mappings.FIRST_NAME, data))} />
                    </FormGroup>
                    
                    {/*<FormGroup className='col-sm-1 col-md-1 col-lg-1'>
                        <ControlLabel>Initial</ControlLabel>
                        <FormControl name='initial' type={mappings.INITIAL} {...this.props.fields(mappings.INITIAL, this.props.getMappedValue(mappings.INITIAL, data))} />
                    </FormGroup>*/}
                    
                    <FormGroup className='col-xs-12'>
                        <ControlLabel>Last Name*</ControlLabel>
                        <FormControl name={mappings.LAST_NAME} type='text' {...this.props.fields(mappings.LAST_NAME, this.props.getMappedValue(mappings.LAST_NAME, data))} />
                    </FormGroup>
                    
                    {/*<FormGroup className='col-sm-3 col-md-1 col-lg-1'>
                        <ControlLabel>Suffix</ControlLabel>
                        <FormControl name={mappings.SUFFIX} componentClass='select' {...this.props.fields(mappings.SUFFIX, this.props.getMappedValue(mappings.SUFFIX, data))} />
                    </FormGroup>*/}
                    
                    {/* DOB Stuff */}
                    {/*
                    <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                        <ControlLabel>M</ControlLabel>
                        <FormControl name={mappings.DOB_MONTH} type='text' {...this.props.fields(mappings.DOB_MONTH, this.props.getMappedValue(mappings.DOB_MONTH, data))} />
                    </FormGroup>
                    
                    <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                        <ControlLabel>D</ControlLabel>
                        <FormControl name={mappings.DOB_DAY} type='text' {...this.props.fields(mappings.DOB_DAY, this.props.getMappedValue(mappings.DOB_DAY, data))} />
                    </FormGroup>
                    
                    <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                        <ControlLabel>Y</ControlLabel>
                        <FormControl name={mappings.DOB_YEAR} type='text' {...this.props.fields(mappings.DOB_YEAR, this.props.getMappedValue(mappings.DOB_YEAR, data))} />
                    </FormGroup>
                    */}
                    {/* Done with DOB */}
                    
                    {/*<FormGroup className='col-sm-4 col-md-4 col-lg-4'>
                        <ControlLabel>SIN</ControlLabel>
                        <FormControl name={mappings.SIN} type='text' {...this.props.fields(mappings.SIN, this.props.getMappedValue(mappings.SIN, data))} />
                    </FormGroup>*/}
                    
                    {/*<FormGroup className='col-sm-4 col-md-4 col-lg-2'>
                        <ControlLabel>Gender</ControlLabel>
                        <FormControl name={mappings.GENDER} componentClass='select' {...this.props.fields(mappings.GENDER, this.props.getMappedValue(mappings.GENDER, data))} />
                    </FormGroup>*/}
                    
                    {/*<FormGroup className='col-sm-4 col-md-4 col-lg-2'>
                        <ControlLabel>Marital</ControlLabel>
                        <FormControl name={mappings.MARITAL} componentClass='select' {...this.props.fields(mappings.MARITAL, this.props.getMappedValue(mappings.MARITAL, data))} />
                    </FormGroup>*/}
                    
                    {/*<FormGroup className='col-sm-4 col-md-5 col-lg-4'>
                        <ControlLabel>Language</ControlLabel>
                        <FormControl name={mappings.LANGUAGE} type='text' {...this.props.fields(mappings.LANGUAGE, this.props.getMappedValue(mappings.LANGUAGE, data))} />
                    </FormGroup>*/}
                    
                    <FormGroup className='col-xs-12 col-sm-6'>
                        <ControlLabel>Telephone*</ControlLabel>
                        <FormControl name={mappings.TELEPHONE} type='tel' {...this.props.fields(mappings.TELEPHONE, this.props.getMappedValue(mappings.TELEPHONE, data))} />
                    </FormGroup>
                    
                    <FormGroup className='col-xs-12 col-sm-6'>
                        <ControlLabel>Mobile</ControlLabel>
                        <FormControl name={mappings.MOBILE} type='tel' {...this.props.fields(mappings.MOBILE, this.props.getMappedValue(mappings.MOBILE, data))} />
                    </FormGroup>
                    
                    <FormGroup className='col-xs-12 col-sm-8'>
                        <ControlLabel>Email*</ControlLabel>
                        <FormControl name={mappings.EMAIL} type='email' {...this.props.fields(mappings.EMAIL, this.props.getMappedValue(mappings.EMAIL, data))} />
                    </FormGroup>
                    
                    {this.props.displayActions && this.props.hasOwnProperty('mode') && this.props.mode === 'create' && (
                    <FormGroup className='col-xs-12'>
                        <Button bsStyle='success' onClick={this.onCreate}>Create Account</Button>&nbsp;
                        <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
                    </FormGroup>
                    )}
                    
                    {this.props.displayActions && this.props.hasOwnProperty('mode') && this.props.mode === 'edit' && (
                    <FormGroup className='col-xs-12'>
                        <Button bsStyle='success' onClick={this.onUpdate}>Update Info</Button>&nbsp;
                        <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
                    </FormGroup>
                    )}
                </form>
            </Row>
        )
    }   
}

export default FormComponent(CustomerInfo)
export { CustomerInfo }