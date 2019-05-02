import assign from 'object-assign'

import axios from 'axios'

import { BaseService } from './BaseService.jsx'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'

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
            this.handleError('', onError, err)
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
            this.handleError('', onError, err)
        })
	}
    
    /**
	 * Retrieves a Product and saves a local copy in ProductStore.
     */
    fetch(id, onSuccess, onError) {
        this.get(id, 
		// onSuccess
		((payload) => {
			let data = payload
                
			this.actions.product.setProduct(data)
			
			if (typeof onSuccess === 'function') {
				onSuccess(data)
			}
		}).bind(this),
		onError)
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
            this.handleError('', onError, err)
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
				this.handleError('', onError, err)
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
				this.handleError('', onError, err)
			})       
        }
    }
    
    /**
     */
    delete(id, onSuccess, onError) {
    }
}

export default ProductService