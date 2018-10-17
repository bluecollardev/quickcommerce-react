class TempMethods {
  constructor() {
    // Dump removed methods
    this.getSelection = this.getSelection.bind(this)
    this.hasItems = this.hasItems.bind(this)

    this.openCart = this.openCart.bind(this)
    this.toggleCart = this.toggleCart.bind(this)
    this.completeOrder = this.completeOrder.bind(this)
    this.showCompleteModal = this.showCompleteModal.bind(this)
    this.hideCompleteModal = this.hideCompleteModal.bind(this)
    this.getTotal = this.getTotal.bind(this)

    this.onComplete = this.onComplete.bind(this)
    this.onSaleComplete = this.onSaleComplete.bind(this)
  }

  getDefaultSettings() {
    const { customerStore } = this.props

    let customerId = 0

    if (customerStore.customer.hasOwnProperty('customer_id') && !isNaN(customerStore.customer['customer_id'])) {
      let storeCustomerId = parseInt(customerStore.customer['customer_id'])
      if (storeCustomerId > 0) {
        customerId = storeCustomerId
      }
    }

    // TODO: Revamp this when we drop in a settings page that actually does something
    // It's a qc-react feature, out of scope for Indigo project
    return {
      config_country_id: 38, // Hard-code to Canada
      config_zone_id: 602, // Hard-code to Alberta
      config_customer_id: customerId, // Codes are for existing (3) / built-in (1) customer types, 2 indicates custom customer
      config_customer_group_id: 1, //POS_a_country_id: this.props.dealStore.payload.order.paymentCountryId,
      config_customer_type: (customerId > 0) ? 3 : 1, //POS_a_zone_id: this.props.dealStore.payload.order.paymentZoneId,
      POS_initial_status_id: 1,
      POS_c_id: customerId,
      POS_customer_group_id: 1,
      POS_c_type: (customerId > 0) ? 3 : 1
    }
  }

  // TODO: This is commented out - I forget why...
  //this.props.dealStore.removeListener('set-order', this.onSetOrder)

  //this.props.settingStore.removeListener('store-info-loaded', this.onStoreInfoLoaded)
  //this.props.settingStore.removeListener('settings-loaded', this.onSettingsLoaded)

  //this.props.dealStore.removeListener('block-ui', this.onBlockUI)
  //this.props.dealStore.removeListener('unblock-ui', this.onUnblockUI)

  //this.props.dealStore.removeListener('set-customer', this.onSetCustomer)
  //this.props.dealStore.removeListener('set-order-status', this.onSetOrderStatus)
  //this.props.dealStore.removeListener('set-notes', this.onSetNotes)

  getSelection() {
    //return this.props.cartStore.getSelection()
  }

  hasItems() {
    //let selection = this.props.cartStore.getSelection() || null
    //return (selection instanceof Array && selection.length > 0)
  }

  completeOrder() {
    // Grab the total, by completing the order we're gonna wipe out the totals
    let orderTotal = parseFloat(this.props.dealStore.getTotal().value)
    // Create the order
    this.props.dealService.doCheckout((data) => {
      // onSuccess handler
      if (this.state.customPaymentAmount) {
        // Get amount
        let cashAmount = null
        if (typeof this.customPaymentAmount !== 'undefined' && this.customPaymentAmount !== null) {
          cashAmount = parseFloat(this.customPaymentAmount.value)

          this.setState({
            charge: null,
            cashAmount: (cashAmount).toFixed(2),
            changeAmount: (cashAmount - orderTotal).toFixed(2),
            prevCheckout: assign({}, this.state.checkout)
          }, () => {
            let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
            cart.clearCart()

            this.checkoutNotes.component.clear()

            this.showCompleteModal()
          })
        } else {
          throw new Error('something went wrong with cash amount')
          // TODO: This is a kind of a stupid error message I can handle this better
        }
      } else {
        this.setState({
          charge: null,
          prevCheckout: assign({}, this.state.checkout)
        }, () => {
          let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
          cart.clearCart()

          this.checkoutNotes.component.clear()

          this.showCompleteModal()
        })
      }
    }, (data) => {
      // onError handler
      this.setState({ charge: null })
    })
  }

  onSetOrderStatus() {
    let { customerStore, dealStore, dealService } = this.props

    if (typeof customerStore.customer !== 'undefined' && customerStore.customer !== null) {
      // Just handle, customer should be set to dealStore
      // Just handle, customer should be set to dealStore
      dealStore.setExistingCustomer(customerStore.customer)

      // Payloard order exists
      if (dealStore.payload.hasOwnProperty('order') && dealStore.payload.order !== null) {
        // Do we update?
        if (dealStore.payload.order.hasOwnProperty('orderId') && !isNaN(dealStore.payload.order.orderId) && dealStore.payload.order.orderId > 0) {

          // TODO: Fix me! I'm hardcoded
          // Change country and zone to customer default address
          dealService.updateOrder(dealStore.payload.order.orderId, assign({}, dealStore.payload.order, {
            action: 'updateOrderStatus',
            defaultSettings: this.getDefaultSettings()
          }), (payload) => {
            dealStore.setOrder(payload)
            //dealService.fetchOrder(dealStore.payload.order.orderId)
          })
          // No orderId detected in the payload order, let's try create instead
        }
      }
    }
  }

  onComplete() {
  }

  onSaleComplete() {
    /*let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
     cart.clearCart()

     this.setState({
     complete: null,
     charge: null
     })

     let stepId = 'shop'
     let instance = this.stepper.getStepById(stepId)

     if (typeof instance !== 'undefined' && instance !== 'null') {
     let data = {}
     let isEnded = false

     // Execute the step handler
     instance.execute(data, isEnded)

     // Update our component state
     this.setStep(stepId)
     }*/
  }

  onItemChanged(item, quantity, oldQuantity) {
    let { customerStore, dealStore, dealService } = this.props

    console.log('item quantity changed')
    console.log(item)
    console.log('qty: ' + quantity)
    console.log('old qty: ' + oldQuantity)

    // TODO: Move this whole chunk of logic to the CartAction, or a Cart ActionCreator?
    if (dealStore.orderIsSet()) {
      let orderProductId = 0
      let orderProducts = []

      if (dealStore.payload.orderProducts instanceof Array) {
        orderProducts = dealStore.payload.orderProducts
      }

      for (let idx = 0; idx < orderProducts.length; idx++) {
        // TODO: Use mappings!
        if (parseInt(orderProducts[idx].productId) === parseInt(item.data['product_id'])) {
          orderProductId = orderProducts[idx].orderProductId
        }
      }

      // TODO: Use mappings!
      let orderProduct = assign({}, item, {
        product_id: parseInt(item['product_id']),
        quantity: quantity
      })

      let optionTotal = dealStore.calculateOptionTotal(parseInt(item.data['product_id']), item)
      let orderProductPrice = parseFloat(item.data['price']) + optionTotal
      let orderTaxRates = dealStore.getOrderTaxRates()

      let lineTotal = orderProductPrice * quantity
      let lineTotalWithTax = dealStore.calculateWithTaxes(lineTotal, item.data['tax_class_id'])
      let lineTax = dealStore.calculateTaxes(lineTotal, item.data['tax_class_id'])

      orderProduct = assign(orderProduct, item.data, {
        total: lineTotal,
        tax: lineTax
      })

      dealService.updateOrder(dealStore.payload.order.orderId, {
        action: 'modifyQuantity',
        orderProduct: orderProduct,
        orderProductId: orderProductId, //orderOptions: orderOptions,
        quantityBefore: oldQuantity,
        quantityAfter: quantity,
        orderTaxRates: orderTaxRates
      }, (payload) => {
        dealStore.setOrder(payload)
        //dealService.fetchOrder(dealStore.payload.order.orderId)
      })
    }
  }

  onProductOptionsChanged(item, quantity, product) {
    let { customerStore, dealStore, dealService } = this.props

    console.log('product options changed')
    console.log(item)
    console.log('qty: ' + quantity)

    if (dealStore.orderIsSet()) {
      let lineTotal = item['price'] * quantity
      let lineTotalWithTax = dealStore.calculateWithTaxes(lineTotal, item['tax_class_id'])
      let lineTax = dealStore.calculateTaxes(lineTotal, item['tax_class_id'])

      let orderProductId = 0
      // Grab associated orderProduct
      let orderProduct = dealStore.payload.orderProducts.filter(orderProduct => {
        // TODO: Use mappings
        return orderProduct.productId === parseInt(product['product_id'])
      })

      if (orderProduct instanceof Array && orderProduct.length === 1) {
        orderProductId = orderProduct[0].orderProductId
      }

      /*let orderProduct = assign({}, item, {
       product_id: parseInt(item['id']),
       quantity: quantity, // TODO: Inject quantity
       total: lineTotal,
       tax: lineTax
       })*/

      // TODO: Promises would probably work better here
      let orderTaxRates = dealStore.getOrderTaxRates()
      // TODO: Use mappings!
      let orderOptions = dealStore.getOrderOptions(parseInt(product['product_id']), orderProductId)

      dealService.updateOrder(dealStore.payload.order.orderId, {
        action: 'update', //orderProduct: orderProduct,
        orderProductId: orderProductId,
        orderOptions: orderOptions, //quantityBefore: oldQuantity,
        //quantityAfter: quantity,
        orderTaxRates: orderTaxRates,
        defaultSettings: this.getDefaultSettings()
      }, (payload) => {
        dealStore.setOrder(payload)
        //dealService.fetchOrder(dealStore.payload.order.orderId)
      })
    }
  }

  onSetNotes() {
    let { customerStore, dealStore, dealService } = this.props

    if (typeof customerStore.customer !== 'undefined' && customerStore.customer !== null) {
      // Just handle, customer should be set to dealStore
      dealStore.setExistingCustomer(customerStore.customer)

      // Payload order exists
      if (dealStore.payload.hasOwnProperty('order') && dealStore.payload.order !== null) {
        // Do we update?
        if (dealStore.payload.order.hasOwnProperty('orderId') && !isNaN(dealStore.payload.order.orderId) && dealStore.payload.order.orderId > 0) {

          // TODO: Fix me! I'm hardcoded
          // Change country and zone to customer default address
          dealService.updateOrder(dealStore.payload.order.orderId, assign({}, dealStore.payload.order, {
            action: 'updateNotes',
            defaultSettings: this.getDefaultSettings()
          }), (payload) => {
            dealStore.setOrder(payload)
            //dealService.fetchOrder(dealStore.payload.order.orderId)
          })
          // No orderId detected in the payload order, let's try create instead
        }
      }
    }
  }

  showCompleteModal() {
    // Hide the charge modal, if for any reason it is visible
    this.setState({
      complete: 1,
      checkout: {
        system: {
          currency: CURRENCY,
          drawer: CASH_IN_DRAWER
        },
        store: this.props.settingStore.getStoreData(),
        order: this.props.dealStore.getOrderDetails(),
        items: this.props.cartStore.selection, // Should already be available via getOrderDetails?
        // Just a thought....
        totals: this.props.dealStore.getTotals(),
        total: this.props.dealStore.getTotal()
      }
    }, () => {
      this.openDrawer()
      this.printOrder()
    })
  }

  hideCompleteModal() {
    this.setState({ complete: null })
  }

  getTotal() {
    let total = 0

    /*if (typeof this.refs.cart !== 'undefined' && this.refs.cart !== null) {
     let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
     }*/

    return total
  }

  toggleCart() {
    // DealPage.toggleCart
    this.setState({ isCartOpen: !this.state.isCartOpen })
  }

  openCart() {
    this.setState({ isCartOpen: true })
  }
}
