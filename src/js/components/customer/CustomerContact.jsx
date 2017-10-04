import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import FormComponent from '../FormComponent.jsx'

import CustomerActions from '../../actions/CustomerActions.jsx'
import CustomerService from '../../services/CustomerService.jsx'

import fieldNames from '../../forms/CustomerContactFields.jsx'

export default FormComponent(class CustomerContact extends Component {
    static defaultProps = {        
		id: null,
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
            let fn = this.props.onCancel
            fn(e)
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
    
    render() {
		const mappings = this.props.mappings || fieldNames
		
        let data = this.state.data 
        
        return (
            <div>
                <form>
                    <Col sm={12} md={6} lg={4}>
                        <FormGroup className='col-sm-12 col-md-4 col-sm-3'>
                            <ControlLabel>Telephone*</ControlLabel>
                            <FormControl type='tel' name={mappings.TELEPHONE} {...this.props.fields(mappings.TELEPHONE, data[mappings.TELEPHONE])} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-12 col-md-4 col-sm-3'>
                            <ControlLabel>Mobile</ControlLabel>
                            <FormControl type='tel' name={mappings.MOBILE} {...this.props.fields(mappings.MOBILE, data[mappings.MOBILE])} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-12 col-md-4 col-sm-3'>
                            <ControlLabel>Email*</ControlLabel>
                            <FormControl type='email' name={mappings.NAME} {...this.props.fields(mappings.NAME, data[mappings.NAME])} />
                        </FormGroup>
                    </Col>
                    
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
})