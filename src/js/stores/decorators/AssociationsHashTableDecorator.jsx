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
     * Variants are intended to allow for the storage of a custom order 'preset' using a hash mechanism
     * (think pre-populated orders, a specific order configuration or an order template). Use it how you want to store
     * arbitrary data associated with the order.
     *
     * This method returns a single variant's data object from store given its key.
     * @param key
     * @returns {*}
     */
    getVariant: {
      value: function(key) {
        if (this.variants.has(key)) {
          return this.variants.get(key)
        }

        return null
      }
    },
    /**
     * Variants are intended to allow for the storage of a custom order 'preset' using a hash mechanism
     * (think pre-populated orders, a specific order configuration or an order template). Use it how you want to store
     * arbitrary data associated with the order.
     *
     * This method returns a single variant's data object from store given its index.
     * Warning, for this to work, the keys need to be sorted, which we aren't currently doing.
     * This method is currently being used as a temporary development hack for an application
     * that uses this library. Just a heads up!
     * @param key
     * @returns {*}
     */
    getVariantAtIndex: {
      value: function(idx) {
        let keys = this.variants.keys()
        let variant = this.variants.get(keys[idx]) || null

        return variant
      }
    },
    /**
     * Variants are intended to allow for the storage of a custom order 'preset' using a hash mechanism
     * (think pre-populated orders, a specific order configuration or an order template). Use it how you want to store
     * arbitrary data associated with the order.
     *
     * @param key The unique key used to identify the particular configuration. Can be a string or an integer value.
     * @param variant
     */
    setVariant: {
      value: function(key, variant) {
        // OrderStore.setVariant
        this.variants.set(key, variant)
        this.emit('set-variant', key, variant)
      }
    },
    /**
     * See above. Iterates over an array of input data and maps it by
     * key to the variants in store, setting any keys that don't already exist.
     * @param keyProperty
     * @param variants
     */
    setVariants: {
      value: function(keyProperty, variants) {
        // OrderStore.setVariant
        if (variants instanceof Array) {
          variants.map((variant) => {
            this.variants.set(variant[keyProperty], variant)
          })

          this.emit('set-variants', variants)
        }
      }
    },
    get: {
      value: function() {

      }
    }
  })

  WrappedStore = wrappedStore

  // Return the decorated instance
  return WrappedStore
}

export default enhancer
