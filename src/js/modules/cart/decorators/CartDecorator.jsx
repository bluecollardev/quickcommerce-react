/**
 * Provides abstract methods. More documentation to come.
 *
 * @param WrappedComponent
 * @returns {*}
 */
function enhancer(WrappedComponent) {
  /**
   * It doesn't matter what the wrapped component is - to have access to mappings,
   * it has to be wrapped in a mobx 'Injector'. There's a more dependable way to do this using
   * the commented out imports above (unwrapComponent, resolveComponent), but it still needs work.
   */
  let wrappedComponent = WrappedComponent.wrappedComponent

  Object.defineProperties(wrappedComponent.prototype, {
    loadCartItems: {
      value: function () {
        console.log('CartDecorator.loadCartItems')
      },
      writable: true,
      configurable: false
    },
    /**
     * @param itemId
     * @param quantity
     * @param item
     */
    onItemAdded: {
      value: function (itemId, quantity, item) {
        console.log('CartDecorator.onItemAdded')
      },
      writable: true,
      configurable: false
    },
    /**
     * @param item
     * @param quantity
     * @param oldQuantity
     */
    onItemChanged: {
      value: function(item, quantity, oldQuantity) {
        console.log('CartDecorator.onItemChanged')
      },
      writable: true,
      configurable: false
    },
    /**
     * @param option
     * @param quantity
     * @param item
     * @param oldQuantity
     */
    onProductOptionsChanged: {
      value: function(option, quantity, item, oldQuantity) {
        console.log('CartDecorator.onProductOptionChanged')
      },
      writable: true,
      configurable: false
    },
    /**
     * @param item
     */
    onItemRemoved: {
      value: function(item) {
        console.log('CartDecorator.onItemRemoved')
      },
      writable: true,
      configurable: false
    },
    onCartReset: {
      value: function() {
        const { orderService } = this.props

        console.log('CartDecorator.onCartReset')
        orderService.clearOrder()
      },
      writable: true,
      configurable: false
    },
    onCartCleared: {
      value: function() {
        console.log('clearing checkout store - cart was checked-out')

        const { orderService } = this.props
        // Don't reset, which deletes order, just create a new order
        orderService.createOrder({ action: 'insert' })
      },
      writable: true,
      configurable: false
    },
    /**
     * @param notes
     */
    updateNotes: {
      value: function(notes) {
        const { orderStore } = this.props

        this.setState({ notes: notes }, () => {
          orderStore.setNotes(notes)
        })
      },
      writable: true,
      configurable: false
    }
  })

  WrappedComponent.wrappedComponent = wrappedComponent

  // Return the decorated instance
  return WrappedComponent
}

export default enhancer
