import { CartComponent as QcCart } from 'qc-react/modules/cart/CartComponent.jsx'

import React from 'react'
import 'react-block-ui/style.css'

import DragDropCartRow from './cart/DragDropCartRow.jsx'

import DragDropCartTable from './cart/DragDropCartTable.jsx'

class ShoppingCart extends QcCart.wrappedComponent {
  render() {
    let props = this.props

    let options = false
    // TODO: This is wrong, should be checking ID or something
    if (this.state.hasOwnProperty('product') && this.state.product !== null && this.state.product.hasOwnProperty('price')) {
      let price = (parseFloat(this.state.product.price)).toFixed(2)
      if (typeof this.state.product.options !== 'undefined' && this.state.product.options instanceof Array && this.state.product.options.length > 0) {
        options = this.state.product.options
      }
    }

    let orderTotal = 0.00
    if (this.props.checkoutStore.payload.orderTotals instanceof Array && this.props.checkoutStore.payload.orderTotals.length > 0) {
      let orderTotalValue = parseFloat(this.props.checkoutStore.getTotal().value)
      if (!isNaN(orderTotalValue)) {
        orderTotal = orderTotalValue.toFixed(2)
      }
    }

    const containerComponent = this.props.containerComponent || DragDropCartTable
    const rowComponent = this.props.rowComponent || DragDropCartRow

    return (
      <main className='content-wrapper'>
        <section className='container padding-top-3x padding-bottom'>
          <h1 className='space-top-half'>Shopping Cart</h1>
          <div className='row padding-top'>
            <div className='col-sm-8 padding-bottom-2x'>
              <QcCart
                ref={props.shoppingCart}
                containerComponent={containerComponent}
                rowComponent={rowComponent}
              />
              <div className>
                <p className='text-gray text-sm'>Have discount coupon?</p>
                <form method='post' className='row'>
                  <div className='col-md-8 col-sm-7'>
                    <div className='form-element'>
                      <input type='text' className='form-control' placeholder='Enter coupon' required/>
                    </div>
                  </div>
                  <div className='col-md-4 col-sm-5'>
                    <button type='submit' className='btn btn-default btn-ghost btn-block space-top-none space-bottom'>Apply Coupon</button>
                  </div>
                </form>
              </div>
            </div>
            <div className='col-md-3 col-md-offset-1 col-sm-4 padding-bottom-2x'>
              <aside>
                <h3 className='toolbar-title'>Cart subtotal:</h3>
                <h4 className='amount'>$460.90</h4>
                <p className='text-sm text-gray'>* Note: This amount does not include taxes or costs for international shipping. You will be able to calculate shipping costs on checkout.</p>
                <a href='#/' className='btn btn-default btn-block waves-effect waves-light'>Update Cart</a>
                <a href='#/checkout' className='btn btn-primary btn-block waves-effect waves-light space-top-none'>Checkout</a>
              </aside>
            </div>
          </div>
        </section>
      </main>
    )
  }
}

export default ShoppingCart
