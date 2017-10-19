import assign from 'object-assign'

import { normalize, denormalize, schema } from 'normalizr'

import { OrderStore } from './OrderStore.jsx'
import CustomerStore from './CustomerStore.jsx'
import SettingStore from './SettingStore.jsx'
import CartStore from '../modules/CartStore.jsx'

import CheckoutConstants from '../constants/CheckoutConstants.jsx'

let instance = null

class CheckoutStore extends OrderStore {
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
        this.config = null

        // Just monkey patch the parent method
        this.subscribe(() => this.registerToActions.bind(this))

        // Easy access while developing app
        window.CheckoutStore = instance = this
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
}

export default new CheckoutStore()