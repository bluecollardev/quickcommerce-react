import assign from 'object-assign'

import axios from 'axios'
//import request from 'reqwest' // TODO: Use axios
//import when from 'when'

import { BaseService } from './BaseService.jsx'

import CustomerConstants from '../constants/CustomerConstants.jsx'

import CustomerStore from '../stores/CustomerStore.jsx'
import StarMicronicsStore from '../stores/StarMicronicsStore.jsx'

import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
import StringHelper from '../helpers/String.js'

export default class CheckoutService extends BaseService {
    fetchOrder(id, onSuccess, onError) {
        console.log('attempting to push product to cart')
        //console.log(JSON.stringify(cartProduct))
        //this.buildDataStore()

        // Emit block ui event
        //this.emit('block-ui')

        axios({
            url: QC_API + 'order/' + id,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data
            CheckoutStore.setOrder(payload)

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }

            //this.emit('unblock-ui')
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
            
            //this.emit('unblock-ui')
        })
    }
    
    createOrder(onSuccess, onError) {
        // Create an new order
		CheckoutStore.newOrder()
        
        let settings = SettingStore.getSettings().posSettings
		//return orderId
        axios({
            url: QC_API + 'order/0', // Set ID to 0 to create new...
            data: CheckoutStore.payload.order, //JSON.stringify(cartProduct),
            method: 'PATCH',
            //dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data
            CheckoutStore.setOrder(payload)

            if (typeof onSuccess === 'function') {
                onSuccess(payload)
            }
        }).catch(err => {
            if (typeof onError === 'function') {
                onError()
            }
        })
    }
    
    modifyOrder(orderId, orderAction) {
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
        let updateOps = [
            'update', 
            'updateOrderStatus', 
            'updatePaymentMethod', 
            'updateShippingMethod', 
            'updateHistory', 
            'updateNotes'
        ]

		if (action === 'insert') {
			// add a new order product
			this.addItem(orderId, orderAction, onSuccess)
		} else if (updateOps.indexOf(action) !== -1) {
            axios({
                url: QC_API + 'order/' + orderId, // Set ID to 0 to create new...
                data: orderAction,
                method: 'PATCH',
                contentType: 'application/json'
            })
            .then(response => {
                let payload = response.data
                CheckoutStore.setOrder(payload)
                
                console.log('order patched')
                console.log(CheckoutStore.payload)

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
    
    // Just an alias for now
    updatePaymentMethod(orderId, orderAction, onSuccess, onError) {
        //let orderAction = {}
        this.updateOrder(orderId, orderAction, onSuccess, onError)
    }
    
    // Just an alias for now
    updateShippingMethod(orderId, orderAction, onSuccess, onError) {
        //let orderAction = {}
        this.updateOrder(orderId, orderAction, onSuccess, onError)
    }
    
    // Just an alias for now
    updateNotes(orderId, orderAction, onSuccess, onError) {
        //let orderAction = {}
        this.updateOrder(orderId, orderAction, onSuccess, onError)
    }
    
    clearOrder(onSuccess, onError) {
		let	that = this

        if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
            if (CheckoutStore.payload.order.hasOwnProperty('orderId') && !isNaN(CheckoutStore.payload.order.orderId)) {
                axios({
                    //url: QC_RESOURCE_API + 'cart/empty',
                    url: QC_API + 'order/' + CheckoutStore.payload.order.orderId,
                    method: 'DELETE',
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .then(response => {
                    if (typeof onSuccess === 'function') {
                        onSuccess(payload)
                    }

                    that.createOrder()
                }).catch(err => {
                    console.log('error patching item to order')
                    if (typeof onError === 'function') {
                        onError()
                    }

                    that.createOrder()
                })
            }
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
            CheckoutStore.setOrder(payload)
            
            console.log('item successfully patched to order')
            console.log(CheckoutStore.payload)

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
    
    // privately invoked
    /*doCheckout(orderAction) {
        orderAction = orderAction || null

        // only accept 'insert' action to create a new order
		if (orderAction.action !== 'insert') {
			// Do something
		}
        
		let orderId = this.newOrder()
    }*/
    
    // From here down list utility methods that invoke our mirrored API methods
    doCheckout(onSuccess, onError, id) { // ID is last because we only use it when testing, otherwise grab ID from 'model'
        id = CheckoutStore.payload.order.orderId || 0
        console.log('attempting to checkout')
        let settings = SettingStore.getSettings().posSettings
        
        this.updateOrder(id, {
            action: 'updateOrderStatus',
            orderStatusId: settings.POS_complete_status_id
        }, (payload) => {
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
                    //this.createOrder()
                }).catch(err => {
                    if (typeof onError === 'function') {
                        onError()
                    }
                })
            })
        })
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
}