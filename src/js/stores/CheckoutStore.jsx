import assign from 'object-assign'

import axios from 'axios'
import { normalize, denormalize, schema } from 'normalizr'

import BaseStore from './BaseStore.jsx'
import SettingStore from './SettingStore.jsx'
import CustomerStore from './CustomerStore.jsx'
import LoginStore from './LoginStore.jsx'
import CartStore from '../modules/CartStore.jsx'

//import jwt_decode from 'jwt-decode'

import SettingActions from '../actions/SettingActions.jsx'
import CustomerActions from '../actions/CustomerActions.jsx'
import CheckoutConstants from '../constants/CheckoutConstants.jsx'

let instance = null

class CheckoutStore extends BaseStore {
    constructor() {
        super()
		
		if (instance !== null) {
            return instance
        }

        this.starPrinter = {
            isConnected: false,
            name: null,
            portName: null,
            macAddress: null
        }

        this.customer = null

        this.stores = SettingStore.stores

        // Order payload
        this.payload = {
            order: {},
            orderProducts: [],
            orderOptions: {},
            orderPayments: null,
            orderTotals: {},
            orderCustomer: null,
            shipping: null,
            leftStock: null
        }

        // Data
        this.settings = {
            cartConfig: {
                countries: {}
            },
            posConfig: {}
        }

        this.items = {}

        // VEST Only
        this.availableTracks = [] // Just so we don't forget VEST
        this.availableDates = [] // VEST as well
        this.unavailableDates = [] // Bookings

        // Selections
        this.category = null
        this.product = {
            product_id: null,
            option: []
        }

        this.billingAddress = null
        this.shippingAddress = null
        this.paymentMethod = null
        this.shippingMethod = null
        this.paymentType = null
        this.stepForward = false
        this.config = null

        // Just monkey patch the parent method
        this.subscribe(() => this.registerToActions.bind(this))

        // TODO: Move these into the root consuming components
        // Having stores listen to stores is an anti-pattern in Flux 
        // architecture as it violates unidirectional data flow
        // I'm leaving this here for now because I'm still deciding on
        // whether or not to use Flux / Redux, and their implementations
        // are different
        SettingActions.fetchStore(8)
        
        SettingStore.on('store-info-loaded', (id, payload) => {
            this.stores[id] = payload
        }) // Load ACE bar store data so we don't have to later

        // Maybe we should make this some kind of configuration option?

        SettingActions.fetchSettings()
        
        SettingStore.on('settings-loaded', (payload) => {
            this.settings = payload

            // We only wanna do this once, so stick 'er right up top
            this.createOrder({
                action: 'insert'
                //orderTaxRates: this.orderTaxRates
            })
        })
        
        CustomerStore.on('CHANGE', () => {
            console.log('customer change detected')
            console.log(CustomerStore.customer)
            console.log(CustomerStore.billingAddress)
            console.log(CustomerStore.shippingAddress)
            
            if (typeof CustomerStore.customer !== 'undefined' && CustomerStore.customer !== null) {
                // Just handle, customer should be set to CheckoutStore
                this.setExistingCustomer()
                
                let customerId = 0
                if (CustomerStore.customer.hasOwnProperty('customer_id') && !isNaN(CustomerStore.customer['customer_id'])) {
                    let storeCustomerId = parseInt(CustomerStore.customer['customer_id'])
                    if (storeCustomerId > 0) {
                        customerId = storeCustomerId
                    }
                }
                
                // Payloard order exists
                if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
                    // Do we update?
                    if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId) &&
                        this.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        this.updateOrder(this.payload.order.orderId, assign({}, this.payload.order, {
                            action: 'update',
                            defaultSettings: {
                                POS_a_country_id: this.payload.order.paymentCountryId,
                                config_country_id: 38, // Hard-code to Canada
                                POS_a_zone_id: this.payload.order.paymentZoneId,
                                config_zone_id: 602, // Hard-code to Alberta
                                POS_initial_status_id: 1,
                                POS_c_id: customerId,
                                config_customer_id: customerId,
                                POS_customer_group_id: 1,
                                config_customer_group_id: 1,
                                // Codes are for existing (3) / built-in (1) customer types, 2 indicates custom customer
                                POS_c_type: (customerId > 0) ? 3 : 1,
                                config_customer_type: (customerId > 0) ? 3 : 1
                            }
                        }), (payload) => {
                            this.fetchOrder(this.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    } else {
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        this.createOrder(assign({}, this.payload.order, {
                            action: 'insert',
                            defaultSettings: {
                                POS_a_country_id: this.payload.order.paymentCountryId,
                                config_country_id: 38, // Hard-code to Canada
                                POS_a_zone_id: this.payload.order.paymentZoneId,
                                config_zone_id: 602, // Hard-code to Alberta
                                POS_initial_status_id: 1,
                                POS_c_id: customerId,
                                config_customer_id: customerId,
                                POS_customer_group_id: 1,
                                config_customer_group_id: 1,
                                // Codes are for existing (3) / built-in (1) customer types, 2 indicates custom customer
                                POS_c_type: (customerId > 0) ? 3 : 1,
                                config_customer_type: (customerId > 0) ? 3 : 1
                            }
                        }), (payload) => {
                            this.fetchOrder(this.payload.order.orderId)
                        })
                    }
                // Payload order doesn't exist, we're gonna have to create it
                } else {
                    // TODO: Fix me! I'm hardcoded
                    // Change country and zone to customer default address
                    this.createOrder(assign({}, {
                        action: 'insert',
                        defaultSettings: {
                            POS_a_country_id: this.payload.order.paymentCountryId,
                            config_country_id: 38, // Hard-code to Canada
                            POS_a_zone_id: this.payload.order.paymentZoneId,
                            config_zone_id: 602, // Hard-code to Alberta
                            POS_initial_status_id: 1,
                            POS_c_id: customerId,
                            config_customer_id: customerId,
                            POS_customer_group_id: 1,
                            config_customer_group_id: 1,
                            // Codes are for existing (3) / built-in (1) customer types, 2 indicates custom customer
                            POS_c_type: (customerId > 0) ? 3 : 1,
                            config_customer_type: (customerId > 0) ? 3 : 1
                        }
                    }), (payload) => {
                        this.fetchOrder(this.payload.order.orderId)
                    })
                }
            }
        })

        // We call this data because it's not a complete item, just a POJO
        CartStore.on('item-added', (itemId, quantity, data) => {
            console.log('item added to order')
            console.log(data)

            if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
                if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
                    let lineTotal = data['price'] * quantity
                    let lineTotalWithTax = this.calculateWithTaxes(lineTotal, data['tax_class_id'])
                    let lineTax = this.calculateTaxes(lineTotal, data['tax_class_id'])

                    // We're mutating the supplied data object by design
                    let orderProduct = assign(data, {
                        product_id: parseInt(itemId),
                        quantity: quantity, // TODO: Inject quantity
                        total: lineTotal,
                        tax: lineTax
                    })

                    let orderTaxRates = this.getOrderTaxRates()
                    let orderOptions = this.getOrderOptions()
                    
                    let customerId = 0
                    if (CustomerStore.customer.hasOwnProperty('customer_id') && !isNaN(CustomerStore.customer['customer_id'])) {
                        let storeCustomerId = parseInt(CustomerStore.customer['customer_id'])
                        if (storeCustomerId > 0) {
                            customerId = storeCustomerId
                        }
                    }

                    this.updateOrder(this.payload.order.orderId, {
                        action: 'insert',
                        orderProduct: orderProduct,
                        orderProductId: 0,
                        orderOptions: orderOptions,
                        productId: data['product_id'],
                        orderTaxRates: orderTaxRates,
                        defaultSettings: {
                            POS_a_country_id: this.payload.order.paymentCountryId,
                            config_country_id: 38, // Hard-code to Canada
                            POS_a_zone_id: this.payload.order.paymentZoneId,
                            config_zone_id: 602, // Hard-code to Alberta
                            POS_initial_status_id: 1,
                            POS_c_id: customerId,
                            config_customer_id: customerId,
                            POS_customer_group_id: 1,
                            config_customer_group_id: 1,
                            // Codes are for existing (3) / built-in (1) customer types, 2 indicates custom customer
                            POS_c_type: (customerId > 0) ? 3 : 1,
                            config_customer_type: (customerId > 0) ? 3 : 1
                        }
                    }, (payload) => {
                        this.fetchOrder(this.payload.order.orderId)
                    })
                }
            }
        })

        CartStore.on('item-changed', (item, quantity, oldQuantity) => {
            console.log('item quantity changed')
            console.log(item)
            console.log('qty: ' + quantity)
            console.log('old qty: ' + oldQuantity)

            if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
                if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
                    let lineTotal = item['price'] * quantity
                    let lineTotalWithTax = this.calculateWithTaxes(lineTotal, item['tax_class_id'])
                    let lineTax = this.calculateTaxes(lineTotal, item['tax_class_id'])

                    let orderProductId = 0
                    for (let idx = 0; idx < this.payload.orderProducts.length; idx++) {
                        if (parseInt(this.payload.orderProducts[idx].productId) === parseInt(parseInt(item['product_id']))) {
                            orderProductId = this.payload.orderProducts[idx].orderProductId
                        }
                    }

                    let orderProduct = assign({}, item, {
                        product_id: parseInt(item['product_id']),
                        quantity: quantity, // TODO: Inject quantity
                        total: lineTotal,
                        tax: lineTax
                    })

                    let orderTaxRates = this.getOrderTaxRates()
                    let orderOptions = this.getOrderOptions()

                    this.updateOrder(this.payload.order.orderId, {
                        action: 'modifyQuantity',
                        orderProduct: orderProduct,
                        orderProductId: orderProductId,
                        orderOptions: orderOptions,
                        quantityBefore: oldQuantity,
                        quantityAfter: quantity,
                        orderTaxRates: orderTaxRates
                    }, (payload) => {
                        this.fetchOrder(this.payload.order.orderId)
                    })
                }
            }
        })
        
        CartStore.on('product-options-changed', (item, quantity, oldQuantity) => {
            console.log('product options changed')
            console.log(item)
            console.log('qty: ' + quantity)
            console.log('old qty: ' + oldQuantity)

            if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
                if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
                    let lineTotal = item['price'] * quantity
                    let lineTotalWithTax = this.calculateWithTaxes(lineTotal, item['tax_class_id'])
                    let lineTax = this.calculateTaxes(lineTotal, item['tax_class_id'])

                    let customerId = 0
                    if (CustomerStore.customer.hasOwnProperty('customer_id') && !isNaN(CustomerStore.customer['customer_id'])) {
                        let storeCustomerId = parseInt(CustomerStore.customer['customer_id'])
                        if (storeCustomerId > 0) {
                            customerId = storeCustomerId
                        }
                    }
                    let orderProductId = 0
                    for (let idx = 0; idx < this.payload.orderProducts.length; idx++) {
                        if (parseInt(this.payload.orderProducts[idx].productId) === parseInt(parseInt(item['product_id']))) {
                            orderProductId = this.payload.orderProducts[idx].orderProductId
                        }
                    }

                    /*let orderProduct = assign({}, item, {
                        product_id: parseInt(item['product_id']),
                        quantity: quantity, // TODO: Inject quantity
                        total: lineTotal,
                        tax: lineTax
                    })*/

                    let orderTaxRates = this.getOrderTaxRates()
                    let orderOptions = this.getOrderOptions()

                    this.updateOrder(this.payload.order.orderId, {
                        action: 'update',
                        //orderProduct: orderProduct,
                        orderProductId: orderProductId,
                        orderOptions: orderOptions,
                        //quantityBefore: oldQuantity,
                        //quantityAfter: quantity,
                        orderTaxRates: orderTaxRates,
                        defaultSettings: {
                            POS_a_country_id: this.payload.order.paymentCountryId,
                            config_country_id: 38, // Hard-code to Canada
                            POS_a_zone_id: this.payload.order.paymentZoneId,
                            config_zone_id: 602, // Hard-code to Alberta
                            POS_initial_status_id: 1,
                            POS_c_id: customerId,
                            config_customer_id: customerId,
                            POS_customer_group_id: 1,
                            config_customer_group_id: 1,
                            // Codes are for existing (3) / built-in (1) customer types, 2 indicates custom customer
                            POS_c_type: (customerId > 0) ? 3 : 1,
                            config_customer_type: (customerId > 0) ? 3 : 1
                        }
                    }, (payload) => {
                        this.fetchOrder(this.payload.order.orderId)
                    })
                }
            }
        })

        CartStore.on('item-removed', (item) => {
            console.log('item removed')
            console.log(item)

            if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
                if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
                    let orderProductId = 0
                    for (let idx = 0; idx < this.payload.orderProducts.length; idx++) {
                        if (parseInt(this.payload.orderProducts[idx].productId) === parseInt(parseInt(item['product_id']))) {
                            orderProductId = this.payload.orderProducts[idx].orderProductId
                        }
                    }

                    let data = assign({}, item, {
                        product_id: parseInt(item['product_id']),
                        quantity: 0
                    })

                    let orderTaxRates = this.getOrderTaxRates()
                    let orderOptions = this.getOrderOptions()

                    this.updateOrder(this.payload.order.orderId, {
                        action: 'modifyQuantity',
                        orderProduct: data,
                        orderProductId: orderProductId,
                        quantityAfter: 0,
                        orderTaxRates: orderTaxRates,
                        orderOptions: orderOptions
                    }, (payload) => {
                        this.fetchOrder(this.payload.order.orderId)
                    })
                }
            }
        })

        CartStore.on('cart-reset', () => {
            console.log('reset checkout store - cart was reset') // TODO: Have clear and reset, they aren't really the same thing

            this.clearOrder()
        })

        CartStore.on('cart-cleared', () => {
            console.log('clearing checkout store - cart was checked-out') // TODO: Have clear and reset, they aren't really the same thing

            // Don't reset, which deletes order, just create a new order
            this.createOrder({
                action: 'insert'
            })
        })

        document.addEventListener('deviceready', () => {
            this.connectToStarPrinter()
        }, false)

        // Easy access while developing app
        window.CheckoutStore = instance = this
    }

    connectToStarPrinter(onSuccess, onError) {
        this.discoverStarPrinterPorts(printerList => {
			printerList = printerList || false

			if (!printerList) {
				return
			}

			// Connect and listen for hardware events (mPOP on iOS only)
			window.plugins.starMicronics.connect(printerList[0].portName, (error, result) => {
				if (error) {
					console.log(error)
					//alert(JSON.stringify(error))
				} else {
					this.starPrinter.name = printerList[0].name
					this.starPrinter.portName = printerList[0].portName
					this.starPrinter.macAddress = printerList[0].macAddress
					this.starPrinter.isConnected = true

					//alert(JSON.stringify(that.starPrinter))
					// Connect and listen for hardware events (mPOP on iOS only)
					window.addEventListener('starIOPluginData', (e) => {
						switch (e.dataType) {
							case 'printerCoverOpen':
								break
							case 'printerCoverClose':
								break
							case 'printerImpossible':
								break
							case 'printerOnline':
								break
							case 'printerOffline':
								break
							case 'printerPaperEmpty':
								break
							case 'printerPaperNearEmpty':
								break
							case 'printerPaperReady':
								break
							case 'barcodeReaderConnect':
								break
							case 'barcodeDataReceive':
								break
							case 'barcodeReaderImpossible':
								break
							case 'cashDrawerOpen':
								break
							case 'cashDrawerClose':
								break
						}
					}) // TODO: Unbind event listener on destruct
				}
			})
        })
    }

    discoverStarPrinterPorts(onSuccess) {
        // Make sure Cordova is initialized
        if (!window.hasOwnProperty('plugins')) {
            throw new Error('Cordova was not detected')
        }

        // Make sure the Star Micronics Cordova plugin is installed and working
        if (!window.plugins.hasOwnProperty('starMicronics')) {
            throw new Error('Star Micronics plugin was not detected')
        }

        window.plugins.starMicronics.portDiscovery('All', (error, printerList) => {
            if (error) {
                console.error(error);
                alert(JSON.stringify(error))
            } else {
				// TODO: Check to make sure it's a function!
                onSuccess(printerList) // Trigger our onSuccess callback
            }
        })
    }

    openDrawer() {
        if (!this.starPrinter.isConnected) return
		
		window.plugins.starMicronics.openCashDrawer(this.starPrinter.portName, (error, result) => {
			if (error) {
				console.log(error)
			} else {
				console.log('Cash drawer opened')
			}
		})
    }

    printOrder(output) {
        if (!this.starPrinter.isConnected) return
		
		this.discoverStarPrinterPorts(printerList => {
			if (!this.starPrinter.isConnected) return
			
			window.plugins.starMicronics.printReceipt(this.starPrinter.portName, output, (error, result) => {
				if (error) {
					console.log(error)
					alert(JSON.stringify(error))
				} else {
					console.log('Receipt printed')
				}
			})
		})
    }

    printReceipt(output) {
        if (!this.starPrinter.isConnected) return
		
		this.discoverStarPrinterPorts(printerList => {
			if (!this.starPrinter.isConnected) return
			
			window.plugins.starMicronics.printReceipt(this.starPrinter.portName, output, (error, result) => {
				if (error) {
					console.log(error)
					alert(JSON.stringify(error))
				} else {
					console.log('Receipt printed')
				}
			})
		})
    }

    printReport(output) {
        if (!this.starPrinter.isConnected) return
		
		this.discoverStarPrinterPorts(printerList => {
			if (!this.starPrinter.isConnected) return
			
			window.plugins.starMicronics.printReceipt(this.starPrinter.portName, output, (error, result) => {
				if (error) {
					console.log(error)
					alert(JSON.stringify(error))
				} else {
					console.log('Receipt printed')
				}
			})
		})
    }

    registerToActions(action) {
        switch (action.actionType) {
            case CheckoutConstants.SET_CUSTOMER:
                this.customer = action.customer
                this.emitChange()
                break
            case CheckoutConstants.SET_ORDER:
                this.order = action.order
                this.emitChange()
                break
            case CheckoutConstants.SET_BILLING_ADDRESS:
                this.billingAddress = action.billingAddress
                this.emitChange()
                break
            case CheckoutConstants.SET_SHIPPING_ADDRESS:
                this.shippingAddress = action.shippingAddress
                this.emitChange()
                break
            case CheckoutConstants.SET_PAYMENT_METHOD:
                this.paymentMethod = action.paymentMethod
                this.emitChange()
                break
            case CheckoutConstants.SET_PAYMENT_TYPE:
                this.paymentType = action.paymentType
                this.emitChange()
                break
            case CheckoutConstants.SET_SHIPPING_METHOD:
                this.shippingMethod = action.shippingMethod
                this.emitChange()
                break
            default:
                break
        }
    }

    isLoggedIn() {
        return !!this.checkout
    }

    registerEventListeners() {
        // TODO: Need a proper auth module for this stuff...
        cartEventHandler.addEventListener('beforeCheckout', () => {
            this.beforeCheckout()
        })

        // TODO: Need a proper auth module for this stuff...
        cartEventHandler.addEventListener('checkoutSuccess', () => {
            this.onCheckoutSuccess()
        })

        // TODO: Need a proper auth module for this stuff...
        cartEventHandler.addEventListener('checkoutError', () => {
            this.onCheckoutError()
        })

        // TODO: Need a proper auth module for this stuff...
        cartEventHandler.addEventListener('checkoutComplete', () => {
            this.onCheckoutComplete()
        })
    }

    // Mirror API methods
    retrieve(orderId) {
        this.getOrderDetails(orderId)
    }

    getOrderDetails(orderId) {
        orderId = orderId || null
        let orderDetails = {} //new PosOrderDetails()

		// Get order model
		/** @var order PosOrder */
		//order = em.find(PosOrder::class, orderId)
		let order = this.payload.order || null

        let buildOrderDetails = (order) => {
            if (order === null) return

            let orderDetails = {} //new PosOrderDetails()

            // onSuccess
            orderDetails.order = order

            //criteria = array('orderId' => orderId)
            // order is found, get the rest of order details

            //serverOrderProducts = em.getRepository(PosOrderProduct::class).findBy(criteria)
            let serverOrderProducts = {} //em.getRepository(PosOrderProduct::class).findBy(criteria)
            let orderProducts = []
            //productRepository = em.getRepository(PosProduct::class)
            for (let serverOrderProduct in serverOrderProducts) {
                orderProduct = {} //new PosOrderProductDetails()
                //orderProduct.cloneParent(serverOrderProduct)
                /** @var product PosProduct */
                //product = productRepository.find(orderProduct.getProductId())
                let product = {}
                orderProduct.image = product.image
                orderProduct.shipping = product.shipping
                orderProduct.updateStock = product.subtract

                orderProducts.push(orderProduct)
            }

            orderDetails.orderProducts = orderProducts

            let customerId = order.customerId
            if (customerId > 0) {
                //orderCustomer = {} //new PosCustomerDetails()
                //orderCustomer.setCustomer(em.find(PosCustomer::class, customerId))
                //orderCustomer.setAddresses(em.getRepository(PosAddress::class).findBy(array('customerId' => customerId)))
                let orderCustomer = this.customer
                orderDetails.orderCustomer = orderCustomer
            }

            /*let orderPaymentDetails = []
            let orderPayments = em.getRepository(PosOrderPayment::class).findBy(criteria)
            if (orderPayments instanceof Array &&
                orderPayments.length > 0) {
                for (let orderPayment in orderPayments) {
                    orderPaymentDetail = {} //new PosOrderPaymentDetails()
                    orderPaymentDetail.orderPayment = orderPayment
                    orderPaymentType = em.find(PosPaymentType::class, orderPayment.getPaymentTypeId())
                    orderPaymentDetail.type = orderPaymentType.type)
                    orderPaymentDetail.name(orderPaymentType.name)

                    orderPaymentDetails.push(orderPaymentDetail)
                }
            }*/

            //orderDetails.setOrderOptions(em.getRepository(PosOrderOption::class).findBy(criteria))
            //orderDetails.setOrderTotals(em.getRepository(PosOrderTotal::class).findBy(criteria, array('sortOrder' => 'ASC')))
            //orderDetails.setOrderPayments(orderPaymentDetails)

            return orderDetails
        }


        if (orderId !== null) {
            if (order !== null && orderId > 0) {
                this.fetchOrder(orderId,
                (data) => {
                    // onSuccess
                    orderDetails = buildOrderDetails(data.order)
                },
                () => {
                    // onError
                })
            }
        } else {
            orderDetails = buildOrderDetails(this.payload.order)
        }

		return orderDetails
    }

    // From here down list utility methods that invoke our mirrored API methods
    fetchOrder(id, onSuccess, onError) {
        console.log('attempting to push product to cart')
        //console.log(JSON.stringify(cartProduct))
        //this.buildDataStore()

        // Emit block ui event
        this.emit('block-ui')

        axios({
            url: QC_API + 'order/' + id,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data
            this.payload = payload

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }

            this.emit('order-fetched')
            this.emit('unblock-ui')
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }

            this.emit('order-fetch-error')
            this.emit('unblock-ui')
        })
    }

    // privately invoked
    doCheckout(orderAction) {
        orderAction = orderAction || null

        // only accept 'insert' action to create a new order
		if (orderAction.action !== 'insert') {
			//throw APIException::orderCannotBeCreated(orderAction)
		}

		// Create an new order
		//let orderId = this.newOrder(orderAction.getDefaultSettings())
		let orderId = this.newOrder()
    }

    createOrder(orderAction, onSuccess, onError) {
        orderAction = orderAction || null

        // only accept 'insert' action to create a new order
		if (orderAction.action !== 'insert') {
			//throw APIException::orderCannotBeCreated(orderAction)
		}

		// Create an new order
		//let orderId = this.newOrder(orderAction.getDefaultSettings())
		let orderId = this.newOrder(orderAction, onSuccess, onError)


		// Add the product to the order
		//this.addItem(orderId, orderAction)
		//this.addItem(orderId)

		// re-calculate totals
		//orderDriver = this.adapter.getOrderDriver()
		//let orderDetails = orderDriver.getOrderDetails(orderId, orderAction.orderTaxRates, orderAction.shipping)

		//return orderDetails
    }

    // privately invoked
    newOrder(settings, onSuccess, onError) {
        settings = assign({
            POS_a_country_id: 38,
            config_country_id: 38, // Canada
            POS_a_zone_id: 602,
            config_zone_id: 602, // Alberta
            POS_c_id: 0,
            config_customer_group_id: 1,
            POS_initial_status_id: 1,
            POS_c_type: 1
        }, settings)

        // create a new empty order with all default settings and return the newly created order id
		this.payload.order = {} //new PosOrder()

		this.payload.order.orderId = 0 // Set to zero to trigger create on server
		this.payload.order.storeId = 0

		let defaultCountryId = this._isset(settings, 'POS_a_country_id') ? settings['POS_a_country_id'] : settings['config_country_id']
		let defaultZoneId = this._isset(settings, 'POS_a_zone_id') ? settings['POS_a_zone_id'] : settings['config_zone_id']

        let customerId = this._isset(settings, 'POS_c_id') ? settings['POS_c_id'] : 0
		let customerGroupId = this._isset(settings, 'POS_c_group_id') ? settings['POS_c_group_id'] : this._isset(settings, 'config_customer_group_id') ? settings['config_customer_group_id'] : 1

        let initialStatusId = this._isset(settings, 'POS_initial_status_id') ? parseInt(settings['POS_initial_status_id']) : 1

		this.payload.order.shippingCountryId = defaultCountryId
		this.payload.order.shippingZoneId = defaultZoneId

        this.payload.order.paymentCountryId = defaultCountryId
		this.payload.order.paymentZoneId = defaultZoneId
		this.payload.order.customerId = customerId
		this.payload.order.customerGroupId = customerGroupId

		let customerType = this._isset(settings, 'POS_c_type') ? parseInt(settings['POS_c_type']) : 1

        switch (customerType) {
			case 1:
				// Use built-in customer
                // TODO: Make this configurable
				this.setBuiltInCustomer(defaultCountryId, defaultZoneId)
				break

			case 2:
				// Use customized customer
				this.setCustomCustomer(settings)
				break

			case 3:
				// Use an existing customer
				this.setExistingCustomer()
				break

			default:
				break
		}

        let store = null
        let storeName = null
        let storeUrl = null

		/** @var store PosStore */
		if (this.payload.storeId) {
			//store = em.find(PosStore::class, order.getStoreId())
			//storeName = store && store.getName() ? store.getName() : ''
			//storeUrl = store && store.getUrl() ? store.getUrl() : ''
		}

		if (storeName !== null) {
			//storeName = settings['config_name'] ? settings['config_name'] : ''
		}
		if (storeUrl !== null) {
			//storeUrl = HTTP_SERVER
		}

		let defaultCurrencyCode = !(typeof settings['config_currency'] === 'undefined') ? settings['config_currency'] : 'USD'
		/** @var currency PosCurrency */
		//currency = em.getRepository(PosCurrency::class).findOneBy(array('code' => defaultCurrencyCode))
		let currency = { currencyId: 5 } // 5 = CAD
        let currencyId = currency.currencyId ? currency.currencyId : 5

        // Specify PATCH action
		this.payload.order.action = 'insert'

        this.payload.order.storeName = storeName
		this.payload.order.storeUrl = storeUrl
		this.payload.order.invoicePrefix = 'pos'
		this.payload.order.shippingMethod = 'instore'
		this.payload.order.shippingCode = 'instore.instore'
		this.payload.order.paymentMethod = 'In Store'
		this.payload.order.paymentCode = 'in_store'
		this.payload.order.comment = ''
		this.payload.order.orderStatusId = initialStatusId
		this.payload.order.customerId = customerId
		this.payload.order.customerGroupId = customerGroupId
		this.payload.order.paymentCountry = 'Canada' //countryName
		this.payload.order.paymentZone = 'Alberta' //zoneName
		this.payload.order.shippingCountry = 'Canada' //countryName
		this.payload.order.shippingZone = 'Alberta' //zoneName
		this.payload.order.currencyCode = 'CAD'
		this.payload.order.currencyId = currencyId
		this.payload.order.dateAdded = new Date() //new \DateTime()
		this.payload.order.dateModified = new Date() //new \DateTime()

        this.payload.order.defaultSettings = settings
        // END PATCH

		//em.persist(order)
		//em.flush()
		//orderId = order.orderId

		this.payload.total = {} //new PosOrderTotal()
		//this.payload.total.orderId = 0
		this.payload.total.code = 'total'
		this.payload.total.value = 0
		this.payload.total.sortOrder = settings['total_sort_order']
		this.payload.total.title = 'Total'

		//em.persist(total)
		//em.flush()

		//return orderId

        axios({
            url: QC_API + 'order/0', // Set ID to 0 to create new...
            data: this.payload.order, //JSON.stringify(cartProduct),
            method: 'PATCH',
            //dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data

            this.payload = assign(this.payload, payload)

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
        })
    }

    /**
     * Used privately by CheckoutStore.patch
     */
    modifyOrder(orderId, posOrderAction) {
        let orderDetails = null

		try {
			// in case orderId is 0, create an order, otherwise, update the order
			if (orderId == 0) {
				orderDetails = this.doCheckout(orderAction)
			} else if (orderId > 0) {
				orderDetails = this.updateOrder(orderId, orderAction)
			} else {
				//throw APIException::orderNotExists(orderId)
			}

			let productId = 0
			if (orderAction.productId) {
				productId = orderAction.productId
			} else if (orderAction.orderProduct) {
				productId = orderAction.orderProduct.productId
			}

            /*result = query.setParameter(1, productId).getArrayResult()

			if (result && count(result) > 0) {
				orderDetails.setLeftStock([(productId => result[0]['quantity'])])
			}*/

			return orderDetails
		} catch (exception) {
			log = this.adapter.getLogger()
			log.debug(exception.getMessage())
			log.debug(exception.getTraceAsString())
		}

		return orderDetails
    }

    /**
     * Used privately by event handlers (item-added, item-changed, item-removed)
     * and invoked by modifyOrder
     */
    updateOrder(orderId, orderAction, onSuccess, onError) {
		let action = orderAction.action

		if (action === 'insert') {
			// add a new order product
			this.addItem(orderId, orderAction, onSuccess)
		} else if (action === 'update') {
            axios({
                url: QC_API + 'order/' + orderId, // Set ID to 0 to create new...
                data: orderAction,
                method: 'PATCH',
                contentType: 'application/json'
            })
            .then(response => {
                let payload = response.data

                //this.payload = assign(this.payload, payload)
                console.log('order patched')
                console.log(this.payload)

                if (typeof onSuccess === 'function') {
                    onSuccess(payload)
                }
            }).catch(err => {
                console.log('error patching order')
                if (typeof onError === 'function') {
                    onError()
                }
            })
        } else {
			let after = orderAction.quantityAfter
			let quantityChange = after - orderAction.quantityBefore

			let productOptionValueIds = []
			//sql = "SELECT oo.productOptionValueId FROM " . PosOrderOption::class . " oo WHERE oo.orderProductId = ?1"
			//foreach (result as record) {
			//	productOptionValueIds[] = record['productOptionValueId']
			//}

			if (action === 'modifyQuantity') {
				if (after > 0) {
					// update the quantity for the given order product id
					//sql = "UPDATE " . PosOrderProduct::class . " op SET op.quantity = " . after . ", op.total = op.price * " . after . " WHERE op.orderProductId = ?1"
				} else {
					// Delete the given order product id and options
					//sql = "DELETE FROM " . PosOrderProduct::class . " op WHERE op.orderProductId = ?1"
					//sql = "DELETE FROM " . PosOrderOption::class . " op WHERE op.orderProductId = ?1"
				}

                this.addItem(orderId, orderAction, onSuccess)

				//this.updateRealStock(orderAction.productId, productOptionValueIds, quantityChange)
			}
		}

		// re-calculate totals
		//orderDriver = this.adapter.getOrderDriver()
		//orderDetails = orderDriver.add(orderId, orderAction.getOrderTaxRates(), orderAction.getShipping())
	}

	clearOrder(onSuccess, onError) {
		let	that = this

        if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
            if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
                axios({
                    //url: QC_RESOURCE_API + 'cart/empty',
                    url: QC_API + 'order/' + this.payload.order.orderId,
                    method: 'DELETE',
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .then(response => {
                    if (typeof onSuccess === 'function') {
                        onSuccess(payload)
                    }

                    that.createOrder({
                        action: 'insert'
                    })
                }).catch(err => {
                    console.log('error patching item to order')
                    if (typeof onError === 'function') {
                        onError()
                    }

                    that.createOrder({
                        action: 'insert'
                    })
                })
            }
        }
	}

    /**
     * Public method
     */
    patch(data, id, attribute) {
        if (attribute === null) {
			// For pattern "PATCH /order/orderId"
			// convert from data to PosOrderAction
			// create a new order if id is 0, otherwise update the order
			let orderAction = {} //new PosOrderAction()

			return this.modifyOrder(id, orderAction)
		} else {
			// For pattern "PATCH /order/orderId/{attribute}"
			// update the attribute for the order only

			let value = data[attribute]

			let result = [] //array(attribute => value)
			if (attribute == 'orderStatusId') {
				let close = false

				let statuses = {} //query.getArrayResult()
				for (let status in statuses) {
					if (parseInt(status['value']) === parseInt(value)) {
						close = true
						break
					}
				}

				result['close'] = close
			}

			return result
		}
    }

    // TODO: Rename this method, it actually handles all updates
    addItem(orderId, orderAction, onSuccess) {
        axios({
            url: QC_API + 'order/' + orderId, // Set ID to 0 to create new...
            data: orderAction,
            method: 'PATCH',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data

            //this.payload = assign(this.payload, payload)
            console.log('item successfully patched to order')
            console.log(this.payload)

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }
        }).catch(err => {
            console.log('error patching item to order')
            if (typeof onError === 'function') {
                onError()
            }
        })
	}

    /**
     * TODO: Double check, but I don't think this is necessary anymore as we are using PATCH
     */
	deleteItem(e) {
		let	that = this

		console.log(e)
		/*var uid = $(e.currentTarget).closest('tr').attr('data-uid'),
			dataItem = that.cartGrid.dataSource.getByUid(uid)

		if (dataItem) {
			axios({
				url: QC_RESOURCE_API + 'cart',
				data: {
					product_id: dataItem.get('key')
				},
				method: 'DELETE',
				dataType: 'json',
				contentType: 'application/json',
				beforeSend: function (request) {
					that.setHeaders(request)
				},
				success: function (response, status, xhr) {
					if (response.success) {
						// Sync? Can't I just clear?
						//that.cartGrid.dataSource.data([])
						//dashboardViewModel.set('product_config', new kendo.data.ObservableObject())
					}
				},
				complete: function () {
					//widget.value(0) // Reset progress bar
					//browser.reset() // Clear menu selection
				}
			})
		}*/
	}

    updateStock(orderProduct, orderOptions) {
		// Update product stock
		let productId = orderProduct.productId
		let quantity = orderProduct.quantity
		let productOptionValueIds = []

        if (orderOptions instanceof Array &&
            orderOptions.length > 0) {
			for (let orderOption in orderOptions) {
				/** @var orderOption PosOrderOption */
				if (orderOption.productOptionValueId) {
					productOptionValueIds.push(orderOption.productOptionValueId)
				}
			}
		}

		this.updateRealStock(productId, productOptionValueIds, quantity)
	}

	updateRealStock(productId, productOptionValueIds, quantity) {
		//this.adapter.getLogger().debug('updating quantity with change ' . quantity . ' for productId ' . productId . ' and productOptionValueIds ' . print_r(productOptionValueIds, true))
		// Update product and option stock
		//sql = "UPDATE " . PosProduct::class . " product SET product.quantity = product.quantity - ?1 WHERE product.productId = ?2 AND product.subtract = '1'"

		if (productOptionValueIds instanceof Array &&
            productOptionValueIds.length > 0) {
			//foreach (productOptionValueIds as productOptionValueId) {
				//sql = "UPDATE " . PosProductOptionValue::class . " value SET value.quantity = value.quantity - ?1 WHERE value.productOptionValueId = ?2 and value.subtract = '1'"
			//}
		}
	}

    // From here down list utility methods that invoke our mirrored API methods
    doCheckout(onSuccess, onError, id) { // ID is last because we only use it when testing, otherwise grab ID from 'model'
        id = id || 0 // Demo
        console.log('attempting to push product to cart')

        // Grab the order
        this.fetchOrder(id, (data) => {
            axios({
                url: QC_API + 'order/' + id,
                data: data, //JSON.stringify(cartProduct),
                method: 'PATCH',
                dataType: 'json',
                contentType: 'application/json',
            })
            .then(response => {
                let payload = response.data

                if (typeof onSuccess === 'function') {
                    onSuccess(payload)
                }

                this.openDrawer()

                this.createOrder({
                    action: 'insert'
                })
            }).catch(err => {
                if (typeof onError === 'function') {
                    onError()
                }
            })
        })
    }

    setHeaders(request) {
		let	that = this,
			customer = null //dataSources.get('customer.entity') || null

		//page.setHeaders(request)
		request.setRequestHeader('X-Oc-Merchant-Language', 'en')

		return request
	}

    getCustomers() {
        axios({
            url: QC_API + 'order/0', // Set ID to 0 to create new...
            data: this.payload.order, //JSON.stringify(cartProduct),
            method: 'PATCH',
            //dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data

            this.payload = assign(this.payload, payload)

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
        })
    }

    setBuiltInCustomer(defaultCountryId, defaultZoneId) {
        this.payload.order.firstname = 'In-Store'
		this.payload.order.lastname = 'Customer'
		this.payload.order.email = 'sales@caffetech.com'
		this.payload.order.telephone = '780-414-1200'
		this.payload.order.fax = ''

		this.payload.order.paymentFirstname = 'In-Store'
		this.payload.order.paymentLastname = 'Customer'
		this.payload.order.paymentCompany = ''
		this.payload.order.paymentAddress1 = 'In-Store'
		this.payload.order.paymentAddress2 = ''
		this.payload.order.paymentCity = 'Edmonton'
		this.payload.order.paymentPostcode = ''
		this.payload.order.paymentCountryId = defaultCountryId
		this.payload.order.paymentZoneId = defaultZoneId

		this.payload.order.shippingFirstname = 'In-Store'
		this.payload.order.shippingLastname = 'Customer'
		this.payload.order.shippingAddress1 = 'In-Store'
		this.payload.order.shippingAddress2 = ''
		this.payload.order.shippingCity = 'Edmonton'
		this.payload.order.shippingPostcode = ''
		this.payload.order.shippingCountryId = defaultCountryId
		this.payload.order.shippingZoneId = defaultZoneId
    }

    setCustomCustomer(settings) {
        this.payload.order.firstname = settings['POS_c_firstname']
		this.payload.order.lastname = settings['POS_c_lastname']
		this.payload.order.email = settings['POS_c_email']
		this.payload.order.telephone = settings['POS_c_telephone']
		this.payload.order.fax = settings['POS_c_fax']

		this.payload.order.paymentFirstname = settings['POS_a_firstname']
		this.payload.order.paymentLastname = settings['POS_a_lastname']
		this.payload.order.paymentCompany = ''
		this.payload.order.paymentAddress1 = settings['POS_a_address1']
		this.payload.order.paymentAddress2 = settings['POS_a_address2']
		this.payload.order.paymentCity = settings['POS_a_city']
		this.payload.order.paymentPostcode = settings['POS_a_postcode']
		this.payload.order.paymentCountryId = settings['POS_a_country_id']
		this.payload.order.paymentZoneId = settings['POS_a_zone_id']

		this.payload.order.shippingFirstname = settings['POS_a_firstname']
		this.payload.order.shippingLastname = settings['POS_a_lastname']
		this.payload.order.shippingAddress1 = settings['POS_a_address1']
		this.payload.order.shippingAddress2 = settings['POS_a_address2']
		this.payload.order.shippingCity = settings['POS_a_city']
		this.payload.order.shippingPostcode = settings['POS_a_postcode']
		this.payload.order.shippingCountryId = settings['POS_a_country_id']
		this.payload.order.shippingZoneId = settings['POS_a_zone_id']
    }

    setExistingCustomer(customer) {
        let customerDetails = customer || CustomerStore.getCustomer()

		if (customerDetails !== null && typeof customerDetails['customer'] !== 'undefined') {
			let customer = customerDetails['customer']

            try {
                this.payload.order.customerId = customer['customer_id']
                this.payload.order.firstname = customer['firstname']
                this.payload.order.firstname = customer['firstname']
    			this.payload.order.lastname = customer['lastname']
    			this.payload.order.email = customer['email']
    			this.payload.order.telephone = customer['telephone']
    			this.payload.order.fax = customer['fax']

    			let address = []
                
                // Handle array of billing addresses
                if (customerDetails['addresses'] instanceof Array && customerDetails['addresses'].length > 1) {
    				for (let customerAddress in customerDetails['addresses']) {
    					if (customerAddress['addressId'] === customer['addressId']) {
    						address = customerAddress
    						break
    					}
    				}

                    if (address.length > 0) {
                        this.setBillingAddress(address)
        			}
                // Single billing address object
    			} else if (typeof customerDetails['billingAddress'] !== 'undefined' && customerDetails.billingAddress !== null) {
                    this.setBillingAddress(customerDetails.billingAddress)
                }
                
                // Handle array of shipping addresses
                if (customerDetails['addresses'] instanceof Array && customerDetails['addresses'].length > 1) {
    				for (let customerAddress in customerDetails['addresses']) {
    					if (customerAddress['addressId'] === customer['addressId']) {
    						address = customerAddress
    						break
    					}
    				}

                    if (address.length > 0) {
                        this.setShippingAddress(address)
        			}
                // Single shipping address object
    			} else if (typeof customerDetails['shippingAddress'] !== 'undefined' && customerDetails.shippingAddress !== null) {
                    this.setShippingAddress(customerDetails.shippingAddress)
                }
            } catch (err) {
                console.log(JSON.stringify(err))
            }
		}
    }

    setBillingAddress(address) {
        let countryId, country, zoneId, zone
        address = address || null
        if (address === null) return
        
        this.billingAddress = address // Set address input fields
        if (typeof address['country'] === 'string') {
            countryId = address['country_id']
            country = address['country']
            zone = address['zone']
            zoneId = address['zone_id']
        } else {
            countryId = (typeof address.country !== 'undefined' && address.country !== null && address.country.hasOwnProperty('country_id')) ? address.country['country_id'] : null
            country = (countryId !== null) ? this.settings.cartConfig.countries[countryId] : ''
            zoneId = (typeof address.zone !== 'undefined' && address.zone !== null && address.zone.hasOwnProperty('zone_id')) ? address.zone['zone_id'] : null
            zone = (zoneId !== null) ? this.settings.cartConfig.zones[countryId][zoneId] : ''
        }
        
        // Set to payload
        this.payload.order.paymentFirstname = address['firstname']
        this.payload.order.paymentLastname = address['lastname']
        this.payload.order.paymentCompany = address['company']
        this.payload.order.paymentAddress1 = address['address1']
        this.payload.order.paymentAddress2 = address['address2']
        this.payload.order.paymentCity = address['city']
        this.payload.order.paymentPostcode = address['postcode']
        this.payload.order.paymentCountry = country
        this.payload.order.paymentCountryId = countryId
        this.payload.order.paymentZone = zone
        this.payload.order.paymentZoneId = zoneId
    }

    setShippingAddress(address) {
        let countryId, country, zoneId, zone
        address = address || null
        if (address === null) return
        
        this.shippingAddress = address // Set address input fields
        if (typeof address['country'] === 'string') {
            countryId = address['country_id']
            country = address['country']
            zone = address['zone']
            zoneId = address['zone_id']
        } else {
            countryId = (typeof address.country !== 'undefined' && address.country !== null && address.country.hasOwnProperty('country_id')) ? address.country['country_id'] : null
            country = (countryId !== null) ? this.settings.cartConfig.countries[countryId] : ''
            zoneId = (typeof address.zone !== 'undefined' && address.zone !== null && address.zone.hasOwnProperty('zone_id')) ? address.zone['zone_id'] : null
            zone = (zoneId !== null) ? this.settings.cartConfig.zones[countryId][zoneId] : ''
        }
        
        // Set to payload
        this.payload.order.shippingFirstname = address['firstname']
        this.payload.order.shippingLastname = address['lastname']
        this.payload.order.shippingCompany = address['company']
        this.payload.order.shippingAddress1 = address['address1']
        this.payload.order.shippingAddress2 = address['address2']
        this.payload.order.shippingCity = address['city']
        this.payload.order.shippingPostcode = address['postcode']
        this.payload.order.shippingZone = zone
        this.payload.order.shippingZoneId = zoneId
        this.payload.order.shippingZone = zone
        this.payload.order.shippingZoneId = zoneId
        
        
    }

    setPaymentMethod(method) {
        this.paymentMethod = method
    }

    setShippingMethod(method) {
        this.shippingMethod = method
    }

    getTotals() {
        let totals = this.payload.orderTotals
        let data = []

        // If there's no total, output zero
        if (typeof totals !== 'undefinied' && totals !== null) {
            if (!(totals instanceof Array || totals.length > 0)) return data //0.00

            // Sort the totals
            for (let idx = 0; idx < totals.length; idx++) {
                data[parseInt(totals[idx].sortOrder)] = totals[idx]

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

    getTotal() {
        let totals = this.getTotals() || null
        let total = {
            title: 'Total',
            value: 0.00
        }

        total = totals.pop() || total

        return total
    }
    
    /**
     * Builds an array of order options which we will send to the server later
     */
    getOrderOptions() {
        let items = CartStore.getSelection()
        let data = []

    	// Loop over active items in cart (the current selection)
        for (let idx in items) {
            let item = items[idx]
            if (items[idx].options instanceof Array) {
                let selectedOptions = item.options
                
                for (let idxOpt in selectedOptions) { 
                    let value = selectedOptions[idxOpt].data.name
                    let name = selectedOptions[idxOpt].data.option.name
                    //data[selectedOptions[idxOpt].id] = selectedOptions[idxOpt].data
                    // Normalize option value into a flat structure for our request
                    data.push(assign({}, selectedOptions[idxOpt].data.option, selectedOptions[idxOpt].data, {
                        name: name, value: value
                    }))
                }
            }
        }
        // TODO: Make this configurable
        // Data keys will be underscored as result of the API used to retrieve products from the server
        // In this case we're using the legacy API, but the new resource API also defaults to underscores
        // Convert our data to camelCase for submission to server
        // normalizePayload(data, from, to)
        console.log('converting payload to camelcase')
        data = this.normalizePayload(data, 'underscore', 'camelcase')
        console.log(data)

    	return data
    }

    /**
     * Builds an array of tax rates and tax amounts (pct. or fixed) which we will send to the server later
     */
    getOrderTaxRates() {
    	let data = {}

    	for (let idx = 0; idx < CartStore.selection.length; idx++) {
            let item = CartStore.selection[idx]

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

    /**
     * Mirrors the getTaxes method in in system\library\cart
     */
    getOrderTaxes() {
		let data = {}

		for (let idx = 0; idx < CartStore.selection.length; idx++) {
            let item = CartStore.selection[idx]

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

    /**
     * Mirrors the calculateTaxes method in system\library\tax
     */
    calculateWithTaxes(value, taxClassId, calculate) {
        calculate = calculate || true
        taxClassId = taxClassId || false
        // TODO: Check for boolean?

        if (taxClassId && calculate) {
			let amount = 0
			let taxRates = this.getTaxRates(value, taxClassId)

			for (let rate in taxRates) {
				if (calculate !== 'P' && calculate !== 'F') {
					amount += taxRates[rate]['amount'] // Why are these the same? See system\library\tax
				} else if (taxRates[rate]['type'] === calculate) {
					amount += taxRates[rate]['amount'] // Why are these the same? See system\library\tax
				}
			}

			return value + amount
		} else {
			return value
		}
    }

    /**
     * Mirrors the getTax method in system\library\tax
     */
    calculateTaxes(value, taxClassId) {
		let amount = 0
        let taxRates = this.getTaxRates(value, taxClassId)

        for (let rate in taxRates) {
            amount += taxRates[rate]['amount']
        }

		return amount
	}

    /**
     * Mirrors the getRates method in system\library\tax
     * Called by the calculateTaxes (orig. Tax) and getOrderTaxes (orig. (Cart) methods, and is generally only for 'private use'
     */
    getTaxRates(value, taxClassId) {
		let rateData = {},
            rates = this.settings.cartConfig.taxRates['1_1_5_store']
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
					'name'       : rate['name'],
					'rate'       : rate['rate'],
					'type'       : rate['type'],
					'amount'     : amount
                }
			}
		//}

		return rateData
	}

    applyRewardPoints(points) {
		let	isSuccess = false

		if (typeof points === 'undefined' || points === null || !(points > 0)) return false

		axios({
			url: QC_RESOURCE_API + 'reward',
			method: 'POST',
			async: false,
			dataType: 'json',
			data: JSON.stringify({
				reward: points
			}),
			contentType: 'application/json',
			beforeSend: (request) => {
				this.setHeaders(request)
			},
			success: (response, status, xhr) => {
				if (response.success) {
					isSuccess = true
				} else {
					if (response.hasOwnProperty('error') && response.error.hasOwnProperty('warning')) {
						if (response.error.warning === 'error_points') {
							loader.setMessage('Sorry, you don\'t have enough credits to make this purchase').open()

							setTimeout(() => {
								loader.close()
							}, 3000)

							throw new Error('Not enough credits')
						} else {
							loader.setMessage(response.error.warning)

							setTimeout(() => {
								loader.close()
							}, 3000)

							throw new Error(response.error.warning)
						}
					}

					if (eventHandler.hasEvent('checkoutError')) {
						event = eventHandler.getEvent('checkoutError')
						// Not sure about the vars...
						event.dispatch({
							xhr: xhr,
							status: status,
							error: error
						})
					}
				}
			},
			complete: () => {
			}
		})

		return isSuccess
	}

    onCheckoutSuccess() {
    }

    onCheckoutComplete() {
    }

    onCheckoutError() {
    }

    /**
     * TODO: I am a utility method move me out of here!
     */
    _isset(array, value) {
        return (typeof array[value] !== 'undefined' && array[value] !== null) ? true : false
    }
}

export default new CheckoutStore()