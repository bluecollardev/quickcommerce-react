import assign from 'object-assign'

import BrowserConstants from '../constants/BrowserConstants.jsx'
//import BrowserStore from '../stores/BrowserStore.jsx'

// Pre-configured step types
import CategoryStep from '../steps/Category.jsx'
import TopCategoryStep from '../steps/TopCategory.jsx'
import ProductStep from '../steps/Product.jsx'
import ProductOptionStep from '../steps/ProductOption.jsx'
//import ProductDateTimeStep from '../steps/ProductDateTime.jsx'
//import ProductQuantityStep from '../steps/ProductQuantity.jsx'

// Action creator
// Set local and/or session storage here as there's no browser service
export default (dispatcher) => {
    return {
        loadCategories: () => {
            dispatcher.dispatch({
                actionType: BrowserConstants.LOAD_CATEGORY,
                config: assign({}, CategoryStep)
            })
        },
        loadTopCategories: () => {
            dispatcher.dispatch({
                actionType: BrowserConstants.LOAD_CATEGORY,
                config: assign({}, TopCategoryStep)
            })
        },
        loadProducts: (id) => {
            id = id || null

            dispatcher.dispatch({
                actionType: BrowserConstants.LOAD_PRODUCT,
                config: assign({}, ProductStep),
                category: id
            })
        },
        loadOptions: (item) => {
            // TODO: Replace with mapping!
            let options = (item['option'] instanceof Array) ? item['option'] : []
            
            dispatcher.dispatch({
                actionType: BrowserConstants.LOAD_OPTION,
                config: assign({}, ProductOptionStep),
                product: assign({}, item),
                options: options, // Option data already loaded as part of product fetch
                loaded: true // Set loaded flag to true
            })
        },
        // TODO: Don't use getters for now, BrowserStore and BrowserActions probably need to be decoupled
        getItems: () => {
            // Just return the items, no need to trigger any events
            //return BrowserStore.getItems()
            throw new Error("BrowserActions.getItems was a temporary workaround and has been removed - actions shouldn't inherently know anything about stores.")
        },
        getCategories: () => {
            // Just return the items, no need to trigger any events
            //return BrowserStore.getCategories()
            throw new Error("BrowserActions.getCategories was a temporary workaround and has been removed - actions shouldn't inherently know anything about stores.")
        },
        getOptions: () => {
            // Just return the items, no need to trigger any events
            //return BrowserStore.getOptions()
            throw new Error("BrowserActions.getOptions was a temporary workaround and has been removed - actions shouldn't inherently know anything about stores.")
        },
        getCurrentStep: () => {
            // Just return the items, no need to trigger any events
            //return BrowserStore.getConfig()
            throw new Error("BrowserActions.getCurrentStep was a temporary workaround and has been removed - actions shouldn't inherently know anything about stores.")
            // TODO: Remove this!
        }
        /*loadDateTimeOption: () => {
            dispatcher.dispatch({
                actionType: BrowserConstants.LOAD_DATE,
                config: ProductDateTimeStep
            })
        },
        loadQuantity: () => {
            dispatcher.dispatch({
                actionType: BrowserConstants.LOAD_QUANTITY,
                config: ProductQuantityStep
            })
        }*/
    }
}
