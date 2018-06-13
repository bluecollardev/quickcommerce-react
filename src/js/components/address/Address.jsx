import { inject, observer } from 'mobx-react'
import assign from 'object-assign'

import React, { Component } from 'react'

import fieldNames from '../../forms/AddressFields.jsx'
import CurrentAddress from './CurrentAddress.jsx'

@inject(deps => ({
  actions: deps.actions,
  customerService: deps.customerService, // Not used, just in case!
  customerAddressService: deps.customerAddressService,
  geoService: deps.geoService,
  settingStore: deps.settingStore
})) @observer
class Address extends Component {
  constructor(props) {
    super(props)

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

    this.onCreate = this.onCreate.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSaveSuccess = this.onSaveSuccess.bind(this)
    this.onError = this.onError.bind(this)

    this.setInitialState = this.setInitialState.bind(this)
  }

  setInitialState(props) {
    const mappings = props.mappings || fieldNames

    let data = {} //this.props.getForm()

    let state = assign({}, this.state, {data: {} //assign({}, props.data, this.state.data, data)
    })

    let city = state.data.city || null
    let zone = state.data.zone || null
    let country = state.data.country || null

    let cityName = ''
    let zoneName = ''
    let countryName = ''

    // TODO: Do something if the data is wrong or something screws up
    if ((country !== null && typeof country !== 'string') && (zone !== null && typeof zone !== 'string')) {
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

    //state.addressString = Address.getAddressString(state.data)

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

  componentDidMount() {
    const { geoService } = this.props

    geoService.getCities((data) => {
      //console.log('cities')
      //console.log(data)

      this.setState({cities: data})
    })

    geoService.getZones((data) => {
      //console.log('zones')
      //console.log(data)

      this.setState({zones: data})
    })

    geoService.getCountries((data) => {
      //console.log('countries')
      //console.log(data)

      this.setState({countries: data})
    })
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

    this.setState({errors: response.error})
  }

  onCityValueChanged(event, value) {

  }

  onCityItemSelected(value, item) {

  }

  onTerritoryValueChanged(event, value) {

  }

  onTerritoryItemSelected(value, item) {
  }

  onCountryValueChanged(event, value) {

  }

  onCountryItemSelected(value, item) {

  }

  getCountryTerritories(countryCode) {
    if (typeof this.props.getCountryTerritories === 'function') {
      this.props.getCountryTerritories()
    }

    const { geoService } = this.props

    geoService.getCountryZones(countryCode, (data) => {
      //console.log('zones')
      //console.log(data)

      this.setState({zones: data})
    })
  }

  getCountryCities(countryCode) {
    if (typeof this.props.getCountryCities === 'function') {
      this.props.getCountryCities()
    }

    const { geoService } = this.props

    geoService.getCountryCities(countryCode, (data) => {
      //console.log('cities')
      //console.log(data)

      this.setState({cities: data})
    })
  }

  getTerritoryCities(territoryCode) {
    if (typeof this.props.getTerritoryCities === 'function') {
      this.props.getTerritoryCities()
    }

    const { geoService } = this.props

    geoService.getZoneCities(territoryCode, (data) => {
      //console.log('cities')
      //console.log(data)

      this.setState({cities: data})
    })
  }

  getCityTerritory(cityCode) {
    if (typeof this.props.getCityTerritory === 'function') {
      this.props.getCityTerritory()
    }
  }

  getCityCountry(cityCode) {
    if (typeof this.props.getCityCountry === 'function') {
      this.props.getCityCountry()
    }
  }

  render() {
    const { countries, zones, cities } = this.state
    //console.log('rendering Address wrapper')
    return (
      <CurrentAddress
        {...this.props}
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
        countries={countries}
        zones={zones}
        cities={cities}
      />
    )
  }
}

export default Address
export { Address }
