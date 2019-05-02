import assign from 'object-assign'

import ProductConstants from '../constants/ProductConstants.jsx'

import BaseStore from './BaseStore.jsx'
//import jwt_decode from 'jwt-decode'

class ProductStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher)
        
       
        this.subscribe(() => this.registerToActions.bind(this))
        
        if (typeof localStorage.getItem('selectedProduct') === 'string') {
            this.product = JSON.parse(localStorage.getItem('selectedProduct'))
            this.options = (this.product['option'] instanceof Array) ? this.product['option'] : []
        }
    }

    registerToActions(action) {
        switch (action.actionType) {
            case ProductConstants.CREATE_PRODUCT:
                this.emitChange()
                
                break
            case ProductConstants.GET_PRODUCT:
                if (typeof localStorage.getItem('selectedProduct') === 'string') {
                    this.product = JSON.parse(localStorage.getItem('selectedProduct'))
                    this.options = (this.product['option'] instanceof Array) ? this.product['option'] : []
                }
                
                break
            case ProductConstants.UPDATE_PRODUCT:
                this.product = action.product
                
                this.emitChange()
                
                break
            case ProductConstants.DELETE_PRODUCT:
                this.emitChange()
                
                break
            case ProductConstants.SET_PRODUCT:
                this.product = action.product
                this.options = (action.product['option'] instanceof Array) ? action.product['option'] : []
                
                sessionStorage.setItem('selectedProduct', JSON.stringify(this.product))
                
                this.emitChange()
                
                break
			case ProductConstants.SET_PRODUCTS:
                break
            default:
                break
        }
    }
    
    getProductOptions() {
        let options = this.options || []
        
        return options
    }
    
    getProduct() {
        return this.product
    }
    
    getProductOptionValues(productOptionId) {
        let values = []
        
        let productOption = this.options.filter(option => {
            return option['product_option_id'] === productOptionId
        })
        
        if (productOption.length === 1) {
            values = productOption[0]['product_option_values']
        }
        
        return values
    }
    
    getOption(productOptionId) {
        let productOption = this.options.filter(option => {
            return option['product_option_id'] === productOptionId
        })
        
        if (productOption.length === 1) {
            return productOption.option
        }
    }
}

ProductStore.product = null

export default ProductStore
export { ProductStore }
