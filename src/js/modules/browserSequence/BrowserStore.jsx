import assign from 'object-assign'

import AbstractBrowserStore from './AbstractBrowserStore.jsx'

class BrowserStore extends AbstractBrowserStore {
  // BrowserStore constructor
  constructor(dispatcher) {
    super()

    this.stepForward = false
    this.config = null

    this.dispatcher = dispatcher

    this.items = {}

    this.subscribe(() => this.registerToActions.bind(this))
  }

  hasItems() {
    let config = this.config || null

    if (config !== null && this.config.hasOwnProperty('key')) {
      if (typeof this.config.key === 'string') {
        return this.has(this.config.key)
      }
    } else {
      return this.has('products')
    }

    return false
  }

  getItems(resolveCodeTypes) {
    resolveCodeTypes = resolveCodeTypes || false

    let items = []

    if (resolveCodeTypes && this.hasItems()) {
      // Map, but don't return - we don't want to mutate data in the store
      this.items['products'].map((item, idx) => {
        let clonedItem = assign({}, item) // Clone the item - we don't want to mutate data in the store
        items[idx] = BrowserStore.resolveCodeTypes(clonedItem, BaseCollectionStore.CODETYPE_NAME) // Base method
      })
    } else if (this.hasItems()) {
      items = this.items['products']
    }

    return items
  }

  getItemAtIndex(idx) {
    return this.items['products'][idx]
  }

  getItemImages(item, resolveCodeTypes) {
    resolveCodeTypes = resolveCodeTypes || false

    let images = []

    if (resolveCodeTypes && this.hasItems()) {
      // Map, but don't return - we don't want to mutate data in the store
      this.items['images'].map((item, idx) => {
        let clonedItem = assign({}, item) // Clone the item - we don't want to mutate data in the store
        images[idx] = BrowserStore.resolveCodeTypes(clonedItem, BaseStore.CODETYPE_NAME) // Base method
      })
    } else if (this.hasItems()) {
      images = this.items['images']
    }

    return images
  }

  getCategories() {
    return this.items['categories']
  }

  getOptions() {
    return this.items['options']
  }

  getProductOptions() {
    return this.getOptions()
  }

  getProductOptionValues(productOptionId) {
    let values = []

    let productOption = this.items['options'].filter(option => {
      return option['product_option_id'] === productOptionId
    })

    if (productOption.length === 1) {
      values = productOption[0]['product_option_values']
    }

    return values
  }

  getOption(productOptionId) {
    let productOption = this.items['options'].filter(option => {
      return option['product_option_id'] === productOptionId
    })

    if (productOption.length === 1) {
      return productOption.option
    }
  }
}

export default BrowserStore
export { BrowserStore }
