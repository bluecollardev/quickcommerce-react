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

export default FormComponent(class CustomerIncome extends Component {
    static defaultProps = {        
		title: 'Income Details',
		incomeType: '',
		grossIncome: '',
		annualIncome: '',
		per: '',
		notes: ''
    }
    
    constructor(props) {
        super(props)
        
        this.onCreate = this.onCreate.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onSaveSuccess = this.onSaveSuccess.bind(this)
        this.onError = this.onError.bind(this)
        
        console.log('identity')
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
            //CustomerService.post(formData, this.onSaveSuccess, this.onError)
        })
        
        this.onSaveSuccess()
        }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.props.triggerAction((formData) => {
            //CustomerService.put(formData, this.onSaveSuccess, this.onError)
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
            fn.call(this, e)
        }
    }
    
    onSaveSuccess(response) {
        console.log('executing onSaveSuccess')
        if (typeof this.props.onSaveSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onSaveSuccess
            fn.call(this, response)
        }
    }
    
    onError(response) {
        console.log('executing onError')
        if (typeof this.props.onError === 'function') {
            console.log('execute handler')
            let fn = this.props.onError
            fn.call(this, response)
        }
        
        this.setState({
            errors: response.error
        })
    }
    
    render() {
        let data = this.state.data 
        
        return (
            <div>
                <form>
                    <Col xs={12} className='col-md-flex col-lg-flex'>
						<h4 className='fieldset-heading flex-md-full flex-lg-full'>{this.props.title}</h4>
                        {/* Only display if purchaser is a company */}
                        <FormGroup style={{ display: 'none' }}>
                            <ControlLabel>Type</ControlLabel>
                            <FormControl name='incomeType' componentClass='select' {...this.props.fields('incomeType', data.incomeType)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-3 flex-md-25'>
                            <ControlLabel>Gross Income</ControlLabel>
                            <FormControl name='grossIncome' type='text' {...this.props.fields('grossIncome', data.grossIncome)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-2 flex-md-12'>
                            <ControlLabel>Per</ControlLabel>
                            <FormControl name='per' componentClass='select' {...this.props.fields('per', data.per)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-4 flex-md-37'>
                            <ControlLabel>Notes</ControlLabel>
                            <FormControl name='notes' type='text' {...this.props.fields('notes', data.notes)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-3 flex-md-25'>
                            <ControlLabel>Total Annual</ControlLabel>
                            <FormControl name='annualIncome' type='text' {...this.props.fields('annualIncome', data.annualIncome)} />
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