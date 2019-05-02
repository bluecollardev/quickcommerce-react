import React from 'react'
import classNames from 'classnames'
import { DropTarget } from 'react-dnd'

import { Well } from 'react-bootstrap'

import RowComponent from './CartRowComponent.jsx'
import ContainerComponent from './CartContainerComponent.jsx'

import CartDispatcher from './CartDispatcher.jsx'
import InternalCartStore from './CartStore.jsx'

// Dirty global hack to maintain store instance until I refactor 
// this component to use context or switch from flux to redux
window.CartStore = (typeof window.CartStore === 'undefined') ? InternalCartStore : window.CartStore

let CartStore = window.CartStore

let cartTarget = {

    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return
        }
        
        const item = monitor.getItem()
        component.props.onItemDropped(item.id)
    }

}

function collect(connect, monitor) {
    return {
        connectDropTarget : connect.dropTarget(),
        isOver            : monitor.isOver(),
        canDrop           : monitor.canDrop()
    }
}

const Cart = React.createClass({
    propTypes: {
        items             : React.PropTypes.object,
        selection         : React.PropTypes.array,
        onItemDropped     : React.PropTypes.func,
        onItemAdded       : React.PropTypes.func,
        onItemRemoved     : React.PropTypes.func,
        onItemQtyChanged  : React.PropTypes.func,
        onChange          : React.PropTypes.func,
        iterator          : React.PropTypes.func,
        tableClassName    : React.PropTypes.string,
        cartEmptyMessage  : React.PropTypes.node

    },
    getDefaultProps() {
        return {
            items               : {},
            selection           : [],
            onItemDropped       : () => {},
            onItemAdded         : () => {},
            onItemRemoved       : () => {},
            onItemQtyChanged    : () => {},
            onChange            : () => {},
            iterator            : () => { return {} },
            containerComponent  : ContainerComponent,
            rowComponent        : RowComponent,
            tableClassName      : '',
            cartEmptyMessage    : (
                <span><b>Your shopping cart is empty.</b><br/>Please add some products to continue.</span>
            )
        }
    },
    getInitialState() {
        return {
            selection: []
        }
    },
    refresh() {
        this.setState({
            selection: CartStore.getSelection()
        })
    },
    onChange() {
        this.refresh()
        this.props.onChange()
    },
    componentDidMount() {
        CartStore.on('ready', this.refresh)
        CartDispatcher.dispatch({
            actionType: 'cart-initialize',
            config: {
                items: this.props.items,
                selection: this.props.selection
            }
        })
        CartStore.on('change', this.onChange)
        CartStore.on('item-added', this.props.onItemAdded)
        CartStore.on('item-removed', this.props.onItemRemoved)
        CartStore.on('item-changed', this.props.onItemQtyChanged)
    },
    componentWillUnmount() {
        CartStore.removeListener('ready', this.refresh)
        CartStore.removeListener('change', this.onChange)
        CartStore.removeListener('item-added', this.props.onItemAdded)
        CartStore.removeListener('item-removed', this.props.onItemRemoved)
        CartStore.removeListener('item-changed', this.props.onItemQtyChanged)
    },
    addItem(key, quantity, item) {
        CartDispatcher.dispatch({
            actionType: 'cart-add-item',
            key: key,
            quantity: quantity,
            item: item
        })
    },
    removeItem(index) {
        CartDispatcher.dispatch({
            actionType: 'cart-remove-item',
            index: index
        })
    },
    updateQuantity(index, quantity) {
        CartDispatcher.dispatch({
            actionType: 'cart-update-item',
            index: index,
            quantity: quantity
        })
    },
    addOption(key, quantity, item, product) {
        CartDispatcher.dispatch({
            actionType: 'cart-add-option',
            key: key,
            quantity: quantity,
            item: item,
            product: product
        })
    },
    emptyCart() {
        CartDispatcher.dispatch({
            actionType: 'cart-reset'
        })
    },
    clearCart() {
        CartDispatcher.dispatch({
            actionType: 'cart-clear'
        })
    },
    reset() {
        CartDispatcher.dispatch({
            actionType: 'cart-revert',
            config: {
                items: this.props.items,
                selection: this.props.selection
            }
        })
    },
    isEmpty() {
        return CartStore.isEmpty()
    },
    getSelection() {
        return CartStore.getSelection()
    },
    render() {
        const { position, isOver, canDrop, connectDropTarget } = this.props

        let context = this.props.iterator(),
            Container = this.props.containerComponent,
            Row = this.props.rowComponent
        if (this.isEmpty()) {
            return connectDropTarget(
                <div className='dnd-target-wrapper'>
                    <div>
                        <Well
                          className = {classNames({"well-is-over": isOver})}
                          style = {{marginBottom: '.5em'}}
                          bsSize = 'large'>
                            {/*<h1 className='drop-target-icon' style={{textAlign: 'center'}}><i className='fa fa-bullseye fa-2x' /></h1>*/}
                            <p style={{textAlign: 'center', maxWidth: 'auto'}}>{this.props.cartEmptyMessage}</p>
                        </Well>
                        <p></p>
                    </div>
                </div>
            )
        }
        
        return connectDropTarget(
            <div className='dnd-target-wrapper'>
                <Container
                    tableClassName = {this.props.tableClassName}
                    columns = {this.props.columns}
                    body = {this.state.selection.map(item => {
                      let context = this.props.iterator(context, item)
                      return (
                          <Row
                            key = {item._key}
                            item = {item}
                            columns = {this.props.columns}
                            removeItem = {()  => this.removeItem(item._index)}
                            setItemQty = {qty => this.updateQuantity(item._index, qty)} />
                      )
                    })}
                    context = {context}
                />
            </div>
        )
    }
})

module.exports = DropTarget('sprite', cartTarget, collect)(Cart)
