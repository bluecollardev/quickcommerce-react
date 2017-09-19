import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import ToggleDisplay from 'react-toggle-display'

import FormComponent from '../FormComponent.jsx'

import EmployerActions from '../../actions/EmployerActions.jsx'
import CustomerActions from '../../actions/CustomerActions.jsx'
import CustomerService from '../../services/CustomerService.jsx'


export default FormComponent(class EmployerInfo extends Component {
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
        
        console.log('customer')
        console.log(props.data)
        
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
            CustomerService.post(formData, this.onSaveSuccess, this.onError)
        })
        
        this.onSaveSuccess()
        }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.props.triggerAction((formData) => {
            CustomerService.put(formData, this.onSaveSuccess, this.onError)
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
        let data = {}
        // Make sure data object is set
        if (!this.props.hasOwnProperty('data')) {
            data = EmployerInfo.defaultProps
        } else {
            data = assign({}, EmployerInfo.defaultProps, this.props.data)
        }
        
        return (
            <div className='customer-full-info'>
                <form>
                    <Col sm={12} lg={6}>
                        <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                            <ControlLabel>Type*</ControlLabel>
                            <FormControl name='employment_type' componentClass='select' value={data.employment_type} onChange={(e) => this.props.setField(e)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                            <ControlLabel>Status*</ControlLabel>
                            <FormControl name='status' componentClass='select' value={data.status} onChange={(e) => this.props.setField(e)} />
                        </FormGroup>
                        
                        {/*<FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                            <ControlLabel>First Name*</ControlLabel>
                            <FormControl name='firstname' type='text' value={data.firstname} onChange={(e) => this.props.setField(e)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                            <ControlLabel>Last Name*</ControlLabel>
                            <FormControl name='lastname' type='text' value={data.lastname} onChange={(e) => this.props.setField(e)} />
                        </FormGroup>*/}
                        
                        <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                            <ControlLabel>Company Name</ControlLabel>
                            <FormControl name='company_name' type='text' value={data.company_name} onChange={(e) => this.props.setField(e)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                            <ControlLabel>Occupation*</ControlLabel>
                            <FormControl name='occupation' type='text' value={data.occupation} onChange={(e) => this.props.setField(e)} />
                        </FormGroup>
                    </Col>
                    
                    {this.props.displayContact && (
                    <Col sm={12} lg={6}>
                        <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                            <ControlLabel>Telephone</ControlLabel>
                            <FormControl name='telephone' type='tel' value={data.telephone} onChange={(e) => this.props.setField(e)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                            <ControlLabel>Email*</ControlLabel>
                            <FormControl name='email' type='email' value={data.email} onChange={(e) => this.props.setField(e)} />
                        </FormGroup>
                    </Col>
                    )}
                    
                    {/*<FormGroup>
                        <Button bsStyle='success' onClick={this.onUpdate}>Update Info</Button>&nbsp;
                        <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
                    </FormGroup>*/}
                </form>
            </div>
        )
    }   
})