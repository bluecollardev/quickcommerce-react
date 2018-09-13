import assign from 'object-assign'

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
        // Payload should never be undefined, just use it
        this.payload.customer = customer

        // TODO: This is being used to trigger updates, but updates are also triggered by OrderStore in registerToActions
        this.emitChange() // OrderStore.registerToActions -> this.emit('set-customer', 'custom')
        // Ideally I'd like to just trigger a single event to help ensure that I don't waste any render cycles
      }
    },
    /**
     * @param CustomerDto customer
     * @param string key The property used in place of the additionalCustomers (not yet implemented) array
     * @param boolean silent
     *
     * TODO: Add a hash to the store to store custom fields, this is kind of... blah!
     * This is currently an acceptable solution as we're only using two custom properties and their
     * respective names are probably never going to change.
     */
    setAdditionalCustomers: {
      value: function(customers, key, silent) {
        silent = silent || false

        if (!(customers instanceof Array)) {
          // Just fail silently, handle any necessary errors somewhere else
          return
        }

        if (!(this[key] instanceof Array)) {
          this[key] = []
        }

        let data = []

        // Normalize the array, we only need the nested customer property anyway
        customers.reduce((result, currentValue, idx) => {
          let customer = currentValue.customer
          // TODO: Maybe this should be somewhere else, like in the service
          if (customer.hasOwnProperty('user')) {
            customer = assign({}, customer, customer.user)
            delete customer.user
          }

          data.push(customer)
        }, customers[0])

        this[key] = data
        console.log('setting additional customers')
        console.log(this[key])

        if (!silent) {
          // TODO: This is being used to trigger updates, but updates are also triggered by OrderStore in registerToActions
          this.emitChange() // OrderStore.registerToActions -> this.emit('set-customer', 'custom')
          // Ideally I'd like to just trigger a single event to help ensure that I don't waste any render cycles
        }
      }
    },
    /**
     * @returns {*}
     */
    getCustomer: {
      value: function() {
        return this.payload.customer
      }
    },
    /**
     * @returns {null}
     */
    getCustomerId: {
      value: function () {
        if (this.payload.hasOwnProperty('customer') && typeof this.payload.customer === 'object' && this.payload.customer !== null && this.payload.customer.hasOwnProperty('id')) {
          return this.payload.customer['id']
        }

        return null
      }
    },
    // TODO: Does this need to be in here for ANY reason?
    // Needed in other quickcommerce apps but not here...
    getAddressString: {
      value: function (data) {
        data = data || null
        let formatted = ''

        let filterValue = function (value) {
          return (typeof value === 'string' && value !== null && value !== '') ? true : false
        }

        if (data !== null && data.hasOwnProperty('address_id')) {
          formatted = [
            [
              data.firstname,
              data.lastname
            ].join(' '),
            [data.company].filter(function (value, idx) {
              return filterValue(value)
            }).join(''),
            [
              data.address1,
              data.address2
            ].filter(function (value, idx) {
              return filterValue(value)
            }).join('\n'),
            [
              data.city,
              data.zone
            ].join(', '),
            [
              data.country,
              data.postcode
            ].join(' ')
          ]

          formatted = formatted.filter(function (value, idx) {
            return filterValue(value)
          })

          formatted = formatted.join('\n')
        }

        return formatted
      }
    }
  })

  WrappedStore = wrappedStore

  // Return the decorated instance
  return WrappedStore
}

export default enhancer
