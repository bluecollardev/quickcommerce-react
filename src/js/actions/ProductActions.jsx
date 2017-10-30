import AppDispatcher from '../dispatcher/AppDispatcher.jsx'
import ProductConstants from '../constants/ProductConstants.jsx'

export default {
    setProduct: (data) => {
        AppDispatcher.dispatch({
            actionType: ProductConstants.SET_PRODUCT,
            product: data
        })
        
        /*this.setState({
            logged: true,
            displayName: (
                typeof data !== 'undefined' && 
                typeof data['display_name'] === 'string') ? data['display_name'] : '',
            fullName: [data['firstname'], data['middlename'], data['lastname']].join(' ')
        })*/
    },
    updateProduct: (data) => {
        AppDispatcher.dispatch({
            actionType: ProductConstants.UPDATE_PRODUCT,
            product: data
        })
        
        /*this.setState({
            logged: true,
            displayName: (
                typeof data !== 'undefined' && 
                typeof data['display_name'] === 'string') ? data['display_name'] : '',
            fullName: [data['firstname'], data['middlename'], data['lastname']].join(' ')
        })*/
    }
}