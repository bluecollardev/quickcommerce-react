import assign from 'object-assign'
import axios from 'axios'

import { BaseService } from 'quickcommerce-react/services/BaseService.jsx'

//import ArrayHelper from 'quickcommerce-react/helpers/Array.js'
//import ObjectHelper from 'quickcommerce-react/helpers/Object.js'
//import StringHelper from 'quickcommerce-react/helpers/String.js'
import UrlHelper from 'quickcommerce-react/helpers/URL.js'

class GeoService extends BaseService {
  getCity(id, onSuccess, onError) {
    axios({
      url: UrlHelper.compile(GEO_CITY, { cityId: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response, 
        // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount() 
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  getCities(onSuccess, onError) {
    axios({
      url: UrlHelper.compile(GEO_CITIES),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response,
        // onSuccess
        ((payload) => {
          let data = this.parseCities(assign({}, payload.content))
          if (typeof onSuccess === 'function') {
            onSuccess(data)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  getCountry(id, onSuccess, onError) {
    axios({
      url: UrlHelper.compile(GEO_COUNTRY, { countryId: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response,
        // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  getCountries(onSuccess, onError) {
    axios({
      url: UrlHelper.compile(GEO_COUNTRIES),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response,
        // onSuccess
        ((payload) => {
          let data = this.parseCountries(assign({}, payload.content))
          if (typeof onSuccess === 'function') {
            onSuccess(data)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  getZone(id, onSuccess, onError) {
    axios({
      url: UrlHelper.compile(GEO_ZONE, { zoneId: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response,
        // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  getZones(onSuccess, onError) {
    axios({
      url: UrlHelper.compile(GEO_ZONES),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response,
        // onSuccess
        ((payload) => {
          let data = this.parseZones(assign({}, payload.content))
          if (typeof onSuccess === 'function') {
            onSuccess(data)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  getCountryZones(id, onSuccess, onError) {
    axios({
      url: UrlHelper.compile(GEO_COUNTRY_ZONES, { countryId: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response,
        // onSuccess
        ((payload) => {
          let data = this.parseZones(assign({}, payload.content))
          if (typeof onSuccess === 'function') {
            onSuccess(data)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  getCountryCities(id, onSuccess, onError) {
    /*axios({
      url: UrlHelper.compile(GEO_COUNTRY_ZONES, { countryId: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response,
        // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })*/
  }

  getZoneCities(id, onSuccess, onError) {
    axios({
      url: UrlHelper.compile(GEO_ZONE_CITIES, { zoneId: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET',
    }).then(response => {
      this.handleResponse(response,
        // onSuccess
        ((payload) => {
          let data = this.parseCities(assign({}, payload.content))
          if (typeof onSuccess === 'function') {
            onSuccess(data)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this),
        // Use legacy API compatibility
        true)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  parseCountries(obj) {
    return this.parseCodeType(obj)
  }

  parseZones(obj) {
    return this.parseCodeType(obj)
  }

  /**
   * Deprecated, this was used to parse QuickCommerce zones.
   */
  /*parseZones(obj) {
    let zones = {}

    // Keys are country IDs
    let keys = Object.keys(obj)
    if (keys && keys.length > 0) {
      for (let idx = 0; idx < keys.length; idx++) {
        zones[keys[idx]] = Object.keys(obj[keys[idx]]).map(z => {
          return { id: z, value: obj[keys[idx]][z] }
        })
      }
    }

    return zones
  }*/

  parseCities(obj) {
    return this.parseCodeType(obj)
  }

  parseGeoZones(obj) {
    return Object.keys(obj).map(g => {
      return { id: g, value: obj[g] }
    })
  }

  parseCodeType(obj) {
    return Object.keys(obj).map(t => {
      // If we are using the ID as the selection key
      //return { id: obj[t].id, value: obj[t].name, data: obj[t] }
      return { id: obj[t].code, value: obj[t].name, data: obj[t] }
    })
  }
}

export default GeoService
