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
    /**
     * This abstract method may be implemented in classes inheriting from OrderStore.
     *
     * @param CustomerDto customer A customer DTO object
     * @return void
     *
     */
    setBuiltInCustomer: {
      value: function(customer) {
        //throw new Error('Not implemented') // TODO: Make a real exception class?
      }
    },
    /**
     * This abstract method may be implemented in classes inheriting from OrderStore.
     *
     * @param CustomerDto customer A customer DTO object
     */
    setCustomCustomer: {
      value: function(customer) {
        //throw new Error('Not implemented') // TODO: Make a real exception class?
      }
    },
    /**
     * This abstract method must be implemented in classes inheriting from OrderStore.
     * If not defined, a Not Implemented exception will be thrown.
     *
     * @param CustomerDto customer A customer DTO object
     * @return void
     *
     */
    setExistingCustomer: {
      value: function(customer) {
        //throw new Error('Not implemented') // TODO: Make a real exception class?
      }
    },
    /**
     * This abstract method may be implemented in classes inheriting from OrderStore.
     *
     * @param CustomerDto customer A customer DTO object
     */
    setAdditionalCustomers: {
      value: function(customers, key) {
        //throw new Error('Not implemented') // TODO: Make a real exception class?
      }
    }
  })

  WrappedStore = wrappedStore

  // Return the decorated instance
  return WrappedStore
}

export default enhancer
