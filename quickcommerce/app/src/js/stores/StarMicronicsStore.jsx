import assign from 'object-assign'

import axios from 'axios'
import { normalize, denormalize, schema } from 'normalizr'

import BaseStore from './BaseStore.jsx'
import SettingStore from './SettingStore.jsx'
import CustomerStore from './CustomerStore.jsx'
import LoginStore from './LoginStore.jsx'
import CartStore from '../modules/CartStore.jsx'

//import jwt_decode from 'jwt-decode'

import CustomerActions from '../actions/CustomerActions.jsx'
import CheckoutConstants from '../constants/CheckoutConstants.jsx'

let instance = null

class StarMicronicsStore extends BaseStore {
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

        this.stores = {
            // Default store
            0: {
                'name': 'QuickCommerce Default Store',
                'url': 'http:\/\/caffetech\/',
                'ssl':'',
                'store_id': 0
            }
        }

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
        SettingStore.fetchStore(8, () => {
            this.stores[id] = payload
        }) // Load ACE bar store data so we don't have to later

        // Maybe we should make this some kind of configuration option?

        SettingStore.fetchSettings((payload) => {
            this.settings = payload

            /*this.createOrder({
                action: 'insert'
            })*/
        })
        
        /*CustomerStore.on('CHANGE', () => {
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
        CartStore.on('item-added', (data, itemId) => {
            console.log('item added to order')
            console.log(data)

            if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
                if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
                    let quantity = 1
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
        }, false)*/

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
}