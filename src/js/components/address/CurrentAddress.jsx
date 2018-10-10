import assign from 'object-assign'
import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import { Button, ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap'

import FormHelper from '../../helpers/Form.js'
import StringHelper from '../../helpers/String.js'

import { InputFormControl, HiddenInput, DateInput } from '../form/Input.jsx'
import { AddressStyleDropdown, StreetTypeDropdown, StreetDirDropdown, QuadrantDropdown } from '../form/Dropdown.jsx'
import { AutocompleteFormControl, matchItemToTerm } from '../form/Autocomplete.jsx'

import FormComponent from '../FormComponent.jsx'
import AddressAutocompleteDecorator from '../form/decorators/AddressAutocompleteDecorator.jsx'

const AddressForm = (props) => {
  const {
    settingStore,
    mode, //type, types,
    nameRequired, durationRequired,
    displayActions,
    data,
    // TODO: Remove any references to the following props
    // We don't need them anymore now that SettingStore has been properly implemented
    countries, zones, cities, //geoZones,
    //streetTypes, directions, quadrants,
    //field, fields, value, getMappedValue
    getMappedValue
  } = props

  const mappings = props.mappings.address
  const addressStyleMappings = props.mappings.address.ADDRESS_STYLE_MAP

  let addressStyleTypes = []
  if (settingStore.addressStyles instanceof Array) {
    addressStyleTypes = settingStore.addressStyles.filter((style) => {
      return true // TODO: Make this configurable, as code types may change!
    })

    // Add extra options for other quickcommerce address configurations
    //let addressStyles = Object.keys(addressStyleMappings)
    // TODO: Automatically append extra address styles that exist in mappings...
    //addressStyleTypes.unshift({ data: addressStyles})
    // TODO: This is a quick workaround to add SIMPLE address type
    addressStyleTypes.unshift({ data: 'SIMPLE' })
  }

  let readOnlyAttr = ''
  switch (mode) {
    case 'view':
      readOnlyAttr = { readOnly: true }
      break
  }

  let type = getMappedValue(mappings.ADDRESS_STYLE, data, true)
  // TODO: Check type against an array of valid types

  // Pass FormComponent props down to inputs
  const inputProps = {
    //data: props.data,
    field: props.field,
    fields: props.fields,
    value: props.value
  }

  // TODO: Remove me, just temporarily hardcoding this while I fix an issue
  //let type = addressStyleMappings.CIVIC.property

  return (
    <form>
      {/* Don't worry about other sizes, we use flexbox to render on large devices and full width layouts */}
      {mode !== 'view' && (
        <div className='col-md-flex col-lg-flex'>
          <HiddenInput {...readOnlyAttr} {...inputProps} mapping={mappings.ADDRESS_ID} data={data} />

          {/*<FormGroup className='col-sm-3 form-element form-select'>
            <ControlLabel>Address Type</ControlLabel>
            <FormControl
              {...readOnlyAttr}
              componentClass='select'
              onChange={props.onAddressStyleSelected}>
              {types.indexOf('simple') > -1 && (<option key={0} value='simple'>Simple</option>)}
              {types.indexOf('civic') > -1 && (<option key={1} value='civic'>Civic</option>)}
              {types.indexOf('rural') > -1 && (<option key={2} value='rural'>Rural</option>)}
              {types.indexOf('pobox') > -1 && (<option key={3} value='pobox'>Postal Box</option>)}
            </FormControl>
          </FormGroup>*/}

          {/* TODO: To accommodate smaller screen sizes we may have to conditionally display this block */}
          <FormGroup className='col-sm-2 form-element form-select'>
            <ControlLabel>Type</ControlLabel>
            <AddressStyleDropdown
              {...readOnlyAttr}
              codeValue
              {...inputProps}
              items={addressStyleTypes}
              mapping={mappings.ADDRESS_STYLE}
              data={data}
              onChange={props.onAddressStyleChanged}
              onSelect={props.onAddressStyleSelected}
              // TODO: Turn me into an example!
              mapItems={(item) => {
                let mappedItem = {}

                if (typeof item.data === 'string') {
                  for (let addressStyleType in mappings.ADDRESS_STYLE_MAP) {
                    let addressStyleMapping = mappings.ADDRESS_STYLE_MAP[addressStyleType]
                    let addressStyleCode = (typeof item.data === 'string') ? item.data : ''
                    if (addressStyleCode === addressStyleType) {
                      mappedItem = {
                        data: addressStyleMapping.property,
                        code: addressStyleMapping.property,
                        value: addressStyleMapping.value,
                        //selected: item.selected
                      }

                      break
                    }
                  }
                }

                return mappedItem
              }}
            />
          </FormGroup>
        </div>
      )}

      <div className='col-md-flex col-lg-flex'>
        {/* First Name / Last Name */}
        {nameRequired && (
          <FormGroup className='col-xs-12 col-lg-6 flex-md-50 flex-md-37'>
            <ControlLabel>First Name*</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.FIRST_NAME} data={data} />
          </FormGroup>
        )}

        {nameRequired && (
          <FormGroup className='col-xs-12 col-lg-6 flex-md-50 flex-md-37'>
            <ControlLabel>Last Name*</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.LAST_NAME} data={data} />
          </FormGroup>
        )}

        {/* TODO: To accommodate smaller screen sizes we may have to conditionally display this block */}
        {/*<FormGroup className='col-sm-1 form-element form-select'>
          <ControlLabel>Type</ControlLabel>
          <AddressStyleDropdown
            {...readOnlyAttr}
            codeValue
            {...inputProps}
            items={addressStyleTypes}
            mapping={mappings.ADDRESS_STYLE}
            data={data}
            onChange={props.onAddressStyleChanged}
            onSelect={props.onAddressStyleSelected}
            // TODO: Turn me into an example!
            mapItems={(item) => {
              let mappedItem = {}

              if (typeof item.data === 'string') {
                for (let addressStyleType in mappings.ADDRESS_STYLE_MAP) {
                  let addressStyleMapping = mappings.ADDRESS_STYLE_MAP[addressStyleType]
                  let addressStyleCode = (typeof item.data === 'string') ? item.data : ''
                  if (addressStyleCode === addressStyleType) {
                    mappedItem = {
                      data: addressStyleMapping.property,
                      code: addressStyleMapping.property,
                      value: addressStyleMapping.value,
                      //selected: item.selected
                    }

                    break
                  }
                }
              }

              return mappedItem
            }}
          />
        </FormGroup>*/}

        {/* Simple Addresses (Line 1, 2, 3?) */}
        {type === addressStyleMappings.SIMPLE.property && (
          <FormGroup className='col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 flex-md-37'>
            <ControlLabel>Address Line 1*</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.ADDRESS_1} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.SIMPLE.property && (
          <FormGroup className='col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 flex-md-37'>
            <ControlLabel>Address Line 2</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.ADDRESS_2} data={data} />
          </FormGroup>
        )}

        {/* Civic Addresses */}
        {type === addressStyleMappings.CIVIC.property && (
          <FormGroup className='col-sm-2 col-md-2 col-lg-2'>
            <ControlLabel>Suite</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.SUITE} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.CIVIC.property && (
          <FormGroup className='col-sm-2 col-md-2 col-lg-2'>
            <ControlLabel>Street No.</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.CIVIC_NUMBER} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.CIVIC.property && (
          <FormGroup className='col-sm-3 col-md-3 col-lg-3'>
            <ControlLabel>Street Name</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.STREET_NAME} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.CIVIC.property && (
          <FormGroup className='col-sm-2 col-md-2 col-lg-2 form-element form-select'>
            <ControlLabel>Street Type</ControlLabel>
            <StreetTypeDropdown
              {...readOnlyAttr}
              optionValue
              {...inputProps}
              items={settingStore.streetTypes}
              mapping={mappings.STREET_TYPE}
              data={data}
              //onChange={props.onAddressStyleChanged}
              //onSelect={props.onAddressStyleSelected}
            />
          </FormGroup>
        )}
        {type === addressStyleMappings.CIVIC.property && (
          <FormGroup className='col-sm-2 col-md-2 col-lg-2 form-element form-select'>
            <ControlLabel>Dir.</ControlLabel>
            <StreetDirDropdown
              {...readOnlyAttr}
              codeValue
              {...inputProps}
              items={settingStore.directions}
              mapping={mappings.STREET_DIR}
              data={data}
              //onChange={props.onAddressStyleChanged}
              //onSelect={props.onAddressStyleSelected}
              // TODO: Turn me into an example!
              mapItems={(item) => {
                let mappedItem = {
                  data: item.code,
                  code: item.code,
                  value: item.code,
                  //selected: item.selected
                }

                return mappedItem
              }}
            />
          </FormGroup>
        )}
        {type === addressStyleMappings.CIVIC.property && (
          <FormGroup className='col-sm-1 col-md-1 col-lg-1 form-element form-select'>
            <ControlLabel>Quad.</ControlLabel>
            <QuadrantDropdown
              {...readOnlyAttr}
              codeValue
              {...inputProps}
              items={settingStore.quadrants}
              mapping={mappings.QUADRANT}
              data={data}
              //onChange={props.onAddressStyleChanged}
              //onSelect={props.onAddressStyleSelected}
              // TODO: Turn me into an example!
              mapItems={(item) => {
                let mappedItem = {
                  data: item.code,
                  code: item.code,
                  value: item.code,
                  //selected: item.selected
                }

                return mappedItem
              }}
            />
          </FormGroup>
        )}

        {/* Postal Installation Addresses */}
        {type === addressStyleMappings.POBOX.property && (
          <FormGroup className='col-xs-12 col-sm-12 col-md-12 col-lg-1'>
            <ControlLabel>Box</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.BOX} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.POBOX.property && (
          <FormGroup className='col-xs-12 col-sm-12 col-md-12 col-lg-1'>
            <ControlLabel>Station</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.STN} data={data} />
          </FormGroup>
        )}

        {/* Rural Addresses */}
        {type === addressStyleMappings.RURAL.property && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Range Rd.</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.RANGE_ROAD} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.RURAL.property && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Site</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.SITE} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.RURAL.property && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Comp</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.COMP} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.RURAL.property && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Box</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.BOX} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.RURAL.property && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Lot #</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.LOT} data={data} />
          </FormGroup>
        )}
        {type === addressStyleMappings.RURAL.property && (
          <FormGroup className='col-sm-3'>
            <ControlLabel>Concession #</ControlLabel>
            <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.CONCESSION} data={data} />
          </FormGroup>
        )}

        {/* Date From / To */}
        {durationRequired && (
          <FormGroup className='col-xs-12 col-lg-2 flex-md-12'>
            <ControlLabel>From</ControlLabel>
            <DateInput {...readOnlyAttr} {...inputProps} mapping={mappings.FROM} data={data} />
          </FormGroup>
        )}
        {durationRequired && (
          <FormGroup className='col-xs-12 col-lg-2 flex-md-12'>
            <ControlLabel>To</ControlLabel>
            <DateInput {...readOnlyAttr} {...inputProps} mapping={mappings.TO} data={data} />
          </FormGroup>
        )}
      </div>

      {/* Common Address Fields */}
      <div className='col-md-flex col-lg-flex flex-md-25'>
        {/* City (If Applicable) */}
        <FormGroup className='form-element form-select autocomplete-control-group col-xs-12 col-sm-12 col-md-6 col-lg-6 flex-md-25'>
          <ControlLabel>City*</ControlLabel>
          <AutocompleteFormControl
            {...readOnlyAttr}
            {...inputProps}
            data={data}
            mappings={{
              field: mappings.CITY,
              id: mappings.CITY_ID,
              code: mappings.CITY_CODE
            }}
            items={cities}
            //shouldItemRender={matchItemToTerm}
            onChange={props.onCityValueChanged}
            onSelect={props.onCityItemSelected}
          />
        </FormGroup>

        <FormGroup className='form-element form-select autocomplete-control-group col-xs-12 col-sm-12 col-md-6 col-lg-6 flex-md-25'>
          <ControlLabel>Prov.*</ControlLabel>
          <AutocompleteFormControl
            {...readOnlyAttr}
            {...inputProps}
            data={data}
            mappings={{
              field: mappings.ZONE,
              id: mappings.ZONE_ID,
              code: mappings.ZONE_CODE
            }}
            items={zones}
            //shouldItemRender={matchItemToTerm}
            onChange={props.onTerritoryValueChanged}
            onSelect={props.onTerritoryItemSelected}
          />
        </FormGroup>

        <FormGroup className='form-element form-select autocomplete-control-group col-xs-12 col-sm-12 col-md-6 col-lg-6 flex-md-25'>
          <ControlLabel>Country*</ControlLabel>
          <AutocompleteFormControl
            {...readOnlyAttr}
            {...inputProps}
            data={data}
            mappings={{
              field: mappings.COUNTRY,
              id: mappings.COUNTRY_ID,
              code: mappings.COUNTRY_CODE
            }}
            items={countries}
            //shouldItemRender={matchItemToTerm}
            onChange={props.onCountryValueChanged}
            onSelect={props.onCountryItemSelected}
          />
        </FormGroup>

        <FormGroup className='col-xs-12 col-sm-9 col-md-9 col-lg-5 flex-md-25'>
          <ControlLabel>Postal Code*</ControlLabel>
          <InputFormControl {...readOnlyAttr} {...inputProps} mapping={mappings.POSTCODE} data={data} />
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
  mappings: deps.mappings,
  customerService: deps.customerService, // Not used, just in case!
  customerAddressService: deps.customerAddressService,
  geoService: deps.geoService,
  settingStore: deps.settingStore
  })) @observer
class CurrentAddress extends Component {
  static propTypes = {
    isSubForm: PropTypes.bool,
    nameRequired: PropTypes.bool,
    displayAddress: PropTypes.bool,
    displaySummary: PropTypes.bool, //type: PropTypes.oneOf('simple', 'civic', 'rural', 'pobox'), // TODO: Wrong syntax!
    //types: PropTypes.arrayOf('simple', 'civic', 'rural', 'pobox'), // TODO: Wrong syntax!
    data: PropTypes.object,
    addressString: PropTypes.string,
    address: PropTypes.object,
    debug: PropTypes.bool
  }

  static defaultProps = {
    // Is the component embedded in another component or form?
    // If this is true, the component will handle its own updating
    isSubForm: false,
    nameRequired: true, // Stupid OpenCart
    displayAddress: false,
    displaySummary: false,
    //type: '',
    //types: [],
    //title: '',
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
    debug: false
  }

  constructor(props) {
    super(props)

    // Turned getAddressString into a static method
    //this.getAddressString = this.getAddressString.bind(this)
    this.showAddressModal = this.showAddressModal.bind(this)
    this.hideAddressModal = this.hideAddressModal.bind(this)
    this.toggleAddress = this.toggleAddress.bind(this)

    this.mergeFormData = this.mergeFormData.bind(this)
    //this.matchItemToTerm = this.matchItemToTerm.bind(this)

    //this.state = assign({}, props)

    this.state = {
      cities: [],
      zones: [],
      countries: [],
      geoZones: [],
      streetTypes: [],
      directions: [],
      quadrants: []
      //types: [],
      //type: props.type
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
        [
          data.firstname,
          data.lastname
        ].join(' '),
        [data.company].filter(function (value, idx) {
          return filterValue(value)
        }).join(''),
        [
          data.address1,
          data.address2
        ].filter(function (value, idx) {
          return filterValue(value)
        }).join('\n'),
        [
          data.city,
          data.zone
        ].join(', '),
        [
          data.country,
          data.postcode
        ].join(' ')
      ]

      formatted = formatted.filter(function (value, idx) {
        return filterValue(value)
      })

      formatted = formatted.join('\n')
    }

    return formatted
  }

  componentWillMount() {
    const { mappings, data, geoService, settingStore, getMappedValue } = this.props

    let processOps = []

    let countries = settingStore.countries
    let zones = settingStore.zones
    let cities = settingStore.cities

    processOps.push(new Promise((resolve, reject) => {
      geoService.getCountries((data) => {
        //console.log('countries')
        //console.log(data)
        countries = data
        resolve()
      })
    }))

    processOps.push(new Promise((resolve, reject) => {
      geoService.getZones((data) => {
        //console.log('zones')
        //console.log(data)
        zones = data
        resolve()
      })
    }))

    processOps.push(new Promise((resolve, reject) => {
      geoService.getCities((data) => {
        //console.log('cities')
        //console.log(data)
        cities = data
        resolve()
      })
    }))

    Promise.all(processOps)
      .then(() => {
        this.setState({
          cities: cities,
          zones: zones,
          countries: countries
        })
      })
  }

  /*componentWillReceiveProps(newProps) {
    // TODO: This is too general...
    if (this.props !== newProps) {
      let newState = assign({}, this.state, newProps)
      this.setState(newState)
    }
  }*/

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
    // Iterate and setmergeFormData
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

  render() {
    // CurrentAddress.render
    let { addressStyles,
      geoZones, countries, zones, cities,
      streetTypes, directions, quadrants
    } = this.state

    let { data } = this.props

    //console.log('DUMPING CURRENT ADDRESS STATE')
    //console.log(this.state)

    this.mergeFormData(data)

    const inputProps = {
      //data: props.data,
      field: this.props.field,
      fields: this.props.fields,
      value: this.props.value
    }

    /*this.onCityValueChanged = this.onCityValueChanged.bind(this)
    this.onCityItemSelected = this.onCityItemSelected.bind(this)
    this.onTerritoryValueChanged = this.onTerritoryValueChanged.bind(this)
    this.onTerritoryItemSelected = this.onTerritoryItemSelected.bind(this)
    this.onCountryValueChanged = this.onCountryValueChanged.bind(this)
    this.onCountryItemSelected = this.onCountryItemSelected.bind(this)
    this.getCountryTerritories = this.getCountryTerritories.bind(this)
    this.getCountryCities = this.getCountryCities.bind(this)
    this.getTerritoryCities = this.getTerritoryCities.bind(this)
    this.getCityTerritory = this.getCityTerritory.bind(this)
    this.getCityCountry = this.getCityCountry.bind(this)*/

    return (
      <div>
        {this.props.title && (<h4>{this.props.title}</h4>)}

        {this.props.displaySummary && this.props.modal && (
          <form>
            <FormGroup>
              <FormControl readOnly componentClass='textarea' value={this.state.addressString} rows={7} onClick={this.showAddressModal}/>
            </FormGroup>
          </form>
        )}

        {this.props.displaySummary && !this.props.modal && (
          <form>
            <FormGroup>
              <FormControl componentClass='textarea' value={this.state.addressString} rows={7} onClick={this.toggleAddress}/>
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
              matchItemToTerm={this.matchItemToTerm.bind(this)}
              onAddressStyleChanged={this.onAddressStyleChanged.bind(this)}
              onAddressStyleSelected={this.onAddressStyleSelected.bind(this)}
              onCityValueChanged={this.onCityValueChanged.bind(this)}
              onCityItemSelected={this.onCityItemSelected.bind(this)}
              onTerritoryValueChanged={this.onTerritoryValueChanged.bind(this)}
              onTerritoryItemSelected={this.onTerritoryItemSelected.bind(this)}
              onCountryValueChanged={this.onCountryValueChanged.bind(this)}
              onCountryItemSelected={this.onCountryItemSelected.bind(this)}
              getCountryTerritories={this.getCountryTerritories.bind(this)}
              getCountryCities={this.getCountryCities.bind(this)}
              getTerritoryCities={this.getTerritoryCities.bind(this)}
              getCityTerritory={this.getCityTerritory.bind(this)}
              getCityCountry={this.getCityCountry.bind(this)}
              geoZones={geoZones}
              countries={countries}
              zones={zones}
              cities={cities}
              //type={type}
              //types={types}
              data={data}
            />
            {/* TODO: This is just for testing */}
            {this.props.debug === true && (
              <div className='col-md-flex col-lg-flex'>
                <div className='col-xs-12'>
                  <Button onClick={() => {
                    console.log('getForm')
                    console.log(this.props.getForm())
                  }}>Get Form</Button>
                </div>
              </div>
            )}
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
                matchItemToTerm={this.matchItemToTerm.bind(this)}
                onAddressStyleChanged={this.onAddressStyleChanged.bind(this)}
                onAddressStyleSelected={this.onAddressStyleSelected.bind(this)}
                onCityValueChanged={this.onCityValueChanged.bind(this)}
                onCityItemSelected={this.onCityItemSelected.bind(this)}
                onTerritoryValueChanged={this.onTerritoryValueChanged.bind(this)}
                onTerritoryItemSelected={this.onTerritoryItemSelected.bind(this)}
                onCountryValueChanged={this.onCountryValueChanged.bind(this)}
                onCountryItemSelected={this.onCountryItemSelected.bind(this)}
                getCountryTerritories={this.getCountryTerritories.bind(this)}
                getCountryCities={this.getCountryCities.bind(this)}
                getTerritoryCities={this.getTerritoryCities.bind(this)}
                getCityTerritory={this.getCityTerritory.bind(this)}
                getCityCountry={this.getCityCountry.bind(this)}
                geoZones={geoZones}
                countries={countries}
                zones={zones}
                cities={cities}
                streetTypes={streetTypes}
                directions={directions}
                quadrants={quadrants}
                //type={type}
                //types={types}
                data={data}
              />
            </Modal.Body>
          </Modal>
        )}
      </div>
    )
  }
}

export default FormComponent(
  // Decorate...
  AddressAutocompleteDecorator(
    // ...the component
    CurrentAddress
  ))

export { CurrentAddress }
