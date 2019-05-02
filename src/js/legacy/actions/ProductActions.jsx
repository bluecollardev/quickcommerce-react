import ProductConstants from '../constants/ProductConstants.jsx'

export default (dispatcher) => {
    return {
        setProduct: (data) => {
            dispatcher.dispatch({
                actionType: ProductConstants.SET_PRODUCT,
                product: data
            })
        },
		setProducts: (data) => {
            dispatcher.dispatch({
                actionType: ProductConstants.SET_PRODUCTS,
                products: data
            })
        },
        updateProduct: (data) => {
            dispatcher.dispatch({
                actionType: ProductConstants.UPDATE_PRODUCT,
                product: data
            })
        }
    }
}