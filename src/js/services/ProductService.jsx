import assign from 'object-assign'

import axios from 'axios'

import { BaseService } from './BaseService.jsx'

import ArrayHelper from 'quickcommerce-react/helpers/Array.js'
import ObjectHelper from 'quickcommerce-react/helpers/Object.js'
import StringHelper from 'quickcommerce-react/helpers/String.js'

class ProductService extends BaseService {
    /**
	 * Retrieves a Product.
     * Override parent implementation.
	 */
    get(id, onSuccess, onError) {
        // Get the account
        axios({
            url: INDIGO_BASE_URI + COMMON_INVENTORY + id,
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
    
    post(data, onSuccess, onError) {
        /* Example converting payload to camelcase
        data = {
            detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
        }*/
        
        axios({
            url: INDIGO_BASE_URI + COMMON_INVENTORY + id,
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
    
    put(data, onSuccess, onError) {
        /* Example converting payload to camelcase
        data = {
            detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
        }*/
        
        if (data.id !== null) {
            axios({
                url: INDIGO_BASE_URI + COMMON_INVENTORY + id,
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
     * Override parent implementation.
     */
    patch(data, onSuccess, onError) {
        /* Example converting payload to camelcase
        data = {
            detailObj: this.normalizePayload(data, 'underscore', 'camelcase')
        }*/
        
        if (data.id !== null) {
            axios({
                url: INDIGO_BASE_URI + COMMON_INVENTORY + id,
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
     * Override parent implementation.
     */
    delete(id, onSuccess, onError) {
    }
}

export default ProductService