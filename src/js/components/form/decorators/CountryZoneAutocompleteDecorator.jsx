import assign from 'object-assign'

//import { unwrapComponent, resolveComponent } from '../../AbstractFormComponent.jsx'

const CountryZoneAutocompleteDecorator = {
  // TODO: Move me to a utils class
  matchItemToTerm: {
    value: function(item, value) {
      if (typeof value === 'string') {
        return item.value.toLowerCase().indexOf(value.toLowerCase()) !== -1 //|| zone.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
    }
  },
  onAddressTypeSelected: {
    value: function(e) {
      console.log('address type changed')
      // TODO: Enumerate options
      this.setState({ type: e.target.value })
    }
  },
  onCityValueChanged: {
    value: function(event, value) {
      const mappings = this.props.mappings.address || fieldNames
      const data = this.state.data

      //this.props.field(mappings.CITY, value)

      this.setState(assign({}, this.state, { data: assign({}, data, { [mappings.CITY.property]: value }) }))
    }
  },
  onCityItemSelected: {
    value: function(value, item) {
      const mappings = this.props.mappings.address || fieldNames
      const data = this.state.data

      //this.props.field(mappings.CITY, value)
      //this.props.field(mappings.CITY_ID, item.id)
      //this.props.field(mappings.CITY_CODE, item.data.code)
      console.log('selected city')
      console.log(item)
      console.log(value)
      console.log('selected city code: ' + item.data.code)

      this.setState(assign({}, this.state, {
        data: assign({}, data, {
          [mappings.CITY.property]: item,
          [mappings.CITY_ID.value]: item.id,
          [mappings.CITY_CODE.value]: item.data.code
        })
      }))
    }
  },
  onTerritoryValueChanged: {
    value: function(event, value) {
      const mappings = this.props.mappings.address || fieldNames
      const data = this.state.data

      //this.props.field(mappings.ZONE, value)

      this.setState(assign({}, this.state, { data: assign({}, data, { [mappings.ZONE.property]: value }) }))
    }
  },
  onTerritoryItemSelected: {
    value: function(value, item) {
      const mappings = this.props.mappings.address || fieldNames
      const data = this.state.data

      //this.props.field(mappings.ZONE, value)
      //this.props.field(mappings.ZONE_ID, item.id)
      //this.props.field(mappings.ZONE_CODE, item.data.code)
      console.log('selected territory')
      console.log(item)
      console.log(value)
      console.log('selected territory code: ' + item.data.code)

      this.getTerritoryCities(item.data.code)

      this.setState(assign({}, this.state, {
        data: assign({}, data, {
          [mappings.ZONE.property]: value,
          [mappings.ZONE_ID.value]: item.id,
          [mappings.ZONE_CODE.value]: item.data.code
        })
      }))
    }
  },
  onCountryValueChanged: {
    value: function(event, value) {
      const mappings = this.props.mappings.address || fieldNames
      const data = this.state.data

      //this.props.field(mappings.COUNTRY, value)

      this.setState(assign({}, this.state, { data: assign({}, data, { [mappings.COUNTRY.property]: value }) }))
    }
  },
  onCountryItemSelected: {
    value: function(value, item) {
      const mappings = this.props.mappings.address || fieldNames
      const data = this.state.data

      //this.props.field(mappings.COUNTRY, value)
      //this.props.field(mappings.COUNTRY_ID, item.id)
      //this.props.field(mappings.COUNTRY_CODE, item.data.code)
      console.log('selected country')
      console.log(item)
      console.log(value)
      console.log('selected country code: ' + item.data.code)

      this.getCountryTerritories(item.data.code)

      let newState = assign({}, this.state, {
        data: assign({}, data, {
          [mappings.COUNTRY.property]: value,
          [mappings.COUNTRY_ID.value]: item.id,
          [mappings.COUNTRY_CODE.value]: item.data.code
        })
      })

      this.setState(newState)
      // TODO: I have a feeling this line is no longer necessary
      // GeoService has made it redundant or obsolete
      // We don't use it anywhere above...
      //this.props.settingStore.getZones(item.id)
    }
  },
  getCountryTerritories: {
    value: function(countryCode) {
      if (typeof this.props.getCountryTerritories === 'function') {
        this.props.getCountryTerritories()
      }

      const { geoService } = this.props

      geoService.getCountryZones(countryCode, (data) => {
        //console.log('zones')
        //console.log(data)

        this.setState({ zones: data })
      })
    }
  },
  getCountryCities: {
    value: function(countryCode) {
      if (typeof this.props.getCountryCities === 'function') {
        this.props.getCountryCities()
      }

      const { geoService } = this.props

      geoService.getCountryCities(countryCode, (data) => {
        //console.log('cities')
        //console.log(data)

        this.setState({ cities: data })
      })
    }
  },
  getTerritoryCities: {
    value: function(territoryCode) {
      if (typeof this.props.getTerritoryCities === 'function') {
        this.props.getTerritoryCities()
      }

      const { geoService } = this.props

      geoService.getZoneCities(territoryCode, (data) => {
        //console.log('cities')
        //console.log(data)

        this.setState({ cities: data })
      })
    }
  },
  getCityTerritory: {
    value: function(cityCode) {
      if (typeof this.props.getCityTerritory === 'function') {
        this.props.getCityTerritory()
      }
    }
  },
  getCityCountry: {
    value: function(cityCode) {
      if (typeof this.props.getCityCountry === 'function') {
        this.props.getCityCountry()
      }
    }
  }
}

/**
 *
 * @param WrappedComponent
 * @returns {*}
 */
function enhancer(WrappedComponent) {
  /**
   * It doesn't matter what the wrapped component is - to have access to mappings,
   * it has to be wrapped in a mobx 'Injector'. There's a more dependable way to do this using
   * the commented out imports above (unwrapComponent, resolveComponent), but it still needs work.
   */
  let wrappedComponent = WrappedComponent.wrappedComponent

  Object.defineProperties(wrappedComponent.prototype, CountryZoneAutocompleteDecorator)

  WrappedComponent.wrappedComponent = wrappedComponent

  // Return the decorated instance
  return WrappedComponent
}

export default enhancer
export { CountryZoneAutocompleteDecorator }
