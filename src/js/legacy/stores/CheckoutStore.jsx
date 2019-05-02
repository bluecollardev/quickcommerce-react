import assign from 'object-assign'

import { normalize, denormalize, schema } from 'normalizr'

import { OrderStore } from './OrderStore.jsx'

import CheckoutConstants from '../constants/CheckoutConstants.jsx'

import HashProxy from '../utils/HashProxy.js'

class CheckoutStore extends OrderStore {
	/**
	 * OrderStore is intended to be abstract, and just passes on the constructor args to BaseStore.
	 * For now, at any rate, it needs to be defined in inheriting classes.
	 */
    constructor(dispatcher, stores) {
        super(dispatcher, stores)
        
        this.starPrinter = {
            isConnected: false,
            name: null,
            portName: null,
            macAddress: null
        }

        // Order payload
        this.payload = {
            order: {},
            orderProducts: [],
            orderOptions: [],
            orderPayments: null,
            orderTotals: [],
            orderCustomer: null,
            shipping: null,
            leftStock: null
        }

        this.customer = null
        this.items = {}

        // VEST Only
        //this.availableTracks = [] // Just so we don't forget VEST
        //this.availableDates = [] // VEST as well
        //this.unavailableDates = [] // Bookings

        this.billingAddress = null
        this.shippingAddress = null
        
        this.paymentMethod = null
        this.shippingMethod = null
        this.paymentType = null
        
        this.subscribe(() => this.registerToActions.bind(this))
    }
    
    /**
     * Not required for anything right now.
     */
    updateStock(orderProduct, orderOptions) {
        // Update product stock
        let productId = orderProduct.productId
        let quantity = orderProduct.quantity
        let productOptionValueIds = []

        if (orderOptions instanceof Array &&
            orderOptions.length > 0) {
            for (let orderOption in orderOptions) {
                if (orderOption.productOptionValueId) {
                    productOptionValueIds.push(orderOption.productOptionValueId)
                }
            }
        }

        this.updateRealStock(productId, productOptionValueIds, quantity)
    }
    /**
     * Not required for anything right now.
     */
    updateRealStock(productId, productOptionValueIds, quantity) {
        if (productOptionValueIds instanceof Array &&
            productOptionValueIds.length > 0) {
        }
    }
    
    orderIsSet() {
        let payload = this.payload
        let order = null
        
        if (payload === null) {
            throw new Error('Invalid payload property on CheckoutStore - payload cannot be null.')
        }
        
        if (payload.hasOwnProperty('order') && payload.order !== null) {
            let order = payload.order
            if (order.hasOwnProperty('orderId') && !isNaN(order.orderId)) {
                return (order.orderId > 0) ? order.orderId : false // Explicitly return boolean false
            }
        }
        
        return false
    }
    
    /**
     * Implement abstract parent method.
     */
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
     * Implement abstract parent method.
     */
     newOrder(customer) {
         // TODO: Wait For!
        let settings = this.getDependentStore('setting').getSettings().posSettings

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
                this.setExistingCustomer(customer) // TODO: This doesn't work anymore, must pass in customer, store logic shouldn't be coupled
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

        let customerId = parseInt(settings['POS_c_id'])
        let customerGroupId = parseInt(settings['POS_c_group_id'])

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

        console.log('remember to re-add settings to order')
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
    
    /**
     * Implement abstract parent method.
     */
    setBuiltInCustomer(customer) {
        let settings = this.getDependentStore('setting').getSettings().posSettings
        
        customer = customer || null
        
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

    /**
     * Implement abstract parent method.
     */
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

    /**
     * Implement abstract parent method.
     */
    setExistingCustomer(customer) {
        let customerDetails = customer

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
    
    /**
     * Implement abstract parent method.
     */
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

    /**
     * Implement abstract parent method.
     */
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
    
    /**
     * Implement abstract parent method.
     */
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
    
    /**
     * Implement abstract parent method.
     */
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
        //throw new Error('This method is broken, it relies on the old Cart which I am replacing because it doesn\'t work the same way as the rest of the components.')
        orderProductId = orderProductId || null
        let cartProducts = this.getDependentStore('cart').getSelection()
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
}

export default CheckoutStore
export { CheckoutStore }