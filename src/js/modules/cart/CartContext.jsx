import assign from 'object-assign'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dispatcher } from 'flux'
import { inject, observer } from 'mobx-react'

import FormHelper from '../../helpers/Form.js'

import createCartActions from './CartActions.jsx'
import { CartStore } from './CartStore.jsx'

let createCartContextManager = (componentClass, exposedMethods) => {
  let dispatcher = new Dispatcher()
  let actions = createCartActions(dispatcher)
  let store = new CartStore(dispatcher)

  let cartContextValue = assign({
    component: componentClass,
    dispatcher: dispatcher,
    actions: actions,
    store: store
  }, exposedMethods)

  let subscribers = []

  let getCartContextValue = () => {
    return cartContextValue
  }

  let subscribe = (subscriber) => {
    subscribers.push(subscriber)

    return () => {
      subscribers = subscribers.filter((s) => {
        return s !== subscriber
      })
    }
  }

  let getSubscribers = () => {
    return subscribers
  }

  let notifySubscribers = (state) => {
    console.log('NOTIFY SUBSCRIBERS')
    cartContextValue = state
    subscribers.forEach((callback) => {
      return callback(cartContextValue)
    })
  }

  return {
    getCartContextValue: getCartContextValue,
    getSubscribers: getSubscribers,
    notifySubscribers: notifySubscribers,
    subscribe: subscribe
  }
}

let INSTANCE_COUNTER = 0

/**
 * This higher-order component wraps an existing component, decorating it with methods needed to interact
 * with the shopping cart.
 */
export default (ComposedComponent) => {
  let displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component'

  @inject(deps => ({
    //actions: deps.actions,
    authService: deps.authService,
    customerService: deps.customerService,
    checkoutService: deps.checkoutService,
    settingService: deps.authService,
    loginStore: deps.loginStore,
    userStore: deps.userStore,
    customerStore: deps.customerStore,
    catalogStore: deps.catalogStore,
    cartStore: deps.cartStore,
    checkoutStore: deps.checkoutStore,
    starMicronicsStore: deps.starMicronicsStore,
    productStore: deps.productStore,
    settingStore: deps.settingStore,
    mappings: deps.mappings, // Mappings correlate directly to stores
    // For instance, if the store dep is named 'cartStore', we would expect its mappings to be under the object key 'cartStore'
    translations: deps.translations, // i8ln transations
    roles: deps.roles, // App level roles, general authenticated user (not customer!)
    userRoles: deps.userRoles, // Shortcut or implement via HoC?
    user: deps.user // Shortcut or implement via HoC?
  })) @observer
  class CartContext extends Component {
    static contextTypes = {
      cartContextManager: PropTypes.object,
      cart: PropTypes.object
    }

    static childContextTypes = {
      cartContextManager: PropTypes.object,
      cart: PropTypes.object
    }

    constructor(props, context) {
      super(props)

      this.INSTANCE_ID = INSTANCE_COUNTER++

      console.log('INITIALIZING CARTCONTEXT ' + this.INSTANCE_ID)

      this.getDecoratedComponentInstance = this.getDecoratedComponentInstance.bind(this)
      this.getContextManager = this.getContextManager.bind(this)
      this.getContextValue = this.getContextValue.bind(this)
      this.getChildContext = this.getChildContext.bind(this)
      this.getSelection = this.getSelection.bind(this)
      this.isEmpty = this.isEmpty.bind(this)
      this.hasItems = this.hasItems.bind(this)
      this.categoryClicked = this.categoryClicked.bind(this)
      this.itemClicked = this.itemClicked.bind(this)
      this.optionClicked = this.optionClicked.bind(this)
      this.optionClicked = this.optionClicked.bind(this)
      this.itemDropped = this.itemDropped.bind(this)
      this.addToCart = this.addToCart.bind(this)
      this.quickAddToCart = this.quickAddToCart.bind(this)
      this.addToCartClicked = this.addToCartClicked.bind(this)
      this.refresh = this.refresh.bind(this)
      this.reset = this.reset.bind(this)
      this.getTotal = this.getTotal.bind(this)
      this.doCheckout = this.doCheckout.bind(this)

      this.state = {
        blockUi: false,
        chooseQuantity: false,
        settings: {}
      }

      let classMethods = {
        getContextManager: this.getContextManager,
        getContextValue: this.getContextValue,
        getSelection: this.getSelection,
        addToCart: this.addToCart,
        quickAddToCart: this.quickAddToCart,
        addToCartClicked: this.addToCartClicked,
        getTotal: this.getTotal,
        doCheckout: this.doCheckout
      }

      this.cartContextManager = createCartContextManager(this, classMethods)

      const cartContextValue = this.cartContextManager.getCartContextValue()
      const store = cartContextValue.store

      store.addListener('change', () => {
        console.log('CartContext CHANGE event emitted in instance ' + this.INSTANCE_ID)
        let payload = this.cartContextManager.getCartContextValue()
        this.cartContextManager.notifySubscribers(payload)
      })
    }

    getContextManager() {
      return this.cartContextManager
    }

    getContextValue() {
      return this.cartContextManager.getCartContextValue()
    }

    getChildContext() {
      //console.log('CartContext.getChildContext')
      //console.log('cartContextManager')
      //console.log(this.cartContextManager)
      //console.log('cartContextValue')
      //console.log(this.cartContextManager.getCartContextValue())
      //console.log('CartContext subscribers')
      //console.log(this.cartContextManager.getSubscribers())
      return {
        cartContextManager: this.cartContextManager,
        cart: this.cartContextManager.getCartContextValue()
      }
    }

    componentDidMount() {// CartContext.componentDidMount
      //this.context.actions.init(this.props.items, this.context.store.getSelection())
      this.cartContextManager.subscribe((data) => {
        //console.log('update CART with data')
        //console.log(data)
        this.forceUpdate()
      })
    }

    componentWillReceiveProps() {
      let payload = this.cartContextManager.getCartContextValue()
      //console.log('component received new props dump context val')
      //console.log(payload)
      this.cartContextManager.notifySubscribers(payload)
    }

    getDecoratedComponentInstance() {
      /*invariant(
       this.child,
       'In order to access an instance of the wrapped component it can not be a stateless component.',
       )*/
      return this.wrappedInstance
    }

    getStore() {
      const cartContextValue = this.cartContextManager.getCartContextValue()
      return cartContextValue.store
    }

    getSelection() {
      return this.getStore().getSelection()
    }

    isEmpty() {
      return this.getStore().isEmpty()
    }

    hasItems() {
      let selection = this.getStore().getSelection() || null
      return (selection instanceof Array && selection.length > 0)
    }

    categoryClicked(e, item) {
      /*let stepId = 'cart'
       let stepDescriptor = this.stepper.getStepById(stepId) || null

       if (stepDescriptor !== null) {
       // Clear existing selections
       if (this.stepper.getSelection().length > 0) {
       this.stepper.clear()
       }

       let data = item

       let isEnded = false
       // Execute the step handler
       this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
       }*/
    }

    /*itemClicked(e, item) {
     // If the Quick Add button was clicked
     if (e.target.type === 'button') {
     this.addToCartClicked(e, item)
     return
     }
     let stepId = 'options'
     let stepDescriptor = this.stepper.getStepById(stepId) || null
     if (stepDescriptor !== null) {
     let data = item
     let isEnded = false
     // Execute the step handler
     this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
     // TODO: Replace with mapping!
     this.stepper.addItem(item['product_id'], 1, item)
     }
     }*/

    /**
     * onItemClicked must be implemented in the extending class?
     */
    itemClicked(e, item) {
      // CartComponent itemClicked
      e.preventDefault()
      e.stopPropagation()

      // If the Quick Add button was clicked
      if (e.target.type === 'button') {
        this.addToCartClicked(e, item)
      }

      //this.context.actions.product.setProduct(item)
    }

    itemDropped(item) {
      //let cart = this.getCart()

      //let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ?
      // this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
    }

    optionClicked(item) {
      // TODO: Check what type of options etc... I have written code for this just need to port it over from the previous app
      /*let stepId = 'checkout'
       let stepDescriptor = this.stepper.getStepById(stepId) } || null
       if (typeof stepDescriptor !== null) {
       let data = item
       let isEnded = false
       // Execute the step handler
       this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
       }*/

      console.log('option clicked')
      console.log(item)

      let product = this.state.item

      this.stepper.addOption(item['product_option_value_id'], 1, item, product)
      this.forceUpdate() // Redraw, options have changed
    }

    addToCart(e, item, quantity) {
      // CartContext.addToCart
      e.preventDefault()
      e.stopPropagation()

      let itemMappings = this.props.mappings.inventoryItem
      let itemId = null

      quantity = !isNaN(quantity) ? Number(quantity) : null

      if (quantity === null) {
        quantity = 0

        switch (this.props.addToCartMode) {
          case 'instant':
            // Temporarily store the selected product's information
            quantity = 1

            break
          case 'popup':
            if (!this.state.chooseQuantity) {
              quantity = parseFloat(this.keypad.getForm().value)
            }

            break
          case 'normal':
            if (this.state.chooseQuantity) {
              // If the keypad popup modal is open, use its value
              quantity = parseFloat(this.popupKeypad.getForm().value)
            } else {
              quantity = parseFloat(this.keypad.getForm().value)
            }

            break
          default:
            if (this.state.chooseQuantity) {
              // If the keypad popup modal is open, use its value
              quantity = parseFloat(this.popupKeypad.getForm().value)
            } else {
              quantity = parseFloat(this.keypad.getForm().value)
            }

            break
        }
      }

      if (!isNaN(quantity) && quantity > -1) {
        if (this.wrappedInstance.hasOwnProperty('stepper')) {
          item = this.wrappedInstance.stepper.getItem(0) // Hardcoded to zero indexed item, should be fine because we explicitly clear the stepper selection
        }

        item = item || null

        if (item === null) throw new Error('Attempted to add non-item to cart!')

        itemId = FormHelper.getMappedValue(itemMappings.ITEM_ID, item)

        this.cartContextManager.getCartContextValue().actions.addItem(itemId, quantity, item)

        if (this.wrappedInstance.hasOwnProperty('keypad')) {
          this.wrappedInstance.keypad.component.clear()
        }

        if (this.wrappedInstance.hasOwnProperty('stepper')) {
          this.wrappedInstance.stepper.start()
        }

        // TODO: This is old school use of SettingStore settings, for previous quickcommerce-react apps only
        /*let settings = this.props.settingStore.getSettings().posSettings
        if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
          console.log('pinned category, auto select category : ' + settings['pinned_category'])
          this.categoryClicked(null, {category_id: settings['pinned_category_id']})
        } else {
          //this.setStep('shop') // TODO: Uncomment
        }*/
      } else {
        alert('Please enter the desired quantity.')
      }

      this.forceUpdate()
    }

    quickAddToCart(e) {
      // CartContext.quickAddToCart
      this.addToCart(e) // Add to cart
      if (this.wrappedInstance.hasOwnProperty('popupKeypad')) {
        this.wrappedInstance.popupKeypad.component.clear()
      }

      // Close quantity keypad popup modal
      this.setState({chooseQuantity: false})
    }

    addToCartClicked(e, item, quantity) {
      // CartContext.addToCartClicked
      let actions = this.props.actions

      let itemMappings = this.props.mappings.inventoryItem
      let itemId = null

      // Home component addToCartClicked
      e.preventDefault()
      e.stopPropagation()

      /*let stepId = 'options'
       let stepDescriptor = this.wrappedInstance.stepper.getStepById(stepId) || null
       if (stepDescriptor !== null) {
       let data = item
       let isEnded = false
       // Execute the step handler
       this.wrappedInstance.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
       this.wrappedInstance.stepper.addItem(item.id, 1, item)
       }*/

      switch (this.props.addToCartMode) {
        case 'instant':
          // Temporarily store the selected product's information
          itemId = FormHelper.getMappedValue(itemMappings.ITEM_ID, item)
          if (this.wrappedInstance.hasOwnProperty('stepper')) {
            this.wrappedInstance.stepper.addItem(itemId, 1, item)
          }

          this.addToCart(e, item, quantity) // Add the item to the cart

          break
        case 'popup':
          // Temporarily store the selected product's information (yes, that's right, zero quantity)
          itemId = FormHelper.getMappedValue(itemMappings.ITEM_ID, item)

          if (this.wrappedInstance.hasOwnProperty('stepper')) {
            this.wrappedInstance.stepper.addItem(itemId, 0, item) // Don't set a quantity just register the item
          }

          // And open the Keypad / Quantity selection modal
          this.setState({chooseQuantity: true})

          break
        case 'normal':
          // Go to the product detail page / component (unless we're there already?)
          break
        default:
          break
      }
    }

    refresh() {
      if (this.wrappedInstance.hasOwnProperty('keypad')) {
        this.wrappedInstance.keypad.setField('value', 0)
      }

      this.setState({ canSubmit: !this.childContext.store.isEmpty() })
    }

    reset() {
      if (this.wrappedInstance.hasOwnProperty('keypad')) {
        this.keypad.setField('value', 0)
      }

      this.childContext.actions.cart.emptyCart()

      if (this.wrappedInstance.hasOwnProperty('checkoutNotes')) {
        this.wrappedInstance.checkoutNotes.component.clear()
      }

      if (this.wrappedInstance.hasOwnProperty('stepper')) {
        let stepId = 'shop'
        let stepDescriptor = this.wrappedInstance.stepper.getStepById(stepId) || null

        if (typeof stepDescriptor !== null) {
          let data = {}

          let isEnded = false
          // Execute the step handler
          this.wrappedInstance.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
        }
      }
    }

    getTotal() {
      let total = 0
      return total
    }

    doCheckout() {
      this.props.showChargeModal(function () {
        window.location.href = '#/checkout'
      })
    }

    render() {
      let props = assign({}, this.props, {
        getContextManager: this.getContextManager,
        getContextValue: this.getContextValue,
        getSelection: this.getSelection,
        addToCart: this.addToCart,
        quickAddToCart: this.quickAddToCart,
        addToCartClicked: this.addToCartClicked,
        getTotal: this.getTotal,
        doCheckout: this.doCheckout
      })

      return (
        <ComposedComponent
          ref={(instance) => this.wrappedInstance = instance}
          {...props}
        />
      )
    }
  }

  return CartContext
}
