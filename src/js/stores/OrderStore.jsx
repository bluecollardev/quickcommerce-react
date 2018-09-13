import OrderConstants from '../constants/OrderConstants.jsx'

import HashTable from '../utils/HashTable.js'

import BaseStore from './BaseStore.jsx'
import CustomersDecorator from './decorators/CustomersDecorator.jsx'
import AssociationsHashTableDecorator from './decorators/AssociationsHashTableDecorator.jsx'

// Not a singleton store, this is an abstract class to inherit from
class OrderStore extends BaseStore {
  constructor(dispatcher, stores) {
    super(dispatcher, stores)

    this.variants = new HashTable()
  }

  registerToActions(action) {
    switch (action.actionType) {
      case OrderConstants.NEW_ORDER:
        this.newOrder(action.customer)
        break
      case OrderConstants.SET_ORDER:
        this.setOrder(action.order)
        break
      case OrderConstants.SET_ORDER_VARIANT:
        this.setVariant(action.key, action.variant)
        break
      case OrderConstants.SET_ORDER_VARIANTS:
        this.setVariants(action.keyProperty, action.variant)
        break
      case OrderConstants.SET_BUILTIN_CUSTOMER:
        this.setBuiltInCustomer(action.customer)
        this.emit('set-customer', 'builtin')
        break
      case OrderConstants.SET_CUSTOM_CUSTOMER:
        this.setCustomCustomer(action.customer)
        this.emit('set-customer', 'custom')
        break
      case OrderConstants.SET_EXISTING_CUSTOMER:
        this.setExistingCustomer(action.customer)
        this.emit('set-customer', 'existing')
        break
      case OrderConstants.SET_ADDITIONAL_CUSTOMERS:
        this.setAdditionalCustomers(action.customers, action.key, action.silent)
        this.emit('set-additional-customers') // TODO: No silent support yet here :(
        break
      case OrderConstants.SET_BILLING_ADDRESS:
      //this.setBillingAddress(action.address)
        break
      case OrderConstants.SET_SHIPPING_ADDRESS:
      //this.setShippingAddress(action.address)
        break
      case OrderConstants.SET_PAYMENT_METHOD:
        this.setPaymentMethod(action.code, action.method)
        break
      case OrderConstants.SET_SHIPPING_METHOD:
        this.setShippingMethod(action.code, action.method)
        break
      case OrderConstants.SET_PAYMENT_TYPE:
        this.setPaymentType(action.paymentType)
        break
      case OrderConstants.SET_ORDER_STATUS:
        this.setOrderStatus(action.status)
        break
      case OrderConstants.SET_NOTES:
        this.setNotes(action.notes)
        break
      default:
        break
    }
  }

  getOrderDetails(orderId) {
    throw new Error('Not implemented') // TODO: Make a real exception class
  }

  getDetails(orderId) {
    throw new Error('Not implemented') // TODO: Make a real exception class
  }

  /**
   * Privately invoked.
   */
  doCheckout(orderAction) {
    orderAction = orderAction || null

    // Only accept 'insert' action to create a new order
    if (orderAction.action !== 'insert') {
      // Do something
    }

    //let orderId = this.newOrder(orderAction.customer)
    this.newOrder(orderAction.customer)
  }

  /**
   * Privately invoked.
   */
  newOrder(customer) {
    throw new Error('Not implemented') // TODO: Make a real exception class
  }

  setOrder(orderPayload) {
    this.payload = orderPayload // TODO: Use mappings(?)
    this.emit('set-order')
  }

  setOrderStatus(status) {
    this.orderStatus = status
    this.emit('set-order-status')
  }

  clearOrder(onSuccess, onError) {
    let that = this

    if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
      if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
      }
    }
  }

  /**
   * TODO: There are no references to this in this project.
   * If there are no projects using this, deprecate and delete.
   * @param item
   * @param callback
   */
  processSelectionOptions(item, callback) {
    // Process selected item options
    if (item.options instanceof Array) {
      let selected = item.options

      // Just a simple loop over selected options 
      // Don't worry about performance there won't be a million of these
      for (let idx = 0; idx < selected.length; idx++) {
        let fn = callback
        fn.call(this, selected[idx], item._key, parseInt(item.id))
      }
    }
  }

  /**
   * TODO: There are no references to this in this project.
   * If there are no projects using this, deprecate and delete.
   * @param selection
   * @param data
   */
  createPayloadOption(selection, data) {
    throw new Error('Not implemented') // TODO: Make a real exception class
  }

  /**
   * TODO: There are no references to this in this project.
   * If there are no projects using this, deprecate and delete.
   * @param selectionOption
   * @param payloadOption
   */
  updatePayloadOption(selectionOption, payloadOption) {
    throw new Error('Not implemented') // TODO: Make a real exception class
  }

  /**
   * Builds an array of order options which we will send to the server later.
   * This method returns an object that we store to this.payload.orderOptions,
   * which correlates to the server DTO.
   */
  getOrderOptions(productId, orderProductId) {
    throw new Error('Not implemented') // TODO: Make a real exception class
  }

  setNotes(notes) {
    this.payload.order.comment = notes // TODO: Clean and sanitize!
    this.emit('set-notes', notes)
  }
}

export default AssociationsHashTableDecorator(CustomersDecorator(OrderStore))
export { OrderStore }
