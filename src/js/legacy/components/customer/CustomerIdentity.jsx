import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Dropdown, Checkbox, Radio } from 'react-bootstrap'

import Autocomplete from 'react-autocomplete'

import FormComponent from '../FormComponent.jsx'

import fieldNames from '../../forms/CustomerIdentityFields.jsx'

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

@inject(deps => ({
    actions: deps.actions,
    customerService: deps.customerService,
    settingStore: deps.settingStore
}))
@observer
class CustomerIdentity extends Component {
    static defaultProps = {        
        title: null,
        data: {
            identityType: '',
            nameAsShown: '',
            value: '',
            expiryDate: '',
            territory: '',
            country: ''
        }
    }
    
    constructor(props) {
        super(props)
        
        this.onCreate = this.onCreate.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onSaveSuccess = this.onSaveSuccess.bind(this)
        this.onError = this.onError.bind(this)
        
        this.matchItemToCountry = this.matchItemToCountry.bind(this)
        this.matchItemToZone = this.matchItemToZone.bind(this)
        
        this.state = {
            data: assign({}, props.data)
        }
    }
    
    componentWillReceiveProps(newProps) {
        this.setState({
            data: assign({}, newProps.data)
        })
    }
    
    // TODO: Move me to a utils class
    // Also: Why the hell is sometimes this being fed a string and other times an object?
    matchItemToTerm(item, key, value) {
        if (typeof value === 'string' && typeof item[key] === 'string') {
            return item[key].toLowerCase().indexOf(value.toLowerCase()) !== -1
        }
    }
    
    matchItemToCountry(item, value) {
        return this.matchItemToTerm(item, 'value', value)
    }
    
    matchItemToZone(item, value) {
        return this.matchItemToTerm(item, 'value', value)
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
                    <Col xs={12} className='col-md-flex col-lg-flex'>
                        {this.props.title && (
                        <h4 className='fieldset-heading flex-md-full flex-lg-full'>{this.props.title}</h4>
                        )}
                        
                        {/* Only display if purchaser is a company */}
                        <FormGroup style={{ display: 'none' }}>
                            <ControlLabel>Type</ControlLabel>
                            <IdTypeDropdown items={this.props.settingStore.idTypes} componentClass='select' name={mappings.ID_TYPE} {...this.props.fields(mappings.ID_TYPE, data[mappings.ID_TYPE])} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 flex-md-25'>
                            <ControlLabel>Name</ControlLabel>
                            <FormControl type='text' name={mappings.NAME_AS_SHOWN} {...this.props.fields(mappings.NAME_AS_SHOWN, data[mappings.NAME_AS_SHOWN])} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-3 flex-md-50 flex-lg-25'>
                            <ControlLabel>Value</ControlLabel>
                            <FormControl type='text' name={mappings.VALUE} {...this.props.fields(mappings.VALUE, data[mappings.VALUE])} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-2 flex-md-25 flex-lg-16'>
                            <ControlLabel>Expiry</ControlLabel>
                            <FormControl type='text' name={mappings.EXPIRY_DATE} {...this.props.fields(mappings.EXPIRY_DATE, data[mappings.EXPIRY_DATE])} />
                        </FormGroup>
                        {console.log('type CHECK')}
                        {console.log(typeof this.props.settingStore.zones)}
                        {console.log(JSON.stringify(this.props.settingStore.zones))}
                        <FormGroup className='col-sm-2 flex-md-50 flex-lg-16'>
                            <ControlLabel>Territory</ControlLabel>
                            <Autocomplete
                                name={mappings.ZONE}
                                getItemValue={(item) => {
                                    return item.value
                                }}
                                items={this.props.settingStore.getZones()}
                                renderItem={(item, isHighlighted) => {
                                    return (
                                        <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                            {item.value}
                                        </div>
                                    )
                                }}
                                shouldItemRender={this.matchItemToZone}
                                renderMenu={(items, value, style) => {
                                    return (
                                        <div style={{
                                            position: 'relative',
                                            width: '100%'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                zIndex: '9999',
                                                left: '0',
                                                right: '0',
                                                overflow: 'hidden',
                                                zIndex: '100',
                                                borderRadius: '0',
                                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                padding: '1rem 0',
                                                fontSize: '100%',
                                                overflow: 'auto',
                                                height: '240px',
                                                maxHeight: '240px'
                                            }}>{items}</div>
                                        </div>
                                    )
                                }}
                                autoHighlight={true}
                                wrapperStyle={{
                                    display: 'block'
                                }}
                                value={data[mappings.ZONE]}
                                onChange={(event, value) => {
                                    this.props.fields(mappings.ZONE, value)
                                    
                                    this.setState(assign({}, this.state, {
                                        data: assign({}, this.state.data, {
                                            [mappings.ZONE]: value
                                        })
                                    }))
                                }}
                                onSelect={(value, item) => {
                                    this.props.field(mappings.ZONE_ID, item.id)
                                    this.props.field(mappings.ZONE, item.value)
                                    
                                    // Not sure if this is necessary anymore, pretty sure it's redundant
                                    this.setState(assign({}, this.state, {
                                        data: assign({}, this.state.data, {
                                            [mappings.ZONE_ID]: item.id,
                                            [mappings.ZONE]: item.value 
                                        })
                                    }))
                                }}
                                inputProps={
                                    assign(this.props.fields(mappings.ZONE, data[mappings.ZONE]), { className: 'form-control'})
                                }
                            />
                            <input type='hidden' name={mappings.ZONE_ID} {...this.props.fields(mappings.ZONE_ID, data[mappings.ZONE_ID])} />
                        </FormGroup>
                        
                        <FormGroup className='col-sm-2 flex-md-50 flex-lg-16'>
                            <ControlLabel>Country</ControlLabel>
                            <Autocomplete
                                name={mappings.COUNTRY}
                                getItemValue={(item) => {
                                    return item.value
                                }}
                                items={this.props.settingStore.countries}
                                renderItem={(item, isHighlighted) => {
                                    return (
                                        <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                            {item.value}
                                        </div>
                                    )
                                }}
                                shouldItemRender={this.matchItemToCountry}
                                renderMenu={(items, value, style) => {
                                    return (
                                        <div style={{
                                            position: 'relative',
                                            width: '100%'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                zIndex: '9999',
                                                left: '0',
                                                right: '0',
                                                overflow: 'hidden',
                                                zIndex: '100',
                                                borderRadius: '0',
                                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                padding: '1rem 0',
                                                fontSize: '100%',
                                                overflow: 'auto',
                                                height: '240px',
                                                maxHeight: '240px'
                                            }}>{items}</div>
                                        </div>
                                    )
                                }}
                                autoHighlight={true}
                                wrapperStyle={{
                                    display: 'block'
                                }}
                                value={data[mappings.COUNTRY]}
                                onChange={(event, value) => {
                                    this.props.field(mappings.COUNTRY, value)
                                    
                                    this.setState(assign({}, this.state, {
                                        data: assign({}, this.state.data, {
                                            [mappings.COUNTRY]: value
                                        })
                                    }))
                                    
                                    //this.parseZones(item.id)
                                }}
                                onSelect={(value, item) => {
                                    this.props.field(mappings.COUNTRY_ID, item.id)
                                    this.props.field(mappings.COUNTRY, item.value)
                                    
                                    // Not sure if this is necessary anymore, pretty sure it's redundant
                                    this.setState(assign({}, this.state, {
                                        data: assign({}, this.state.data, {
                                            [mappings.COUNTRY_ID]: item.id,
                                            [mappings.COUNTRY]: item.value
                                        })
                                    }))
                                    
                                    this.props.settingStore.parseZones(item.id)
                                }}
                                inputProps={
                                    assign(this.props.fields(mappings.COUNTRY, data[mappings.COUNTRY]), { className: 'form-control'})
                                }
                            />
                            <input type='hidden' name={mappings.COUNTRY_ID} {...this.props.fields(mappings.COUNTRY_ID, data[mappings.COUNTRY_ID])} />
                        </FormGroup>
                        {/* Done with DOB */}
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
}

export default FormComponent(CustomerIdentity)
export { CustomerIdentity }