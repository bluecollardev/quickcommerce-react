import axios from 'axios'
import { normalize, schema } from 'normalizr'
import assign from 'object-assign'
//import ArrayHelper from '../helpers/Array.js'
//import ObjectHelper from '../helpers/Object.js'
//import StringHelper from '../helpers/String.js'
import UrlHelper from '../helpers/URL.js'
//import QcCustomerService from './CustomerService.jsx'
import { BaseService } from './BaseService.jsx'
import CustomerSearchConstants from '../constants/CustomerSearchConstants'

const key = 'customers'

const result = new schema.Entity('content', {
  //idAttribute: 'customer_id'
  idAttribute: 'customerId'
})

const schemaDef = {customers: [result]}

const config = assign({}, {
  key: key,
  src: {
    transport: {
      read: {
        url: CustomerSearchConstants.SEARCH_CUSTOMERS_URI,
        method: CustomerSearchConstants.SEARCH_CUSTOMERS_URI_METHOD,
        dataType: 'json',
        contentType: 'application/json',
        data: {search: ''}
      }
    }
  },
  schema: schemaDef
})

class CustomerService extends BaseService {
  /**
   */
  setCustomer(data) {
    // Try using/fetching the customer's default address
    let addressId = null

    // If the customer object was returned from qcapi resource services, it will be provided as a property
    if (data.hasOwnProperty('address') && data.address.hasOwnProperty('address_id')) {
      addressId = data.address['address_id']
      // If the customer object was returned from default api services (legacy), it will be provided as an id
    } else if (data.hasOwnProperty('address_id')) {
      addressId = data['address_id']
    }

    if (!isNaN(addressId)) {
      // Fetch...
      axios({
        url: QC_RESOURCE_API + 'address/' + addressId,
        method: 'GET', //dataType: 'json',
        contentType: 'application/json'
      })
        .then(response => {
          let payload = response.data

          // Set the customer
          this.actions.customer.setCustomer(data)

          // Resource API data is wrapped in a data object                
          this.actions.customer.setBillingAddress({
            addresses: [payload.data],
            billingAddressId: addressId,
            billingAddress: payload.data
          })

          this.actions.customer.setShippingAddress({
            addresses: [payload.data],
            shippingAddressId: addressId,
            shippingAddress: payload.data
          })
        }).catch(err => {
        // Do nothing, not a deal-breakeThere r if we couldn't grab an address
          console.log(err)

          // TODO: Notify user

          this.actions.customer.setCustomer(data)
        })

    } else {
      this.actions.customer.setCustomer(data)
      // TODO: Clear addresses explicitly
    }
  }

  /**
   * Retrieves a Customer.
   */
  get(id, onSuccess, onError) {
    // Get the account
    axios({
      url: UrlHelper.compile(CUSTOMER, { id: id }),
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      async: false
    }).then(response => {
      this.handleResponse(response, // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount() 
        }).bind(this), // Use legacy API compatibility
        true)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  getSummary(id, onSuccess, onError) {
    // Get the account
    axios({
      url: UrlHelper.compile(CUSTOMER_SUMMARY, { id: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET'
    }).then(response => {
      this.handleResponse(response, // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this), // Use legacy API compatibility
        true)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  /**
   * Retrieves a Product's life history.
   * This (currently not an) override returns a payload with registration, repair,
   * estimate and odometer histories, as well as wholesale lot tags (if they exist).
   */
  getHistory(id, onSuccess, onError) {
    // Get the account
    axios({
      url: UrlHelper.compile(CUSTOMER_HISTORY, { id: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET'
    }).then(response => {
      this.handleResponse(response, // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this), // Use legacy API compatibility
        true)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  getDeals(customerId, onSuccess, onError) {
    // Get the account
    axios({
      url: UrlHelper.compile(CUSTOMER_DEALS, { customerId: customerId }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET'
    }).then(response => {
      this.handleResponse(response, // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this), // Use legacy API compatibility
        true)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  fetchDeals(customerId, onSuccess, onError) {
    this.getDeals(customerId, // onSuccess
      ((payload) => {
        let data = payload

        this.actions.customer.setCustomerDeals(customerId, data)

        if (typeof onSuccess === 'function') {
          onSuccess(data)
        }
      }).bind(this), onError)
  }

  getPhotos(id, onSuccess, onError) {
    // Get the account
    axios({
      url: UrlHelper.compile(CUSTOMER_PROFILE_IMAGE, { id: id }),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET'
    }).then(response => {
      this.handleResponse(response, // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this), // Use legacy API compatibility
        true)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  /**
   * Retrieves a Customer and saves a local copy in CustomerStore.
   */
  fetch(id, onSuccess, onError) {
    this.get(id, // onSuccess
      ((payload) => {
        let data = payload

        this.actions.customer.setCustomer(id, data)

        if (typeof onSuccess === 'function') {
          onSuccess(data)
        }
      }).bind(this), onError)
  }

  fetchSummary(id, onSuccess, onError) {
    this.getSummary(id, // onSuccess
      ((payload) => {
        let data = payload

        this.actions.customer.setCustomerSummary(id, data)

        if (typeof onSuccess === 'function') {
          onSuccess(data)
        }
      }).bind(this), onError)
  }

  fetchHistory(id, onSuccess, onError) {
    this.getHistory(id, // onSuccess
      ((payload) => {
        let data = payload

        this.actions.customer.setCustomerHistory(id, data)

        if (typeof onSuccess === 'function') {
          onSuccess(data)
        }
      }).bind(this), onError)
  }

  /**
   * Creates a new Customer.
   */
  post(formData, onSuccess, onError) {
    let customerStore = this.stores.customer

    let data = assign({}, customerStore.customer, {})

    // Wrap the object
    data = {customer: data}

    axios({
      url: UrlHelper.compile(CUSTOMERS),
      data: data,
      dataType: 'json',
      method: 'POST',
      contentType: 'application/json'
    }).then(response => {
      this.handleResponse(response, onSuccess, onError)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  put(formData, onSuccess, onError) {
    let customerStore = this.stores.customer

    let data = assign({}, customerStore.customer, formData)

    if (this.validateId(data.id)) {
      axios({
        url: UrlHelper.compile(CUSTOMER, { id: data.id }),
        data: data,
        dataType: 'json',
        contentType: 'application/json',
        method: 'PUT'
      }).then(response => {
        this.handleResponse(response, onSuccess, onError)
      }).catch(err => {
        let customMessage = err.message
        this.handleError(err, onError, customMessage)
      })
    }
  }

  patch(formData, onSuccess, onError) {
    let customerStore = this.stores.customer

    let data = assign({}, customerStore.customer, formData)

    if (this.validateId(data.id)) {
      axios({
        url: UrlHelper.compile(CUSTOMER, { id: data.id }),
        data: data,
        dataType: 'json',
        contentType: 'application/json',
        method: 'PATCH'
      }).then(response => {
        this.handleResponse(response, onSuccess, onError)
      }).catch(err => {
        let customMessage = err.message
        this.handleError(err, onError, customMessage)
      })
    }
  }

  delete(id, onSuccess, onError) {
  }

  addOtherIncome(customerId, data, onSuccess, onError) {
    let customerStore = this.stores.customer

    data = assign({}, customerStore.customer, {})

    data = {customer: data}

    axios({
      url: UrlHelper.compile(CUSTOMER_OTHER_INCOME, { customerId: customerId }),
      data: data,
      dataType: 'json',
      method: 'POST',
      contentType: 'application/json'
    }).then(response => {
      this.handleResponse(response, onSuccess, onError)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  updateOtherIncome() {
  }

  deleteOtherIncome() {
  }

  addAsset(customerId, data, onSuccess, onError) {
    let customerStore = this.stores.customer

    data = assign({}, customerStore.customer, {})

    data = {customer: data}

    axios({
      url: UrlHelper.compile(CUSTOMER_ASSETS, { customerId: customerId }),
      data: data,
      dataType: 'json',
      method: 'POST',
      contentType: 'application/json'
    }).then(response => {
      this.handleResponse(response, onSuccess, onError)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  updateAsset() {
  }

  deleteAsset() {
  }

  addLiability(customerId, data, onSuccess, onError) {
    let customerStore = this.stores.customer

    data = assign({}, customerStore.customer, {})

    data = {customer: data}

    axios({
      url: UrlHelper.compile(CUSTOMER_LIABILITIES, { customerId: customerId }),
      data: data,
      dataType: 'json',
      method: 'POST',
      contentType: 'application/json'
    }).then(response => {
      this.handleResponse(response, onSuccess, onError)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  updateLiability() {
  }

  deleteLiability() {
  }

  addEmploymentRecord(customerId, data, onSuccess, onError) {
    let customerStore = this.stores.customer

    data = assign({}, customerStore.customer, {})

    data = {customer: data}

    axios({
      url: UrlHelper.compile(CUSTOMER_EMPLOYMENT_HISTORY, { customerId: customerId }),
      data: data,
      dataType: 'json',
      method: 'POST',
      contentType: 'application/json'
    }).then(response => {
      this.handleResponse(response, onSuccess, onError)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  updateEmploymentRecord() {
  }

  deleteEmploymentRecord() {
  }

  addResidentialRecord(customerId, data, onSuccess, onError) {
    let customerStore = this.stores.customer

    data = assign({}, customerStore.customer, {})

    data = {customer: data}

    axios({
      url: UrlHelper.compile(CUSTOMER_RESIDENCE_HISTORY, { customerId: customerId }),
      data: data,
      dataType: 'json',
      method: 'POST',
      contentType: 'application/json'
    }).then(response => {
      this.handleResponse(response, onSuccess, onError)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  updateResidentialRecord() {
  }

  deleteResidentialRecord() {
  }

  /**
   */
  getCollection(onSuccess, onError) {
    // Get the account
    axios({
      url: UrlHelper.compile(CUSTOMERS),
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      method: 'GET'
    }).then(response => {
      this.handleResponse(response, // onSuccess
        ((payload) => {
          if (typeof onSuccess === 'function') {
            onSuccess(payload)
          }
        }).bind(this), // Bind to current context
        // onError - fail silently
        (() => {
          //this.refetchAccount()
        }).bind(this), // Use legacy API compatibility
        true)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  /**
   * Retrieves Customers and saves a local copy in CustomerStore.
   */
  fetchCollection(onSuccess, onError) {
    this.getCollection(((payload) => {
      this.actions.customer.setCustomers(payload)

      if (typeof onSuccess === 'function') {
        onSuccess(payload)
      }
    }).bind(this), onError)
  }

  /**
   * Searches for Customers and saves a local copy of the results in CustomerStore.
   */
  searchCollection(onSuccess, onError) {
    this.search(((payload) => {
      this.actions.customer.setCustomers(payload)

      if (typeof onSuccess === 'function') {
        onSuccess(payload)
      }
    }).bind(this), onError)
  }

  search(onSuccess, onError) {
    axios(config.src.transport.read)
      .then(response => {
        let payload = response.data
        let normalizedData = normalize(payload.content, config.schema)

        let results = []

        // Normalize our data and store the items
        if (typeof key === 'string' && key !== '') {
          results[key] = Object.keys(normalizedData.result).map(key => {
            let item = normalizedData.result[key]

            // TODO: Maybe there's a better way to clean/decode item names
            // Clean/decode name
            let elem = document.createElement('textarea')
            elem.innerHTML = item.name
            item.name = elem.value

            return item
          })
        } else {
          // Set to root
          results = Object.keys(normalizedData.result).map(key => normalizedData.result[key])
        }

        // CustomerService.actions.setCustomers
        this.actions.customer.setCustomers({
          // TODO: Transform the data correctly, just getting things displaying again for now
          content: results.customers // TODO: Page-size, filters, etc
        })

        if (typeof onSuccess === 'function') {
          onSuccess()
        }
      }).catch(err => {
        if (typeof onError === 'function') {
          onError(err)
        }
      // Only if sample data is loaded...
      //let normalizedData = normalize(SampleItems.data, that.config.schema)
      //this.items = Object.keys(normalizedData.result).map(key => normalizedData.result[key])
      })
  }

}

CustomerService.primaryKey = 'customerId'

export default CustomerService
export { CustomerService }
