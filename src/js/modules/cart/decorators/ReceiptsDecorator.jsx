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
    renderPlainTxtReceipt: {
      value: function() {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.prevCheckout.store

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
        output.push('Sale')
        output.push('\n')
        output.push('Qty        Item        Total')

        // We need a max line chars algo so we can make stuff line up

        let prev = this.state.prevCheckout || null
        // Items
        let items = (prev !== null) ? prev.items : this.state.checkout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
          let item = items[idx]

          let line = [
            item.quantity + ' x ',
            item.data['model'],
            '$' + (parseFloat(item.data['price']) * item.quantity).toFixed(2)
          ].join('  ')

          output.push(line)

          if (typeof item.options !== 'undefined' &&
            item.options instanceof Array &&
            item.options.length > 0) {

            let options = items[idx].options
            options = options.filter(option => {
              // Only render options that have a price for the receipt
              return option.data['price'] !== false
            })

            output = output.concat(this.renderPlainTxtOptions(options, items[idx].quantity, true))
          }
        }

        output.push('\n')

        // Totals
        let totals = []
        let total = null

        if (prev !== null) {
          // Totals
          totals = this.state.prevCheckout.totals || []
          total = this.state.prevCheckout.total || null
        } else {
          // Totals
          totals = this.state.checkout.totals || []
          total = this.state.checkout.total || null
        }

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
          if (totals[idx].code === total.code) continue

          // Set the total title
          let subTotalTitle = ''
          switch (totals[idx].code) {
            case 'sub_total':
              subTotalTitle = 'Sub-total'
              break
            case 'total':
              subTotalTitle = 'Total'
              break
            default:
              subTotalTitle = totals[idx].title
          }

          output.push(subTotalTitle + ': $' + parseFloat(totals[idx].value).toFixed(2))
        }

        if (total !== null) {
          // Final total
          // Set the total title
          let totalTitle = ''
          switch (total.code) {
            case 'sub_total':
              totalTitle = 'Sub-total'
              break
            case 'total':
              totalTitle = 'Total'
              break
            default:
              totalTitle = total.title
          }

          output.push(totalTitle + ': $' + parseFloat(total.value).toFixed(2))
        }

        output.push('\n')
        output.push('Payment Method' + ': ' + this.state.paymentMethod)

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
      }
    },
    renderPlainTxtOptions: {
      value: function(selectedOptions, itemQuantity, displayPrice) {
        itemQuantity = itemQuantity || null
        displayPrice = displayPrice || false

        let options = []

        for (let idx in selectedOptions) {
          let selectedOption = selectedOptions[idx]
          let data = selectedOption.data
          let price = Number(data['price'])
          let lineTotal = price * itemQuantity

          let line = []

          if (itemQuantity !== null && !isNaN(itemQuantity)) {
            line.push(itemQuantity + ' x ')
          } else {
            line.push(selectedOption.quantity + ' x ')
          }

          line.push(data.option.name + ' (' + data.name + ')')

          if (price > 0 && displayPrice) {
            line.push('     ' + ['$', lineTotal.toFixed(2)].join(''))
          }

          options.push(line.join(''))
        }

        return options
      }
    },
    renderCachedReceipt: {
      value: function(cached) {
        cached = cached || true
        let render = false

        if (this.state.hasOwnProperty('prevCheckout') &&
          this.state.prevCheckout.hasOwnProperty('order') &&
          typeof this.state.prevCheckout.order !== 'undefined') {
          render = true
        }

        if (!render) return

        let output = []

        // Build our receipt, line by line
        // Store info
        let store = this.state.prevCheckout.store

        let headerLines = []
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{store.name}</h4></span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>10055 - 80 Ave NW</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Edmonton, Alberta T6E 1T4</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Tel. 780.244.0ACE</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>info@acecoffeeroasters.com</span>)

        let local = new Date().toISOString()
        let date = local.slice(0, 10)
        let time = local.slice(11).split('.')[0]

        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>{[date, time].join(', ')}</span>)

        output.push(<div className='receipt-header' style={{'text-align': 'center'}}>{headerLines}</div>)

        output.push(<hr />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>Sale</h4></span>)
        output.push(<br />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

        // We need a max line chars algo so we can make stuff line up

        // Items - TODO: this code below is also repeated in renderReceipt
        let items = this.state.prevCheckout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
          let item = items[idx]
          let data = item.data
          let price = 0.00
          let optionTotal = 0.00
          let lineTotal = 0.00

          price = (typeof data['price'] !== 'undefined' && !isNaN(data.price)) ? Number(data.price) : 0.00
          lineTotal = price * item.quantity

          // Don't include option prices in receipt, we want to detail the options line by line as well
          lineTotal = (lineTotal).toFixed(2)

          //lineTotal = (lineTotal + optionTotal).toFixed(2)

          let model = data['model']
          if (typeof item.options !== 'undefined' &&
            item.options instanceof Array &&
            item.options.length > 0) {
            output.push(
              <span style={{
                'display': 'block',
                clear: 'both'
              }} className='receipt-line-item'>
                <span>{item.quantity} x {model}</span>
                <span style={{'float': 'right'}}>${lineTotal}</span>
                {this.renderOptions(items[idx].options, item.quantity)}
              </span>
            )
          } else {
            output.push(
              <span style={{
                'display': 'block',
                clear: 'both'
              }} className='receipt-line-item'>
                <span>{item.quantity} x {model}</span>
                <span style={{'float': 'right'}}>${lineTotal}</span>
              </span>
            )
          }
        }

        output.push(<br />)

        // Totals
        let totals = this.state.prevCheckout.totals || []
        let total = this.state.prevCheckout.total || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
          if (totals[idx].code === total.code) continue // Ignore the final total OpenCart sux goat dick what a fucking dumb way to output totals!

          output.push(
            <span style={{
              'display': 'block',
              'clear': 'both'
            }} className='receipt-line-item'>
              {totals[idx].title}
              <span style={{'float': 'right'}}>${parseFloat(totals[idx].value).toFixed(2)}</span>
            </span>
          )
        }

        if (total !== null) {
          output.push(<br />)
          output.push(<hr />)

          // Final total
          output.push(
            <span style={{
              'display': 'block',
              'clear': 'both'
            }} className='receipt-line-item'>
              {total.title}
              <span style={{
                'float': 'right',
                'font-size': '18px',
                'font-weight': 'bold'
              }}>${parseFloat(total.value).toFixed(2)}</span>
            </span>
          )
        }

        return output
      }
    },
    renderReceipt: {
      value: function(cached) {
        cached = cached || true
        let render = false

        if (this.state.hasOwnProperty('checkout') &&
          this.state.checkout.hasOwnProperty('order') &&
          typeof this.state.checkout.order !== 'undefined') {
          render = true
        }

        if (!render) return

        let output = []

        // Build our receipt, line by line
        // Store info
        let store = this.state.checkout.store

        let headerLines = []
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{store.name}</h4></span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>10055 - 80 Ave NW</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Edmonton, Alberta T6E 1T4</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Tel. 780.244.0ACE</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>info@acecoffeeroasters.com</span>)

        let local = new Date().toISOString()
        let date = local.slice(0, 10)
        let time = local.slice(11).split('.')[0]

        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>{[date, time].join(', ')}</span>)

        output.push(<div className='receipt-header' style={{'text-align': 'center'}}>{headerLines}</div>)

        output.push(<hr />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{[this.state.paymentMethod, 'Sale'].join(' ')}</h4></span>)
        output.push(<br />)
        //output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = this.state.checkout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
          let item = items[idx]
          let data = item.data
          let price = 0.00
          let optionTotal = 0.00
          let lineTotal = 0.00

          price = (typeof data['price'] !== 'undefined' && !isNaN(data.price)) ? Number(data.price) : 0.00
          lineTotal = price * item.quantity

          // Don't include option prices in receipt, we want to detail the options line by line as well
          lineTotal = (lineTotal).toFixed(2)

          //lineTotal = (lineTotal + optionTotal).toFixed(2)

          let model = data['model']
          if (typeof item.options !== 'undefined' &&
            item.options instanceof Array &&
            item.options.length > 0) {
            output.push(
              <span style={{
                'display': 'block',
                clear: 'both'
              }} className='receipt-line-item'>
                <span>{item.quantity} x {model}</span>
                <span style={{'float': 'right'}}>${lineTotal}</span>
                {this.renderOptions(items[idx].options, item.quantity)}
              </span>
            )
          } else {
            output.push(
              <span style={{
                'display': 'block',
                clear: 'both'
              }} className='receipt-line-item'>
                <span>{item.quantity} x {model}</span>
                <span style={{'float': 'right'}}>${lineTotal}</span>
              </span>
            )
          }
        }

        output.push(<br />)

        // Comments
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>Order Notes</h4></span>)

        output.push(
          <span style={{
            'display': 'block',
            'clear': 'both'
          }} className='receipt-line-item'>
            <span style={{
              'font-size': '16px',
              'font-weight': 'normal'
            }}>{this.state.notes}</span>
          </span>
        )

        output.push(<br />)

        // Totals
        let totals = this.state.checkout.totals || []
        let total = this.state.checkout.total || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
          if (totals[idx].code === total.code) continue // Ignore the final total OpenCart sux goat dick what a fucking dumb way to output totals!

          output.push(
            <span style={{
              'display': 'block',
              'clear': 'both'
            }} className='receipt-line-item'>
              {totals[idx].title}
              <span style={{'float': 'right'}}>${parseFloat(totals[idx].value).toFixed(2)}</span>
            </span>
          )
        }

        if (total !== null) {
          output.push(<br />)
          output.push(<hr />)

          // Final total
          output.push(
            <span style={{
              'display': 'block',
              'clear': 'both'
            }} className='receipt-line-item'>
              <h4 style={{display: 'inline-block'}}>{total.title}</h4>
              <span style={{
                'float': 'right',
                'font-size': '18px',
                'font-weight': 'bold'
              }}>${parseFloat(total.value).toFixed(2)}</span>
            </span>
          )
        }

        output.push(<br />)

        // Payment details
        output.push(
          <span style={{
            'display': 'block',
            'clear': 'both'
          }} className='receipt-line-item'>
            Payment Method
            <span style={{
              'float': 'right',
              'font-size': '16px',
              'font-weight': 'bold'
            }}>{this.state.paymentMethod}</span>
          </span>
        )

        return output
      }
    },
    renderOptions: {
      value: function(selectedOptions, itemQty) {
        itemQty = itemQty || 0

        let options = []

        for (let idx in selectedOptions) {
          let selectedOption = selectedOptions[idx]
          let data = selectedOption.data
          let price = Number(data['price'])
          let lineTotal = price * itemQty

          if (price > 0) {
            options.push(<li>{itemQty} x {data.option.name}: <b>{data.name}</b><span style={{'float': 'right'}}>${lineTotal.toFixed(2)}</span></li>)
          } else {
            options.push(<li>{data.option.name}: <b>{data.name}</b><span style={{'float': 'right'}}></span></li>)
          }
        }

        return (
          <ul style={{
            paddingLeft: '1.5rem',
            marginLeft: '0'
          }}>
            {options}
          </ul>
        )
      }
    }
  })

  WrappedComponent.wrappedComponent = wrappedComponent

  // Return the decorated instance
  return WrappedComponent
}

export default enhancer
