/**
 *
 * @param WrappedStore
 * @returns {*}
 */
function enhancer(WrappedStore) {
  /**
   * It doesn't matter what the wrapped component is - to have access to mappings,
   * it has to be wrapped in a mobx 'Injector'. There's a more dependable way to do this using
   * the commented out imports above (unwrapComponent, resolveComponent), but it still needs work.
   */
  let wrappedStore = WrappedStore

  Object.defineProperties(wrappedStore.prototype, {
    setPaymentMethod: {
      value: function(code, method) {
        this.paymentMethod = {
          code: code,
          method: method
        }
        this.payload.order.paymentMethod = method
        this.payload.order.paymentCode = code
        this.emit('set-payment-method')
      }
    },
    /**
     * This abstract method may be implemented in classes inheriting from OrderStore.
     *
     * @return void
     */
    setPaymentAddress: {
      value: function(address) {
        throw new Error('Not implemented') // TODO: Make a real exception class
      }
    }
  })

  WrappedStore = wrappedStore

  // Return the decorated instance
  return WrappedStore
}

export default enhancer
