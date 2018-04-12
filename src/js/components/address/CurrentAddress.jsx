import assign from 'object-assign'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'

import FormHelper from 'quickcommerce-react/helpers/Form.js'

import { DateInput } from '../form/Input.jsx'

import FormComponent from '../FormComponent.jsx'

import fieldNames from '../../forms/AddressFields.jsx'

const AddressForm = (props) => {
  const mappings = props.mappings || fieldNames

  const {
    mode,
    type,
    types,
    nameRequired,
    durationRequired,
    displayActions,
    data,
    countries,
    zones,
    cities,
    geoZones,
    getMappedValue
  } = props

  let readOnlyAttr = ''
  switch (mode) {
    case 'view':
      readOnlyAttr = { readOnly: true }
      break
  }

  // Common fields
  let addressId = getMappedValue(mappings.ADDRESS_ID, data) || null
  let selectedCountry = getMappedValue(mappings.COUNTRY, data) || ''
  let selectedCountryId = getMappedValue(mappings.COUNTRY_ID, data) || null
  let selectedCountryCode = getMappedValue(mappings.COUNTRY_CODE, data) || ''
  let selectedZone = getMappedValue(mappings.ZONE, data) || ''
  let selectedZoneId = getMappedValue(mappings.ZONE_ID, data) || null
  let selectedZoneCode = getMappedValue(mappings.ZONE_CODE, data) || ''
  let selectedCity = getMappedValue(mappings.CITY, data) || ''
  let selectedCityId = getMappedValue(mappings.CITY_ID, data) || null
  let selectedCityCode = getMappedValue(mappings.CITY_CODE, data) || ''

  // Name fields
  let firstName = getMappedValue(mappings.FIRST_NAME, data)
  let lastName = getMappedValue(mappings.LAST_NAME, data)

  // Line fields
  let line1 = getMappedValue(mappings.ADDRESS_1, data)
  let line2 = getMappedValue(mappings.ADDRESS_2, data)

  // Civic fields
  let suite = getMappedValue(mappings.SUITE, data)
  let streetName = getMappedValue(mappings.STREET_NAME, data)
  let streetType = getMappedValue(mappings.STREET_TYPE, data)
  let streetDir = getMappedValue(mappings.STREET_DIR, data)

  // PO fields
  let box = getMappedValue(mappings.BOX, data)
  let stn = getMappedValue(mappings.STN, data)

  // Rural fields
  let rangeRd = getMappedValue(mappings.RANGE_ROAD, data)
  let site = getMappedValue(mappings.SITE, data)
  let comp = getMappedValue(mappings.COMP, data)
  let lot = getMappedValue(mappings.LOT, data)
  let concession = getMappedValue(mappings.CONCESSION, data)

  // Date from / to
  let dateFrom = getMappedValue(mappings.FROM, data)
  let dateTo = getMappedValue(mappings.TO, data)
  //let selectedGeoZone = getMappedValue(mappings.GEOZONE, data)

  return (
    <form>
      {/* Don't worry about other sizes, we use flexbox to render on large devices and full width layouts */}
      <div className='col-md-flex col-lg-flex'>
        <input type='hidden' name={mappings.ADDRESS_ID} {...props.fields(mappings.ADDRESS_ID, addressId)} />

        <FormGroup className='col-sm-3 form-element form-select'>
          <ControlLabel>Address Type</ControlLabel>
          <FormControl
            {...readOnlyAttr}
            componentClass='select'
            onChange={props.onAddressTypeSelected}>
            {types.indexOf('simple') > -1 && (
            <option key={0} value='simple'>Simple</option>
            )}
            {types.indexOf('civic') > -1 && (
            <option key={1} value='civic'>Civic</option>
            )}
            {types.indexOf('rural') > -1 && (
            <option key={2} value='rural'>Rural</option>
            )}
            {types.indexOf('pobox') > -1 && (
              <option key={3} value='pobox'>Postal Box</option>
            )}
          </FormControl>
        </FormGroup>

        {/* First Name / Last Name */}
        {nameRequired && (
          <FormGroup className='col-xs-12 col-lg-6 flex-md-50 flex-md-37'>
            <ControlLabel>First Name*</ControlLabel>
            <FormControl {...readOnlyAttr} name={mappings.FIRST_NAME} type='text' {...props.fields(mappings.FIRST_NAME, firstName)} />
          </FormGroup>
        )}

        {nameRequired && (
          <FormGroup className='col-xs-12 col-lg-6 flex-md-50 flex-md-37'>
            <ControlLabel>Last Name*</ControlLabel>
            <FormControl {...readOnlyAttr} name={mappings.LAST_NAME} type='text' {...props.fields(mappings.LAST_NAME, lastName)} />
          </FormGroup>
        )}

        {/* Simple Addresses (Line 1, 2, 3?) */}
        {type === 'simple' && (
          <FormGroup className='col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 flex-md-37'>
            <ControlLabel>Address Line 1*</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.ADDRESS_1} {...props.fields(mappings.ADDRESS_1, line1)} />
          </FormGroup>
        )}
        {type === 'simple' && (
          <FormGroup className='col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 flex-md-37'>
            <ControlLabel>Address Line 2</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.ADDRESS_2} {...props.fields(mappings.ADDRESS_2, line2)} />
          </FormGroup>
        )}

        {/* Civic Addresses */}
        {type === 'civic' && (
          <FormGroup className='col-sm-2 col-md-2 col-lg-2'>
            <ControlLabel>Suite</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.SUITE} {...props.fields(mappings.SUITE, suite)} />
          </FormGroup>
        )}
        {type === 'civic' && (
          <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
            <ControlLabel>Street Name</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.STREET_NAME} {...props.fields(mappings.SUITE, streetName)} />
          </FormGroup>
        )}
        {type === 'civic' && (
          <FormGroup className='col-sm-2 col-md-2 col-lg-2 form-element form-select'>
            <ControlLabel>Street Type</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.STREET_TYPE} {...props.fields(mappings.STREET_TYPE, streetType)} />
          </FormGroup>
        )}
        {type === 'civic' && (
          <FormGroup className='col-sm-1 col-md-1 col-lg-1 form-element form-select'>
            <ControlLabel>Direction</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.STREET_DIR} {...props.fields(mappings.STREET_DIR, streetDir)} />
          </FormGroup>
        )}

        {/* Postal Installation Addresses */}
        {type === 'pobox' && (
          <FormGroup className='col-xs-12 col-sm-12 col-md-12 col-lg-1'>
            <ControlLabel>Box</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.BOX} {...props.fields(mappings.BOX, box)} />
          </FormGroup>
        )}
        {type === 'pobox' && (
          <FormGroup className='col-xs-12 col-sm-12 col-md-12 col-lg-1'>
            <ControlLabel>Station</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.STN} {...props.fields(mappings.STN, stn)} />
          </FormGroup>
        )}

        {/* Rural Addresses */}
        {type === 'rural' && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Range Rd.</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.RANGE_ROAD} {...props.fields(mappings.RANGE_ROAD, rangeRd)} />
          </FormGroup>
        )}
        {type === 'rural' && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Site</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.SITE} {...props.fields(mappings.SITE, site)} />
          </FormGroup>
        )}
        {type === 'rural' && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Comp</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.COMP} {...props.fields(mappings.COMP, comp)} />
          </FormGroup>
        )}
        {type === 'rural' && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Box</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.BOX} {...props.fields(mappings.BOX, box)} />
          </FormGroup>
        )}
        {type === 'rural' && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Lot #</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.LOT} {...props.fields(mappings.LOT, lot)} />
          </FormGroup>
        )}
        {type === 'rural' && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Concession #</ControlLabel>
            <FormControl {...readOnlyAttr} type='text' name={mappings.CONCESSION} {...props.fields(mappings.CONCESSION, concession)} />
          </FormGroup>
        )}

        {/* Date From / To */}
        {durationRequired && (
          <FormGroup className='col-xs-12 col-lg-2 flex-md-12'>
            <ControlLabel>From</ControlLabel>
            <DateInput {...readOnlyAttr} name='from' name={mappings.FROM} {...props.fields(mappings.FROM, dateFrom)} />
          </FormGroup>
        )}
        {durationRequired && (
          <FormGroup className='col-xs-12 col-lg-2 flex-md-12'>
            <ControlLabel>To</ControlLabel>
            <DateInput {...readOnlyAttr} name='to' name={mappings.TO} {...props.fields(mappings.TO, dateTo)} />
          </FormGroup>
        )}
      </div>

      {/* Common Address Fields */}

      <div className='col-md-flex col-lg-flex flex-md-25'>
        {/* City (If Applicable) */}
        <FormGroup className='form-element form-select autocomplete-control-group col-xs-12 col-sm-12 col-md-6 col-lg-6 flex-md-25'>
          <ControlLabel>City*</ControlLabel>
          <Autocomplete
            name={mappings.CITY}
            getItemValue={(item) => {
              return item.value
            }}
            items={cities}
            renderItem={(item, isHighlighted) => {
              return (
                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                  {item.value}
                </div>
              )
            }}
            shouldItemRender={props.matchItemToTerm}
            autoHighlight={true}
            wrapperStyle={{
              display: 'block'
            }}
            value={selectedCity}
            onChange={props.onCityValueChanged}
            onSelect={props.onCityItemSelected}
            inputProps={
              assign(props.fields(mappings.CITY, selectedCity), { className: 'form-control', ...readOnlyAttr })
            }
          />
          <input type='hidden' name={mappings.CITY_ID} {...props.fields(mappings.CITY_ID, selectedCityId, data)} />
          <input type='hidden' name={mappings.CITY_CODE} {...props.fields(mappings.CITY_CODE, selectedCityCode, data)} />
        </FormGroup>

        <FormGroup className='form-element form-select autocomplete-control-group col-xs-12 col-sm-12 col-md-6 col-lg-6 flex-md-25'>
          <ControlLabel>Prov.*</ControlLabel>
          <Autocomplete
            name={mappings.ZONE}
            getItemValue={(item) => {
              return item.value
            }}
            items={zones}
            renderItem={(item, isHighlighted) => {
              return (
                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                  {item.value}
                </div>
              )
            }}
            shouldItemRender={props.matchItemToTerm}
            autoHighlight={true}
            wrapperStyle={{
              display: 'block'
            }}
            value={selectedZone}
            onChange={props.onTerritoryValueChanged}
            onSelect={props.onTerritoryItemSelected}
            inputProps={
              assign(props.fields(mappings.ZONE, selectedZone), { className: 'form-control', ...readOnlyAttr })
            }
          />
          <input type='hidden' name={mappings.ZONE_ID} {...props.fields(mappings.ZONE_ID, selectedZoneId)} />
          <input type='hidden' name={mappings.ZONE_CODE} {...props.fields(mappings.ZONE_CODE, selectedZoneCode)} />
        </FormGroup>

        <FormGroup className='form-element form-select autocomplete-control-group col-xs-12 col-sm-12 col-md-6 col-lg-6 flex-md-25'>
          <ControlLabel>Country*</ControlLabel>
          <Autocomplete
            name={mappings.COUNTRY}
            getItemValue={(item) => {
              return item.value
            }}
            items={countries}
            renderItem={(item, isHighlighted) => {
              return (
                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                  {item.value}
                </div>
              )
            }}
            shouldItemRender={props.matchItemToTerm}
            autoHighlight={true}
            wrapperStyle={{
              display: 'block'
            }}
            value={selectedCountry}
            onChange={props.onCountryValueChanged}
            onSelect={props.onCountryItemSelected}
            inputProps={
              assign(props.fields(mappings.COUNTRY, selectedCountry), { className: 'form-control', ...readOnlyAttr })
            }
          />
          <input type='hidden' name={mappings.COUNTRY_ID} {...props.fields(mappings.COUNTRY_ID, selectedCountryId, data)} />
          <input type='hidden' name={mappings.COUNTRY_CODE} {...props.fields(mappings.COUNTRY_CODE, selectedCountryCode, data)} />
        </FormGroup>

        <FormGroup className='col-xs-12 col-sm-9 col-md-9 col-lg-5 flex-md-25'>
          <ControlLabel>Postal Code*</ControlLabel>
          <FormControl {...readOnlyAttr} type='text' name={mappings.POSTCODE} {...props.fields(mappings.POSTCODE, getMappedValue(mappings.POSTCODE, data))} />
        </FormGroup>
      </div>

      {displayActions && props.hasOwnProperty('mode') && props.mode === 'create' && (
        <FormGroup>
          <Button bsStyle='success' onClick={props.onCreate}>{props.isSubForm ? 'Create Address' : 'OK'}</Button>&nbsp;
          <Button onClick={props.onCancel}>Cancel</Button>&nbsp;
        </FormGroup>
      )}

      {displayActions && props.hasOwnProperty('mode') && props.mode === 'edit' && (
        <FormGroup>
          <Button bsStyle='success' onClick={props.onUpdate}>{props.isSubForm ? 'Update Address' : 'OK'}</Button>&nbsp;
          <Button onClick={props.onCancel}>Cancel</Button>&nbsp;
        </FormGroup>
      )}
    </form>
  )
}


@inject(deps => ({
  actions: deps.actions,
  customerService: deps.customerService, // Not used, just in case!
  customerAddressService: deps.customerAddressService,
  settingStore: deps.settingStore
}))
@observer
class CurrentAddress extends Component {
  constructor(props) {
    super(props)
        
    // Turned getAddressString into a static method
    //this.getAddressString = this.getAddressString.bind(this)
    this.showAddressModal = this.showAddressModal.bind(this)
    this.hideAddressModal = this.hideAddressModal.bind(this)
    this.toggleAddress = this.toggleAddress.bind(this)

    this.onAddressTypeSelected = this.onAddressTypeSelected.bind(this)
    this.onCityValueChanged = this.onCityValueChanged.bind(this)
    this.onCityItemSelected = this.onCityItemSelected.bind(this)
    this.onTerritoryValueChanged = this.onTerritoryValueChanged.bind(this)
    this.onTerritoryItemSelected = this.onTerritoryItemSelected.bind(this)
    this.onCountryValueChanged = this.onCountryValueChanged.bind(this)
    this.onCountryItemSelected = this.onCountryItemSelected.bind(this)
    this.getCountryTerritories = this.getCountryTerritories.bind(this)
    this.getCountryCities = this.getCountryCities.bind(this)
    this.getTerritoryCities = this.getTerritoryCities.bind(this)
    this.getCityTerritory = this.getCityTerritory.bind(this)
    this.getCityCountry = this.getCityCountry.bind(this)

    this.mergeFormData = this.mergeFormData.bind(this)
    //this.matchItemToTerm = this.matchItemToTerm.bind(this)

    this.state = assign({}, props)
  }

  componentWillReceiveProps(newProps) {
    this.setState(assign({}, newProps))
  }

  /**
   * Set an error boundary so a rendering failure in the component doesn't cascade.
   */
  componentDidCatch(error, info) {
    console.log('CurrentAddress error')
    console.log(error)
    console.log(info)
  }

  mergeFormData(data) {
    let formData = this.props.getForm()
    // Iterate and set
    for (let path in formData) {
      FormHelper.setMappedValue(path, data, formData[path])
    }

    //console.log('merged props and form data')
    //console.log(data)
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
        }).join('\n'),
        [data.city, data.zone].join(', '),
        [data.country, data.postcode].join(' ')
      ]

      formatted = formatted.filter(function (value, idx) {
        return filterValue(value)
      })

      formatted = formatted.join('\n')
    }

    return formatted
  }
    
  // TODO: Move me to a utils class
  matchItemToTerm(item, value) {
    if (typeof value === 'string') {
      return item.value.toLowerCase().indexOf(value.toLowerCase()) !== -1 //|| zone.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }

  onAddressTypeSelected(e) {
    console.log('address type changed')
    // TODO: Enumerate options
    this.setState({
      type: e.target.value
    })
  }

  onCityValueChanged(event, value) {
    const mappings = this.props.mappings || fieldNames
    const data = this.state.data

    this.props.field(mappings.CITY, value)

    this.setState(assign({}, this.state, {
      data: assign({}, data, {
        [mappings.CITY]: value
      })
    }))
  }

  onCityItemSelected(value, item) {
    const mappings = this.props.mappings || fieldNames
    const data = this.state.data

    this.props.field(mappings.CITY_ID, item.id)
    this.props.field(mappings.CITY_CODE, item.data.code)
    console.log('selected city')
    console.log(item)
    console.log(value)
    console.log('selected city code: ' + item.data.code)
    this.props.field(mappings.CITY, value)

    this.setState(assign({}, this.state, {
      data: assign({}, data, {
        [mappings.CITY_CODE]: item.data.code,
        [mappings.CITY_ID]: item.id,
        [mappings.CITY]: value
      })
    }))
  }

  onTerritoryValueChanged(event, value) {
    const mappings = this.props.mappings || fieldNames
    const data = this.state.data

    this.props.field(mappings.ZONE, value)

    this.setState(assign({}, this.state, {
      data: assign({}, data, {
        [mappings.ZONE]: value
      })
    }))
  }

  onTerritoryItemSelected(value, item) {
    const mappings = this.props.mappings || fieldNames
    const data = this.state.data

    this.props.field(mappings.ZONE_ID, item.id)
    this.props.field(mappings.ZONE_CODE, item.data.code)
    //console.log('selected territory')
    //console.log(item)
    //console.log(value)
    //console.log('selected territory code: ' + item.data.code)
    this.props.field(mappings.ZONE, value)

    this.getTerritoryCities(item.data.code)

    this.setState(assign({}, this.state, {
      data: assign({}, data, {
        [mappings.ZONE_CODE]: item.data.code,
        [mappings.ZONE_ID]: item.id,
        [mappings.ZONE]: value
      })
    }))
  }

  onCountryValueChanged(event, value) {
    const mappings = this.props.mappings || fieldNames
    const data = this.state.data

    this.props.field(mappings.COUNTRY, value)

    this.setState(assign({}, this.state, {
      data: assign({}, data, {
        [mappings.COUNTRY]: value
      })
    }))
  }

  onCountryItemSelected(value, item) {
    const mappings = this.props.mappings || fieldNames
    const data = this.state.data

    this.props.field(mappings.COUNTRY_ID, item.id)
    this.props.field(mappings.COUNTRY_CODE, item.data.code)
    //console.log('selected country')
    //console.log(item)
    //console.log(value)
    //console.log('selected country code: ' + item.data.code)
    this.props.field(mappings.COUNTRY, value)

    this.getCountryTerritories(item.data.code)

    this.setState(assign({}, this.state, {
      data: assign({}, data, {
        [mappings.COUNTRY_ID]: item.id,
        [mappings.COUNTRY_CODE]: item.data.code,
        [mappings.COUNTRY]: value
      })
    }))

	// TODO: I have a feeling this line is no longer necessary
	// GeoService has made it redundant or obsolete
	// We don't use it anywhere above...
    this.props.settingStore.getZones(item.id)
  }

  getCountryTerritories(countryCode) {
    if (typeof this.props.getCountryTerritories === 'function') {
      this.props.getCountryTerritories(countryCode)
    }
  }

  getCountryCities(countryCode) {
    if (typeof this.props.getCountryCities === 'function'){
      this.props.getCountryCities(countryCode)
    }
  }

  getTerritoryCities(territoryCode) {
    if (typeof this.props.getTerritoryCities === 'function') {
      this.props.getTerritoryCities(territoryCode)
    }
  }

  getCityTerritory() {
    if (typeof this.props.getCityTerritory === 'function') {
      this.props.getCityTerritory()
    }
  }

  getCityCountry() {
    if (typeof this.props.getCityCountry === 'function') {
      this.props.getCityCountry()
    }
  }

  render() {
    // CurrentAddress.render
    const { data, countries, zones, cities, geoZones, type, types } = this.state

    this.mergeFormData(data)

    return (
      <div>
        {this.props.title && (
          <h4>{this.props.title}</h4>
        )}

        {this.props.displaySummary && this.props.modal && (
          <form>
            <FormGroup>
              <FormControl readOnly componentClass='textarea' value={this.state.addressString} rows={7} onClick={this.showAddressModal} />
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
            <AddressForm
              {...this.props}
              matchItemToTerm={this.matchItemToTerm}
              onAddressTypeSelected={this.onAddressTypeSelected}
              onCityValueChanged={this.onCityValueChanged}
              onCityItemSelected={this.onCityItemSelected}
              onTerritoryValueChanged={this.onTerritoryValueChanged}
              onTerritoryItemSelected={this.onTerritoryItemSelected}
              onCountryValueChanged={this.onCountryValueChanged}
              onCountryItemSelected={this.onCountryItemSelected}
              getCountryTerritories={this.getCountryTerritories}
              getCountryCities={this.getCountryCities}
              getTerritoryCities={this.getTerritoryCities}
              getCityTerritory={this.getCityTerritory}
              getCityCountry={this.getCityCountry}
              geoZones={geoZones}
              countries={countries}
              zones={zones}
              cities={cities}
              type={type}
              data={data}
            />
          </div>
        )}

        {this.state.address && this.props.modal && (
          <Modal
            bsClass='modal'
            show={!!this.state.address}
            onHide={this.hideAddressModal}
            backdrop={true}
            backdropClassName='address-edit-modal-backdrop'>
            {this.props.modal && typeof this.props.title === 'string' && (
              <Modal.Header>
                <Modal.Title>
                  {this.props.title}
                </Modal.Title>
              </Modal.Header>
            )}

            <Modal.Body>
              <AddressForm
                {...this.props}
                matchItemToTerm={this.matchItemToTerm}
                onAddressTypeSelected={this.onAddressTypeSelected}
                onCityValueChanged={this.onCityValueChanged}
                onCityItemSelected={this.onCityItemSelected}
                onTerritoryValueChanged={this.onTerritoryValueChanged}
                onTerritoryItemSelected={this.onTerritoryItemSelected}
                onCountryValueChanged={this.onCountryValueChanged}
                onCountryItemSelected={this.onCountryItemSelected}
                getCountryTerritories={this.getCountryTerritories}
                getCountryCities={this.getCountryCities}
                getTerritoryCities={this.getTerritoryCities}
                getCityTerritory={this.getCityTerritory}
                getCityCountry={this.getCityCountry}
                geoZones={geoZones}
                countries={countries}
                zones={zones}
                cities={cities}
                type={type}
                types={types}
                data={data}
              />
            </Modal.Body>
          </Modal>
        )}
      </div>
    )
  }
}

CurrentAddress.propTypes = {
  isSubForm: PropTypes.bool,
  nameRequired: PropTypes.bool,
  displayAddress: PropTypes.bool,
  displaySummary: PropTypes.bool,
  //type: PropTypes.oneOf('simple', 'civic', 'rural', 'pobox'), // TODO: Wrong syntax!
  //types: PropTypes.arrayOf('simple', 'civic', 'rural', 'pobox'), // TODO: Wrong syntax!
  data: PropTypes.object,
  addressString: PropTypes.string,
  address: PropTypes.object,
  countries: PropTypes.array,
  zones: PropTypes.array,
  geoZones: PropTypes.array
}

CurrentAddress.defaultProps = {
  // Is the component embedded in another component or form?
  // If this is true, the component will handle its own updating
  isSubForm: false,
  nameRequired: true, // Stupid OpenCart
  displayAddress: false,
  displaySummary: false,
  type: 'simple', // [simple|civic|rural|pobox] // TODO: Wrong syntax!
  types: ['simple', 'civic', 'rural', 'pobox'], // TODO: Wrong syntax!
  //title: 'Current Address',
  data: {
    id: null,
    line1: '',
    line2: '',
    city: {
      id: null,
      value: '',
      name: ''
    },
    territory: {
      id: null,
      value: '',
      name: ''
    },
    country: {
      id: null,
      value: '',
      name: ''
    },
    postalCode: ''
  },
  addressString: '',
  address: null,
  geoZones: [{id: null, value: ''}],
  countries: [{id: null, value: ''}],
  zones: [{id: null, value: ''}],
  cities: [{id: null, value: ''}]
}

export default FormComponent(CurrentAddress)
export { CurrentAddress }
