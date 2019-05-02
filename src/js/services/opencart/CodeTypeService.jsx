import axios from 'axios'

import { BaseService } from './BaseService.jsx'

export class CodeTypeService extends BaseService {
  /**
   * Override parent implementation.
   */
  get(id, onSuccess, onError) {
    axios({
      url: '',
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
      this.handleError(err.message, onError, err.stack)
    })
  }

  /**
   * Get the entity and execute a callback / set to store.
   */
  fetch(id, onSuccess, onError) {
    this.get(id, // onSuccess
      ((payload) => {
        let data = payload

        // Do something

        if (typeof onSuccess === 'function') {
          onSuccess(data)
        }
      }).bind(this), onError)
  }

  /**
   * Override parent implementation.
   */
  post(data, onSuccess, onError) {
    /* Example converting payload to camelcase
     data = {
     detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
     }*/

    axios({
      url: '',
      data: data,
      dataType: 'json',
      method: 'PATCH',
      contentType: 'application/json'
    }).then(response => {
      this.handleResponse(response, onSuccess, onError)
    }).catch(err => {
      this.handleError(err.message, onError, err.stack)
    })
  }

  /**
   * Override parent implementation.
   */
  put(data, onSuccess, onError) {
    /* Example converting payload to camelcase
     data = {
     detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
     }*/

    let id = data.id
    if (typeof id === 'undefined' || isNaN(id)) {
      throw new Error('Invalid ID: supplied value must be an integer!')
    } else {
      id = parseInt(id)
    }

    if (id !== null) {
      axios({
        url: '',
        data: data,
        method: 'PATCH',
        dataType: 'json',
        contentType: 'application/json'
      }).then(response => {
        this.handleResponse(response, onSuccess, onError)
      }).catch(err => {
        this.handleError(err.message, onError, err.stack)
      })
    }
  }

  /**
   * Override parent implementation.
   */
  patch(data, onSuccess, onError) {
    /* Example converting payload to camelcase
     data = {
     detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
     }*/

    let id = data.id
    if (typeof id === 'undefined' || isNaN(id)) {
      throw new Error('Invalid ID: supplied value must be an integer!')
    } else {
      id = parseInt(id)
    }

    if (id !== null) {
      axios({
        url: '',
        data: data,
        method: 'PATCH',
        dataType: 'json',
        contentType: 'application/json'
      }).then(response => {
        this.handleResponse(response, onSuccess, onError)
      }).catch(err => {
        this.handleError(err.message, onError, err.stack)
      })
    }
  }

  /**
   * Override parent implementation.
   */
  delete(id) {
  }
}

export default new CodeTypeService()
