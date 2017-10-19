import assign from 'object-assign'

import { normalize, denormalize, schema } from 'normalizr'

import BaseStore from './BaseStore.jsx'
import CustomerStore from './CustomerStore.jsx'
import SettingStore from './SettingStore.jsx'
import CartStore from '../modules/CartStore.jsx'

import CheckoutConstants from '../constants/CheckoutConstants.jsx'

let instance = null

export class OrderStore extends BaseStore {
    constructor() {
        super()
		
		if (instance !== null) {
            return instance
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

        // System settings
        this.settings = {
            cartConfig: {
                countries: {}
            },
            posConfig: {}
        }

        this.items = {}

        this.billingAddress = null
        this.shippingAddress = null
        this.paymentMethod = null
        this.shippingMethod = null
        this.paymentType = null
        this.config = null

        // Just monkey patch the parent method
        this.subscribe(() => this.registerToActions.bind(this))

        // Easy access while developing app
        window.OrderStore = instance = this
    }

    registerToActions(action) {
        switch (action.actionType) {
            case CheckoutConstants.NEW_ORDER:
                this.newOrder()
                break
            case CheckoutConstants.SET_ORDER:
                // This doesn't do anything right now
                this.payload = action.order
                break
            case CheckoutConstants.SET_BUILTIN_CUSTOMER:
                this.setBuiltInCustomer(action.customer)
                this.emit('set-customer', 'builtin')
                break
            case CheckoutConstants.SET_CUSTOM_CUSTOMER:
                this.setCustomCustomer(action.customer)
                this.emit('set-customer', 'custom')
                break
            case CheckoutConstants.SET_EXISTING_CUSTOMER:
                this.setExistingCustomer(action.customer)
                this.emit('set-customer', 'existing')
                break
            case CheckoutConstants.SET_BILLING_ADDRESS:
                this.setBillingAddress(action.address)
                break
            case CheckoutConstants.SET_SHIPPING_ADDRESS:
                this.setShippingAddress(action.address)
                break
            case CheckoutConstants.SET_PAYMENT_METHOD:
                this.setPaymentMethod(action.code, action.method)
                break
            case CheckoutConstants.SET_SHIPPING_METHOD:
                this.setShippingMethod(action.code, action.method)
                break
            case CheckoutConstants.SET_PAYMENT_TYPE:
                this.setPaymentType(action.paymentType)
                break
            case CheckoutConstants.SET_ORDER_STATUS:
                this.setOrderStatus(action.status)
                break
            case CheckoutConstants.SET_NOTES:
                this.setNotes(action.notes)
                break
            default:
                break
        }
    }

    getOrderDetails(orderId) {
        orderId = orderId || null
        let orderDetails = {}

		// Get order model
		let order = this.payload.order || null

        let buildOrderDetails = (order) => {
            if (order === null) return

            let orderDetails = {}
            orderDetails.order = order

            let serverOrderProducts = {}
            let orderProducts = []
            
			for (let serverOrderProduct in serverOrderProducts) {
                orderProduct = {}
                
				let product = {}
                orderProduct.image = product.image
                orderProduct.shipping = product.shipping
                orderProduct.updateStock = product.subtract

                orderProducts.push(orderProduct)
            }

            orderDetails.orderProducts = orderProducts

            let customerId = order.customerId
            if (customerId > 0) {
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
	
    /**
	 * Privately invoked.
	 */
    doCheckout(orderAction) {
        orderAction = orderAction || null

        // Only accept 'insert' action to create a new order
		if (orderAction.action !== 'insert') {
			// Do something
		}
        
		let orderId = this.newOrder()
    }

    /**
	 * Privately invoked.
	 */
    newOrder() {
        let settings = SettingStore.getSettings().posSettings

        this.payload.order = {}
		
		let customerType = parseInt(settings['POS_c_type'])

        switch (customerType) {
			case 1:
				// Use built-in customer
				this.setBuiltInCustomer()
				break

			case 2:
				// Use customized customer
				//this.setCustomCustomer(customer)
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

        // Specify PATCH action
		this.payload.order.action = 'insert'
        
        this.payload.order.orderId = 0 // Set to zero to trigger create on server
		this.payload.order.storeId = 0
		this.payload.order.orderStatusId = parseInt(settings['POS_initial_status_id'])
		this.payload.order.invoicePrefix = settings['config_invoice_prefix']

        //let customerId = parseInt(settings['POS_c_id'])
		//let customerGroupId = parseInt(settings['POS_c_group_id'])

        this.payload.order.storeName = storeName
		this.payload.order.storeUrl = storeUrl
        
		this.payload.order.shippingMethod = settings['config_shipping_method']
		this.payload.order.shippingCode = settings['config_shipping_code']
        
		this.payload.order.paymentMethod = settings['config_payment_method']
		this.payload.order.paymentCode = settings['config_payment_code']
		this.payload.order.comment = ''
		
        this.payload.order.customerId = parseInt(settings['default_customer_id'])
		this.payload.order.customerGroupId = parseInt(settings['default_customer_group_id'])
		
        this.payload.order.paymentCountryId = parseInt(settings['default_customer_country_id'])
        this.payload.order.paymentCountry = settings['default_customer_country']
		this.payload.order.paymentZoneId = parseInt(settings['default_customer_zone_id'])
		this.payload.order.paymentZone = settings['default_customer_zone']
        
        this.payload.order.shippingCountryId = parseInt(settings['default_customer_country_id'])
        this.payload.order.shippingCountry = settings['default_customer_country']
		this.payload.order.shippingZoneId = parseInt(settings['default_customer_zone_id'])
		this.payload.order.shippingZone = settings['default_customer_zone']
		
        this.payload.order.currencyCode = settings['config_currency']
		this.payload.order.currencyId = parseInt(settings['config_currency_id'])
		
        this.payload.order.dateAdded = new Date()
		this.payload.order.dateModified = new Date()

        this.payload.order.defaultSettings = settings
        // END PATCH
        
		this.payload.total = {}
		//this.payload.total.orderId = 0
		this.payload.total.code = 'total'
		this.payload.total.value = 0
		this.payload.total.sortOrder = 0 //settings['total_sort_order']
		this.payload.total.title = 'Total'

		//return orderId
        this.emit('new-order')
    }
    
    setOrder(orderPayload) {
        this.payload = orderPayload
        this.emit('set-order')
    }
    
	clearOrder(onSuccess, onError) {
		let	that = this

        if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
            if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
            }
        }
	}
	
    setBuiltInCustomer(customer) {
        customer = customer || null
        let settings = SettingStore.getSettings().posSettings
        
        if (customer !== null) {
            this.payload.order.firstname = customer['firstname']
            this.payload.order.lastname = customer['lastname']
            this.payload.order.email =  customer['email']
            this.payload.order.telephone = customer['telephone']
            this.payload.order.fax = customer['fax']

            this.payload.order.paymentFirstname = customer['firstname']
            this.payload.order.paymentLastname = customer['lastname']
            this.payload.order.paymentCompany = customer['company']
            this.payload.order.paymentAddress1 = customer['address1']
            this.payload.order.paymentAddress2 = customer['address2']
            this.payload.order.paymentCity = customer['city']
            this.payload.order.paymentPostcode = customer['postcode']
            this.payload.order.paymentCountryId = parseInt(customer['country_id'])
            this.payload.order.paymentZoneId = parseInt(customer['zone_id'])

            this.payload.order.shippingFirstname = customer['firstname']
            this.payload.order.shippingLastname = customer['lastname']
            this.payload.order.shippingCompany = customer['company']
            this.payload.order.shippingAddress1 = customer['address1']
            this.payload.order.shippingAddress2 = customer['address2']
            this.payload.order.shippingCity = customer['city']
            this.payload.order.shippingPostcode = customer['postcode']
            this.payload.order.shippingCountryId = parseInt(customer['country_id'])
            this.payload.order.shippingZoneId = parseInt(customer['zone_id'])
        } else {
            this.payload.order.firstname = settings['default_customer_firstname']
            this.payload.order.lastname = settings['default_customer_lastname']
            this.payload.order.email =  settings['default_customer_email']
            this.payload.order.telephone = settings['default_customer_telephone']
            this.payload.order.fax = settings['default_customer_fax']

            this.payload.order.paymentFirstname = settings['default_customer_firstname']
            this.payload.order.paymentLastname = settings['default_customer_lastname']
            this.payload.order.paymentCompany = settings['default_customer_company']
            this.payload.order.paymentAddress1 = settings['default_customer_address1']
            this.payload.order.paymentAddress2 = settings['default_customer_address2']
            this.payload.order.paymentCity = settings['default_customer_city']
            this.payload.order.paymentPostcode = settings['default_customer_postcode']
            this.payload.order.paymentCountryId = parseInt(settings['default_customer_country_id'])
            this.payload.order.paymentZoneId = parseInt(settings['default_customer_zone_id'])

            this.payload.order.shippingFirstname = settings['default_customer_firstname']
            this.payload.order.shippingLastname = settings['default_customer_lastname']
            this.payload.order.shippingCompany = settings['default_customer_company']
            this.payload.order.shippingAddress1 = settings['default_customer_address1']
            this.payload.order.shippingAddress2 = settings['default_customer_address2']
            this.payload.order.shippingCity = settings['default_customer_city']
            this.payload.order.shippingPostcode = settings['default_customer_postcode']
            this.payload.order.shippingCountryId = parseInt(settings['default_customer_country_id'])
            this.payload.order.shippingZoneId = parseInt(settings['default_customer_zone_id'])
        }
    }

    setCustomCustomer(customer) {
        this.payload.order.firstname = customer['POS_c_firstname']
		this.payload.order.lastname = customer['POS_c_lastname']
		this.payload.order.email = customer['POS_c_email']
		this.payload.order.telephone = customer['POS_c_telephone']
		this.payload.order.fax = customer['POS_c_fax']

		this.payload.order.paymentFirstname = customer['POS_a_firstname']
		this.payload.order.paymentLastname = customer['POS_a_lastname']
		this.payload.order.paymentCompany = ''
		this.payload.order.paymentAddress1 = customer['POS_a_address1']
		this.payload.order.paymentAddress2 = customer['POS_a_address2']
		this.payload.order.paymentCity = customer['POS_a_city']
		this.payload.order.paymentPostcode = customer['POS_a_postcode']
		this.payload.order.paymentCountryId = customer['POS_a_country_id']
		this.payload.order.paymentZoneId = customer['POS_a_zone_id']

		this.payload.order.shippingFirstname = customer['POS_a_firstname']
		this.payload.order.shippingLastname = customer['POS_a_lastname']
		this.payload.order.shippingAddress1 = customer['POS_a_address1']
		this.payload.order.shippingAddress2 = customer['POS_a_address2']
		this.payload.order.shippingCity = customer['POS_a_city']
		this.payload.order.shippingPostcode = customer['POS_a_postcode']
		this.payload.order.shippingCountryId = customer['POS_a_country_id']
		this.payload.order.shippingZoneId = customer['POS_a_zone_id']
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

    setPaymentMethod(code, method) {
        this.paymentMethod = { code: code, method: method }
        this.payload.order.paymentMethod = method
        this.payload.order.paymentCode = code
        this.emit('set-payment-method')
    }

    setShippingMethod(code, method) {
        this.shippingMethod = { code: code, method: method }
        this.payload.order.shippingMethod = method
        this.payload.order.shippingCode = code
        this.emit('set-shipping-method')
    }
    
    setOrderStatus(status) {
        this.orderStatus = status
        this.emit('set-order-status')
    }
    
    setNotes(notes) {
        this.payload.order.comment = notes // TODO: Clean and sanitize!
        this.emit('set-notes', notes)
    }

    getTotals() {
        let totals = this.payload.orderTotals
        let data = []

        // If there's no total, output zero
        if (typeof totals !== 'undefined' && totals !== null) {
            
            if (!(totals instanceof Array || totals.length > 0)) return data //0.00

            // Sort the totals
            for (let idx = 0; idx < totals.length; idx++) {
                //data[parseInt(totals[idx].sortOrder)] = totals[idx] // No sort order right now
                data[idx] = totals[idx]

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
    
    createPayloadOption(selection, data) {
        // Grab the name and option value
        let name = selection.data.option.name
        let type = selection.data.option.type
        let value = selection.data.name
        
        // Grab any server generated IDs related to the orderOption
        // Update using cart info if undefined or null for any required fields
        let productOptionId = selection.data.option['product_option_id']
        let productOptionValueId = selection.data['product_option_value_id']
        let quantity = quantity || selection.quantity // Always use the selected quantity? Yeah, I think so...
        
        // Map the object
        return assign({
            productOptionId: parseInt(productOptionId),
            productOptionValueId: parseInt(productOptionValueId),
            quantity: parseFloat(quantity),
            name: name,
            type: type,
            value: value
        }, data)
    }
    
    updatePayloadOption(selectionOption, payloadOption) {
        // TODO: Multiple option types - see my note in method description referring to TS and future complexity
        // The selected product option value
        // Note that we're using the name returned on the data node of the selectionOption
        // I should probably rename that property to 'value'
        
        // Grab the name and option value
        let name = selectionOption.data.option.name
        let type = selectionOption.data.option.type
        let value = selectionOption.data.name
        
        // Grab any server generated IDs related to the orderOption
        let orderOptionId = payloadOption.orderOptionId || 0 // Required for update
        let orderId = payloadOption.orderId || 0 // Required for update
        let orderProductId = payloadOption.orderProductId || 0 // Required for update
        
        // Update using cart info if undefined or null for any required fields
        let productOptionId = payloadOption.productOptionId || selectionOption.data.option['product_option_id']
        let productOptionValueId = payloadOption.productOptionValueId ||  selectionOption.data['product_option_value_id']
        let quantity = quantity || selectionOption.quantity // Always use the selected quantity? Yeah, I think so...
        // TODO: Double check the line above...
        //let quantity = quantity || selectionOption.quantity
        
        return {
            orderOptionId: parseInt(orderOptionId),
            orderId: parseInt(orderId),
            orderProductId: parseInt(orderProductId),
            productOptionId: parseInt(productOptionId),
            productOptionValueId: parseInt(productOptionValueId),
            quantity: parseFloat(quantity),
            name: name,
            type: type,
            value: value
        }
    }
    
    /**
     * Builds an array of order options which we will send to the server later.
     * This method returns an object that we store to this.payload.orderOptions,
     * which correlates to the server DTO.
     *
     * Formatted object will look like the array item below:
     * 
		{
			"orderOptionId": 2,
			"orderId": 198,
			"orderProductId": 4,
			"productOptionId": "249",
			"productOptionValueId": "514",
			"name": "Coffee Package Size",
			"value": "340g",
			"type": "select"
		}
	],
     * TODO: I may start employing TypeScript in a limited capacity... 
     * static typed objects would be useful for standardizing my data objects; 
     * I like flexible code, but this is something I can see getting out of hand in future versions
        "orderProducts": [
            {
                "orderProductId": 4,
                "orderId": 198,
                "productId": 3381,
                "name": "Ceni Subscription",
                "model": "Ceni Subscription",
                "quantity": 1,
                "price": "111.1100",
                "total": "111.1100",
                "tax": "5.5555",
                "reward": 0
            }
        ],
        "orderOptions": [
            {
                "orderOptionId": 2,
                "orderId": 198,
                "orderProductId": 4,
                "productOptionId": "249",
                "productOptionValueId": "514",
                "name": "Coffee Package Size",
                "value": "340g",
                "type": "select"
            }
        ]
     */
    getOrderOptions(productId, orderProductId) {
        orderProductId = orderProductId || null
        let cartProducts = CartStore.getSelection()
        let data = []
        
        // Get the orderProduct that corresponds to the provided orderProductId
        let orderProduct = null
        orderProduct = this.payload.orderProducts.filter(op => { 
            return op.orderProductId === orderProductId
        })[0] || null
        
        // Get the orderOptions that correspond to the provided orderProductId
        let orderOptions = this.payload.orderOptions.filter(oo => {
            return oo.orderProductId === orderProductId
        })
        
        // Get the cart product that we're looking to update
        // A product ID must be provide
        if (!productId) {
            throw new Error('No productId provided')
        }
        
        // Get all matching products
        cartProducts = cartProducts.filter(p => { return parseInt(p.id) === productId })
        
        // For each matching product in the shopping cart
        for (let idx = 0; idx < cartProducts.length; idx++) {
            // Process selected item options
            let selected = cartProducts[idx].options
            
            // Just a simple loop over selected options 
            // Don't worry about performance there won't be a million of these
            for (let idx = 0; idx < selected.length; idx++) {
                let selectionOption = selected[idx]
                let selectionKey = selected._key
                let selectionProductId = parseInt(selected.id)
                
                if (orderProduct !== null && orderOptions.length > 0) {
                    let selectionProductOptionId = parseInt(selectionOption.data.option['product_option_id'])
                    
                    if (!isNaN(selectionProductOptionId)) {
                        orderOptions = orderOptions.filter(oo => {
                            return oo.productOptionId === selectionProductOptionId
                        })
                        
                        if (orderOptions.length === 1) {
                            // Found option, update
                            data.push(this.updatePayloadOption(selectionOption, orderOptions[0]))
                        } else {
                            data.push(this.createPayloadOption(selectionOption, {
                                orderProductId: orderProduct.orderProductId,
                                orderId: orderProduct.orderId,
                                productId: orderProduct.productId
                            }))
                        }
                    }
                    
                    console.log(selectionOption)
                } else {
                    // Create new item
                    data.push(this.createPayloadOption(selectionOption))
                    console.log(selectionOption)
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
     * Builds an array of tax rates and tax amounts (pct. or fixed) which we will send to the server later.
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
     * Mirrors the getTaxes method in in system\library\cart.
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
     * Mirrors the calculateTaxes method in system\library\tax.
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
     * Mirrors the getTax method in system\library\tax.
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
     * Mirrors the getRates method in system\library\tax.
     * Called by the calculateTaxes (orig. Tax) and getOrderTaxes (orig. (Cart) methods, and is generally only for 'private use'.
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
}

export default new OrderStore()