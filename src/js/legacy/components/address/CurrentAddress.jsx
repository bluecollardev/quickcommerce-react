import assign from 'object-assign'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'

import { DateInput } from '../form/Input.jsx'

import FormComponent from '../FormComponent.jsx'

import fieldNames from '../../forms/AddressFields.jsx'

@inject(deps => ({
    actions: deps.actions,
    customerService: deps.customerService, // Not used, just in case!
    customerAddressService: deps.customerAddressService,
    settingStore: deps.settingStore
}))
@observer
class CurrentAddress extends Component {
    // TODO: Map default props
    static defaultProps = {
        // Is the component embedded in another component or form?
        // If this is true, the component will handle its own updating
        isSubForm: false,
        nameRequired: true, // Stupid OpenCart
        displayAddress: false,
        displaySummary: false,
        type: 'simple', // [simple|civic|rural|pobox]
        //title: 'Current Address',
        addressString: '',
        data: {
            id: null,
            address_id: null,
            firstname: '',
            lastname: '',
            company: '',
            address1: '',
            address2: '',
            suite: '',
            street: '',
            street_type: '',
            dir: '',
            box: '',
            stn: '',
            city: '',
            zone: '',
            zone_id: null,
            country: '',
            country_id: null,
            postcode: ''
        }
    }

    constructor(props) {
        super(props)
        
        this.setInitialState = this.setInitialState.bind(this)
        
        // Turned getAddressString into a static method
        //this.getAddressString = this.getAddressString.bind(this)
        this.showAddressModal = this.showAddressModal.bind(this)
        this.hideAddressModal = this.hideAddressModal.bind(this)
        this.toggleAddress = this.toggleAddress.bind(this)
        
        this.onCreate = this.onCreate.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onSaveSuccess = this.onSaveSuccess.bind(this)
        this.onError = this.onError.bind(this)
        
        //this.matchItemToTerm = this.matchItemToTerm.bind(this)
        
        let defaultProps = CurrentAddress.defaultProps
        
        this.state = assign({}, defaultProps, props, {
            addressString: '',
            address: null,
            countries: [{id: null, value: ''}],
            zones: [{id: null, value: ''}],
            geoZones: [{id: null, value: ''}]
        })
    }
    
    setInitialState(props) {
        const mappings = props.mappings || fieldNames
        
        let data = this.props.getForm()
        
        let state = assign({}, this.state, {
            data: assign({}, props.data, this.state.data, data)
        })
        
        let city = state.data.city || null
        let zone = state.data.zone || null
        let country = state.data.country || null
        
        let cityName = ''
        let zoneName = ''
        let countryName = ''
        
        // TODO: Do something if the data is wrong or something screws up
        if ((country !== null && typeof country !== 'string') &&
            (zone !== null && typeof zone !== 'string')) {
            let zones = this.props.settingStore.getZones(country[mappings.COUNTRY_ID])
            let filteredZones = zones.filter(obj => Number(obj.id) === Number(zone[mappings.ZONE_ID]))
            zoneName = (filteredZones instanceof Array && filteredZones.length > 0) ? filteredZones[0].value : ''
            state.data[mappings.ZONE_ID] = zone[mappings.ZONE_ID]
            state.data[mappings.ZONE] = zoneName
        }
        
        if (country !== null && typeof country !== 'string') {
            let filteredCountries = this.props.settingStore.getCountries().filter(obj => Number(obj.id) === Number(this.props.getMappedValue(mappings.COUNTRY_ID, state.data)))
            countryName = (filteredCountries instanceof Array && filteredCountries.length > 0) ? filteredCountries[0].value : ''
            state.data[mappings.COUNTRY_ID] = this.props.getMappedValue(mappings.COUNTRY_ID, state.data)
            state.data[mappings.COUNTRY] = countryName
        }
        
        state.addressString = CurrentAddress.getAddressString(state.data)
        
        this.setState(state)
    }
    
    componentWillMount() {
        let countries = this.props.settingStore.getCountries() || []
        let zones = this.props.settingStore.zones || []
        
        if (!Object.keys(countries).length > 0 && !Object.keys(zones).length > 0) {
            this.props.settingStore.on('settings-loaded', () => {
                this.setInitialState(this.props)
            })
        } else {
            this.setInitialState(this.props)
        }
    }
    componentWillReceiveProps(newProps) {
        let countries = this.props.settingStore.getCountries() || []
        let zones = this.props.settingStore.zones || []
        
        if (!Object.keys(countries).length > 0 && !Object.keys(zones).length > 0) {
            this.props.settingStore.on('settings-loaded', () => {
                this.setInitialState(newProps)
            })
        } else {
            this.setInitialState(newProps)
        }
    }

    toggleAddress() {
        if (this.state.address === 1) {
            this.setState({ address: null })
        } else {
            this.setState({ address: 1 })
        }
    }

    showAddressModal() {
        if (this.props.modal) {
            this.setState({ address: 1 })
        } else {
            this.toggleAddress()
        }
        
        if (typeof this.props.onShowAddress === 'function') {
            let fn = this.props.onShowAddress
            fn() // TODO: No args - maybe we can do the arguments thing later?
        }
    }

    hideAddressModal() {
        if (this.props.modal) {
            this.setState({ address: null })
        } else {
            this.toggleAddress()
        }
        
        if (typeof this.props.onHideAddress === 'function') {
            let fn = this.props.onHideAddress
            fn() // TODO: No args - maybe we can do the arguments thing later?
        }
    }

    static getAddressString(data) {
        data = data || null
        let formatted = ''

        let filterValue = function (value) {
            return (typeof value === 'string' && value !== null && value !== '') ? true : false
        }

        if (data !== null && data.hasOwnProperty('address_id')) {
            formatted = [
                [data.firstname, data.lastname].join(' '),
                [data.company].filter(function(value, idx) {
                    return filterValue(value)
                }).join(''),
                [data.address1, data.address2].filter(function(value, idx) {
                    return filterValue(value)
                }).join("\n"),
                [data.city, data.zone].join(', '),
                [data.country, data.postcode].join(' ')
            ]

            formatted = formatted.filter(function (value, idx) {
                return filterValue(value)
            })

            formatted = formatted.join("\n")
        }

        return formatted
    }
    
    // TODO: Move me to a utils class
    // Also: Why the hell is sometimes this being fed a string and other times an object?
    matchItemToTerm(item, value) {
        if (typeof value === 'string') {
            return item.value.toLowerCase().indexOf(value.toLowerCase()) !== -1 //|| zone.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
        }
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        if (!this.props.isSubForm) {
            this.props.triggerAction((formData) => {
                this.props.customerAddressService.post(formData, this.onSaveSuccess, this.onError)
            })            
        }
        
        if (this.props.modal) {
            this.setState({
                addressString: CurrentAddress.getAddressString(assign({}, this.props.getForm())),
                data: assign({}, this.state.data, this.props.getForm())
            }, this.hideAddressModal())
        }
    }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        if (!this.props.isSubForm) {
            this.props.triggerAction((formData) => {
                this.props.customerAddressService.put(formData, this.onSaveSuccess, this.onError)
            })
        } else if (typeof this.props.onUpdate === 'function') {
            console.log('execute CurrentAddress onUpdate handler')
            let fn = this.props.onUpdate
            fn(this.props.getForm())
        }
        
        if (this.props.modal) {
            this.setState({
                addressString: CurrentAddress.getAddressString(assign({}, this.props.getForm())),
                data: assign({}, this.state.data, this.props.getForm())
            }, this.hideAddressModal())
        }
    }
    
    onCancel(e) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('executing CurrentAddress onCancel')
        if (typeof this.props.onCancel === 'function') {
            console.log('execute handler')
            let fn = this.props.onCancel
            fn(e)
        }
        
        this.hideAddressModal()
    }
        
    onSaveSuccess(response) {
        console.log('executing CurrentAddress onSaveSuccess')
        if (typeof this.props.onSaveSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onSaveSuccess
            fn(response)
        }
        
        this.hideAddressModal()
    }
    
    onError(response) {
        console.log('executing CurrentAddress onError')
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
        
        const settingStore = this.props.settingStore
        
        return (
            <div>
                {this.props.title && (
                <h4>{this.props.title}</h4>
                )}
                
                {this.props.displaySummary && this.props.modal && (
                <form>
                    <FormGroup>
                        <FormControl componentClass='textarea' value={this.state.addressString} rows={7} onClick={this.showAddressModal} />
                    </FormGroup>
                </form>
                )}
                
                {this.props.displaySummary && !this.props.modal && (
                <form>
                    <FormGroup>
                        <FormControl componentClass='textarea' value={this.state.addressString} rows={7} onClick={this.toggleAddress} />
                    </FormGroup>
                </form>
                )}

                {(this.state.address && !this.props.modal) || (this.props.displaySummary !== true) && (
                <div>
                    {/*<div>
                        <Alert bsStyle='warning'>
                            Please enter your current address. <i className='fa fa-smile-o' />
                        </Alert>
                    </div>*/}
                    <form>
                        {/* Don't worry about other sizes, we use flexbox to render on large devices and full width layouts */}
                        <Col xs={12} className='col-md-flex col-lg-flex'>
                            <input type='hidden' name={mappings.ADDRESS_ID} {...this.props.fields(mappings.ADDRESS_ID, this.props.getMappedValue(mappings.ADDRESS_ID, data))} />
                            
                            {/* First Name / Last Name */}
                            {this.props.nameRequired && (
                            <FormGroup className='col-xs-12 col-lg-6 flex-md-50 flex-md-37'>
                                <ControlLabel>First Name*</ControlLabel>
                                <FormControl name={mappings.FIRST_NAME} type='text' {...this.props.fields(mappings.FIRST_NAME, this.props.getMappedValue(mappings.FIRST_NAME, data))} />
                            </FormGroup>
                            )}
                            
                            {this.props.nameRequired && (
                            <FormGroup className='col-xs-12 col-lg-6 flex-md-50 flex-md-37'>
                                <ControlLabel>Last Name*</ControlLabel>
                                <FormControl name={mappings.LAST_NAME} type='text' {...this.props.fields(mappings.LAST_NAME, this.props.getMappedValue(mappings.LAST_NAME, data))} />
                            </FormGroup>
                            )}
                            
                            {/* Simple Addresses (Line 1, 2, 3?) */}
                            {this.props.type === 'simple' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-6 col-xl-4 flex-md-37'>
                                <ControlLabel>Address 1*</ControlLabel>
                                <FormControl type='text' name={mappings.ADDRESS_1} {...this.props.fields(mappings.ADDRESS_1, this.props.getMappedValue(mappings.ADDRESS_1, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'simple' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-6 col-xl-4 flex-md-37'>
                                <ControlLabel>Address 2</ControlLabel>
                                <FormControl type='text' name={mappings.ADDRESS_2} {...this.props.fields(mappings.ADDRESS_2, this.props.getMappedValue(mappings.ADDRESS_2, data))} />
                            </FormGroup>
                            )}
                            
                            {/* Civic Addresses */}
                            {this.props.type === 'civic' && (
                            <FormGroup className='col-sm-2 col-md-2 col-lg-2'>
                                <ControlLabel>Suite</ControlLabel>
                                <FormControl type='text' name={mappings.SUITE} {...this.props.fields(mappings.SUITE, this.props.getMappedValue(mappings.SUITE, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'civic' && (
                            <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                                <ControlLabel>Street Name</ControlLabel>
                                <FormControl type='text' name={mappings.STREET_NAME} {...this.props.fields(mappings.SUITE, this.props.getMappedValue(mappings.STREET_NAME, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'civic' && (
                            <FormGroup className='col-sm-2 col-md-2 col-lg-2'>
                                <ControlLabel>Street Type</ControlLabel>
                                <FormControl type='text' name={mappings.STREET_TYPE} {...this.props.fields(mappings.STREET_TYPE, this.props.getMappedValue(mappings.STREET_TYPE, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'civic' && (
                            <FormGroup className='col-sm-1 col-md-1 col-lg-1'>
                                <ControlLabel>Direction</ControlLabel>
                                <FormControl type='text' name={mappings.STREET_DIR} {...this.props.fields(mappings.STREET_DIR, this.props.getMappedValue(mappings.STREET_DIR, data))} />
                            </FormGroup>
                            )}
                            
                            {/* Postal Installation Addresses */}
                            {this.props.type === 'pobox' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-1'>
                                <ControlLabel>Box</ControlLabel>
                                <FormControl type='text' name={mappings.BOX} {...this.props.fields(mappings.BOX, this.props.getMappedValue(mappings.BOX, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'pobox' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-1'>
                                <ControlLabel>Station</ControlLabel>
                                <FormControl type='text' name={mappings.STN} {...this.props.fields(mappings.STN, this.props.getMappedValue(mappings.STN, data))} />
                            </FormGroup>
                            )}
                            
                            {/* Rural Addresses */}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Range Rd.</ControlLabel>
                                <FormControl type='text' name={mappings.RANGE_ROAD} {...this.props.fields(mappings.RANGE_ROAD, this.props.getMappedValue(mappings.RANGE_ROAD, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Site</ControlLabel>
                                <FormControl type='text' name={mappings.SITE} {...this.props.fields(mappings.SITE, this.props.getMappedValue(mappings.SITE, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Comp</ControlLabel>
                                <FormControl type='text' name={mappings.COMP} {...this.props.fields(mappings.COMP, this.props.getMappedValue(mappings.COMP, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Box</ControlLabel>
                                <FormControl type='text' name={mappings.BOX} {...this.props.fields(mappings.BOX, this.props.getMappedValue(mappings.BOX, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Lot #</ControlLabel>
                                <FormControl type='text' name={mappings.LOT} {...this.props.fields(mappings.LOT, this.props.getMappedValue(mappings.LOT, data))} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Concession #</ControlLabel>
                                <FormControl type='text' name={mappings.CONCESSION} {...this.props.fields(mappings.CONCESSION, this.props.getMappedValue(mappings.CONCESSION, data))} />
                            </FormGroup>
                            )}
                            
                            {/* Date From / To */}
                            {this.props.durationRequired && (
                            <FormGroup className='col-xs-12 col-lg-2 flex-md-12'>
                                <ControlLabel>From</ControlLabel>
                                <DateInput name='from' name={mappings.FROM} {...this.props.fields(mappings.FROM, this.props.getMappedValue(mappings.FROM, data))} />
                            </FormGroup>
                            )}
                            {this.props.durationRequired && (
                            <FormGroup className='col-xs-12 col-lg-2 flex-md-12'>
                                <ControlLabel>To</ControlLabel>
                                <DateInput name='to' name={mappings.TO} {...this.props.fields(mappings.TO, this.props.getMappedValue(mappings.TO, data))} />
                            </FormGroup>
                            )}
                        </Col>
                        <Col xs={12} className='col-md-flex col-lg-flex flex-md-25'>
                            {/* City (If Applicable) */}
                            <FormGroup className='col-sm-12 col-md-12 col-lg-12 col-xl-4 flex-md-25'>
                                <ControlLabel>City*</ControlLabel>
                                <FormControl type='text' name={mappings.CITY} {...this.props.fields(mappings.CITY, this.props.getMappedValue(mappings.CITY, data))} />
                            </FormGroup>
                            
                            {/* Common Address Fields */}
                            <FormGroup className='form-element form-select autocomplete-control-group col-sm-12 col-md-6 col-lg-6 flex-md-25'>
                                <ControlLabel>Country*</ControlLabel>
                                <Autocomplete
                                    name={mappings.COUNTRY}
                                    getItemValue={(item) => {
                                        return item.value
                                    }}
                                    items={this.props.settingStore.getCountries()}
                                    renderItem={(item, isHighlighted) => {
                                        return (
                                            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                {item.value}
                                            </div>
                                        )
                                    }}
                                    shouldItemRender={this.matchItemToTerm}
                                    autoHighlight={true}
                                    wrapperStyle={{
                                        display: 'block'
                                    }}
                                    value={this.props.getMappedValue(mappings.COUNTRY, data)}
                                    onChange={(event, value) => {
                                        this.props.field(mappings.COUNTRY, value)
                                        
                                        this.setState(assign({}, this.state, {
                                            data: assign({}, data, {
                                                country: value
                                            })
                                        }))
                                        
                                        //this.parseZones(item.id)
                                    }}
                                    onSelect={(value, item) => {
                                        this.props.field(mappings.COUNTRY_ID, item.id)
                                        this.props.field(mappings.COUNTRY, value)
                                        
                                        // Not sure if this is necessary anymore, pretty sure it's redundant
                                        this.setState(assign({}, this.state, {
                                            data: assign({}, data, {
                                                [mappings.COUNTRY_ID]: item.id,
                                                [mappings.COUNTRY]: value
                                            })
                                        }))
                                        
                                        this.props.settingStore.getZones(item.id)
                                    }}
                                    inputProps={
                                        assign(this.props.fields(mappings.COUNTRY, this.props.getMappedValue(mappings.COUNTRY, data)), { className: 'form-control'})
                                    }
                                />
                                <input type='hidden' name={mappings.COUNTRY_ID} {...this.props.fields(mappings.COUNTRY_ID, this.props.getMappedValue(mappings.COUNTRY_ID, data))} />
                            </FormGroup>
                            <FormGroup className='form-element form-select autocomplete-control-group col-sm-12 col-md-6 col-lg-6 flex-md-25'>
                                <ControlLabel>Prov.*</ControlLabel>
                                <Autocomplete
                                    name={mappings.ZONE}
                                    getItemValue={(item) => {
                                        return item.value
                                    }}
                                    items={this.props.settingStore.getZones(this.props.getMappedValue(mappings.COUNTRY_ID, data))}
                                    renderItem={(item, isHighlighted) => {
                                        return (
                                            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                {item.value}
                                            </div>
                                        )
                                    }}
                                    shouldItemRender={this.matchItemToTerm}
                                    autoHighlight={true}
                                    wrapperStyle={{
                                        display: 'block'
                                    }}
                                    value={this.props.getMappedValue(mappings.ZONE, data)}
                                    onChange={(event, value) => {
                                        this.props.fields(mappings.ZONE, value)
                                        
                                        this.setState(assign({}, this.state, {
                                            data: assign({}, data, {
                                                [mappings.ZONE]: value
                                            })
                                        }))
                                    }}
                                    onSelect={(value, item) => {
                                        this.props.field(mappings.ZONE_ID, item.id)
                                        this.props.field(mappings.ZONE, value)
                                        
                                        // Not sure if this is necessary anymore, pretty sure it's redundant
                                        this.setState(assign({}, this.state, {
                                            data: assign({}, data, {
                                                [mappings.ZONE_ID]: item.id,
                                                [mappings.ZONE]: value 
                                            })
                                        }))
                                    }}
                                    inputProps={
                                        assign(this.props.fields(mappings.ZONE, this.props.getMappedValue(mappings.ZONE, data)), { className: 'form-control'})
                                    }
                                />
                                <input type='hidden' name={mappings.ZONE_ID} {...this.props.fields(mappings.ZONE_ID, this.props.getMappedValue(mappings.ZONE_ID, data))} />
                            </FormGroup>
                            <FormGroup className='col-sm-9 col-md-9 col-lg-5 flex-md-25'>
                                <ControlLabel>Postal Code*</ControlLabel>
                                <FormControl type='text' name={mappings.POSTCODE} {...this.props.fields(mappings.POSTCODE, this.props.getMappedValue(mappings.POSTCODE, data))} />
                            </FormGroup>
                        </Col>
                        
                        {this.props.displayActions && this.props.hasOwnProperty('mode') && this.props.mode === 'create' && (
                        <FormGroup>
                            <Button bsStyle='success' onClick={this.onCreate}>{this.props.isSubForm ? 'Create Address' : 'OK'}</Button>&nbsp;
                            <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
                        </FormGroup>
                        )}
                        
                        {this.props.displayActions && this.props.hasOwnProperty('mode') && this.props.mode === 'edit' && (
                        <FormGroup>
                            <Button bsStyle='success' onClick={this.onUpdate}>{this.props.isSubForm ? 'Update Address' : 'OK'}</Button>&nbsp;
                            <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
                        </FormGroup>
                        )}
                    </form>
                </div>
                )}

                {this.state.address && this.props.modal && (
                <Modal
                    bsClass = 'modal'
                    show = {!!this.state.address}
                    onHide = {this.hideAddressModal}
                    backdrop = {true}
                    backdropClassName = 'address-edit-modal-backdrop'>
                    {this.props.modal && typeof this.props.title === 'string' && (
                    <Modal.Header>
                        <Modal.Title>
                        {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    )}
                    
                    <Modal.Body>
                        {this.state.address && (
                            <div>
                                {/*<div>
                                    <Alert bsStyle='warning'>
                                        Please enter your current address. <i className='fa fa-smile-o' />
                                    </Alert>
                                </div>*/}
                                <form>
                                    <div>
                                        <input type='hidden' name={mappings.ADDRESS_ID} {...this.props.fields(mappings.ADDRESS_ID, this.props.getMappedValue(mappings.ADDRESS_ID, data))} />
                                        
                                        {/* First Name / Last Name */}
                                        {this.props.nameRequired && (
                                        <Row>
                                            <FormGroup className='col-xs-12 col-lg-6'>
                                                <ControlLabel>First Name*</ControlLabel>
                                                <FormControl type='text' name={mappings.FIRST_NAME} {...this.props.fields(mappings.FIRST_NAME, this.props.getMappedValue(mappings.FIRST_NAME, data))} />
                                            </FormGroup>
                                            <FormGroup className='col-xs-12 col-lg-6'>
                                                <ControlLabel>Last Name*</ControlLabel>
                                                <FormControl type='text' name={mappings.LAST_NAME} {...this.props.fields(mappings.LAST_NAME, this.props.getMappedValue(mappings.LAST_NAME, data))} />
                                            </FormGroup>
                                        </Row>
                                        )}
                                        
                                        {/* Simple Addresses (Line 1, 2, 3?) */}
                                        {this.props.type === 'simple' && (
                                        <FormGroup>
                                            <ControlLabel>Address 1</ControlLabel>
                                            <FormControl type='text' name={mappings.ADDRESS_1} {...this.props.fields(mappings.ADDRESS_1, this.props.getMappedValue(mappings.ADDRESS_1, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'simple' && (
                                        <FormGroup>
                                            <ControlLabel>Address 2</ControlLabel>
                                            <FormControl type='text' name={mappings.ADDRESS_2} {...this.props.fields(mappings.ADDRESS_2, this.props.getMappedValue(mappings.ADDRESS_2, data))} />
                                        </FormGroup>
                                        )}
                                        
                                        {/* Civic Addresses */}
                                        {this.props.type === 'civic' && (
                                        <FormGroup>
                                            <ControlLabel>Suite</ControlLabel>
                                            <FormControl type='text' name={mappings.SUITE} {...this.props.fields(mappings.SUITE, this.props.getMappedValue(mappings.SUITE, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'civic' && (
                                        <FormGroup>
                                            <ControlLabel>Street Name</ControlLabel>
                                            <FormControl type='text' name={mappings.STREET_NAME} {...this.props.fields(mappings.STREET_NAME, this.props.getMappedValue(mappings.STREET_NAME, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'civic' && (
                                        <FormGroup>
                                            <ControlLabel>Street Type</ControlLabel>
                                            <FormControl type='text' name={mappings.STREET_TYPE} {...this.props.fields(mappings.STREET_TYPE, this.props.getMappedValue(mappings.STREET_TYPE, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'civic' && (
                                        <FormGroup>
                                            <ControlLabel>Direction</ControlLabel>
                                            <FormControl type='text' name={mappings.STREET_DIR} {...this.props.fields(mappings.STREET_DIR, this.props.getMappedValue(mappings.STREET_DIR, data))} />
                                        </FormGroup>
                                        )}
                                        
                                        {/* Postal Installation Addresses */}
                                        {this.props.type === 'pobox' && (
                                        <FormGroup>
                                            <ControlLabel>Box</ControlLabel>
                                            <FormControl type='text' name={mappings.BOX} {...this.props.fields(mappings.BOX, this.props.getMappedValue(mappings.BOX, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'pobox' && (
                                        <FormGroup>
                                            <ControlLabel>Station</ControlLabel>
                                            <FormControl type='text' name={mappings.STN} {...this.props.fields(mappings.STN, this.props.getMappedValue(mappings.STN, data))} />
                                        </FormGroup>
                                        )}
                                        
                                        {/* Rural Addresses */}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Range Rd.</ControlLabel>
                                            <FormControl type='text' name={mappings.RANGE_ROAD} {...this.props.fields(mappings.RANGE_ROAD, this.props.getMappedValue(mappings.RANGE_ROAD, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Site</ControlLabel>
                                            <FormControl type='text' name={mappings.STREET_DIR} {...this.props.fields(mappings.STREET_DIR, this.props.getMappedValue(mappings.STREET_DIR, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Comp</ControlLabel>
                                            <FormControl type='text' name={mappings.COMP} {...this.props.fields(mappings.COMP, this.props.getMappedValue(mappings.COMP, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Box</ControlLabel>
                                            <FormControl type='text' name={mappings.BOX} {...this.props.fields(mappings.BOX, this.props.getMappedValue(mappings.BOX, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Lot #</ControlLabel>
                                            <FormControl type='text' name={mappings.LOT} {...this.props.fields(mappings.LOT, this.props.getMappedValue(mappings.LOT, data))} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Concession #</ControlLabel>
                                            <FormControl type='text' name={mappings.CONCESSION} {...this.props.fields(mappings.CONCESSION, this.props.getMappedValue(mappings.CONCESSION, data))} />
                                        </FormGroup>
                                        )}
                                        
                                        {/* City (If Applicable) */}
                                        <FormGroup>
                                            <ControlLabel>City</ControlLabel>
                                            <FormControl type='text' name='city' {...this.props.fields('city', data.city)} />
                                        </FormGroup>
                                        
                                        {/* Common Address Fields */}
                                        <FormGroup className='autocomplete-control-group'>
                                            <ControlLabel>Country*</ControlLabel>
                                            <Autocomplete
                                                name={mappings.COUNTRY}
                                                getItemValue={(item) => {
                                                    return item.value
                                                }}
                                                items={this.props.settingStore.getCountries()}
                                                renderItem={(item, isHighlighted) => {
                                                    return (
                                                        <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                            {item.value}
                                                        </div>
                                                    )
                                                }}
                                                shouldItemRender={this.matchItemToTerm}
                                                autoHighlight={true}
                                                wrapperStyle={{
                                                    display: 'block'
                                                }}
                                                value={this.props.getMappedValue(mappings.COUNTRY, data)}
                                                onChange={(event, value) => {
                                                    this.props.field(mappings.COUNTRY, value)
                                                    
                                                    this.setState(assign({}, this.state, {
                                                        data: assign({}, data, {
                                                            country: value
                                                        })
                                                    }))
                                                    
                                                    //this.parseZones(item.id)
                                                }}
                                                onSelect={(value, item) => {
                                                    this.props.field(mappings.COUNTRY_ID, item.id)
                                                    this.props.field(mappings.COUNTRY, value)
                                                    
                                                    // Not sure if this is necessary anymore, pretty sure it's redundant
                                                    this.setState(assign({}, this.state, {
                                                        data: assign({}, data, {
                                                            [mappings.COUNTRY_ID]: item.id,
                                                            [mappings.COUNTRY]: value
                                                        })
                                                    }))
                                                    
                                                    this.props.settingStore.getZones(item.id)
                                                }}
                                                inputProps={
                                                    assign(this.props.fields(mappings.COUNTRY, this.props.getMappedValue(mappings.COUNTRY, data)), { className: 'form-control'})
                                                }
                                            />
                                            <input type='hidden' name={mappings.COUNTRY_ID} {...this.props.fields(mappings.COUNTRY_ID, this.props.getMappedValue(mappings.COUNTRY_ID, data))} />
                                        </FormGroup>
                                        <FormGroup className='autocomplete-control-group'>
                                            <ControlLabel>Prov.*</ControlLabel>
                                            <Autocomplete
                                                name={mappings.ZONE}
                                                getItemValue={(item) => {
                                                    return item.value
                                                }}
                                                items={this.props.settingStore.getZones(this.props.getMappedValue(mappings.COUNTRY_ID, data))}
                                                renderItem={(item, isHighlighted) => {
                                                    return (
                                                        <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                            {item.value}
                                                        </div>
                                                    )
                                                }}
                                                shouldItemRender={this.matchItemToTerm}
                                                autoHighlight={true}
                                                wrapperStyle={{
                                                    display: 'block'
                                                }}
                                                value={this.props.getMappedValue(mappings.ZONE, data)}
                                                onChange={(event, value) => {
                                                    this.props.fields(mappings.ZONE, value)
                                                    
                                                    this.setState(assign({}, this.state, {
                                                        data: assign({}, data, {
                                                            [mappings.ZONE]: value
                                                        })
                                                    }))
                                                }}
                                                onSelect={(value, item) => {
                                                    this.props.field(mappings.ZONE_ID, item.id)
                                                    this.props.field(mappings.ZONE, value)
                                                    
                                                    // Not sure if this is necessary anymore, pretty sure it's redundant
                                                    this.setState(assign({}, this.state, {
                                                        data: assign({}, data, {
                                                            [mappings.ZONE_ID]: item.id,
                                                            [mappings.ZONE]: value 
                                                        })
                                                    }))
                                                }}
                                                inputProps={
                                                    assign(this.props.fields(mappings.ZONE, this.props.getMappedValue(mappings.ZONE, data)), { className: 'form-control'})
                                                }
                                            />
                                            <input type='hidden' name={mappings.ZONE_ID} {...this.props.fields(mappings.ZONE_ID, this.props.getMappedValue(mappings.ZONE_ID, data))} />
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>Postal Code*</ControlLabel>
                                            <FormControl type='text' name={mappings.POSTCODE} {...this.props.fields(mappings.POSTCODE, this.props.getMappedValue(mappings.POSTCODE, data))} />
                                        </FormGroup>
                                        
                                        {this.props.displayActions && (
                                        <Row>
                                            {this.props.mode === 'create' && (
                                            <FormGroup className='col-xs-12 col-sm-6'>
                                                <Button block bsStyle='success' onClick={this.onCreate}><h4><i className='fa fa-check' /> {this.props.isSubForm ? 'Create Address' : 'OK'}</h4></Button>
                                            </FormGroup>
                                            )}
                                            
                                            {this.props.mode === 'edit' && (
                                            <FormGroup className='col-xs-12 col-sm-6'>
                                                <Button block bsStyle='success' onClick={this.onUpdate}><h4><i className='fa fa-check' /> {this.props.isSubForm ? 'Update Address' : 'OK'}</h4></Button>
                                            </FormGroup>
                                            )}
                                            
                                            <FormGroup className='col-xs-12 col-sm-6'>
                                                <Button block onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                                            </FormGroup>
                                        </Row>
                                        )}                                    
                                    </div>
                                </form>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
                )}
            </div>
        )
    }
}

export default FormComponent(CurrentAddress)
export { CurrentAddress }