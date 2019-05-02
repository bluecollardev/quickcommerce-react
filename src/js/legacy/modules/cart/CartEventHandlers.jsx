function cartItemAdded(itemId, quantity, item) => {
    console.log('item added to order')
    console.log(item)
    
    // TODO: Move this whole chunk of logic to the CartAction, or a Cart ActionCreator
    if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
        if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
            !isNaN(props.checkoutStore.payload.order.orderId)) {
            let orderProduct = assign({}, item.data, {
                product_id: parseInt(itemId),
                quantity: quantity
            })
            
            let optionTotal = 0.00 
            // Get the prices off of the selected options and add them to the product price
            let orderOptions = props.checkoutStore.getOrderOptions(parseInt(itemId)) || null
            
            if (typeof orderOptions !== 'undefined' && orderOptions !== null) {
                // Not sure if I want to finalize this as an array or an object so I'm accounting for either
                if (Object.keys(orderOptions).length > 0) {
                    //for (let idx = 0; idx < orderOptions.length; idx++) {
                    for (let key in Object.keys(orderOptions)) {
                        let orderOption = orderOptions[key]
                        
                        // Get the product option value using the selected option's productOptionValueId
                        let productOptionId = Number(orderOption.productOptionId)
                        let productOptionValueId = Number(orderOption.productOptionValueId)
                        
                        let productOptions = item.data['options']
                        let selectedOptions = productOptions.filter(option => { return Number(option['product_option_id']) === productOptionId })
                        
                        if (selectedOptions instanceof Array && selectedOptions.length > 0) {
                            let selectedOption = selectedOptions[0]
                            // TODO: Make this method static
                            let optionPrice = CartStore.getOptionPrice(item.data, selectedOption, productOptionValueId)
                            optionTotal += (!isNaN(optionPrice)) ? Number(optionPrice) : 0
                        }
                    }
                }                        
            }
            
            let orderProductPrice = parseFloat(item.data['price']) + optionTotal
            
            let orderTaxRates = props.checkoutStore.getOrderTaxRates()
            
            let lineTotal = orderProductPrice * quantity
            let lineTotalWithTax = props.checkoutStore.calculateWithTaxes(lineTotal, item.data['tax_class_id'])
            let lineTax = props.checkoutStore.calculateTaxes(lineTotal, item.data['tax_class_id'])

            // We're mutating the supplied data object by design
            orderProduct = assign(orderProduct, {
                price: orderProductPrice,
                total: lineTotal,
                tax: lineTax
            })

            props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, {
                action: 'insert',
                orderProduct: orderProduct,
                orderProductId: 0,
                orderOptions: orderOptions, // TODO: If we fix the UI glitch (when tapping first option, item is created) we need to re-enable this
                productId: parseInt(itemId),
                orderTaxRates: orderTaxRates,
                defaultSettings: this.getDefaultSettings()
            }, (payload) => {
                let onSuccess = (payload) => {
                    // Format the return payload
                    /* Returned JSON payload
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
                    ]*/
                    
                    /*orderProducts.reduce((list, item, index) => {
                        
                    })*/
                    
                    // Update our CartStore
                    //CartStore.updateItem()
                }
                
                props.checkoutStore.setOrder(payload)
                //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId, onSuccess)
            })
        } else {
            // Create a new order
        }
    }
}

function cartItemChanged(item, quantity, oldQuantity) => {
    console.log('item quantity changed')
    console.log(item)
    console.log('qty: ' + quantity)
    console.log('old qty: ' + oldQuantity)
    
    // TODO: Move this whole chunk of logic to the CartAction, or a Cart ActionCreator
    if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
        if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
            !isNaN(props.checkoutStore.payload.order.orderId)) {
            let orderProductId = 0
            for (let idx = 0; idx < props.checkoutStore.payload.orderProducts.length; idx++) {
                if (parseInt(props.checkoutStore.payload.orderProducts[idx].productId) === parseInt(item.data['id'])) {
                    orderProductId = props.checkoutStore.payload.orderProducts[idx].orderProductId
                }
            }
            
            let orderProduct = assign({}, item.data, {
                product_id: parseInt(item.data['id']),
                quantity: quantity
            })
            
            let optionTotal = 0.00 
            // Get the prices off of the selected options and add them to the product price
            let orderOptions = props.checkoutStore.getOrderOptions(parseInt(item.data['id'])) || null
            
            if (typeof orderOptions !== 'undefined' && orderOptions !== null) {
                // Not sure if I want to finalize this as an array or an object so I'm accounting for either
                if (Object.keys(orderOptions).length > 0) {
                    //for (let idx = 0; idx < orderOptions.length; idx++) {
                    for (let key in Object.keys(orderOptions)) {
                        let orderOption = orderOptions[key]
                        
                        // Get the product option value using the selected option's productOptionValueId
                        let productOptionId = Number(orderOption.productOptionId)
                        let productOptionValueId = Number(orderOption.productOptionValueId)
                        
                        let productOptions = item.data['options']
                        let selectedOptions = productOptions.filter(option => { return Number(option['product_option_id']) === productOptionId })
                        
                        if (selectedOptions instanceof Array && selectedOptions.length > 0) {
                            let selectedOption = selectedOptions[0]
                            
                            // TODO: Make this method static
                            let optionPrice = CartStore.getOptionPrice(item.data, selectedOption, productOptionValueId)
                            optionTotal += (!isNaN(optionPrice)) ? Number(optionPrice) : 0
                        }
                    }
                }                        
            }
            
            let orderProductPrice = parseFloat(item.data['price']) + optionTotal
            
            let lineTotal = orderProductPrice * quantity
            let lineTotalWithTax = props.checkoutStore.calculateWithTaxes(lineTotal, item.data['tax_class_id'])
            let lineTax = props.checkoutStore.calculateTaxes(lineTotal, item.data['tax_class_id'])
            
            orderProduct = assign(orderProduct, item.data, {
                total: lineTotal,
                tax: lineTax
            })

            let orderTaxRates = props.checkoutStore.getOrderTaxRates()
            //let orderOptions = props.checkoutStore.getOrderOptions()

            props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, {
                action: 'modifyQuantity',
                orderProduct: orderProduct,
                orderProductId: orderProductId,
                //orderOptions: orderOptions,
                quantityBefore: oldQuantity,
                quantityAfter: quantity,
                orderTaxRates: orderTaxRates
            }, (payload) => {
                props.checkoutStore.setOrder(payload)
                //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
            })
        }
    }
}

function productOptionChanged(item, quantity, product) => {
    console.log('product options changed')
    console.log(item)
    console.log('qty: ' + quantity)

    if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
        if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
            !isNaN(props.checkoutStore.payload.order.orderId)) {
            let lineTotal = item['price'] * quantity
            let lineTotalWithTax = props.checkoutStore.calculateWithTaxes(lineTotal, item['tax_class_id'])
            let lineTax = props.checkoutStore.calculateTaxes(lineTotal, item['tax_class_id'])
            
            let orderProductId = 0
            // Grab associated orderProduct
            let orderProduct = props.checkoutStore.payload.orderProducts.filter(orderProduct => {
                return orderProduct.productId === parseInt(product['id'])
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
            let orderTaxRates = props.checkoutStore.getOrderTaxRates()
            let orderOptions = props.checkoutStore.getOrderOptions(parseInt(product['id']), orderProductId)

            props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, {
                action: 'update',
                //orderProduct: orderProduct,
                orderProductId: orderProductId,
                orderOptions: orderOptions,
                //quantityBefore: oldQuantity,
                //quantityAfter: quantity,
                orderTaxRates: orderTaxRates,
                defaultSettings: this.getDefaultSettings()
            }, (payload) => {
                props.checkoutStore.setOrder(payload)
                //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
            })
        }
    }
}

function itemRemoved(item) => {
    console.log('item removed')
    console.log(item)

    if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
        if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
            !isNaN(props.checkoutStore.payload.order.orderId)) {
            let orderProductId = 0
            for (let idx = 0; idx < props.checkoutStore.payload.orderProducts.length; idx++) {
                if (parseInt(props.checkoutStore.payload.orderProducts[idx].productId) === parseInt(item['id'])) {
                    orderProductId = props.checkoutStore.payload.orderProducts[idx].orderProductId
                }
            }

            let data = assign({}, item, {
                product_id: parseInt(item['id']),
                quantity: 0
            })

            let orderTaxRates = props.checkoutStore.getOrderTaxRates()
            //let orderOptions = props.checkoutStore.getOrderOptions()

            props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, {
                action: 'modifyQuantity',
                orderProduct: data,
                orderProductId: orderProductId,
                quantityAfter: 0,
                orderTaxRates: orderTaxRates,
                //orderOptions: orderOptions
            }, (payload) => {
                props.checkoutStore.setOrder(payload)
                //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
            })
        }
    }
}