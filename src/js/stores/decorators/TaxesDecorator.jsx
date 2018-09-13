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
     * Mirrors the getTaxes method in in quickcommerce-php/system/library/cart.
     */
    getOrderTaxRates: {
      value: function() {
        //throw new Error('This method is broken, it relies on the old Cart which I am replacing because it doesn\'t work the same way as the rest of the components.')
        let data = {}

        for (let idx = 0; idx < this.getDependentStore('cart').selection.length; idx++) {
          let item = this.getDependentStore('cart').selection[idx]

          let taxRates = this.getTaxRates(parseFloat(item.data['price']))

          // Have we previously set this rate?
          for (let rate in taxRates) { // TODO: Throw exception if not exists!
            if (typeof data[rate] === 'undefined' || data[rate] === null || !this._isset(taxRates[rate], 'rate_id')) {
              data[rate] = (parseFloat(taxRates[rate]['amount']) * item.quantity)
            } else {
              data[rate] += (parseFloat(taxRates[rate]['amount']) * item.quantity)
            }
          }
        }

        return data
      }
    },
    getOrderTaxes: {
      value: function() {
        let data = {}

        for (let idx = 0; idx < this.getDependentStore('cart').selection.length; idx++) {
          let item = this.getDependentStore('cart').selection[idx]

          let taxRates = this.getTaxRates(parseFloat(item.data['price']))

          // Have we previously set this rate?
          for (let rate in taxRates) { // TODO: Throw exception if not exists!
            if (typeof data[rate] === 'undefined' || data[rate] === null || !this._isset(data[rate], 'rate_id')) {
              data[rate] = (parseFloat(taxRates[rate]['amount']) * item.quantity)
            } else {
              data[rate] += (parseFloat(taxRates[rate]['amount']) * item.quantity)
            }
          }
        }

        return data
      }
    },
    /**
     * Mirrors the calculateTaxes method in quickcommerce-php/system/library/tax.
     * @param value
     * @param taxClassId
     * @param calculate
     * @returns {*}
     */
    calculateWithTaxes: {
      value: function(value, taxClassId, calculate) {
        calculate = calculate || true
        taxClassId = taxClassId || false
        // TODO: Check for boolean?

        if (taxClassId && calculate) {
          let amount = 0
          let taxRates = this.getTaxRates(value, taxClassId)

          for (let rate in taxRates) {
            if (calculate !== 'P' && calculate !== 'F') {
              amount += taxRates[rate]['amount'] // Why are these the same? See system/library/tax...
            } else if (taxRates[rate]['type'] === calculate) {
              amount += taxRates[rate]['amount'] // Why are these the same? See system/library/tax...
            }
          }

          return value + amount
        } else {
          return value
        }
      }
    },
    /**
     * Mirrors the getTax method in quickcommerce-php/system/library/tax.
     */
    calculateTaxes: {
      value: function(value, taxClassId) {
        let amount = 0
        let taxRates = this.getTaxRates(value, taxClassId)

        for (let rate in taxRates) {
          amount += taxRates[rate]['amount']
        }

        return amount
      }
    },
    /**
     * Mirrors the getRates method in system\library\tax.
     * Called by the calculateTaxes (orig. Tax) and getOrderTaxes
     * (orig. (Cart) methods, and is generally only for 'private use'.
     * @param value
     * @param taxClassId
     */
    getTaxRates: {
      value: function(value, taxClassId) {
        let rateData = {}, rates = this.settings.cartConfig.taxRates['1_1_5_store']

        // TODO: Need to grab store dynamically!!!! 1_1_5 Correlates to languageId = 1, storeId = 1, taxClassId = 5?

        // Pretty sure returned data is already filtered by tax class
        //if (this._isset(rates, taxClassId)) { // As per our note above, disable this conditional
        //for (let rate in rates[taxClassId]) {
        let rateCount = rates.length
        let idx = 0
        for (idx; idx < rateCount; idx++) {
          let rate = rates[idx]
          let amount = 0

          if (rateData.hasOwnProperty(rate['taxRateId']) && this._isset(rateData[rate], 'taxRateId')) {
            amount = rateData[rate['taxRateId']]['amount']
          }

          if (rate['type'] === 'F') {
            amount += rates[idx]['rate']
          } else if (rate['type'] === 'P') {
            amount += (value / 100 * rate['rate'])
          }

          rateData[rate['taxRateId']] = {
            'rate_id': rate['taxRateId'],
            'name': rate['name'],
            'rate': rate['rate'],
            'type': rate['type'],
            'amount': amount
          }
        }
        //}

        return rateData
      }
    }
  })

  WrappedStore = wrappedStore

  // Return the decorated instance
  return WrappedStore
}

export default enhancer
