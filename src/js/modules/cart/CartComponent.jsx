import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import React, { Component } from 'react'
import 'react-block-ui/style.css'

import { Button, Col, FormGroup, Modal, Row } from 'react-bootstrap'

import Keypad from '../../components/common/Keypad.jsx'

import Cart from './Cart.jsx'
import DragDropCartRow from './DragDropCartRow.jsx'

import DragDropCartTable from './DragDropCartTable.jsx'

//import CartStore from './CartStore.jsx' // TODO: Create internally if not provided

/**
 * TODO: This is really AbstractCartComponent
 */
@inject(deps => ({
  actions: deps.actions,
  settingService: deps.authService,
  checkoutService: deps.checkoutService,
  cartStore: deps.cartStore,
  checkoutStore: deps.checkoutStore,
  settingStore: deps.settingStore,
  mappings: deps.mappings, // Per component or global scope?
  translations: deps.translations, // i8ln transations
  roles: deps.roles, // App level roles, general authenticated user (not customer!)
  userRoles: deps.userRoles, // Shortcut or implement via HoC?
  user: deps.user // Shortcut or implement via HoC?
})) @observer
class CartComponent extends Component {
  static contextTypes = {
    cartContextManager: PropTypes.object,
    cart: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.renderOptions = this.renderOptions.bind(this)

    let actions = this.props.actions
    // Thiis actually might be a better place...
    //actions.setting.fetchStore(8)
    //actions.setting.fetchSettings()

    this.state = {
      chooseQuantity: false,
      canSubmit: false,
      settings: {}
    }
  }

  componentDidMount() {
    let settings = this.props.settingStore.getSettings().posSettings
  }

  rowIterator(context, row) {
    if (!context) {
      return {total: 0}
    } else {
      const price = Number(row.data['price'])
      return {total: Number(context.total) + Number(row.quantity) * price}
    }
  }

  renderOptions(selectedOptions, itemQty) {
    itemQty = itemQty || 0

    let options = []

    for (let idx in selectedOptions) {
      let selectedOption = selectedOptions[idx]
      let data = selectedOption.data
      let price = Number(data['price'])
      let lineTotal = price * itemQty

      if (price > 0) {
        options.push(<li>{itemQty} x {data.option.name}: <b>{data.name}</b><span style={{ 'float': 'right' }}>${lineTotal.toFixed(2)}</span></li>)
      } else {
        options.push(<li>{data.option.name}: <b>{data.name}</b><span style={{ 'float': 'right' }}></span></li>)
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

  render() {
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

    let cartWrapperClass = ['checkout-parts']
    if (this.props.display === false) {
      cartWrapperClass.push('display-none')
    }

    let cartWrapperClassName = cartWrapperClass.join(' ')

    return (
      <Row className={cartWrapperClassName}>
        <Col xs={12}>
          <Cart
            ref={(cart) => this.cart = cart}
            tableClassName='table cart'
            onChange={this.refresh}
            columns={['price']}
            iterator={this.rowIterator}
            containerComponent={containerComponent}
            rowComponent={rowComponent}
            onItemClicked={this.props.onCartItemClicked}
            onItemDropped={this.itemDropped}
          />
        </Col>
        <Col className='cart-buttons' xs={12}>
          {/*this.state.canSubmit && (
           <Button
           style     = {{
           width: '100%',
           marginTop: '2rem'
           }}
           onClick = {this.showChargeModal}
           bsStyle = 'success'>
           <h4><i className='fa fa-money' /> Charge</h4>
           </Button>
           )*/}

          {this.state.canSubmit && (
            <Button
              style={{
                width: '100%',
                marginTop: '2rem'
              }}
              className='pull-right'
              onClick={this.reset}
              bsStyle='danger'>
              <h4><i className='fa fa-times'/> Empty</h4>
            </Button>
          )}

          {this.state.canSubmit && (
            <Button
              onClick={this.emptyCart}
              style={{
                width: '100%',
                marginTop: '2rem'
              }}
              className='hidden-xs hidden-sm hidden-md'
              onClick={this.reload}
              bssize>
              <h4><i className='fa fa-refresh'/> Reset</h4>
            </Button>
          )}
        </Col>
        <Modal
          show={!!this.state.chooseQuantity}
          onHide={() => { /*this.hideQuantity*/ }}>
          <Modal.Header>
            <Modal.Title>
              Enter Item Quantity
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Keypad
              ref={(keypad) => this.popupKeypad = keypad}
              displayLabel={false}
            />
            <FormGroup style={{ display: 'block' }}>
              <Button block bsStyle='success' onClick={this.quickAddToCart}>
                <h4><i className='fa fa-shopping-cart'/> Add to Order</h4>
              </Button>
              <Button block bsStyle='danger' onClick={() => this.setState({ chooseQuantity: false }, () => this.popupKeypad.component.clear())}>
                <h4><i className='fa fa-ban'/> Cancel</h4>
              </Button>
            </FormGroup>
          </Modal.Body>
        </Modal>
      </Row>
    )
  }
}

export { CartComponent }
