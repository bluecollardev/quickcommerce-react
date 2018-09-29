import assign from 'object-assign'

import BrowserConstants from './BrowserConstants.jsx'
// Pre-configured step types
//import CategoryStep from '../steps/Category.jsx'
//import ProductStep from '../steps/Product.jsx'
//import ProductImageStep from '../steps/ProductImage.jsx'
//import ProductOptionStep from '../steps/ProductOption.jsx'
//import TopCategoryStep from '../steps/TopCategory.jsx'
//import BrowserStore from '../stores/BrowserStore.jsx'
//import ProductDateTimeStep from '../steps/ProductDateTime.jsx'
//import ProductQuantityStep from '../steps/ProductQuantity.jsx'

// Action creator
// Set local and/or session storage here as there's no browser service
export default (dispatcher) => {
  return {
    loadCategories: () => {
      dispatcher.dispatch({
        actionType: BrowserConstants.LOAD_CATEGORY,
        config: {}
      })
    },
    loadTopCategories: () => {
      dispatcher.dispatch({
        actionType: BrowserConstants.LOAD_CATEGORY,
        config: {}
      })
    },
    searchCategories: (query) => {
      query = query || {} // Don't fail client-side

      dispatcher.dispatch({
        actionType: BrowserConstants.SEARCH_CATEGORY,
        config: {}
      })
    },
    loadProducts: (id) => {
      id = id || null

      dispatcher.dispatch({
        actionType: BrowserConstants.LOAD_PRODUCT,
        config: {}
      })
    },
    searchProducts: (query) => {
      query = query || {} // Don't fail client-side

      dispatcher.dispatch({
        actionType: BrowserConstants.SEARCH_PRODUCT,
        config: {}
      })
    },
    loadProductExtendedInfo: (item) => {
      // Just return the items, no need to trigger any events
      //return BrowserStore.getCategories()
      //console.log('BrowserActions.loadProductExtendedInfo has not yet been implemented.')
      // Leave it up to the store implementation to decide how do deal with the item
      /*dispatcher.dispatch({
       actionType: BrowserConstants.LOAD_PRODUCT_EXTENDED,
       config: assign({}, ProductStep),
       product: assign({}, item)
       })*/
    },
    loadProductImages: (item, idProp, orderId) => {
      //console.log('BrowserActions.loadProductImages is not functional.')
      // Leave it up to the store implementation to decide how do deal with the item
      dispatcher.dispatch({
        actionType: BrowserConstants.LOAD_PRODUCT_IMAGES,
        config: {}
      })
    },
    loadOptions: (item) => {
      // TODO: Replace with mapping!?
      let options = (item['option'] instanceof Array) ? item['option'] : []

      dispatcher.dispatch({
        actionType: BrowserConstants.LOAD_OPTION,
        config: {},
        loaded: true // Set loaded flag to true
      })
    },
    getItems: () => {
      // Just return the items, no need to trigger any events
      //return BrowserStore.getItems()
      throw new Error('BrowserActions.getItems was a temporary workaround and has been removed - actions shouldn\'t inherently know anything about stores.')
    },
    getCategories: () => {
      // Just return the items, no need to trigger any events
      //return BrowserStore.getCategories()
      throw new Error('BrowserActions.getCategories was a temporary workaround and has been removed - actions shouldn\'t inherently know anything about stores.')
    },
    getOptions: () => {
      // Just return the items, no need to trigger any events
      //return BrowserStore.getOptions()
      throw new Error('BrowserActions.getOptions was a temporary workaround and has been removed - actions shouldn\'t inherently know anything about stores.')
    },
    getCurrentStep: () => {
      // Just return the items, no need to trigger any events
      //return BrowserStore.getConfig()
      throw new Error('BrowserActions.getCurrentStep was a temporary workaround and has been removed - actions shouldn\'t inherently know anything about stores.')
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
