//import CartConstants from './CartConstants.jsx'

export default (dispatcher) => {
    return {
        init() {
            dispatcher.dispatch({
                actionType: 'cart-initialize',
                config: {
                    items: this.props.items || {},
                    selection: this.props.selection || []
                }
            })
        },
        addItem(key, quantity, item) {
            dispatcher.dispatch({
                actionType: 'cart-add-item',
                key: key,
                quantity: quantity,
                item: item
            })
        },
        removeItem(index) {
            dispatcher.dispatch({
                actionType: 'cart-remove-item',
                index: index
            })
        },
        updateQuantity(index, quantity) {
            dispatcher.dispatch({
                actionType: 'cart-update-item',
                index: index,
                quantity: quantity
            })
        },
        addOption(key, quantity, item, product) {
            dispatcher.dispatch({
                actionType: 'cart-add-option',
                key: key,
                quantity: quantity,
                item: item,
                product: product
            })
        },
        emptyCart() {
            dispatcher.dispatch({
                actionType: 'cart-reset'
            })
        },
        clearCart() {
            dispatcher.dispatch({
                actionType: 'cart-clear'
            })
        },
        reset() {
            dispatcher.dispatch({
                actionType: 'cart-revert',
                config: {
                    items: {},
                    selection: []
                }
            })
        }
    }
}