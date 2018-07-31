import axios from 'axios'

import { BaseService } from './BaseService.jsx'

class ProductService extends BaseService {
  /**
   * Retrieves a Product.
   */
  get(id, onSuccess, onError) {
    axios({
      url: QC_RESOURCE_API + 'product/' + id,
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

  getCollection(onSuccess, onError) {
    axios({
      url: QC_RESOURCE_API + 'product/',
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

  /**
   * Retrieves a Product and saves a local copy in ProductStore.
   */
  fetch(id, onSuccess, onError) {
    this.get(id, // onSuccess
      ((payload) => {
        let data = payload

        this.actions.product.setProduct(data)

        if (typeof onSuccess === 'function') {
          onSuccess(data)
        }
      }).bind(this), onError)
  }

  /**
   * Retrieves Products and saves a local copy in ProductStore.
   */
  fetchCollection(onSuccess, onError) {
    this.getCollection(((payload) => {
      let data = payload

      this.actions.product.setProducts(data)

      if (typeof onSuccess === 'function') {
        onSuccess(data)
      }
    }).bind(this), onError)
  }

  /**
   */
  post(data, onSuccess, onError) {
    /* Example converting payload to camelcase
     data = {
     detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
     }*/

    axios({
      url: QC_RESOURCE_API + 'product/' + id,
      data: data,
      dataType: 'json',
      method: 'PATCH',
      contentType: 'application/json'
    }).then(response => {
      this.handleResponse(response, onSuccess, onError)
    }).catch(err => {
      let customMessage = err.message
      this.handleError(err, onError, customMessage)
    })
  }

  /**
   */
  put(data, onSuccess, onError) {
    /* Example converting payload to camelcase
     data = {
     detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
     }*/

    if (data.id !== null) {
      axios({
        url: QC_RESOURCE_API + 'product/' + id,
        data: data,
        method: 'PATCH',
        dataType: 'json',
        contentType: 'application/json'
      }).then(response => {
        this.handleResponse(response, onSuccess, onError)
      }).catch(err => {
        let customMessage = err.message
        this.handleError(err, onError, customMessage)
      })
    }
  }

  /**
   */
  patch(data, onSuccess, onError) {
    /* Example converting payload to camelcase
     data = {
     detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
     }*/

    if (data.id !== null) {
      axios({
        url: QC_RESOURCE_API + 'product/' + id,
        data: data,
        method: 'PATCH',
        dataType: 'json',
        contentType: 'application/json'
      }).then(response => {
        this.handleResponse(response, onSuccess, onError)
      }).catch(err => {
        let customMessage = err.message
        this.handleError(err, onError, customMessage)
      })
    }
  }

  /**
   */
  delete(id, onSuccess, onError) {
  }
}

export default ProductService
