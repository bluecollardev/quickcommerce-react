import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import 'react-block-ui/style.css'

import { Alert, Row } from 'react-bootstrap'

import { CartComponent as QcCart } from 'qc-react/modules/cart/CartComponent.jsx'

import DragDropCartRow from './cart/DragDropCartRow.jsx'
import DragDropCartTable from './cart/DragDropCartTable.jsx'

import CartDecorator from './cart/decorators/CartDecorator.jsx'

@inject(deps => ({
  dispatcher: deps.dispatcher,
  actions: deps.actions,
  mappings: deps.mappings,
  authService: deps.authService,
  customerService: deps.customerService,
  dealService: deps.dealService,
  cartStore: deps.cartStore,
  dealStore: deps.dealStore,
  settingStore: deps.settingStore
  })) @observer
class KioskCartComponent extends Component {
  static contextTypes = {
    cartContextManager: PropTypes.object,
    cart: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {displayCart: this.props.displayCart}
  }

  /**
   * Set an error boundary so a rendering failure in the component doesn't cascade.
   */
  componentDidCatch(error, info) {
    console.log('KioskCartComponent error')
    console.log(error)
    console.log(info)
  }

  componentDidMount() {
    //const { dealStore } = this.props

    const vehicleSelectionContext = this.props.getContextValue()
    const vehicleSelectionStore = vehicleSelectionContext.store
    //const vehicleSelectionActions = vehicleSelectionContext.actions

    vehicleSelectionStore.addListener('item-added', this.onItemAdded.bind(this))
    // TODO: These methods are using quickcommerce data format
    vehicleSelectionStore.addListener('item-changed', this.onItemChanged.bind(this))
    vehicleSelectionStore.addListener('product-options-changed', this.onProductOptionsChanged.bind(this))
    vehicleSelectionStore.addListener('item-removed', this.onItemRemoved.bind(this))
    vehicleSelectionStore.addListener('cart-reset', this.onCartReset.bind(this))
    vehicleSelectionStore.addListener('cart-cleared', this.onCartCleared.bind(this))

    this.context.cartContextManager.subscribe((contextValue) => {
      // Do something when context is updated
      console.log('get cart selections from context')
      console.log(contextValue.store.getSelection())
    })
  }

  componentWillUnmount() {
    //const { actions, dealStore } = this.props

    const vehicleSelectionContext = this.props.getContextValue()
    const vehicleSelectionStore = vehicleSelectionContext.store

    // Wrap removal of event listeners in a try-catch; if there's no listener attached to the store, it will throw an
    // error if you try to remove it I don't have a better solution right now, as there's also no hasEventListener in
    // node's EventEmitter class
    try {
      vehicleSelectionStore.removeListener('item-added', this.onItemAdded)
      // TODO: These methods are using quickcommerce data format
      vehicleSelectionStore.removeListener('item-changed', this.onItemChanged)
      vehicleSelectionStore.removeListener('product-options-changed', this.onProductOptionsChanged)
      vehicleSelectionStore.removeListener('item-removed', this.onItemRemoved)
      vehicleSelectionStore.removeListener('cart-reset', this.onCartReset)
      vehicleSelectionStore.removeListener('cart-cleared', this.onCartCleared)
    } catch (err) {
      // Fail silently
      console.log('failed to remove listener')
      console.log(err)
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({displayCart: newProps.displayCart})
  }

  render() {
    const containerComponent = this.props.containerComponent || DragDropCartTable

    const rowComponent = this.props.rowComponent || DragDropCartRow
    rowComponent.defaultProps.itemMappings = this.props.mappings.inventoryItem // Must be specified use directly
    rowComponent.defaultProps.onWorksheetButtonClicked = (dealId, dealTargetId, worksheetId) => {
      //alert('worksheet button clicked')
      // TODO: window.location.reload is dirrrrty!!!
      window.location.href = '#/deal/' + dealId + '/edit/finance/' + dealTargetId
      window.location.reload()
      //this.setStep('finance')
    }

    rowComponent.defaultProps.onCreateWorksheetClicked = this.onCreateWorksheetClicked
    rowComponent.defaultProps.onCreateWorksheetsClicked = this.onCreateWorksheetsClicked
    rowComponent.defaultProps.onEditWorksheetClicked = this.onEditWorksheetClicked
    rowComponent.defaultProps.onWorksheetSelected = this.onWorksheetSelected

    return (
      <div className='cart-ui kiosk'>
        <Alert bsStyle='info' className='no-margin-bottom no-margin-top' style={{ padding: '0.75rem 1.25rem' }}>
          <i className='fa fa-fw fa-info-circle'/> <strong>Notice!</strong> New vehicle selections have been recommended based on application progress. Please (re)select your vehicles.
        </Alert>
        <Row>
          <QcCart
            ref={(cart) => this.vehicleSelectionComponent = cart}
            containerComponent={containerComponent}
            rowComponent={rowComponent}
            onCartItemClicked={(e) => {
              if (typeof e !== 'undefined') {
                e.preventDefault()
                e.stopPropagation()
              }

              console.log('CART ITEM CLICKED')
              console.log(e)

              //this.onCartItemClicked()
            }}
            display={this.state.displayCart}
          />
        </Row>
      </div>
    )
  }
}

// Decorate...
export default CartDecorator(
  // ...the component
  KioskCartComponent
)

export { KioskCartComponent }
