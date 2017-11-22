import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import FormComponent from '../FormComponent.jsx'

@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService,
    customerService: deps.customerService,
    customerStore: deps.customerStore
}))
@observer
class CustomerFullInfo extends Component {
    static defaultProps = {        
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
        let data = this.state.data 
        
        return (
            <div className='customer-full-info'>
                <form>
                    <Col sm={12} md={6} lg={4}>
                        {/* Only display if purchaser is a company */}
                        <FormGroup style={{ display: 'none' }}>
                            <ControlLabel>Company</ControlLabel>
                            <FormControl name='company_name' type='text' {...this.props.fields('name', data.name)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 col-md-1 col-lg-1'>
                            <ControlLabel>Title</ControlLabel>
                            <FormControl name='title' componentClass='select' {...this.props.fields('title', data.title)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-8 col-md-3 col-lg-3'>
                            <ControlLabel>First Name*</ControlLabel>
                            <FormControl name='firstname' type='text' {...this.props.fields('firstName', data.firstName)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-1 col-md-1 col-lg-1'>
                            <ControlLabel>Initial</ControlLabel>
                            <FormControl name='initial' type='text' {...this.props.fields('initial', data.initial)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-9 col-md-3 col-lg-3'>
                            <ControlLabel>Last Name*</ControlLabel>
                            <FormControl name='lastname' type='text' {...this.props.fields('lastName', data.lastName)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 col-md-1 col-lg-1'>
                            <ControlLabel>Suffix</ControlLabel>
                            <FormControl name='suffix' componentClass='select' {...this.props.fields('suffix', data.suffix)} />
                        </FormGroup>
                        
                        {/* DOB Stuff */}
                        <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                            <ControlLabel>M</ControlLabel>
                            <FormControl name='dob_month' type='text' {...this.props.fields('dob_month', data.dob_month)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                            <ControlLabel>D</ControlLabel>
                            <FormControl name='dob_day' type='text' {...this.props.fields('dob_day', data.dob_day)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-4 col-md-1 col-lg-1'>
                            <ControlLabel>Y</ControlLabel>
                            <FormControl name='dob_year' type='text' {...this.props.fields('dob_year', data.dob_year)} />
                        </FormGroup>
                        {/* Done with DOB */}
                    </Col>
                    
                    <Col sm={12} md={6} lg={4}>
                        <FormGroup className='col-sm-4 col-md-4 col-lg-4'>
                            <ControlLabel>SIN</ControlLabel>
                            <FormControl name='sin' type='text' {...this.props.fields('sin', data.sin)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-4 col-md-4 col-lg-2'>
                            <ControlLabel>Gender</ControlLabel>
                            <FormControl name='gender' componentClass='select' {...this.props.fields('gender', data.gender)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-4 col-md-4 col-lg-2'>
                            <ControlLabel>Marital</ControlLabel>
                            <FormControl name='marital' componentClass='select' {...this.props.fields('marital', data.marital)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-4 col-md-5 col-lg-4'>
                            <ControlLabel>Language</ControlLabel>
                            <FormControl name='lang' type='text' {...this.props.fields('lang', data.lang)} />
                        </FormGroup>    
                    </Col>
                    
                    <Col sm={12} md={6} lg={4}>
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Telephone*</ControlLabel>
                            <FormControl name='telephone' type='tel' {...this.props.fields('telephone', data.telephone)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Mobile</ControlLabel>
                            <FormControl name='telephone' type='tel' {...this.props.fields('mobile', data.telephone)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Email*</ControlLabel>
                            <FormControl name='email' type='email' {...this.props.fields('email', data.email)} />
                        </FormGroup>
                    </Col>
                    {this.props.displayPassword && (
                    <Col sm={12}>
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Password*</ControlLabel>
                            <FormControl name='password' type='password' {...this.props.fields('password')} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-12 col-md-4 col-lg-3'>
                            <ControlLabel>Confirm Password*</ControlLabel>
                            <FormControl name='confirm' type='password' {...this.props.fields('confirm')} />
                        </FormGroup>
                        
                        <input type='hidden' name='agree' {...this.props.fields('agree', 1)} />
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