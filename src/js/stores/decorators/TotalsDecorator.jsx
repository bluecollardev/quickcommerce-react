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
    getTotals: {
      value: function() {
        let totals = this.payload.orderTotals
        let data = []

        // If there's no total, output zero
        if (typeof totals !== 'undefined' && totals !== null) {

          if (!(totals instanceof Array || totals.length > 0)) return data //0.00

          // Sort the totals
          for (let idx = 0; idx < totals.length; idx++) {
            //data[parseInt(totals[idx].sortOrder)] = totals[idx] // No sort order right now
            data[idx] = totals[idx]

            /* Format:
             orderTotalId": 49,
             "orderId": 13,
             "code": "tax",
             "title": "VAT",
             "value": "73.3900",
             "sortOrder": 5
             */
          }

          data = data.filter(val => val) // Re-index array
        }

        return data
      }
    },
    getTotal: {
      value: function() {
        let totals = this.getTotals() || null
        let total = {
          title: 'Total',
          value: 0.00
        }

        total = totals.pop() || total

        return total
      }
    },
    getSubTotal: {
      value: function() {
        let totals = this.getTotals() || null
        let total = {
          title: 'Sub-Total',
          value: 0.00
        }

        total = totals.shift() || total

        return total
      }
    },
    /**
     * @param itemId
     * @param item
     * @returns {number}
     */
    calculateOptionTotal: {
      value: function(itemId, item) {
        let optionTotal = 0.00
        // Get the prices off of the selected options and add them to the product price
        let orderOptions = this.getOrderOptions(parseInt(itemId)) || null

        if (typeof orderOptions !== 'undefined' && orderOptions !== null) {
          // Not sure if I want to finalize this as an array or an object so I'm accounting for either
          if (Object.keys(orderOptions).length > 0) {
            //for (let idx = 0; idx < orderOptions.length; idx++) {
            for (let key in Object.keys(orderOptions)) {
              let orderOption = orderOptions[key]

              // Get the product option value using the selected option's productOptionValueId
              let productOptionId = Number(orderOption.productOptionId)
              let productOptionValueId = Number(orderOption.productOptionValueId)

              let productOptions = item.data['options']
              let selectedOptions = productOptions.filter(option => {
                return Number(option['product_option_id']) === productOptionId
              })

              if (selectedOptions instanceof Array && selectedOptions.length > 0) {
                let selectedOption = selectedOptions[0]
                // TODO: Make this method static?
                let optionPrice = this.cartStore.getOptionPrice(item.data, selectedOption, productOptionValueId)
                optionTotal += (!isNaN(optionPrice)) ? Number(optionPrice) : 0
              }
            }
          }
        }

        return optionTotal
      }
    }
  })

  WrappedStore = wrappedStore

  // Return the decorated instance
  return WrappedStore
}

export default enhancer
