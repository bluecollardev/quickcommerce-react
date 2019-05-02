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
        
        if ((country !== null && typeof country !== 'string') &&
            (zone !== null && typeof zone !== 'string')) {
            let zones = this.props.settingStore.getZones(country.country_id)
            
            zoneName = zones.filter(obj => Number(obj.id) === Number(zone.zone_id))[0].value
            state.data['zone_id'] = zone.zone_id
            state.data['zone'] = zoneName
        }
        
        if (country !== null && typeof country !== 'string') {
            countryName = this.props.settingStore.getCountries().filter(obj => Number(obj.id) === Number(country.country_id))[0].value
            state.data['country_id'] = country.country_id
            state.data['country'] = countryName
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
    
    /**
     * In progress, porting from kPaged address module
     */
    setAddress() {
        var    that = this,
            moduleElement = $('#' + that.getId()),
            page = that.getPage(),
            block = page.getBlock('center-pane'),
            viewModel = that.getViewModel(),
            data = page.getFormData(),
            addressEventHandler = that.getEventHandler(),
            addressValidator = block.getValidator(),
            addressEditPopup,
            addressLookupPopup,
            addressEditWindow,
            addressLookupWindow,
            addressEditTrigger,
            addressLookupTrigger,
            addressDisplay,
            overrideAddress,
            overrideAddressReason,
            addressReviewDate,
            sources = {},
            tabs = that.tabs,
            tab,
            fields = {},
            address = [],
            addressString = [],
            current
            
        tab = tabs.select()
        fields = {
            // Civic address fields
            civic: {
                suiteNumber: $.trim(viewModel.get('address.suiteNumber')),
                streetNumber: $.trim(viewModel.get('address.streetNumber')),
                streetName: $.trim(viewModel.get('address.streetName')),
                streetType: $.trim(viewModel.get('address.streetType')),
                streetDirection: $.trim(viewModel.get('address.streetDirection')),
                poBox: (viewModel.get('address.poBox')) ? 'PO BOX ' + $.trim(viewModel.get('address.poBox')) : ''
                
            },
            // Rural address fields
            rural: {
                rr: (viewModel.get('address.rr')) ? 'RR ' + $.trim(viewModel.get('address.rr')) : '',
                site: (viewModel.get('address.site')) ? 'SITE ' + $.trim(viewModel.get('address.site')) : '',
                comp: (viewModel.get('address.comp')) ? 'COMP ' + $.trim(viewModel.get('address.comp')) : '',
                box: (viewModel.get('address.box')) ? 'BOX ' + $.trim(viewModel.get('address.box')) : '',
                lotNumber: (viewModel.get('address.lotNumber')) ? 'LOT ' + $.trim(viewModel.get('address.lotNumber')) : '',
                concessionNumber: (viewModel.get('address.concessionNumber')) ? 'CONCESSION ' + $.trim(viewModel.get('address.concessionNumber')) : ''
            },
            common: {
                station: (viewModel.get('address.station')) ? 'STN ' + $.trim(viewModel.get('address.station')) : '',
                city: $.trim(viewModel.get('address.city')),
                zone: $.trim(viewModel.get('address.zone')),
                postcode: $.trim(viewModel.get('address.postcode')),
                country: $.trim(viewModel.get('address.country'))
            }
        }
        
        // Create a string representation of the address fields
        if (tab.index() === 0) {
            // Civic address selected
            // Clear all rural values
            $.each(fields.rural, function (key, value) {
                viewModel.set(key, '')
            })
            
            if (fields.civic.suiteNumber !== '') {
                address.push('{suiteNumber}-{streetNumber} {streetName} {streetType} {streetDirection}')
            } else {
                address.push('{streetNumber} {streetName} {streetType} {streetDirection}')
            }
            address.push('{poBox} {station}')
        } else if (tab.index() === 1) {
            // Rural address selected
            // Clear all civic values
            $.each(fields.civic, function (key, value) {
                viewModel.set(key, '') 
            })
            
            if (fields.rural.lot !== '' && fields.rural.concession !== '') {
                address.push('{lotNumber} {concessionNumber}')
            }
            if (fields.rural.site !== '' && fields.rural.comp !== '') {
                address.push('{site} {comp} {box}')
            }
            address.push('{rr} {station}')
        }
        
        // Append city/municipality, zone and postal code
        address.push('{city} {zone} {postcode}')

        if (fields.common.country == "USA") {
            address.push('{country}')
        }
        
        // Replace formatting keys with form values
        $.each(address, function (idx, format) {
            current = format
            if (tab.index() === 0) {
                $.each(fields.civic, function (key, value) {
                    current = current.replace('{' + key + '}', value)
                })
            } else if (tab.index() === 1) {
                $.each(fields.rural, function (key, value) {
                    current = current.replace('{' + key + '}', value)
                })
            }
            
            $.each(fields.common, function (key, value) {
                current = current.replace('{' + key + '}', value)
            })
            
            if ($.trim(current) !== '') {
                addressString.push($.trim(current))
            }
        })
        
        // Join address strings
        addressString = addressString.join('\r\n')
        
        that.addressDisplay.attr('readonly', false).val(addressString).attr('readonly', true)
        $('div[name=addressEditPopup]').data('kendoWindow').close()
    }
    
    /**
     * In progress, porting from kPaged address module
     */
    onAddressLookupClicked() {
        var moduleElement = e.sender.element.closest('[id^=module_address_]'),
            module = page.getModule(moduleElement.attr('id')),
            //lookupWindow = module.addressLookupPopup.data('kendoWindow')
            lookupWindow = addressLookupWindow
        
        console.log(moduleElement)
        console.log(module)
        console.log(lookupWindow)
        
        lookupWindow.center().open()
    }
    
    /**
     * In progress, porting from kPaged address module
     */
    onAddressEditClicked() {
        var moduleElement = e.sender.element.closest('[id^=module_address_]'),
            module = page.getModule(moduleElement.attr('id')),
            //editWindow = module.addressEditPopup.data('kendoWindow')
            editWindow = addressEditWindow
        
        console.log(moduleElement)
        console.log(module)
        console.log(editWindow)
        
        editWindow.center().open()
    }
    
    /**
     * In progress, porting from kPaged address module
     */
    onAddressLookupSelect() {
        var addressLookupGrid = $("#addressLookupGrid").data("kendoGrid"),
            selectedItem = addressLookupGrid.dataItem(addressLookupGrid.select()),
            viewModel = this,
            fields = {
                // Civic address fields
                civic: {
                    suiteNumber: $.trim(viewModel.get('address.suiteNumber')),
                    streetNumber: $.trim(viewModel.get('address.streetNumber')),
                    streetName: $.trim(viewModel.get('address.streetName')),
                    streetType: $.trim(viewModel.get('address.streetType')),
                    streetDirection: $.trim(viewModel.get('address.streetDirection')),
                    poBox: (viewModel.get('address.poBox')) ? 'PO BOX ' + $.trim(viewModel.get('address.poBox')) : ''
                },
                // Rural address fields
                rural: {
                    rr: (viewModel.get('address.rr')) ? 'RR ' + $.trim(viewModel.get('address.rr')) : '',
                    site: (viewModel.get('address.site')) ? 'SITE ' + $.trim(viewModel.get('address.site')) : '',
                    comp: (viewModel.get('address.comp')) ? 'COMP ' + $.trim(viewModel.get('address.comp')) : '',
                    box: (viewModel.get('address.box')) ? 'BOX ' + $.trim(viewModel.get('address.box')) : '',
                    lotNumber: (viewModel.get('address.lotNumber')) ? 'LOT ' + $.trim(viewModel.get('address.lotNumber')) : '',
                    concessionNumber: (viewModel.get('address.concessionNumber')) ? 'CONCESSION ' + $.trim(viewModel.get('address.concessionNumber')) : ''
                },
                common: {
                    station: (viewModel.get('address.station')) ? 'STN ' + $.trim(viewModel.get('address.station')) : '',
                    city: $.trim(viewModel.get('address.city')),
                    zone: $.trim(viewModel.get('address.zone')),
                    postcode: $.trim(viewModel.get('address.postcode')),
                    country: $.trim(viewModel.get('address.country'))
                }
            }
            
        if (selectedItem !== null) {
            // Clear the address fields
            $.each(fields, function (key, value) {
                $.each(fields[key], function (key, value) {
                    viewModel.set(key, '') 
                })
            })

            viewModel.set('address.streetName', selectedItem.StreetName)
            viewModel.set('address.streetType', selectedItem.StreetType)
            viewModel.set('address.streetDirection', selectedItem.Direction)
            viewModel.set('address.city', selectedItem.City)
            viewModel.set('address.zone', selectedItem.Jurisdiction)
            viewModel.set('address.postcode', selectedItem.PostalCode)
            viewModel.set('address.country', "CANADA")
            
            // Clear the street number
            viewModel.set('address.streetNumber', '')
            
            $("div#addressLookupPopup").data("kendoWindow").close()
            $("div#addressEditPopup").data("kendoWindow").open()
        }
    }
    
    /**
     * In progress, porting from kPaged address module
     */
    renderAddress() {
        try {
            fields = {
                // Civic address fields
                civic: {
                    suiteNumber: $.trim(addressViewModel.get('address.suiteNumber')),
                    streetNumber: $.trim(addressViewModel.get('address.streetNumber')),
                    streetName: $.trim(addressViewModel.get('address.streetName')),
                    streetType: $.trim(addressViewModel.get('address.streetType')),
                    streetDirection: $.trim(addressViewModel.get('address.streetDirection')),
                    poBox: (addressViewModel.get('address.poBox')) ? 'PO BOX ' + $.trim(addressViewModel.get('address.poBox')) : ''
                    
                },
                // Rural address fields
                rural: {
                    rr: (addressViewModel.get('address.rr')) ? 'RR ' + $.trim(addressViewModel.get('address.rr')) : '',
                    site: (addressViewModel.get('address.site')) ? 'SITE ' + $.trim(addressViewModel.get('address.site')) : '',
                    comp: (addressViewModel.get('address.comp')) ? 'COMP ' + $.trim(addressViewModel.get('address.comp')) : '',
                    box: (addressViewModel.get('address.box')) ? 'BOX ' + $.trim(addressViewModel.get('address.box')) : '',
                    lotNumber: (addressViewModel.get('address.lotNumber')) ? 'LOT ' + $.trim(addressViewModel.get('address.lotNumber')) : '',
                    concessionNumber: (addressViewModel.get('address.concessionNumber')) ? 'CONCESSION ' + $.trim(addressViewModel.get('address.concessionNumber')) : ''
                },
                common: {
                    station: (addressViewModel.get('address.station')) ? 'STN ' + $.trim(addressViewModel.get('address.station')) : '',
                    city: $.trim(addressViewModel.get('address.city')),
                    zone: $.trim(addressViewModel.get('address.zone')),
                    postcode: $.trim(addressViewModel.get('address.postcode'))
                }
            }
        } catch (e) {
            App.log(e)
        }
        
        // Create a string representation of the address fields
        if (tab.index() === 0) {
            // Civic address selected
            // Clear all rural values
            $.each(fields.rural, function (key, value) {
                addressViewModel.set(key, '')
            })
            
            if (fields.civic.suiteNumber !== '') {
                address.push('{suiteNumber}-{streetNumber} {streetName} {streetType} {streetDirection}')
            } else {
                address.push('{streetNumber} {streetName} {streetType} {streetDirection}')
            }
            address.push('{poBox} {station}')
        } else if (tab.index() === 1) {
            // Rural address selected
            // Clear all civic values
            $.each(fields.civic, function (key, value) {
                addressViewModel.set(key, '') 
            })
            
            if (fields.rural.lot !== '' && fields.rural.concession !== '') {
                address.push('{lotNumber} {concessionNumber}')
            }
            if (fields.rural.site !== '' && fields.rural.comp !== '') {
                address.push('{site} {comp} {box}')
            }
            address.push('{rr} {station}')
        }
        
        // Append city/municipality, zone and postal code
        address.push('{city} {zone} {postcode}')
        
        // Replace formatting keys with form values
        $.each(address, function (idx, format) {
            current = format
            if (tab.index() === 0) {
                $.each(fields.civic, function (key, value) {
                    current = current.replace('{' + key + '}', value)
                })
            } else if (tab.index() === 1) {
                $.each(fields.rural, function (key, value) {
                    current = current.replace('{' + key + '}', value)
                })
            }
            
            $.each(fields.common, function (key, value) {
                current = current.replace('{' + key + '}', value)
            })
            
            if ($.trim(current) !== '') {
                addressString.push($.trim(current))
            }
        })
        
        // Join address strings
        addressString = addressString.join('\r\n')
        
        addressDisplay.attr('readonly', false).val(addressString).attr('readonly', true)
        addressEditWindow.close()
        // Create hidden fields in the parent form (if it exists)
        
        // Only if autoBind is true...
        /*try {
            that.dataBind(addressViewModel)
        } catch (e) {
            App.log(e)
        }*/
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
        console.log('rendering CurrentAddress')
        let data = this.state.data
        
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
                            <input type='hidden' name='address_id' {...this.props.fields('address_id', data.address_id)} />
                            
                            {/* First Name / Last Name */}
                            {this.props.nameRequired && (
                            <FormGroup className='col-xs-12 col-lg-6 flex-md-50 flex-md-37'>
                                <ControlLabel>First Name*</ControlLabel>
                                <FormControl name='firstname' type='text' {...this.props.fields('firstname', data.firstname)} />
                            </FormGroup>
                            )}
                            
                            {this.props.nameRequired && (
                            <FormGroup className='col-xs-12 col-lg-6 flex-md-50 flex-md-37'>
                                <ControlLabel>Last Name*</ControlLabel>
                                <FormControl name='lastname' type='text' {...this.props.fields('lastname', data.lastname)} />
                            </FormGroup>
                            )}
                            
                            {/* Simple Addresses (Line 1, 2, 3?) */}
                            {this.props.type === 'simple' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-6 col-xl-4 flex-md-37'>
                                <ControlLabel>Address 1*</ControlLabel>
                                <FormControl type='text' name='address1' {...this.props.fields('address1', data.address1)} />
                            </FormGroup>
                            )}
                            {this.props.type === 'simple' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-6 col-xl-4 flex-md-37'>
                                <ControlLabel>Address 2</ControlLabel>
                                <FormControl type='text' name='address2' {...this.props.fields('address2', data.address2)} />
                            </FormGroup>
                            )}
                            
                            {/* Civic Addresses */}
                            {this.props.type === 'civic' && (
                            <FormGroup className='col-sm-2 col-md-2 col-lg-2'>
                                <ControlLabel>Suite</ControlLabel>
                                <FormControl type='text' name='suite' {...this.props.fields('suite', data.suite)} />
                            </FormGroup>
                            )}
                            {this.props.type === 'civic' && (
                            <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
                                <ControlLabel>Street Name</ControlLabel>
                                <FormControl type='text' name='street' {...this.props.fields('street', data.street)} />
                            </FormGroup>
                            )}
                            {this.props.type === 'civic' && (
                            <FormGroup className='col-sm-2 col-md-2 col-lg-2'>
                                <ControlLabel>Street Type</ControlLabel>
                                <FormControl type='text' name='street_type' {...this.props.fields('street_type', data.street_type)} />
                            </FormGroup>
                            )}
                            {this.props.type === 'civic' && (
                            <FormGroup className='col-sm-1 col-md-1 col-lg-1'>
                                <ControlLabel>Direction</ControlLabel>
                                <FormControl type='text' name='dir' {...this.props.fields('dir', data.dir)} />
                            </FormGroup>
                            )}
                            
                            {/* Postal Installation Addresses */}
                            {this.props.type === 'pobox' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-1'>
                                <ControlLabel>Box</ControlLabel>
                                <FormControl type='text' value={data.box} />
                            </FormGroup>
                            )}
                            {this.props.type === 'pobox' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-1'>
                                <ControlLabel>Station</ControlLabel>
                                <FormControl type='text' value={data.stn} />
                            </FormGroup>
                            )}
                            
                            {/* Rural Addresses */}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Range Rd.</ControlLabel>
                                <FormControl type='text' value={data.box} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Site</ControlLabel>
                                <FormControl type='text' value={data.site} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Comp</ControlLabel>
                                <FormControl type='text' value={data.comp} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Box</ControlLabel>
                                <FormControl type='text' value={data.box} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Lot #</ControlLabel>
                                <FormControl type='text' value={data.lot} />
                            </FormGroup>
                            )}
                            {this.props.type === 'rural' && (
                            <FormGroup className='col-sm-12 col-md-12 col-lg-4'>
                                <ControlLabel>Concession #</ControlLabel>
                                <FormControl type='text' value={data.concession} />
                            </FormGroup>
                            )}
                            
                            {/* Date From / To */}
                            {this.props.durationRequired && (
                            <FormGroup className='col-xs-12 col-lg-2 flex-md-12'>
                                <ControlLabel>From</ControlLabel>
                                <FormControl name='from' type='text' {...this.props.fields('from', data.from)} />
                            </FormGroup>
                            )}
                            {this.props.durationRequired && (
                            <FormGroup className='col-xs-12 col-lg-2 flex-md-12'>
                                <ControlLabel>To</ControlLabel>
                                <FormControl name='to' type='text' {...this.props.fields('to', data.to)} />
                            </FormGroup>
                            )}
                        </Col>
                        <Col xs={12} className='col-md-flex col-lg-flex flex-md-25'>
                            {/* City (If Applicable) */}
                            <FormGroup className='col-sm-12 col-md-12 col-lg-12 col-xl-4 flex-md-25'>
                                <ControlLabel>City*</ControlLabel>
                                <FormControl type='text' name='city' {...this.props.fields('city', data.city)} />
                            </FormGroup>
                            
                            {/* Common Address Fields */}
                            <FormGroup className='autocomplete-control-group col-sm-12 col-md-6 col-lg-6 flex-md-25'>
                                <ControlLabel>Country*</ControlLabel>
                                <Autocomplete
                                    name='country'
                                    getItemValue={(item) => {
                                        return item.value
                                    }}
                                    items={this.state.countries}
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
                                        this.props.field('country', value)
                                        
                                        // Not sure if this is necessary anymore, pretty sure it's redundant
                                        this.setState(assign({}, this.state, {
                                            data: assign({}, data, {
                                                country_id: item.id,
                                                country: value
                                            })
                                        }))
                                        
                                        this.props.settingStore.parseZones(item.id)
                                    }}
                                    inputProps={
                                        assign(this.props.fields('country', data.country), { className: 'form-control'})
                                    }
                                />
                                <input type='hidden' name='country_id' {...this.props.fields('country_id', data.country_id)} />
                            </FormGroup>
                            <FormGroup className='autocomplete-control-group col-sm-12 col-md-6 col-lg-6 flex-md-25'>
                                <ControlLabel>Prov.*</ControlLabel>
                                <Autocomplete
                                    name='zone'
                                    getItemValue={(item) => {
                                        return item.value
                                    }}
                                    items={this.state.zones}
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
                                    value={data.zone}
                                    onChange={(event, value) => {
                                        this.props.fields('zone', value)
                                        
                                        this.setState(assign({}, this.state, {
                                            data: assign({}, this.data, {
                                                zone: value
                                            })
                                        }))
                                    }}
                                    onSelect={(value, item) => {
                                        this.props.field('zone_id', item.id)
                                        this.props.field('zone', value)
                                        
                                        // Not sure if this is necessary anymore, pretty sure it's redundant
                                        this.setState(assign({}, this.state, {
                                            data: assign({}, data, {
                                                zone_id: item.id,
                                                zone: value 
                                            })
                                        }))
                                    }}
                                    inputProps={
                                        assign(this.props.fields('zone', data.zone), { className: 'form-control'})
                                    }
                                />
                                <input type='hidden' name='zone_id' {...this.props.fields('zone_id', data.zone_id)} />
                            </FormGroup>
                            <FormGroup className='col-sm-9 col-md-9 col-lg-5 flex-md-25'>
                                <ControlLabel>Postal Code*</ControlLabel>
                                <FormControl type='text' name='postcode' {...this.props.fields('postcode', data.postcode)} />
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
                                        <input type='hidden' name='address_id' {...this.props.fields('address_id', data.address_id)} />
                                        
                                        {/* First Name / Last Name */}
                                        {this.props.nameRequired && (
                                        <Row>
                                            <FormGroup className='col-xs-12 col-lg-6'>
                                                <ControlLabel>First Name*</ControlLabel>
                                                <FormControl name='firstname' type='text' {...this.props.fields('firstname', data.firstname)} />
                                            </FormGroup>
                                            <FormGroup className='col-xs-12 col-lg-6'>
                                                <ControlLabel>Last Name*</ControlLabel>
                                                <FormControl name='lastname' type='text' {...this.props.fields('lastname', data.lastname)} />
                                            </FormGroup>
                                        </Row>
                                        )}
                                        
                                        {/* Simple Addresses (Line 1, 2, 3?) */}
                                        {this.props.type === 'simple' && (
                                        <FormGroup>
                                            <ControlLabel>Address 1</ControlLabel>
                                            <FormControl type='text' name='address1' {...this.props.fields('address1', data.address1)} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'simple' && (
                                        <FormGroup>
                                            <ControlLabel>Address 2</ControlLabel>
                                            <FormControl type='text' name='address2' {...this.props.fields('address2', data.address2)} />
                                        </FormGroup>
                                        )}
                                        
                                        {/* Civic Addresses */}
                                        {this.props.type === 'civic' && (
                                        <FormGroup>
                                            <ControlLabel>Suite</ControlLabel>
                                            <FormControl type='text' name='suite' {...this.props.fields('suite', data.suite)} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'civic' && (
                                        <FormGroup>
                                            <ControlLabel>Street Name</ControlLabel>
                                            <FormControl type='text' name='street' {...this.props.fields('street', data.street)} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'civic' && (
                                        <FormGroup>
                                            <ControlLabel>Street Type</ControlLabel>
                                            <FormControl type='text' name='street_type' {...this.props.fields('street_type', data.street_type)} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'civic' && (
                                        <FormGroup>
                                            <ControlLabel>Direction</ControlLabel>
                                            <FormControl type='text' name='dir' {...this.props.fields('dir', data.dir)} />
                                        </FormGroup>
                                        )}
                                        
                                        {/* Postal Installation Addresses */}
                                        {this.props.type === 'pobox' && (
                                        <FormGroup>
                                            <ControlLabel>Box</ControlLabel>
                                            <FormControl type='text' value={data.box} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'pobox' && (
                                        <FormGroup>
                                            <ControlLabel>Station</ControlLabel>
                                            <FormControl type='text' value={data.stn} />
                                        </FormGroup>
                                        )}
                                        
                                        {/* Rural Addresses */}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Range Rd.</ControlLabel>
                                            <FormControl type='text' value={data.box} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Site</ControlLabel>
                                            <FormControl type='text' value={data.site} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Comp</ControlLabel>
                                            <FormControl type='text' value={data.comp} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Box</ControlLabel>
                                            <FormControl type='text' value={data.box} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Lot #</ControlLabel>
                                            <FormControl type='text' value={data.lot} />
                                        </FormGroup>
                                        )}
                                        {this.props.type === 'rural' && (
                                        <FormGroup>
                                            <ControlLabel>Concession #</ControlLabel>
                                            <FormControl type='text' value={data.concession} />
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
                                                name='country'
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
                                                value={data.country}
                                                onChange={(event, value) => {
                                                    this.props.field('country', value)
                                                    
                                                    this.setState(assign({}, this.state, {
                                                        data: assign({}, data, {
                                                            country: value
                                                        })
                                                    }))
                                                    
                                                    //this.parseZones(item.id)
                                                }}
                                                onSelect={(value, item) => {
                                                    this.props.field('country_id', item.id)
                                                    this.props.field('country', value)
                                                    
                                                    // Not sure if this is necessary anymore, pretty sure it's redundant
                                                    this.setState(assign({}, this.state, {
                                                        data: assign({}, data, {
                                                            country_id: item.id,
                                                            country: value
                                                        })
                                                    }))
                                                    
                                                    this.props.settingStore.getZones(item.id)
                                                }}
                                                inputProps={
                                                    assign(this.props.fields('country', data.country), { className: 'form-control'})
                                                }
                                            />
                                            <input type='hidden' name='country_id' {...this.props.fields('country_id', data.country_id)} />
                                        </FormGroup>
                                        <FormGroup className='autocomplete-control-group'>
                                            <ControlLabel>Prov.*</ControlLabel>
                                            <Autocomplete
                                                name='zone'
                                                getItemValue={(item) => {
                                                    return item.value
                                                }}
                                                items={this.props.settingStore.getZones(data.country_id)}
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
                                                value={data.zone}
                                                onChange={(event, value) => {
                                                    this.props.fields('zone', value)
                                                    
                                                    this.setState(assign({}, this.state, {
                                                        data: assign({}, data, {
                                                            zone: value
                                                        })
                                                    }))
                                                }}
                                                onSelect={(value, item) => {
                                                    this.props.field('zone_id', item.id)
                                                    this.props.field('zone', value)
                                                    
                                                    // Not sure if this is necessary anymore, pretty sure it's redundant
                                                    this.setState(assign({}, this.state, {
                                                        data: assign({}, data, {
                                                            zone_id: item.id,
                                                            zone: value 
                                                        })
                                                    }))
                                                }}
                                                inputProps={
                                                    assign(this.props.fields('zone', data.zone), { className: 'form-control'})
                                                }
                                            />
                                            <input type='hidden' name='zone_id' {...this.props.fields('zone_id', data.zone_id)} />
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>Postal Code*</ControlLabel>
                                            <FormControl type='text' name='postcode' {...this.props.fields('postcode', data.postcode)} />
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