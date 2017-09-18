import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import Autocomplete from 'react-autocomplete'

import FormComponent from '../FormComponent.jsx'

import SettingStore from '../../stores/SettingStore.jsx'

import CustomerActions from '../../actions/CustomerActions.jsx'
import CustomerService from '../../services/CustomerService.jsx'

export default FormComponent(class CustomerIdentity extends Component {
    static defaultProps = {        
		title: 'Identification',
		identityType: '',
		nameAsShown: '',
		value: '',
		expiryDate: '',
		territory: '',
		country: ''
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
                            <FormControl name='identityType' componentClass='select' {...this.props.fields('identityType', data.identityType)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-3 flex-md-25'>
                            <ControlLabel>Name</ControlLabel>
                            <FormControl name='nameAsShown' type='text' {...this.props.fields('nameAsShown', data.nameAsShown)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-3 flex-md-50 flex-lg-25'>
                            <ControlLabel>Value</ControlLabel>
                            <FormControl name='value' type='text' {...this.props.fields('value', data.value)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-2 flex-md-25 flex-lg-16'>
                            <ControlLabel>Expiry</ControlLabel>
                            <FormControl name='expiryDate' type='text' {...this.props.fields('expiryDate', data.expiryDate)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-2 flex-md-50 flex-lg-16'>
                            <ControlLabel>Territory</ControlLabel>
                            <Autocomplete
                                name='zone'
                                getItemValue={(item) => {
                                    return item.value
                                }}
                                items={SettingStore.zones}
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
                                value={data.zone}
                                onChange={(event, value) => {
                                    this.props.fields('zone', value)
                                    
                                    this.setState(assign({}, this.state, {
                                        data: assign({}, this.state.data, {
                                            zone: value
                                        })
                                    }))
                                }}
                                onSelect={(value, item) => {
                                    this.props.field('zone_id', item.id)
                                    this.props.field('zone', item.value)
                                    
                                    // Not sure if this is necessary anymore, pretty sure it's redundant
                                    this.setState(assign({}, this.state, {
                                        data: assign({}, this.state.data, {
                                            zone_id: item.id,
                                            zone: item.value 
                                        })
                                    }))
                                }}
                                inputProps={
                                    assign(this.props.fields('zone', data.zone), { className: 'form-control'})
                                }
                            />
                            <input type='hidden' name='zone_id' {...this.props.fields('zone_id', data.zone_id)} />
                        </FormGroup>
                        
                        <FormGroup className='col-lg-2 flex-md-50 flex-lg-16'>
                            <ControlLabel>Country</ControlLabel>
                            <Autocomplete
                                name='country'
                                getItemValue={(item) => {
                                    return item.value
                                }}
                                items={SettingStore.countries}
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
                                value={data.country}
                                onChange={(event, value) => {
                                    this.props.field('country', value)
                                    
                                    this.setState(assign({}, this.state, {
                                        data: assign({}, this.state.data, {
                                            country: value
                                        })
                                    }))
                                    
                                    //this.parseZones(item.id)
                                }}
                                onSelect={(value, item) => {
                                    this.props.field('country_id', item.id)
                                    this.props.field('country', item.value)
                                    
                                    // Not sure if this is necessary anymore, pretty sure it's redundant
                                    this.setState(assign({}, this.state, {
                                        data: assign({}, this.state.data, {
                                            country_id: item.id,
                                            country: item.value
                                        })
                                    }))
                                    
                                    SettingStore.parseZones(item.id)
                                }}
                                inputProps={
                                    assign(this.props.fields('country', data.country), { className: 'form-control'})
                                }
                            />
                            <input type='hidden' name='country_id' {...this.props.fields('country_id', data.country_id)} />
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
})