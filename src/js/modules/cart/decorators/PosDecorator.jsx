import assign from 'object-assign'

//import { unwrapComponent, resolveComponent } from '../../AbstractFormComponent.jsx'

/**
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
    // TODO: Move me to a utils class
    renderPlainTxtOrder: {
      value: function() {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.prevCheckout.store

        let headerLines = []
        headerLines.push('ORDER')

        let local = new Date().toISOString()
        let date = local.slice(0, 10)
        let time = local.slice(11).split('.')[0]

        headerLines.push([date, time].join(', '))

        output.push(...headerLines) // ES6 extend array

        output.push('\n')
        output.push('ITEMS')
        output.push('\n')

        // We need a max line chars algo so we can make stuff line up

        let prev = this.state.prevCheckout || null
        // Items
        let items = (prev !== null) ? prev.items : this.state.checkout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
          let line = [
            items[idx].quantity + ' x ',
            items[idx].data['model']
          ].join('  ')

          output.push(line)

          if (typeof items[idx].options !== 'undefined' &&
            items[idx].options instanceof Array &&
            items[idx].options.length > 0) {
            output = output.concat(this.renderPlainTxtOptions(items[idx].options, null, false))
          }
        }

        if (typeof this.state.notes === 'string' && this.state.notes !== '') {
          output.push('\n')
          output.push('NOTES')
          output.push('\n')
          output.push(this.state.notes)
        }

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
      }
    },
    renderEndOfDayReport: {
      value: function(data) {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.checkout.store

        let headerLines = []
        headerLines.push('ACE Coffee Roasters')
        headerLines.push('10055 - 80 Ave NW')
        headerLines.push('Edmonton, Alberta T6E 1T4')
        headerLines.push('Tel. 780.244.0ACE')
        headerLines.push('info@acecoffeeroasters.com')

        let local = new Date().toISOString()
        let date = local.slice(0, 10)
        let time = local.slice(11).split('.')[0]

        headerLines.push([date, time].join(', '))

        output.push(...headerLines) // ES6 extend array

        output.push('\n')
        output.push('End of Day Report')
        output.push('\n')
        output.push('Qty        Item        Total')

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = data['purchased_products']
        for (let idx = 0; idx < items.length; idx++) {
          let line = [
            items[idx]['quantity'] + ' x ',
            items[idx]['model'],
            '$' + (parseFloat(items[idx]['total']).toFixed(2))
          ].join('  ')

          output.push(line)
        }

        output.push('\n')

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
      }
    },
    renderCashOptions: {
      value: function() {
        let total = parseFloat(this.props.checkoutStore.getTotal().value)
        let min = Math.ceil(total/5)*5 // 5 dollars is the lowest bill denomination
        let options = []

        for (let idx = 0; idx < 5; idx++) {
          options.push(min * (idx + 1))
        }

        return (
          <div className='cash-options'>
            <Button bsStyle='success' data-amount={total} onClick={this.selectChangePreset}>${total.toFixed(2)}</Button>&nbsp;
            <Button bsStyle='success' data-amount={options[0]} onClick={this.selectChangePreset}>${options[0].toFixed(2)}</Button>&nbsp;
            <Button bsStyle='success' data-amount={options[1]} onClick={this.selectChangePreset}>${options[1].toFixed(2)}</Button>&nbsp;
            <Button bsStyle='success' data-amount={options[2]} onClick={this.selectChangePreset}>${options[2].toFixed(2)}</Button>&nbsp;
            <Button bsStyle='success' data-amount={options[3]} onClick={this.selectChangePreset}>${options[3].toFixed(2)}</Button>&nbsp;
            {/*<Button bsStyle='default' data-amount={options[4]} onClick={this.calculateChange}>${options[4].toFixed(2)}</Button>&nbsp;*/}
            <Button bsStyle='default' data-amount='custom' onClick={this.toggleCustomPaymentAmount}>Custom</Button>&nbsp;
          </div>
        )
      }
    },
    renderPaymentOptions: {
      value: function() {
        return (
          <div className='cash-options payment-options'>
            <Button bsStyle='default' data-type='cash' onClick={this.selectPaymentMethod.bind(this, 'cash')}>Cash</Button>&nbsp;
            <Button bsStyle='default' data-type='visa' onClick={this.selectPaymentMethod.bind(this, 'credit')}>Visa</Button>&nbsp;
            <Button bsStyle='default' data-type='mastercard' onClick={this.selectPaymentMethod.bind(this, 'credit')}>Mastercard</Button>&nbsp;
            <Button bsStyle='default' data-type={'debit'} onClick={this.selectPaymentMethod.bind(this, 'debit')}>Debit</Button>&nbsp;
            <Button bsStyle='default' data-type={'cheque'} onClick={this.selectPaymentMethod.bind(this, 'cheque')}>Cheque</Button>&nbsp;
            <Button bsStyle='default' data-type={'giftcard'} onClick={this.selectPaymentMethod.bind(this, 'giftcard')}>Gift Card</Button>
          </div>
        )
      }
    },
    getChangeAmounts: {
      value: function(price, cash, cid) {
        let change = cash - price
        cid = cid || CASH_IN_DRAWER // Defined at the top

        // Transform CID array into drawer object
        let register = cid.reduce(function(acc, curr) {
          acc.total += curr[1]
          acc[curr[0]] = curr[1]
          return acc
        }, {total: 0})

        // Handle exact change
        if (register.total === change) {
          return 'Closed'
        }

        // Handle obvious insufficent funds
        if (register.total < change) {
          return 'Insufficient Funds'
        }

        // Loop through the denomination array
        let change_arr = denom.reduce(function(acc, curr) {
          let value = 0
          // While there is still money of this type in the drawer
          // And while the denomination is larger than the change reminaing
          while (register[curr.name] > 0 && change >= curr.val) {
            change -= curr.val
            register[curr.name] -= curr.val
            value += curr.val

            // Round change to the nearest hundreth deals with precision errors
            change = Math.round(change * 100) / 100
          }

          // Add this denomination to the output only if any was used.
          if (value > 0) {
            acc.push([ curr.name, value ])
          }

          return acc // Return the current Change Array
        }, []) // Initial value of empty array for reduce

        // If there are no elements in change_arr or we have leftover change, return
        // the string 'Insufficient Funds'

        if (change_arr.length < 1 || change > 0) {
          return 'Insufficient Funds'
        }

        // Here is your change, ma'am.
        return change_arr
      }
    },
    calculateChange: {
      value: function(e) {
        console.log(e)
        let orderTotal = parseFloat(this.props.checkoutStore.getTotal().value)

        let cashAmount = e.target.getAttribute('data-amount')

        if (isNaN(cashAmount) && cashAmount === 'custom') {
          if (typeof this.customPaymentAmount !== 'undefined' &&
            this.customPaymentAmount !== null) {
            cashAmount = parseFloat(this.customPaymentAmount.value)
          } else {
            throw new Error('something went wrong with cash amount')
            // TODO: This is a kind of a stupid error message I can handle this better
          }
        } else if (!isNaN(cashAmount)) {
          cashAmount = parseFloat(cashAmount)
        }

        this.setState({
          cashAmount: (cashAmount).toFixed(2),
          changeAmount: (cashAmount - orderTotal).toFixed(2)
        })
      }
    },
    selectChangePreset: {
      value: function(e) {
        console.log(e)
        let orderTotal = parseFloat(this.props.checkoutStore.getTotal().value)

        let cashAmount = e.target.getAttribute('data-amount')

        if (isNaN(cashAmount) && cashAmount === 'custom') {
          if (typeof this.customPaymentAmount !== 'undefined' &&
            this.customPaymentAmount !== null) {
            cashAmount = parseFloat(this.customPaymentAmount.value)
          } else {
            throw new Error('something went wrong with cash amount')
            // TODO: This is a kind of a stupid error message I can handle this better
          }
        } else if (!isNaN(cashAmount)) {
          cashAmount = parseFloat(cashAmount)
        }

        this.setState({
          cashAmount: (cashAmount).toFixed(2),
          changeAmount: (cashAmount - orderTotal).toFixed(2)
        })

        this.completeOrder()
      }
    },
    selectPaymentMethod: {
      value: function(method) {
        let methods = ['cash', 'credit', 'debit', 'cheque', 'giftcard']

        if (methods.indexOf(method) > -1) {
          console.log('changing payment method to ' + StringHelper.capitalizeFirstLetter(method))
          this.setState({
            paymentMethod: StringHelper.capitalizeFirstLetter(method),
            paymentCode: method
          }, () => {
            this.updatePaymentMethod(method, StringHelper.capitalizeFirstLetter(method))
            this.forceUpdate() // Redraw receipt
          })
        } else {
          console.log('clear payment method')
          this.setState({
            paymentMethod: 'In Store',
            paymentCode: 'in_store'
          }, () => {
            this.updatePaymentMethod('in_store', 'In Store')
            this.forceUpdate() // Redraw receipt
          })
        }
      }
    },
    toggleCustomPaymentAmount: {
      value: function() {
        this.setState({customPaymentAmount: !this.state.customPaymentAmount})
      }
    },
  })

  WrappedComponent.wrappedComponent = wrappedComponent

  // Return the decorated instance
  return WrappedComponent
}

export default enhancer
