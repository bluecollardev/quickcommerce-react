import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import Autocomplete from 'react-autocomplete'

// Higher order component adds Auth functions
import AuthenticatedComponent from './AuthenticatedComponent.jsx'
import FormComponent from './FormComponent.jsx'

import CurrentAddress from './address/CurrentAddress.jsx'

import SettingActions from '../actions/SettingActions.jsx'
import SettingStore from '../stores/SettingStore.jsx'

import CustomerListActions from '../actions/CustomerListActions.jsx'
import CustomerListStore from '../stores/CustomerListStore.jsx'

export default FormComponent(class SettingComponent extends Component {
	static defaultProps = {
        customers: [{id: null, value: ''}],
        visible: true,
		open: false
    }
	
	constructor(props) {
        super(props)
        
        this.setInitialState = this.setInitialState.bind(this)
        
        this.getForm = this.getForm.bind(this)
        this.getAddress = this.getAddress.bind(this)
        
        this.getCustomerList = this.getCustomerList.bind(this)
        this.updateCustomerList = this.updateCustomerList.bind(this)
        
        this.onHashChange = this.onHashChange.bind(this)
        this.onCreate = this.onCreate.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onCreateSuccess = this.onCreateSuccess.bind(this)
        this.onSaveSuccess = this.onSaveSuccess.bind(this)
        this.onError = this.onError.bind(this)
        this.onAddressUpdate = this.onAddressUpdate.bind(this)
        
        this.matchItemToName = this.matchItemToName.bind(this)
        this.matchItemToStore = this.matchItemToStore.bind(this)
        this.matchItemToCountry = this.matchItemToCountry.bind(this)
        this.matchItemToZone = this.matchItemToZone.bind(this)
        this.matchItemToCustomer = this.matchItemToCustomer.bind(this)
        this.matchItemToCustomerGroup = this.matchItemToCustomerGroup.bind(this)
        this.matchItemToStatus = this.matchItemToStatus.bind(this)
        
        this.renderErrors = this.renderErrors.bind(this)
        
        this.showSettings = this.showSettings.bind(this)
        this.hideSettings = this.hideSettings.bind(this)
        this.openSettings = this.openSettings.bind(this)
        this.closeSettings = this.closeSettings.bind(this)
        
        // Merge defaults from SettingStore into our component state
        this.state = assign({}, SettingComponent.defaultProps, props, {
            data: SettingStore.posSettings
        })
    }
    
    setInitialState(props) {        
        let settings = {}
        let data = this.props.getForm()
        
        /*if (typeof localStorage.getItem('POS_settings') === 'string') {
            settings = JSON.parse(localStorage.getItem('POS_settings'))
            
            for (let prop in settings) {
                this.props.field(prop, settings[prop])
            }
        }*/
        
        let state = assign({}, this.state, {
            data: assign({}, props.data, settings, this.state.data, data)
        })
        
        let zone = state.data.zone || null
        let country = state.data.country || null
        
        let zoneName = ''
        let countryName = ''
        
        if ((country !== null && typeof country !== 'string') &&
            (zone !== null && typeof zone !== 'string')) {
            let zones = SettingStore.getZones(country.country_id)
            
            zoneName = zones.filter(obj => Number(obj.id) === Number(zone.zone_id))[0].value
            state.data['zone_id'] = zone.zone_id
            state.data['zone'] = zoneName
        }
        
        if (country !== null && typeof country !== 'string') {
            countryName = SettingStore.getCountries().filter(obj => Number(obj.id) === Number(country.country_id))[0].value
            state.data['country_id'] = country.country_id
            state.data['country'] = countryName
        }
        
        this.setState(state)
    }
    
    showSettings() {
        this.setState({ visible: true })
    }
    
    hideSettings() {
        this.setState({ visible: false })
    }
    
    openSettings() {
        this.setState({ open: true })
    }
    
    closeSettings() {
        this.setState({ open: false })
        window.location.hash = '/'
    }
	
	componentWillMount() {
		//this.setInitialState(this.props)
        
        SettingActions.fetchSettings()
        SettingActions.fetchStores()
        
        // Use core event from BaseStore
        CustomerListStore.on('CHANGE', this.updateCustomerList)

        CustomerListActions.loadCustomers()
        
        window.addEventListener('hashchange', this.onHashChange)
		this.onHashChange()
	}
	
	componentWillUnmount() {
		window.removeEventListener('hashchange', this.onHashChange)
        
        if (CustomerListStore.listenerCount('CHANGE') > 0) {
			CustomerListStore.removeListener('CHANGE', this.updateCustomerList)
        }
	}
    
    componentWillReceiveProps(newProps) {
        // Update our 'initial' state
        this.setInitialState(newProps)
        
        console.log('SettingComponent componentWillReceiveProps')
        SettingActions.fetchSettings()
        SettingActions.fetchStores()
        
        CustomerListActions.loadCustomers()
	}
	
	onHashChange() {
        if (window.location.hash.indexOf('/settings') > -1) {
            this.openSettings()
        }
	}
	
    getCustomerList() {
        let customers = CustomerListStore.getItems()
        if (typeof customers === 'undefined' || customers instanceof Array === false || customers.length === 0) {
            // Autocomplete will completely eff up if no input array of items is provided
            customers = [{
                customer_id: null,
                firstname: '',
                lastname: '',
                email: ''
            }]
        }

        return customers
    }
    
    updateCustomerList() {
        this.setState({
            customers: this.getCustomerList()
        })
	}
    
    // TODO: Move me to a utils class
    matchItemToTerm(item, key, value) {
        if (typeof value === 'string' && typeof item[key] === 'string') {
            return item[key].toLowerCase().indexOf(value.toLowerCase()) !== -1
        }
    }
    
    matchItemToStore(item, value) {
        return this.matchItemToTerm(item, 'value', value)
    }
    
    matchItemToName(item, value) {
        return this.matchItemToTerm(item, 'name', value)
    }
    
    matchItemToCountry(item, value) {
        return this.matchItemToTerm(item, 'value', value)
    }
    
    matchItemToZone(item, value) {
        return this.matchItemToTerm(item, 'value', value)
    }
    
    matchItemToCustomer(item, value) {
        if (typeof value === 'string') {
            return [item.firstname, item.lastname].join(' ').toLowerCase().indexOf(value.toLowerCase()) !== -1 //|| zone.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
        }
    }
    
    matchItemToCustomerGroup(item, value) {
        return this.matchItemToTerm(item, 'value', value)
    }
    
    matchItemToStatus(item, value) {
        return this.matchItemToTerm(item, 'value', value)
    }
    
    // TODO: Abstract out getForm and triggerAction
    getForm() {
        console.log('grabbing form data from child form components')
        let address = (typeof this.address !== 'undefined') ? this.address.getForm() : {}
        let formData = assign({
            address: assign({}, address),
            addresses: [
                assign({}, address)
            ]
        }, this.props.getForm())
        
        console.log(formData)
        
        // Do something?
        return formData
    }
    
    /**
     * Formats the address object for the address component
     */
    getAddress() {
        // Grab the form's data keys
        let address = this.state.data.address || null
        let data = {}
        
        
        if (address !== null) {
            let keys = Object.keys(address) || null
        
            if (keys !== null) {
                for (let idx = 0; idx < keys.length; idx++) {
                    data[keys[idx]] = this.state.data['default_customer_' + keys[idx]]
                }
            }
        } else {
            data = {
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
        
        return data
    }
    
    triggerAction(callback) {
        return callback(this.props.getForm())
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
    }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.triggerAction((formData) => {
            console.log('updating store settings')
            console.log(formData)
            
            SettingActions.setSettings(formData)
            
            this.closeSettings()
        })
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
        
        window.location.hash = '/' // Return to home
        // TODO: Use hashHistory
    }
    
    onAddressUpdate() {
        let address = (typeof this.address !== 'undefined') ? this.address.getForm() : {}
        
        // Use default keys
        let keys = Object.keys(SettingStore.getSettings().posDefaults.address)
        let addressState = {}
        
        for (let idx = 0; idx < keys.length; idx++) {
            addressState['default_customer_' + keys[idx]] = address[keys[idx]]
        }
        
        for (let prop in address) {
            this.props.field('default_customer_' + prop, address[prop])
        }
        
        this.setState({
            data: assign({}, this.state.data, addressState)
        })
    }
    
    onCreateSuccess(response) {
        console.log('executing onCreateSuccess')
        if (typeof this.props.onCreateSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onCreateSuccess
            fn(response)
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
	
    renderErrors() {
        let errors = []
        let count = Object.keys(this.state.errors).length
        let idx = 1
        
        if (typeof this.state.errors !== 'string' && count > 0) {
            for (let error in this.state.errors) {
                errors.push(<strong>{this.state.errors[error]}</strong>)
                if (idx < count) {
                    errors.push(<br/>)
                }
                
                idx++
            }
        } else if (typeof this.state.errors === 'string') {
            errors.push(<strong>{this.state.errors}</strong>)
        }
        
        return errors
    }
	
	render() {
        let data = this.state.data   
		if (this.props.loggedIn) {
			let data = this.state.data
			let dialogClass = (this.state.visible) ? 'setting-modal in' : 'setting-modal out'
			return (	
				<div className='container-fluid'>
                    <Modal
                        dialogClassName = {dialogClass}
                        show = {this.state.open}>
                        <Modal.Header>
                            <Modal.Title>
                                <div className='column_attr clearfix align_center'>
                                    <h2 className='heading-with-border' style={{textAlign: 'center'}}>Point-of-Sale Settings</h2>
                                </div>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='container-fluid'>
                                <Row>
                                    <Col xs={12} className='customer-profile'>
                                        <div className='customer-full-info'>
                                            <form>
                                                <Col xs={12}>
                                                    <h4>Store Settings</h4>
                                                    <hr />
                                                    <FormGroup className='col-sm-12 col-md-12 col-lg-12 col-xl-4'>
                                                        <ControlLabel>QuickCommerce Shop URL</ControlLabel>
                                                        <FormControl type='text' name='shop_url' {...this.props.fields('shop_url', data.shop_url)} />
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='autocomplete-control-group col-sm-12'>
                                                        <ControlLabel>Assign to Store</ControlLabel>
                                                        <Autocomplete
                                                            name='store'
                                                            getItemValue={(item) => {
                                                                return item.value
                                                            }}
                                                            items={SettingStore.stores}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.value}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToStore}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.store}
                                                            onChange={(event, value) => {
                                                                this.props.fields('store', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        store: value
                                                                    })
                                                                }))
                                                                
                                                                //this.parseZones(item.id)
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('store_id', parseInt(item.id))
                                                                this.props.fields('store', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        store_id: parseInt(item.id),
                                                                        store: value
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('store', data.store), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='store_id' {...this.props.field('store_id', data.store_id)} />
                                                    </FormGroup>
                                                    <h4>Layout Settings</h4>
                                                    <hr />
                                                    <FormGroup className='autocomplete-control-group col-sm-12'>
                                                        <ControlLabel>Default Display Category</ControlLabel>
                                                        <Autocomplete
                                                            name='pinned_category'
                                                            getItemValue={(item) => {
                                                                return item.value
                                                            }}
                                                            items={SettingStore.categories}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.value}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToStore}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.pinned_category}
                                                            onChange={(event, value) => {
                                                                this.props.fields('pinned_category', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        pinned_category: value
                                                                    })
                                                                }))
                                                                
                                                                //this.parseZones(item.id)
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('pinned_category_id', parseInt(item.id))
                                                                this.props.fields('pinned_category', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        pinned_category_id: parseInt(item.id),
                                                                        pinned_category: value
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('pinned_category', data.pinned_category), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='pinned_category_id' {...this.props.field('pinned_category_id', data.pinned_category_id)} />
                                                    </FormGroup>
                                                    <h4>Location Settings</h4>
                                                    <hr />
                                                    {/* Only display if purchaser is a company */}
                                                    <FormGroup className='autocomplete-control-group col-sm-6'>
                                                        <ControlLabel>Default Country</ControlLabel>
                                                        <Autocomplete
                                                            name='default_country'
                                                            getItemValue={(item) => {
                                                                return item.value
                                                            }}
                                                            items={SettingStore.getCountries()}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.value}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToCountry}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.default_country}
                                                            onChange={(event, value) => {
                                                                this.props.fields('default_country', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        default_country: value
                                                                    })
                                                                }))
                                                                
                                                                //this.parseZones(item.id)
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('default_country_id', parseInt(item.id))
                                                                this.props.fields('default_country', item.value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        default_country_id: parseInt(item.id),
                                                                        default_country: item.value
                                                                    })
                                                                }))
                                                                
                                                                SettingStore.parseZones(item.id)
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('default_country', data.default_country), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='default_country_id' {...this.props.field('default_country_id', data.default_country_id)} />
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='autocomplete-control-group col-sm-6'>
                                                        <ControlLabel>Default Province</ControlLabel>
                                                        <Autocomplete
                                                            name='default_zone'
                                                            getItemValue={(item) => {
                                                                return item.value
                                                            }}
                                                            items={SettingStore.getZones(data.default_country_id)}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.value}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToZone}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.default_zone}
                                                            onChange={(event, value) => {
                                                                this.props.fields('default_zone', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        zone: value
                                                                    })
                                                                }))
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('default_zone_id', parseInt(item.id))
                                                                this.props.fields('default_zone', item.value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        default_zone_id: parseInt(item.id),
                                                                        default_zone: item.value 
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('default_zone', data.default_zone), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='default_zone_id' {...this.props.field('default_zone_id', data.default_zone_id)} />
                                                    </FormGroup>
                                                </Col>
                                                
                                                <Col xs={12}>
                                                    <h4>Order Settings</h4>
                                                    <hr />
                                                    <FormGroup className='autocomplete-control-group col-sm-6'>
                                                        <ControlLabel>Initial Order Status</ControlLabel>
                                                        <Autocomplete
                                                            name='order_status'
                                                            getItemValue={(item) => {
                                                                return item.value
                                                            }}
                                                            items={SettingStore.orderStatuses}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.value}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToStatus}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.POS_initial_status}
                                                            onChange={(event, value) => {
                                                                this.props.fields('POS_initial_status', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        POS_initial_status: value
                                                                    })
                                                                }))
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('POS_initial_status_id', item.id)
                                                                this.props.fields('POS_initial_status', item.value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        POS_initial_status_id: parseInt(item.id),
                                                                        POS_initial_status: item.value 
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('POS_initial_status', data.POS_initial_status), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='POS_initial_status_id' {...this.props.field('POS_initial_status_id', data.POS_initial_status_id)} />
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='autocomplete-control-group col-sm-6'>
                                                        <ControlLabel>Completed Order Status</ControlLabel>
                                                        <Autocomplete
                                                            name='order_status'
                                                            getItemValue={(item) => {
                                                                return item.value
                                                            }}
                                                            items={SettingStore.orderStatuses}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.value}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToStatus}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.POS_complete_status}
                                                            onChange={(event, value) => {
                                                                this.props.fields('POS_complete_status', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        POS_complete_status: value
                                                                    })
                                                                }))
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('POS_complete_status_id', parseInt(item.id))
                                                                this.props.fields('POS_complete_status', item.value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        POS_complete_status_id: parseInt(item.id),
                                                                        POS_complete_status: item.value 
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('POS_complete_status', data.POS_complete_status), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='POS_complete_status_id' {...this.props.field('POS_complete_status_id', data.POS_complete_status_id)} />
                                                    </FormGroup>
                                                </Col>
                                                
                                                <Col xs={12}>
                                                    <h4>Customer Settings</h4>
                                                    <hr />
                                                    <FormGroup className='autocomplete-control-group col-sm-6'>
                                                        <ControlLabel>Cash Sales Customer</ControlLabel>
                                                        <Autocomplete
                                                            name='customer'
                                                            getItemValue={(item) => {
                                                                return [item.firstname, item.lastname].join(' ')
                                                            }}
                                                            items={this.state.customers}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {[item.firstname, item.lastname].join(' ')}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToCustomer}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.cash_customer}
                                                            onChange={(event, value) => {
                                                                this.props.fields('cash_customer', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        cash_customer: value
                                                                    })
                                                                }))
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('cash_customer_id', parseInt(item.customer_id))
                                                                this.props.fields('cash_customer', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        cash_customer_id: parseInt(item.id), 
                                                                        cash_customer: value
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('cash_customer', data.cash_customer), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='cash_customer_id' {...this.props.field('cash_customer_id', data.cash_customer_id)} />
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='autocomplete-control-group col-sm-6'>
                                                        <ControlLabel>Cash Sales Group</ControlLabel>
                                                        <Autocomplete
                                                            name='cash_customer_group'
                                                            getItemValue={(item) => {
                                                                return item.value
                                                            }}
                                                            items={SettingStore.customerGroups}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.value}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToCustomerGroup}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.cash_customer_group}
                                                            onChange={(event, value) => {
                                                                this.props.fields('cash_customer_group', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        cash_customer_group: value
                                                                    })
                                                                }))
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('cash_customer_group_id', parseInt(item.id))
                                                                this.props.fields('cash_customer_group', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        cash_customer_group_id: parseInt(item.id), 
                                                                        cash_customer_group: value
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('cash_customer_group', data.cash_customer_group), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='cash_customer_group_id' {...this.props.field('cash_customer_group_id', data.cash_customer_group_id)} />
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='autocomplete-control-group col-sm-6'>
                                                        <ControlLabel>Default Customer</ControlLabel>
                                                        <Autocomplete
                                                            name='customer'
                                                            getItemValue={(item) => {
                                                                return [item.firstname, item.lastname].join(' ')
                                                            }}
                                                            items={this.state.customers}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {[item.firstname, item.lastname].join(' ')}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToCustomer}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.default_customer}
                                                            onChange={(event, value) => {
                                                                this.props.fields('default_customer', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        default_customer: value
                                                                    })
                                                                }))
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('default_customer_id', parseInt(item.customer_id))
                                                                this.props.fields('default_customer', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        default_customer_id: parseInt(item.customer_id), 
                                                                        default_customer: value
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('default_customer', data.default_customer), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='default_customer_id' {...this.props.field('default_customer_id', data.default_customer_id)} />
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='autocomplete-control-group col-sm-6'>
                                                        <ControlLabel>Default Group</ControlLabel>
                                                        <Autocomplete
                                                            name='default_customer_group'
                                                            getItemValue={(item) => {
                                                                return item.value
                                                            }}
                                                            items={SettingStore.customerGroups}
                                                            renderItem={(item, isHighlighted) => {
                                                                return (
                                                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.value}
                                                                    </div>
                                                                )
                                                            }}
                                                            shouldItemRender={this.matchItemToCustomerGroup}
                                                            autoHighlight={true}
                                                            wrapperStyle={{
                                                                display: 'block'
                                                            }}
                                                            value={data.default_customer_group}
                                                            onChange={(event, value) => {
                                                                this.props.fields('default_customer_group', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        default_customer_group: value
                                                                    })
                                                                }))
                                                            }}
                                                            onSelect={(value, item) => {
                                                                this.props.fields('default_customer_group_id', item.id)
                                                                this.props.fields('default_customer_group', value)
                                                                
                                                                this.setState(assign({}, this.state, {
                                                                    data: assign({}, data, {
                                                                        default_customer_group_id: item.id, 
                                                                        default_customer_group: value
                                                                    })
                                                                }))
                                                            }}
                                                            inputProps={
                                                                assign(this.props.field('default_customer_group', data.default_customer_group), { className: 'form-control'})
                                                            }
                                                        />
                                                        <input type='hidden' name='default_customer_group_id' {...this.props.field('default_customer_group_id', data.default_customer_group_id)} />
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='autocomplete-control-group'>
                                                        <ControlLabel>Default Customer Address</ControlLabel>
                                                        <CurrentAddress
                                                            ref = {(address) => {this.address = address}}
                                                            //title = 'Edit Address'
                                                            mode = 'edit'
                                                            isSubForm = {true}
                                                            data = {this.getAddress()}
                                                            displaySummary = {true}
                                                            displayActions = {true}
                                                            modal = {true}
                                                            onShowAddress = {this.hideSettings}
                                                            onHideAddress = {this.showSettings}
                                                            onUpdate = {this.onAddressUpdate}
                                                            />
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='col-xs-12 col-sm-6'>
                                                        <Button block bsStyle='success' onClick={this.onUpdate}><h4><i className='fa fa-check' /> Update Settings</h4></Button>
                                                    </FormGroup>
                                                    
                                                    <FormGroup className='col-xs-12 col-sm-6'>
                                                        <Button block onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                                                    </FormGroup>
                                                </Col>
                                            </form>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
			)
		}
		
		// If we're not logged in don't render the component at all
		// This only works with React 15+
		return null
	}
})