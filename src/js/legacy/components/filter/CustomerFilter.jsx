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
    customerService: deps.customerService
}))
@observer
class CustomerFilter extends Component {
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
        let data = this.state.data 
        
        return (
            <div className='customer-full-info dark' style={{ paddingTop: '1rem' }}>
                <form>
                    <Col xs={12} md={6}>
                        {/* Only display if purchaser is a company */}
                        <FormGroup style={{ display: 'none' }}>
                            <ControlLabel>Company</ControlLabel>
                            <FormControl name='company_name' type='text' {...this.props.fields('company_name', data.company_name)} />
                        </FormGroup>
                        
                        <FormGroup className='col-md-6'>
                            <ControlLabel>First Name</ControlLabel>
                            <FormControl name='firstname' type='text' {...this.props.fields('firstname', data.firstname)} />
                        </FormGroup>
                        
                        <FormGroup className='col-md-6'>
                            <ControlLabel>Last Name</ControlLabel>
                            <FormControl name='lastname' type='text' {...this.props.fields('lastname', data.lastname)} />
                        </FormGroup>
                    </Col>
                    
                    <Col xs={12} md={6}>
                        <FormGroup className='col-md-6'>
                            <ControlLabel>Telephone</ControlLabel>
                            <FormControl name='telephone' type='tel' {...this.props.fields('telephone', data.telephone)} />
                        </FormGroup>
                        
                        <FormGroup className='col-md-6'>
                            <ControlLabel>Email</ControlLabel>
                            <FormControl name='email' type='email' {...this.props.fields('email', data.email)} />
                        </FormGroup>
                    </Col>
                </form>
            </div>
        )
    }   
}

export default FormComponent(CustomerFilter)
export { CustomerFilter }