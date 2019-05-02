import assign from 'object-assign'

import { normalize, denormalize, schema } from 'normalizr'

import BaseStore from './BaseStore.jsx'
import CustomerStore from './CustomerStore.jsx'
import SettingStore from './SettingStore.jsx'
import OrderConstants from '../constants/OrderConstants.jsx'

// Not a singleton store, this is an abstract class to inherit from
export class OrderStore extends BaseStore {
    constructor(dispatcher, stores) {
        super(dispatcher, stores)
    }
    
    registerToActions(action) {
        switch (action.actionType) {
            case OrderConstants.NEW_ORDER:
                this.newOrder(action.customer)
                break
            case OrderConstants.SET_ORDER:
                //this.payload = action.order
                this.setOrder(action.order)
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
            /*case OrderConstants.SET_BILLING_ADDRESS:
                this.setBillingAddress(action.address)
                break
            case OrderConstants.SET_SHIPPING_ADDRESS:
                this.setShippingAddress(action.address)
                break*/
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
        
        let orderId = this.newOrder(orderAction.customer)
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
    
    clearOrder(onSuccess, onError) {
        let    that = this

        if (this.payload.hasOwnProperty('order') && this.payload.order !== null) {
            if (this.payload.order.hasOwnProperty('orderId') && !isNaN(this.payload.order.orderId)) {
            }
        }
    }
    
    setBuiltInCustomer(customer) {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }

    setCustomCustomer(customer) {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }

    setExistingCustomer(customer) {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }

    setBillingAddress(address) {
        throw new Error('Not implemented') // TODO: Make a real exception class
    }

    setShippingAddress(address) {
        throw new Error('Not implemented') // TODO: Make a real exception class
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
    
    getSubTotal() {
        let totals = this.getTotals() || null
        let total = {
            title: 'Sub-Total',
            value: 0.00
        }

        total = totals.shift() || total

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
        throw new Error('Not implemented') // TODO: Make a real exception class
    }
    
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

    /**
     * Builds an array of tax rates and tax amounts (pct. or fixed) which we will send to the server later.
     */
    getOrderTaxRates() {
        //throw new Error('This method is broken, it relies on the old Cart which I am replacing because it doesn\'t work the same way as the rest of the components.')
        let data = {}

        for (let idx = 0; idx < this.getDependentStore('cart').selection.length; idx++) {
            let item = this.getDependentStore('cart').selection[idx]

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

        for (let idx = 0; idx < this.getDependentStore('cart').selection.length; idx++) {
            let item = this.getDependentStore('cart').selection[idx]

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