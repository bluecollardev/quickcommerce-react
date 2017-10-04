import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import FormComponent from '../FormComponent.jsx'

import SettingStore from '../../stores/SettingStore.jsx'

import CustomerActions from '../../actions/CustomerActions.jsx'
import CustomerService from '../../services/CustomerService.jsx'

import {
	OccupationAutocomplete,
	CountryAutocomplete,
	ZoneAutocomplete,
	CustomerAutocomplete,
	CustomerGroupAutocomplete,
	OrderStatusAutocomplete,
	LanguageAutocomplete,
	StoreAutocomplete
} from '../form/Autocomplete.jsx'

import {
	SelectList,
	ContactTypeDropdown,
	IdTypeDropdown,
	CustomerRelationDropdown,
	SalutationDropdown,
	SuffixDropdown,
	GenderDropdown,
	MaritalDropdown,
	ResidenceTypeDropdown,
	EmploymentTypeDropdown,
	IncomeTypeDropdown,
	FrequencyDropdown,
	AssetTypeDropdown,
	LiabilityTypeDropdown,
	StreetTypeDropdown,
	StreetDirDropdown
} from '../form/Dropdown.jsx'

import {
	SelectButton,
	ContactTypeButton,
	IdTypeButton,
	CustomerRelationButton,
	SalutationButton,
	SuffixButton,
	GenderButton,
	MaritalButton,
	ResidenceTypeButton,
	EmploymentTypeButton,
	IncomeTypeButton,
	FrequencyButton,
	AssetTypeButton,
	LiabilityTypeButton,
	StreetTypeButton,
	StreetDirButton
} from '../form/Dropdown.jsx'

import {
	DateInput,
	DateTimeInput,
	TimeInput,
	NumericInput,
	TelephoneInput,
	EmailInput,
	PostalCodeInput,
	SinNumberInput,
	SsnInput
} from '../form/Input.jsx'

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
                    <Col xs={12} className='col-md-flex col-sm-flex'>
						<h4 className='fieldset-heading flex-md-full flex-lg-full'>{this.props.title}</h4>
                        {/* Only display if purchaser is a company */}
                        <FormGroup>
                            <ControlLabel>Type</ControlLabel>
                            <IncomeTypeDropdown componentClass='select' items={SettingStore.incomeTypes} name='incomeType' {...this.props.fields('incomeType', data.incomeType)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 flex-md-25'>
                            <ControlLabel>Gross Income</ControlLabel>
                            <FormControl type='text' name='grossIncome' {...this.props.fields('grossIncome', data.grossIncome)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-2 flex-md-12'>
                            <ControlLabel>Frequency</ControlLabel>
                            <FrequencyDropdown componentClass='select' items={SettingStore.paymentFrequencies} name='per' {...this.props.fields('per', data.per)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-4 flex-md-37'>
                            <ControlLabel>Notes</ControlLabel>
                            <FormControl type='text' name='notes' {...this.props.fields('notes', data.notes)} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 flex-md-25'>
                            <ControlLabel>Total Annual</ControlLabel>
                            <FormControl type='text' name='annualIncome' {...this.props.fields('annualIncome', data.annualIncome)} />
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