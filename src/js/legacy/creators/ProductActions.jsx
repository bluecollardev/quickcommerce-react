import ProductConstants from '../constants/ProductConstants.jsx'

export default (dispatcher) => {
    return {
        setProduct: (data) => {
            dispatcher.dispatch({
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
            dispatcher.dispatch({
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
}