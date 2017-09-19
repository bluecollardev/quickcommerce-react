import ProductConstants from '../constants/ProductConstants.jsx';
import BaseStore from './BaseStore.jsx'
//import jwt_decode from 'jwt-decode'

class ProductStore extends BaseStore {
    constructor() {
        super()
        
        // Just monkey patch the parent method
        this.subscribe(() => this.registerToActions.bind(this))
        
        if (typeof localStorage.getItem('selectedProduct') === 'string') {
            this.product = JSON.parse(localStorage.getItem('selectedProduct'))
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
                }
                
                this.emitChange()
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
                sessionStorage.setItem('selectedProduct', JSON.stringify(this.product))
                
                console.log('setting product')
                console.log(action.product)
                this.emitChange()
                break
            default:
                break
        }
    }
    
    getProduct() {
        return {
            product: this.product
        }
    }
}

ProductStore.product = null

export default new ProductStore()
