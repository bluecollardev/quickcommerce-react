import assign from 'object-assign'

import AppDispatcher from '../dispatcher/AppDispatcher.jsx'
import BrowserConstants from '../constants/BrowserConstants.jsx'
import BrowserStore from '../stores/BrowserStore.jsx'

// Pre-configured step types
import CategoryStep from '../steps/Category.jsx'
import ProductStep from '../steps/Product.jsx'
import ProductOptionStep from '../steps/ProductOption.jsx'
//import ProductDateTimeStep from '../steps/ProductDateTime.jsx'
//import ProductQuantityStep from '../steps/ProductQuantity.jsx'

// Action creator
// Set local and/or session storage here as there's no browser service
export default {
    loadCategories: () => {
        AppDispatcher.dispatch({
            actionType: BrowserConstants.LOAD_CATEGORY,
            config: assign({}, CategoryStep)
        })
    },
    loadProducts: (id) => {
        id = id || null

        AppDispatcher.dispatch({
            actionType: BrowserConstants.LOAD_PRODUCT,
            config: assign({}, ProductStep),
            category: id
        })
    },
    loadOptions: (item) => {
        AppDispatcher.dispatch({
            actionType: BrowserConstants.LOAD_OPTION,
            config: assign({}, ProductOptionStep),
            product: assign({}, item),
            options: assign({}, item.options), // Option data already loaded as part of product fetch
            loaded: true // Set loaded flag to true
        })
    },
    getItems: () => {
        // Just return the items, no need to trigger any events
        return BrowserStore.getItems()
    },
    getCategories: () => {
        // Just return the items, no need to trigger any events
        return BrowserStore.getCategories()
    },
    getOptions: () => {
        // Just return the items, no need to trigger any events
        return BrowserStore.getOptions()
    },
    getCurrentStep: () => {
        // Just return the items, no need to trigger any events
        return BrowserStore.getConfig()
    }
    /*loadDateTimeOption: () => {
        AppDispatcher.dispatch({
            actionType: BrowserConstants.LOAD_DATE,
            config: ProductDateTimeStep
        })
    },
    loadQuantity: () => {
        AppDispatcher.dispatch({
            actionType: BrowserConstants.LOAD_QUANTITY,
            config: ProductQuantityStep
        })
    }*/
}
