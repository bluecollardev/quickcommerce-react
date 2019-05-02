import assign from 'object-assign'

import EventEmitter from 'events'
import { Dispatcher } from 'flux'

import CartStore from './CartStore.jsx'

const CartDispatcher = new Dispatcher

CartDispatcher.register(payload => {
    switch (payload.actionType) {
        case 'cart-initialize':
            CartStore.init(payload.config)
            CartStore.emit('ready')
            break
        case 'cart-revert':
            CartStore.init(payload.config)
            CartStore.emit('change')
            break
        case 'cart-add-item':
            CartStore.addItem(payload.key, payload.quantity, payload.item)
            break
        case 'cart-remove-item':
            CartStore.removeItem(payload.index)
            break
        case 'cart-update-item':
            CartStore.updateQuantity(payload.index, payload.quantity)
            break
        case 'cart-add-option':
            CartStore.addOption(payload.key, payload.quantity, payload.item, payload.product)
            break
        case 'cart-reset':
            CartStore.reset()
            break
        case 'cart-clear':
            CartStore.clear()
            break
    }
})

module.exports = CartDispatcher
