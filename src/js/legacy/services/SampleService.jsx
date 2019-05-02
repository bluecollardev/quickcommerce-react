import assign from 'object-assign'
import axios from 'axios'

import ArrayHelper from 'quickcommerce-react/helpers/Array.js'
import ObjectHelper from 'quickcommerce-react/helpers/Object.js'
import StringHelper from 'quickcommerce-react/helpers/String.js'

export class SampleService extends BaseService {
    /**
     * Override parent implementation.
     */
    onSuccess() {
    }
    
    /**
     * Override parent implementation.
     */
    get(id, onSuccess, onError) {
        axios({
            url: ''
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            async: false
        }).then(response => {
            if (response.success || response.status === 200) {
                if (response.hasOwnProperty('data')) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data)
                    }
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data)
                    }
                }
            } else {
                if (typeof onError === 'function') {
                    onError(response)
                }
            }
        }).catch(err => {
            this.handleError('', onError, err)
        })
    }
    
    /**
     * Get the entity and execute a callback / set to store.
     */
    fetch(id, onSuccess, onError) {
        axios({
            url: '',
            method: 'GET'
        }).then(response => {
            if (response.success || response.status === 200) {
                if (response.hasOwnProperty('data')) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data)
                    }
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data)
                    }
                }
            } else {
                if (typeof onError === 'function') {
                    onError(response)
                }
            }
        }).catch(err => {
            this.handleError('', onError, err)
        })
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
            if (response.success || response.status === 200) {
                if (response.hasOwnProperty('data')) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data)
                    }
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data)
                    }
                }
            } else {
                if (typeof onError === 'function') {
                    onError(response)
                }
            }
        }).catch(err => {
            this.handleError('', onError, err)
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
        
        if (data.id !== null) {
            axios({
                url: '',
                data: data,
                method: 'PATCH',
                dataType: 'json',
                contentType: 'application/json'
            }).then(response => {
                if (response.success || response.status === 200) {
                    if (response.hasOwnProperty('data')) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(response.data)
                        }
                    } else {
                        if (typeof onSuccess === 'function') {
                            onSuccess(response.data)
                        }
                    }
                } else {
                    if (typeof onError === 'function') {
                        onError(response)
                    }
                }
            }).catch(err => {
                this.handleError('', onError, err)
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
        
        if (data.id !== null) {
            axios({
                url: '',
                data: data,
                method: 'PATCH',
                dataType: 'json',
                contentType: 'application/json'
            }).then(response => {
                if (response.success || response.status === 200) {
                    if (response.hasOwnProperty('data')) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(response.data)
                        }
                    } else {
                        if (typeof onSuccess === 'function') {
                            onSuccess(response.data)
                        }
                    }
                } else {
                    if (typeof onError === 'function') {
                        onError(response)
                    }
                }
            }).catch(err => {
                this.handleError('', onError, err)
            })       
        }
    }
    
    /**
     * Override parent implementation.
     */
    delete(id) {
    }
}

export default SampleService
